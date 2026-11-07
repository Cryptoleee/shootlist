// Briefings inlezen uit bestanden die klanten sturen.
//
// DOCX gaat zonder enige library: een .docx is een zip, en de browser kan
// zelf uitpakken met DecompressionStream. De kopstijlen uit Word worden
// de structuur — Kop 1 wordt een blok, Kop 2 een onderdeel, de rest shots.
//
// PDF heeft wél een parser nodig; pdf.js wordt pas opgehaald op het moment
// dat je echt een PDF kiest, zodat de app licht blijft voor de set.
//
// Alles komt als gewone briefing-tekst in het tekstvak terecht, nooit
// rechtstreeks als klus. Je ziet dus altijd eerst wat eruit kwam en kunt
// het bijschaven voordat je opslaat.

const PDFJS_VERSION = "6.4.299";
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/`;

// ---------- zip (alleen wat we nodig hebben) ----------
function findEOCD(view) {
  // de eind-van-centrale-map staat achteraan, met maximaal 64k commentaar erna
  const max = Math.min(view.byteLength, 65557);
  for (let i = view.byteLength - 22; i >= view.byteLength - max; i--) {
    if (i >= 0 && view.getUint32(i, true) === 0x06054b50) return i;
  }
  return -1;
}

async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// haalt één bestand uit het zip-archief
async function unzipEntry(buf, wantedName) {
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  const eocd = findEOCD(view);
  if (eocd < 0) throw new Error("Dit lijkt geen geldig .docx-bestand.");
  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);

  for (let i = 0; i < count; i++) {
    if (view.getUint32(p, true) !== 0x02014b50) break;
    const method = view.getUint16(p + 10, true);
    const compSize = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const localOff = view.getUint32(p + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nameLen));

    if (name === wantedName) {
      const lNameLen = view.getUint16(localOff + 26, true);
      const lExtraLen = view.getUint16(localOff + 28, true);
      const start = localOff + 30 + lNameLen + lExtraLen;
      const data = bytes.subarray(start, start + compSize);
      if (method === 0) return data;              // niet gecomprimeerd
      if (method === 8) return await inflateRaw(data); // deflate
      throw new Error("Onbekende compressie in het bestand.");
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("Geen documenttekst gevonden in het bestand.");
}

// ---------- DOCX ----------
function paraText(node) {
  let out = "";
  for (const t of node.getElementsByTagName("*")) {
    if (t.localName === "t") out += t.textContent;
    else if (t.localName === "tab") out += " ";
    else if (t.localName === "br") out += " ";
  }
  return out.replace(/\s+/g, " ").trim();
}

// Word gebruikt Kop1/Heading1 afhankelijk van de taalversie
function headingLevel(node) {
  const st = node.getElementsByTagName("w:pStyle")[0];
  const val = st ? (st.getAttribute("w:val") || "") : "";
  if (/^(title|titel)$/i.test(val)) return 1;
  const m = /^(heading|kop)\s*(\d)/i.exec(val);
  if (m) return Number(m[2]) <= 1 ? 1 : 2;
  if (/^(subtitle|ondertitel)$/i.test(val)) return 2;
  return 0;
}

async function readDocx(file) {
  if (typeof DecompressionStream !== "function") {
    throw new Error("Deze browser kan geen .docx uitpakken. Plak de tekst dan even handmatig.");
  }
  const xml = await unzipEntry(await file.arrayBuffer(), "word/document.xml");
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), "application/xml");
  if (doc.getElementsByTagName("parsererror").length) throw new Error("Kon het document niet lezen.");
  const body = doc.getElementsByTagName("w:body")[0];
  if (!body) throw new Error("Geen documenttekst gevonden.");

  const out = [];
  for (const node of Array.from(body.children)) {
    if (node.localName === "p") {
      const txt = paraText(node);
      if (!txt) continue;
      const lvl = headingLevel(node);
      out.push(lvl === 1 ? `# ${txt}` : lvl === 2 ? `## ${txt}` : txt);
    } else if (node.localName === "tbl") {
      // tabelrijen worden shots; de kolommen aan elkaar met een punt ertussen
      for (const row of Array.from(node.children)) {
        if (row.localName !== "tr") continue;
        const cells = Array.from(row.children)
          .filter(c => c.localName === "tc")
          .map(c => paraText(c))
          .filter(Boolean);
        if (cells.length) out.push(cells.join(" · "));
      }
    }
  }
  return out.join("\n");
}

// ---------- PDF ----------
let pdfLib = null;
async function loadPdfLib() {
  if (pdfLib) return pdfLib;
  pdfLib = await import(/* webpackIgnore: true */ PDFJS_BASE + "pdf.min.mjs");
  pdfLib.GlobalWorkerOptions.workerSrc = PDFJS_BASE + "pdf.worker.min.mjs";
  return pdfLib;
}

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function readPdf(file, onProgress) {
  const lib = await loadPdfLib();
  const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];

  for (let n = 1; n <= doc.numPages; n++) {
    if (onProgress) onProgress(n, doc.numPages);
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    // tekstfragmenten op dezelfde regel samenvoegen op hun y-positie
    const rows = new Map();
    for (const it of content.items) {
      if (!it.str || !it.str.trim()) continue;
      const y = Math.round(it.transform[5] / 2) * 2;
      const h = Math.abs(it.transform[3]) || Math.hypot(it.transform[2], it.transform[3]);
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y).push({ x: it.transform[4], s: it.str, h });
    }
    const lines = [...rows.entries()]
      .sort((a, b) => b[0] - a[0]) // van boven naar beneden
      .map(([, parts]) => {
        parts.sort((a, b) => a.x - b.x);
        let s = "";
        let prevEnd = null;
        for (const p of parts) {
          if (prevEnd !== null && p.x - prevEnd > 6) s += "  ";
          s += p.s;
          prevEnd = p.x + p.s.length * p.h * 0.5;
        }
        return { text: s.replace(/\s+/g, " ").trim(), h: Math.max(...parts.map(p => p.h)) };
      })
      .filter(l => l.text);
    pages.push(lines);
  }

  // kop- en voetteksten eruit: regels die op de meeste pagina's terugkomen
  const seen = new Map();
  pages.forEach(ls => new Set(ls.map(l => l.text)).forEach(t => seen.set(t, (seen.get(t) || 0) + 1)));
  const repeated = new Set(
    [...seen.entries()].filter(([, c]) => pages.length > 2 && c >= pages.length - 1).map(([t]) => t)
  );

  const all = pages.flat().filter(l => !repeated.has(l.text) && !/^\d{1,3}$/.test(l.text));
  const body = median(all.map(l => l.h));

  // Een PDF kent geen kopstijlen, dus leiden we ze af uit de tekstgrootte:
  // alles wat duidelijk groter is dan de lopende tekst is een kop, en de
  // allergrootste maat wordt het blok.
  const bigger = [...new Set(all.map(l => Math.round(l.h * 2) / 2))]
    .filter(h => body && h > body * 1.12)
    .sort((a, b) => b - a);
  const blockSize = bigger[0];

  const out = [];
  for (const l of all) {
    const h = Math.round(l.h * 2) / 2;
    if (blockSize && h === blockSize) out.push(`# ${l.text}`);
    else if (bigger.includes(h)) out.push(`## ${l.text}`);
    else out.push(l.text);
  }
  return out.join("\n");
}

// ---------- ingang ----------
async function readBriefingFile(file, onProgress) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (ext === "docx") return readDocx(file);
  if (ext === "pdf") return readPdf(file, onProgress);
  if (ext === "doc") throw new Error("Oud .doc-formaat kan niet. Vraag om .docx of een PDF.");
  if (["txt", "md", "markdown", "csv"].includes(ext)) return file.text();
  throw new Error(`Bestandstype .${ext} kan ik niet lezen. Gebruik PDF, DOCX of platte tekst.`);
}
