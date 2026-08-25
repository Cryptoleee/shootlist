// Shootlist app logic — multi-klus versie.
// Startscherm toont alle klussen (PROJECTS); tik op een klus om de
// bijbehorende shootlist te openen. State wordt per klus opgeslagen.

let project = null; // actieve klus
let state = null;   // state van actieve klus

function storageKeyFor(p) { return `shootlist_state_${p.stateKey}`; }

function loadState(p) {
  try {
    const raw = localStorage.getItem(storageKeyFor(p));
    if (raw) {
      const s = JSON.parse(raw);
      if (!s.filters) s.filters = {};
      if (!s.filters.day) s.filters.day = "all";
      if (!s.filters.status) s.filters.status = "all";
      if (!s.filters.priorities) s.filters.priorities = [];
      if (!s.filters.sort) s.filters.sort = "time";
      if (!s.slots) s.slots = {};
      if (!s.notes) s.notes = {};
      return s;
    }
  } catch (e) {}
  return { slots: {}, notes: {}, filters: { day: "all", status: "all", priorities: [], sort: "time" } };
}
function saveState() {
  if (!project || !state) return;
  localStorage.setItem(storageKeyFor(project), JSON.stringify(state));
}

function slotKey(actId, idx) { return `${actId}::${idx}`; }
function isSlotDone(s, actId, idx) { return !!s.slots[slotKey(actId, idx)]; }

function isActDoneIn(p, s, act) {
  // "any": act = done zodra >=1 slot is afgevinkt (snippet voldoende)
  // "all": act = done als álle slots zijn afgevinkt (bedrijfsvideo)
  if (act.slots.length === 0) return false;
  if (p.doneMode === "all") return act.slots.every((_, i) => isSlotDone(s, act.id, i));
  return act.slots.some((_, i) => isSlotDone(s, act.id, i));
}
function isActDone(act) { return isActDoneIn(project, state, act); }

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

function toggleSlot(actId, idx) {
  const k = slotKey(actId, idx);
  if (state.slots[k]) delete state.slots[k];
  else state.slots[k] = new Date().toISOString();
  saveState();
  render();
}

function toggleAct(act) {
  const done = isActDone(act);
  if (done) {
    // clear alle slots
    act.slots.forEach((_, i) => { delete state.slots[slotKey(act.id, i)]; });
  } else if (project.doneMode === "all") {
    // markeer alle slots als done
    act.slots.forEach((_, i) => { state.slots[slotKey(act.id, i)] = new Date().toISOString(); });
  } else {
    // markeer eerste slot als done
    state.slots[slotKey(act.id, 0)] = new Date().toISOString();
  }
  saveState();
  render();
}

// ---- Home (klus-keuze) ----
function showHome() {
  project = null;
  state = null;
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
  buildTabs();
  restoreFilterUI();

  // altijd starten op de lijst-tab
  activateTab("list");
  render();
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
        <div class="info-names">${g.names.map(n => `<span class="name-chip">${escapeHtml(n)}</span>`).join("")}</div>
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
    btn.className = "chip";
    btn.dataset.day = key;
    btn.textContent = label;
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
  for (const act of acts) {
    container.appendChild(renderActCard(act));
  }
}

function renderActCard(act) {
  const done = isActDone(act);
  const past = !done && isActPast(act);
  const multiDay = project.days.length > 1;
  const card = document.createElement("div");
  card.className = "act-card" + (done ? " done" : "") + (past ? " past" : "");

  const slotsForDay = state.filters.day === "all"
    ? act.slots
    : act.slots.filter(s => s.day === state.filters.day);
  const slotsToShow = slotsForDay.length ? slotsForDay : act.slots;

  // bepaal dagen voor meta
  const days = [...new Set(slotsToShow.map(s => s.day))];

  card.innerHTML = `
    <div class="act-header">
      <div class="act-check ${done ? "checked" : ""}" data-toggle="${act.id}">✓</div>
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
    ${state.notes[act.id] ? `<div class="note-preview">📝 ${escapeHtml(state.notes[act.id])}</div>` : ""}
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
      <div class="slot-check ${sDone ? "checked" : ""}" data-slot="${act.id}|${idx}">✓</div>
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
  document.getElementById("modalNotes").value = state.notes[act.id] || "";
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
  if (txt) state.notes[currentActId] = txt;
  else delete state.notes[currentActId];
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
  if (!confirm(`Alle vinkjes en notities van "${project.name}" resetten?`)) return;
  state.slots = {};
  state.notes = {};
  saveState();
  render();
});

// ---- Image zoom (tap to fullscreen) ----
document.querySelectorAll(".zoom-img").forEach(img => {
  img.addEventListener("click", () => {
    img.classList.toggle("zoomed");
  });
});

// ---- Init ----
setupStaticFilters();
showHome();

// Elke minuut opnieuw renderen zodat "voorbij" status meeloopt met de klok
setInterval(render, 60_000);
