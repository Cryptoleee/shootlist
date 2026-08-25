// Shootlist app logic — multi-klus versie.
// Startscherm toont alle klussen (PROJECTS); tik op een klus om de
// bijbehorende shootlist te openen. State wordt per klus opgeslagen.

let project = null; // actieve klus
let state = null;   // state van actieve klus

function storageKeyFor(p) { return `shootlist_state_${p.stateKey}`; }

function nowIso() { return new Date().toISOString(); }

// Elke sync-bare waarde is een entry { v, t }: waarde + timestamp.
// Zo kunnen twee telefoons veilig samengevoegd worden (nieuwste wint),
// en blijft "uitgevinkt" bewaard als tombstone i.p.v. te verdwijnen.
function entryVal(map, key) {
  const e = map ? map[key] : null;
  return e && typeof e === "object" ? e.v : undefined;
}
function setEntry(map, key, v) {
  map[key] = { v, t: nowIso() };
}

// Migratie van oud formaat (kale waarden) naar entry-formaat
function normalizeState(s) {
  if (!s.filters) s.filters = {};
  if (!s.filters.day) s.filters.day = "all";
  if (!s.filters.status) s.filters.status = "all";
  if (!s.filters.priorities) s.filters.priorities = [];
  if (!s.filters.sort) s.filters.sort = "time";
  if (!s.filters.who) s.filters.who = "all";
  if (!s.slots) s.slots = {};
  if (!s.notes) s.notes = {};
  if (!s.assign) s.assign = {};
  if (!s.crew) s.crew = [];
  if (!s.crewRemoved) s.crewRemoved = {};
  for (const k of Object.keys(s.slots)) {
    if (typeof s.slots[k] === "string") s.slots[k] = { v: 1, t: s.slots[k] };
  }
  for (const k of Object.keys(s.notes)) {
    if (typeof s.notes[k] === "string") s.notes[k] = { v: s.notes[k], t: "" };
  }
  for (const k of Object.keys(s.assign)) {
    if (typeof s.assign[k] === "string") s.assign[k] = { v: s.assign[k], t: "" };
  }
  for (const m of s.crew) { if (!m.t) m.t = ""; }
  return s;
}

function loadState(p) {
  try {
    const raw = localStorage.getItem(storageKeyFor(p));
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (e) {}
  return normalizeState({});
}
function saveState() {
  if (!project || !state) return;
  localStorage.setItem(storageKeyFor(project), JSON.stringify(state));
  schedulePush();
}

function slotKey(actId, idx) { return `${actId}::${idx}`; }
function isSlotDone(s, actId, idx) { return !!entryVal(s.slots, slotKey(actId, idx)); }
function noteText(actId) { return entryVal(state.notes, actId) || ""; }
function assignedId(s, actId) { return entryVal(s.assign, actId) || null; }

function isActDoneIn(p, s, act) {
  // "any": act = done zodra >=1 slot is afgevinkt (snippet voldoende)
  // "all": act = done als álle slots zijn afgevinkt (bedrijfsvideo)
  if (act.slots.length === 0) return false;
  if (p.doneMode === "all") return act.slots.every((_, i) => isSlotDone(s, act.id, i));
  return act.slots.some((_, i) => isSlotDone(s, act.id, i));
}
function isActDone(act) { return isActDoneIn(project, state, act); }

// ---- Toewijzing (crew) ----
// Kleuren voor in de app toegevoegde crewleden (eerste vrije wordt gepakt)
const CREW_COLORS = [
  { color: "#a78bfa", soft: "" },
  { color: "#ff9f43", soft: "" },
  { color: "#2dd4bf", soft: "" },
  { color: "#ff6b6b", soft: "" },
  { color: "#ff7ac6", soft: "" },
  { color: "#94a3b8", soft: "" }
];

// tekstkleur (licht/donker) die leesbaar is óp een crew-kleur
function textOn(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ""));
  if (!m) return "#101010";
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 140 ? "#101010" : "#ffffff";
}

function crewList() {
  // vaste crew uit data.js + in de app toegevoegde crewleden
  return [...(project.crew || []), ...(state && state.crew ? state.crew : [])];
}
function crewOf(act) {
  const list = crewList();
  if (list.length === 0) return null;
  const id = assignedId(state, act.id);
  return id ? list.find(c => c.id === id) || null : null;
}
function setAssign(actId, crewId) {
  setEntry(state.assign, actId, crewId || null);
  saveState();
  render();
}
function addCrewMember(name) {
  name = String(name || "").trim();
  if (!name) return null;
  const used = crewList().map(c => c.color);
  const palette = CREW_COLORS.find(c => !used.includes(c.color)) || CREW_COLORS[state.crew.length % CREW_COLORS.length];
  const member = {
    id: "c_" + Date.now().toString(36),
    name,
    color: palette.color,
    soft: palette.soft,
    t: nowIso()
  };
  state.crew.push(member);
  saveState();
  buildWhoChips();
  restoreFilterUI();
  render();
  return member;
}
function removeCrewMember(id) {
  state.crew = state.crew.filter(c => c.id !== id);
  state.crewRemoved[id] = nowIso(); // tombstone, zodat verwijderen ook synct
  // toewijzingen aan dit crewlid opheffen
  for (const actId of Object.keys(state.assign)) {
    if (assignedId(state, actId) === id) setEntry(state.assign, actId, null);
  }
  if (state.filters.who === id) state.filters.who = "all";
  saveState();
  buildWhoChips();
  restoreFilterUI();
  render();
}

// ---- "Voorbij" detectie ----
// Pakt het laatste HH:MM in de tijd-string als eindtijd.
function parseLastTime(timeStr) {
  const matches = [...String(timeStr).matchAll(/(\d{1,2}):(\d{2})/g)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1];
  return { h: parseInt(last[1], 10), m: parseInt(last[2], 10) };
}
function dayInfo(dayKey) {
  return project.days.find(d => d.key === dayKey) || null;
}
function slotEndDate(slot) {
  const t = parseLastTime(slot.time);
  const d = dayInfo(slot.day);
  if (!t || !d || !d.date) return null; // klus zonder datum → nooit "voorbij"
  const hh = String(t.h).padStart(2, "0");
  const mm = String(t.m).padStart(2, "0");
  return new Date(`${d.date}T${hh}:${mm}:00`);
}
function isSlotPast(slot) {
  const end = slotEndDate(slot);
  if (!end) return false;
  return Date.now() > end.getTime();
}
function isActPast(act) {
  return act.slots.length > 0 && act.slots.every(isSlotPast);
}

// welke check net is aangetikt → krijgt een pop-animatie na re-render
let lastPop = null;

function toggleSlot(actId, idx) {
  const k = slotKey(actId, idx);
  const nowOn = !entryVal(state.slots, k);
  setEntry(state.slots, k, nowOn ? 1 : 0);
  if (nowOn) lastPop = `slot:${k}`;
  saveState();
  render();
}

function toggleAct(act) {
  const done = isActDone(act);
  if (done) {
    // clear alle slots
    act.slots.forEach((_, i) => { setEntry(state.slots, slotKey(act.id, i), 0); });
  } else if (project.doneMode === "all") {
    // markeer alle slots als done
    act.slots.forEach((_, i) => { setEntry(state.slots, slotKey(act.id, i), 1); });
  } else {
    // markeer eerste slot als done
    setEntry(state.slots, slotKey(act.id, 0), 1);
  }
  if (!done) lastPop = `act:${act.id}`;
  saveState();
  render();
}

// ---- Home (klus-keuze) ----
function showHome() {
  project = null;
  state = null;
  stopSync();
  document.body.classList.add("home-mode");
  document.getElementById("appTitle").textContent = "Shootlist";
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-home").classList.add("active");
  renderHome();
  window.scrollTo(0, 0);
}

function renderHome() {
  const container = document.getElementById("projectsList");
  container.innerHTML = "";
  for (const p of PROJECTS) {
    const s = loadState(p);
    const total = p.acts.length;
    const done = p.acts.filter(a => isActDoneIn(p, s, a)).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const card = document.createElement("div");
    card.className = "project-card";
    card.style.setProperty("--i", Math.min(container.children.length, 8));
    card.innerHTML = `
      <div class="project-icon">${p.icon || "🎬"}</div>
      <div class="project-info">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="project-sub">${escapeHtml(p.subtitle || "")}</div>
        <div class="project-progress">
          <div class="project-progress-bar"><div style="width:${pct}%"></div></div>
          <span>${done} / ${total}</span>
        </div>
      </div>
      <div class="project-arrow">›</div>
    `;
    card.addEventListener("click", () => openProject(p.id));
    container.appendChild(card);
  }
}

function openProject(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return showHome();
  project = p;
  state = loadState(p);
  document.body.classList.remove("home-mode");
  document.getElementById("appTitle").textContent = p.name;

  buildDayChips();
  buildWhoChips();
  buildTabs();
  restoreFilterUI();

  // altijd starten op de lijst-tab
  activateTab("list");
  render();
  startSync();
  window.scrollTo(0, 0);
}

// ---- Tabs (per klus) ----
function buildTabs() {
  document.querySelector('.tab[data-tab="map"]').style.display = project.map ? "" : "none";
  document.querySelector('.tab[data-tab="timetable"]').style.display = project.timetable ? "" : "none";
  document.querySelector('.tab[data-tab="info"]').style.display = project.info ? "" : "none";

  if (project.map) {
    document.getElementById("mapImg").src = project.map.image;
    const legend = document.getElementById("mapLegend");
    legend.innerHTML = "<h3>Locaties</h3><ul>" + project.map.legend.map(([b, rest]) =>
      `<li><b>${escapeHtml(b)}</b>${rest ? " — " + escapeHtml(rest) : ""}</li>`
    ).join("") + "</ul>";
  }
  if (project.timetable) {
    document.getElementById("ttImg").src = project.timetable.image;
  }
  if (project.info) {
    const el = document.getElementById("infoContent");
    el.innerHTML = `<h3>${escapeHtml(project.info.title)}</h3>` + project.info.groups.map(g => `
      <div class="info-group">
        <div class="info-group-label">${escapeHtml(g.label)}</div>
        ${g.names ? `<div class="info-names">${g.names.map(n => `<span class="name-chip">${escapeHtml(n)}</span>`).join("")}</div>` : ""}
        ${g.text ? `<div class="info-text">${escapeHtml(g.text)}</div>` : ""}
      </div>
    `).join("");
  }
}

function activateTab(target) {
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === target));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + target).classList.add("active");
  window.scrollTo(0, 0);
}

// ---- Filters ----
function buildDayChips() {
  const row = document.getElementById("dayChips");
  row.innerHTML = "";
  if (project.days.length <= 1) {
    row.style.display = "none";
    state.filters.day = "all";
    return;
  }
  row.style.display = "";
  const mk = (key, label) => {
    const btn = document.createElement("button");
    btn.dataset.day = key;
    // "Vr 28 aug" → date-pill met dagdeel boven en nummer eronder
    const m = /^(\S{2,3})\s+(\d{1,2})/.exec(label);
    if (m) {
      btn.className = "chip day-pill";
      btn.innerHTML = `<span class="dp-top">${escapeHtml(m[1])}</span><span class="dp-num">${escapeHtml(m[2])}</span>`;
    } else {
      btn.className = "chip";
      btn.textContent = label;
    }
    btn.addEventListener("click", () => {
      row.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.day = key;
      saveState();
      render();
    });
    row.appendChild(btn);
  };
  mk("all", "Alle");
  project.days.forEach(d => mk(d.key, d.label));
}

function buildWhoChips() {
  const row = document.getElementById("whoRow");
  row.innerHTML = "";
  const list = crewList();
  if (list.length === 0) {
    row.style.display = "none";
    state.filters.who = "all";
    return;
  }
  row.style.display = "";
  const label = document.createElement("span");
  label.className = "sort-label";
  label.textContent = "Voor:";
  row.appendChild(label);
  const mk = (who, text, color) => {
    const btn = document.createElement("button");
    btn.className = "chip sort";
    btn.dataset.who = who;
    btn.textContent = text;
    if (color) {
      btn.style.setProperty("--crew-color", color);
      btn.style.setProperty("--crew-text", textOn(color));
    }
    btn.addEventListener("click", () => {
      row.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.who = who;
      saveState();
      render();
    });
    row.appendChild(btn);
  };
  mk("all", "Iedereen");
  list.forEach(c => mk(c.id, c.name, c.color));
  mk("none", "Niet toegewezen");
}

function setupStaticFilters() {
  document.querySelectorAll(".filters .chip[data-status]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters .chip[data-status]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.status = btn.dataset.status;
      saveState();
      render();
    });
  });
  document.querySelectorAll(".filters .chip[data-priority]").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const p = btn.dataset.priority;
      if (btn.classList.contains("active")) {
        if (!state.filters.priorities.includes(p)) state.filters.priorities.push(p);
      } else {
        state.filters.priorities = state.filters.priorities.filter(x => x !== p);
      }
      saveState();
      render();
    });
  });
  document.querySelectorAll(".filters .chip[data-sort]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters .chip[data-sort]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.sort = btn.dataset.sort;
      saveState();
      render();
    });
  });
}

function restoreFilterUI() {
  const dayRow = document.getElementById("dayChips");
  // reset dag-filter als hij niet meer bestaat in deze klus
  if (state.filters.day !== "all" && !project.days.some(d => d.key === state.filters.day)) {
    state.filters.day = "all";
  }
  dayRow.querySelectorAll(".chip").forEach(b => {
    b.classList.toggle("active", b.dataset.day === state.filters.day);
  });
  // reset wie-filter als crewlid niet meer bestaat
  const validWho = ["all", "none", ...crewList().map(c => c.id)];
  if (!validWho.includes(state.filters.who)) state.filters.who = "all";
  document.querySelectorAll("#whoRow .chip").forEach(b => {
    b.classList.toggle("active", b.dataset.who === state.filters.who);
  });
  document.querySelectorAll(".filters .chip[data-status]").forEach(b => {
    b.classList.toggle("active", b.dataset.status === state.filters.status);
  });
  document.querySelectorAll(".filters .chip[data-priority]").forEach(b => {
    b.classList.toggle("active", state.filters.priorities.includes(b.dataset.priority));
  });
  document.querySelectorAll(".filters .chip[data-sort]").forEach(b => {
    b.classList.toggle("active", b.dataset.sort === state.filters.sort);
  });
}

// ---- Time parsing & sort helpers ----
function parseFirstTimeMinutes(timeStr) {
  // pakt de eerste HH:MM uit een string, bv "19:30 – 21:00" → 1170
  const m = String(timeStr).match(/(\d{1,2}):(\d{2})/);
  if (!m) return 9999; // "doorlopend" of onbekend → onderaan
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function dayOrderOf(dayKey) {
  const i = project.days.findIndex(d => d.key === dayKey);
  return i === -1 ? 9 : i;
}

function earliestSortKey(act, dayFilter) {
  // geeft [dayOrder, minutes] voor de vroegste relevante slot
  const slots = dayFilter === "all" ? act.slots : act.slots.filter(s => s.day === dayFilter);
  if (slots.length === 0) return [9, 9999];
  let best = [9, 9999];
  for (const s of slots) {
    const dayOrder = dayOrderOf(s.day);
    const mins = parseFirstTimeMinutes(s.time);
    if (dayOrder < best[0] || (dayOrder === best[0] && mins < best[1])) {
      best = [dayOrder, mins];
    }
  }
  return best;
}

function filterActs() {
  return project.acts.filter(act => {
    if (state.filters.priorities.length > 0) {
      if (!state.filters.priorities.includes(act.priority)) return false;
    }
    if (state.filters.day !== "all") {
      const hasDay = act.slots.some(s => s.day === state.filters.day);
      if (!hasDay) return false;
    }
    if (state.filters.status === "todo" && isActDone(act)) return false;
    if (state.filters.status === "done" && !isActDone(act)) return false;
    if (crewList().length > 0 && state.filters.who !== "all") {
      const assigned = assignedId(state, act.id);
      if (state.filters.who === "none") { if (assigned) return false; }
      else if (assigned !== state.filters.who) return false;
    }
    return true;
  }).sort((a, b) => {
    // gedane én voorbije acts altijd onderaan
    const aOut = isActDone(a) || isActPast(a);
    const bOut = isActDone(b) || isActPast(b);
    if (aOut !== bOut) return aOut ? 1 : -1;

    const mode = state.filters.sort || "time";
    if (mode === "name") {
      return a.name.localeCompare(b.name, "nl");
    }
    if (mode === "location") {
      const la = (a.location || "").toLowerCase();
      const lb = (b.location || "").toLowerCase();
      if (la !== lb) return la.localeCompare(lb, "nl");
      // binnen zelfde locatie: op tijd
      const ka = earliestSortKey(a, state.filters.day);
      const kb = earliestSortKey(b, state.filters.day);
      if (ka[0] !== kb[0]) return ka[0] - kb[0];
      return ka[1] - kb[1];
    }
    // default: time
    const ka = earliestSortKey(a, state.filters.day);
    const kb = earliestSortKey(b, state.filters.day);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1] - kb[1];
    return a.name.localeCompare(b.name, "nl");
  });
}

// ---- Render ----
function render() {
  if (!project) return renderHome();
  renderProgress();
  renderList();
}

function renderProgress() {
  const total = project.acts.length;
  const done = project.acts.filter(isActDone).length;
  document.getElementById("progressText").textContent = `${done} / ${total} vastgelegd`;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
}

function renderList() {
  const container = document.getElementById("actsList");
  const acts = filterActs();
  container.innerHTML = "";
  if (acts.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--muted);">Geen acts in deze filter.</div>`;
    return;
  }
  acts.forEach((act, i) => {
    const card = renderActCard(act);
    card.style.setProperty("--i", Math.min(i, 8));
    container.appendChild(card);
  });
  lastPop = null;
}

function renderActCard(act) {
  const done = isActDone(act);
  const past = !done && isActPast(act);
  const multiDay = project.days.length > 1;
  const crew = crewOf(act);
  const card = document.createElement("div");
  card.className = "act-card" + (done ? " done" : "") + (past ? " past" : "") + (crew ? " assigned" : "");
  if (crew) {
    card.style.background = `color-mix(in srgb, ${crew.color} 12%, var(--card))`;
    card.style.borderColor = `color-mix(in srgb, ${crew.color} 55%, var(--line))`;
  }

  const slotsForDay = state.filters.day === "all"
    ? act.slots
    : act.slots.filter(s => s.day === state.filters.day);
  const slotsToShow = slotsForDay.length ? slotsForDay : act.slots;

  // bepaal dagen voor meta
  const days = [...new Set(slotsToShow.map(s => s.day))];

  card.innerHTML = `
    ${crew ? `<div class="assign-strip" style="background:${crew.color}; color:${textOn(crew.color)}">🎥 ${escapeHtml(crew.name)}</div>` : ""}
    <div class="act-header">
      <div class="act-check ${done ? "checked" : ""}${lastPop === `act:${act.id}` ? " pop" : ""}" data-toggle="${act.id}">✓</div>
      <div class="act-info" data-open-act>
        <h3 class="act-title">${escapeHtml(act.name)}${
          act.priority === "conditional"
            ? `<span class="priority-badge conditional">Conditioneel</span>`
            : ""
        }${past ? `<span class="priority-badge past-badge">Voorbij</span>` : ""}</h3>
        <div class="act-meta">
          ${multiDay ? days.map(d => `<span><span class="day-dot ${d}"></span> ${dayLabel(d)}</span>`).join("") : ""}
          <span>📍 ${escapeHtml(act.location)}</span>
        </div>
      </div>
    </div>
    <div class="slots"></div>
    ${noteText(act.id) ? `<div class="note-preview">📝 ${escapeHtml(noteText(act.id))}</div>` : ""}
    ${act.note ? `<div class="note-extra">ℹ️ ${escapeHtml(act.note)}</div>` : ""}
    <div class="act-actions">
      <button data-details="${act.id}">Notities / details</button>
    </div>
  `;

  // render slots
  const slotsEl = card.querySelector(".slots");
  act.slots.forEach((slot, idx) => {
    if (state.filters.day !== "all" && slot.day !== state.filters.day) return;
    const sDone = isSlotDone(state, act.id, idx);
    const sPast = !sDone && isSlotPast(slot);
    const sEl = document.createElement("div");
    sEl.className = "slot" + (sDone ? " captured" : "") + (sPast ? " past" : "");
    sEl.innerHTML = `
      <div class="slot-check ${sDone ? "checked" : ""}${lastPop === `slot:${slotKey(act.id, idx)}` ? " pop" : ""}" data-slot="${act.id}|${idx}">✓</div>
      ${multiDay ? `<span class="day-dot ${slot.day}"></span>` : ""}
      <span class="slot-time">${escapeHtml(slot.time)}</span>
      ${multiDay ? `<span class="slot-loc">${dayLabel(slot.day)}${sPast ? " · voorbij" : ""}</span>` : (sPast ? `<span class="slot-loc">voorbij</span>` : "")}
    `;
    slotsEl.appendChild(sEl);
  });

  // events
  card.querySelector('[data-toggle]').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAct(act);
  });
  card.querySelectorAll('[data-slot]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const [aid, idx] = el.dataset.slot.split("|");
      toggleSlot(aid, parseInt(idx, 10));
    });
  });
  card.querySelector('[data-details]').addEventListener('click', () => openModal(act));
  card.querySelector('[data-open-act]').addEventListener('click', () => openModal(act));

  return card;
}

function dayLabel(d) {
  const info = project ? project.days.find(x => x.key === d) : null;
  return info ? info.label : d;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// ---- Modal ----
let currentActId = null;
function openModal(act) {
  currentActId = act.id;
  const multiDay = project.days.length > 1;
  document.getElementById("modalTitle").textContent = act.name;
  const photoEl = document.getElementById("modalPhoto");
  if (act.photo) {
    photoEl.innerHTML = `<img src="${act.photo}" alt="${escapeHtml(act.name)}" loading="lazy" />`;
    photoEl.classList.remove("hidden");
  } else {
    photoEl.innerHTML = "";
    photoEl.classList.add("hidden");
  }
  const days = [...new Set(act.slots.map(s => s.day))];
  document.getElementById("modalMeta").innerHTML = `
    📍 ${escapeHtml(act.location)}<br>
    ${multiDay ? days.map(d => dayLabel(d)).join(" · ") : ""}
    ${act.note ? `<div style="margin-top:8px; padding:8px 10px; background:var(--amber-soft); border-radius:8px;">${escapeHtml(act.note)}</div>` : ""}
  `;
  // render slots in modal
  const slotsEl = document.getElementById("modalSlots");
  slotsEl.innerHTML = "<label class='notes-label'>Slots</label>";
  act.slots.forEach((slot, idx) => {
    const sDone = isSlotDone(state, act.id, idx);
    const sPast = !sDone && isSlotPast(slot);
    const row = document.createElement("div");
    row.className = "slot" + (sDone ? " captured" : "") + (sPast ? " past" : "");
    row.style.marginBottom = "6px";
    row.innerHTML = `
      <div class="slot-check ${sDone ? "checked" : ""}" data-mslot="${idx}">✓</div>
      ${multiDay ? `<span class="day-dot ${slot.day}"></span>` : ""}
      <span class="slot-time">${escapeHtml(slot.time)}</span>
      ${multiDay ? `<span class="slot-loc">${dayLabel(slot.day)}${sPast ? " · voorbij" : ""}</span>` : (sPast ? `<span class="slot-loc">voorbij</span>` : "")}
    `;
    row.querySelector('[data-mslot]').addEventListener('click', () => {
      toggleSlot(act.id, idx);
      openModal(act); // refresh modal
    });
    slotsEl.appendChild(row);
  });
  // toewijzen aan crewlid
  const assignEl = document.getElementById("modalAssign");
  {
    const current = assignedId(state, act.id);
    const customIds = state.crew.map(c => c.id);
    assignEl.style.display = "";
    assignEl.innerHTML = "<label class='notes-label'>Toewijzen aan</label>";
    const row = document.createElement("div");
    row.className = "assign-row";
    const mkBtn = (id, text, color, removable) => {
      const btn = document.createElement("button");
      btn.className = "chip assign-chip" + ((id === current) || (!id && !current) ? " active" : "");
      btn.textContent = text;
      if (color && id === current) {
        btn.style.background = color;
        btn.style.borderColor = color;
        btn.style.color = textOn(color);
      }
      btn.addEventListener("click", () => {
        setAssign(act.id, id === current ? null : id);
        openModal(act); // refresh modal
      });
      if (removable) {
        const x = document.createElement("span");
        x.className = "chip-remove";
        x.textContent = "✕";
        x.addEventListener("click", (e) => {
          e.stopPropagation();
          const member = state.crew.find(c => c.id === id);
          if (!member) return;
          if (!confirm(`"${member.name}" verwijderen? Toewijzingen aan ${member.name} vervallen.`)) return;
          removeCrewMember(id);
          openModal(act);
        });
        btn.appendChild(x);
      }
      row.appendChild(btn);
    };
    mkBtn(null, "Niemand");
    crewList().forEach(c => mkBtn(c.id, c.name, c.color, customIds.includes(c.id)));
    // nieuw crewlid toevoegen
    const addBtn = document.createElement("button");
    addBtn.className = "chip assign-chip add-crew";
    addBtn.textContent = "+ Naam toevoegen";
    addBtn.addEventListener("click", () => {
      const name = prompt("Naam van het nieuwe crewlid:");
      if (name === null) return;
      const member = addCrewMember(name);
      if (member) {
        setAssign(act.id, member.id); // direct toewijzen aan de nieuwe naam
      }
      openModal(act);
    });
    row.appendChild(addBtn);
    assignEl.appendChild(row);
  }
  document.getElementById("modalNotes").value = noteText(act.id);
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  currentActId = null;
}
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});
document.getElementById("modalSave").addEventListener("click", () => {
  if (!currentActId) return;
  const txt = document.getElementById("modalNotes").value.trim();
  if (txt !== noteText(currentActId)) setEntry(state.notes, currentActId, txt);
  saveState();
  render();
  closeModal();
});

// ---- Tabs ----
document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => activateTab(t.dataset.tab));
});

// ---- Terug naar klus-overzicht ----
document.getElementById("backBtn").addEventListener("click", showHome);

// ---- Reset (alleen actieve klus) ----
document.getElementById("resetBtn").addEventListener("click", () => {
  if (!project) return;
  if (!confirm(`Alle vinkjes en notities van "${project.name}" resetten? (Dit synct ook naar andere telefoons.)`)) return;
  // tombstones i.p.v. leegmaken, anders komt de oude staat via sync terug
  for (const k of Object.keys(state.slots)) setEntry(state.slots, k, 0);
  for (const k of Object.keys(state.notes)) setEntry(state.notes, k, "");
  saveState();
  render();
});

// ---- Image zoom (tap to fullscreen) ----
document.querySelectorAll(".zoom-img").forEach(img => {
  img.addEventListener("click", () => {
    img.classList.toggle("zoomed");
  });
});

// ---- Sync tussen telefoons (via /api/state) ----
// Zonder gekoppelde database antwoordt de API {sync:false} en blijft
// alles gewoon lokaal werken. Met database: pull elke 10s + push (met
// debounce) na elke wijziging. Merge: nieuwste timestamp per item wint.
let syncAvailable = null; // null = onbekend, true/false
let pullTimer = null;
let pushTimer = null;

function pickSyncFields(s) {
  return {
    slots: s.slots || {},
    notes: s.notes || {},
    assign: s.assign || {},
    crew: s.crew || [],
    crewRemoved: s.crewRemoved || {}
  };
}
function mergeEntryMaps(a, b) {
  const out = { ...(a || {}) };
  for (const k of Object.keys(b || {})) {
    const ea = out[k], eb = b[k];
    if (!ea || String(eb.t || "") > String(ea.t || "")) out[k] = eb;
  }
  return out;
}
function mergeStates(local, remote) {
  if (!remote) return local;
  if (!local) return remote;
  const tombs = { ...(local.crewRemoved || {}) };
  for (const [id, t] of Object.entries(remote.crewRemoved || {})) {
    if (!tombs[id] || String(t) > String(tombs[id])) tombs[id] = t;
  }
  const crewMap = {};
  for (const m of [...(local.crew || []), ...(remote.crew || [])]) {
    const ex = crewMap[m.id];
    if (!ex || String(m.t || "") > String(ex.t || "")) crewMap[m.id] = m;
  }
  return {
    slots: mergeEntryMaps(local.slots, remote.slots),
    notes: mergeEntryMaps(local.notes, remote.notes),
    assign: mergeEntryMaps(local.assign, remote.assign),
    crewRemoved: tombs,
    crew: Object.values(crewMap)
      .filter(m => !(tombs[m.id] && String(tombs[m.id]) > String(m.t || "")))
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
  };
}

// stabiele JSON (gesorteerde keys) zodat vergelijken niet op
// key-volgorde struikelt en de push-lus netjes stopt
function stableStringify(x) {
  if (Array.isArray(x)) return "[" + x.map(stableStringify).join(",") + "]";
  if (x && typeof x === "object") {
    return "{" + Object.keys(x).sort().map(k => JSON.stringify(k) + ":" + stableStringify(x[k])).join(",") + "}";
  }
  return JSON.stringify(x);
}

function setSyncStatus(v) {
  if (syncAvailable === v) return;
  syncAvailable = v;
  renderSyncBadge();
}
function renderSyncBadge() {
  const el = document.getElementById("syncBadge");
  if (!el) return;
  if (!project) { el.textContent = ""; el.className = "sync-badge"; return; }
  if (syncAvailable === true) { el.textContent = "☁️ synct"; el.className = "sync-badge on"; }
  else if (syncAvailable === false) { el.textContent = "alleen dit toestel"; el.className = "sync-badge off"; }
  else { el.textContent = ""; el.className = "sync-badge"; }
}

// merged-server-staat overnemen; als lokaal nieuwer is → terugpushen
function adoptMerged(remote) {
  if (!project || !state) return;
  const local = pickSyncFields(state);
  const combined = mergeStates(local, remote);
  const combinedJson = stableStringify(combined);
  if (combinedJson !== stableStringify(local)) {
    Object.assign(state, combined);
    localStorage.setItem(storageKeyFor(project), JSON.stringify(state));
    buildWhoChips();
    restoreFilterUI();
    render();
  }
  // lokaal iets dat de server nog niet heeft → terugpushen
  if (!remote || combinedJson !== stableStringify(mergeStates(remote, remote))) {
    schedulePush();
  }
}

function schedulePush() {
  if (!project || syncAvailable === false) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(pushState, 800);
}
async function pushState() {
  if (!project || !state) return;
  const p = project;
  try {
    const r = await fetch(`/api/state?project=${encodeURIComponent(p.id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: pickSyncFields(state) })
    });
    const j = await r.json();
    if (project !== p) return; // ondertussen andere klus geopend
    if (!j.sync) { setSyncStatus(false); return; }
    setSyncStatus(true);
    adoptMerged(j.state);
  } catch (e) { /* offline of geen API — stil laten */ }
}
async function pullState() {
  if (!project) return;
  const p = project;
  try {
    const r = await fetch(`/api/state?project=${encodeURIComponent(p.id)}`);
    const j = await r.json();
    if (project !== p) return;
    if (!j.sync) { setSyncStatus(false); return; }
    setSyncStatus(true);
    adoptMerged(j.state);
  } catch (e) { /* offline — stil laten */ }
}
function startSync() {
  stopSync();
  pullState();
  pullTimer = setInterval(pullState, 10_000);
}
function stopSync() {
  clearInterval(pullTimer);
  clearTimeout(pushTimer);
  renderSyncBadge();
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && project) pullState();
});

// ---- Init ----
setupStaticFilters();
showHome();

// Elke minuut opnieuw renderen zodat "voorbij" status meeloopt met de klok
setInterval(render, 60_000);
