// Shootlist app logic
const STORAGE_KEY = "shootlist_state_v1";

const state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (!s.filters.sort) s.filters.sort = "time";
      return s;
    }
  } catch (e) {}
  return { slots: {}, notes: {}, filters: { day: "all", status: "all", priorities: [], sort: "time" } };
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function slotKey(actId, idx) { return `${actId}::${idx}`; }
function isSlotDone(actId, idx) { return !!state.slots[slotKey(actId, idx)]; }
function isActDone(act) {
  // act = done zodra >=1 slot is afgevinkt (snippet voldoende)
  return act.slots.some((_, i) => isSlotDone(act.id, i));
}

// ---- "Voorbij" detectie ----
// Pakt het laatste HH:MM in de tijd-string als eindtijd.
function parseLastTime(timeStr) {
  const matches = [...String(timeStr).matchAll(/(\d{1,2}):(\d{2})/g)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1];
  return { h: parseInt(last[1], 10), m: parseInt(last[2], 10) };
}
function slotEndDate(slot) {
  const t = parseLastTime(slot.time);
  const d = FESTIVAL_DATES[slot.day];
  if (!t || !d) return null;
  const hh = String(t.h).padStart(2, "0");
  const mm = String(t.m).padStart(2, "0");
  return new Date(`${d}T${hh}:${mm}:00`);
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
  } else {
    // markeer eerste slot als done
    state.slots[slotKey(act.id, 0)] = new Date().toISOString();
  }
  saveState();
  render();
}

// ---- Filters ----
function setupFilters() {
  document.querySelectorAll(".filters .chip[data-day]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters .chip[data-day]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.day = btn.dataset.day;
      saveState();
      render();
    });
  });
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
    // initial state from storage
    if (state.filters.priorities.includes(btn.dataset.priority)) btn.classList.add("active");
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
  // restore filter UI state
  document.querySelectorAll(".filters .chip[data-day]").forEach(b => {
    b.classList.toggle("active", b.dataset.day === state.filters.day);
  });
  document.querySelectorAll(".filters .chip[data-status]").forEach(b => {
    b.classList.toggle("active", b.dataset.status === state.filters.status);
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

function earliestSortKey(act, dayFilter) {
  // geeft [dayOrder, minutes] voor de vroegste relevante slot
  const slots = dayFilter === "all" ? act.slots : act.slots.filter(s => s.day === dayFilter);
  if (slots.length === 0) return [9, 9999];
  let best = [9, 9999];
  for (const s of slots) {
    const dayOrder = s.day === "wo" ? 0 : s.day === "do" ? 1 : 2;
    const mins = parseFirstTimeMinutes(s.time);
    if (dayOrder < best[0] || (dayOrder === best[0] && mins < best[1])) {
      best = [dayOrder, mins];
    }
  }
  return best;
}

function filterActs() {
  return ACTS.filter(act => {
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
  renderProgress();
  renderList();
}

function renderProgress() {
  const total = ACTS.length;
  const done = ACTS.filter(isActDone).length;
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
          ${days.map(d => `<span><span class="day-dot ${d}"></span> ${dayLabel(d)}</span>`).join("")}
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
    const sDone = isSlotDone(act.id, idx);
    const sPast = !sDone && isSlotPast(slot);
    const sEl = document.createElement("div");
    sEl.className = "slot" + (sDone ? " captured" : "") + (sPast ? " past" : "");
    sEl.innerHTML = `
      <div class="slot-check ${sDone ? "checked" : ""}" data-slot="${act.id}|${idx}">✓</div>
      <span class="day-dot ${slot.day}"></span>
      <span class="slot-time">${escapeHtml(slot.time)}</span>
      <span class="slot-loc">${dayLabel(slot.day)}${sPast ? " · voorbij" : ""}</span>
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
  if (d === "wo") return "Wo 13 mei";
  if (d === "do") return "Do 14 mei";
  return d;
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
    ${days.map(d => dayLabel(d)).join(" · ")}
    ${act.note ? `<div style="margin-top:8px; padding:8px 10px; background:var(--amber-soft); border-radius:8px;">${escapeHtml(act.note)}</div>` : ""}
  `;
  // render slots in modal
  const slotsEl = document.getElementById("modalSlots");
  slotsEl.innerHTML = "<label class='notes-label'>Slots</label>";
  act.slots.forEach((slot, idx) => {
    const sDone = isSlotDone(act.id, idx);
    const sPast = !sDone && isSlotPast(slot);
    const row = document.createElement("div");
    row.className = "slot" + (sDone ? " captured" : "") + (sPast ? " past" : "");
    row.style.marginBottom = "6px";
    row.innerHTML = `
      <div class="slot-check ${sDone ? "checked" : ""}" data-mslot="${idx}">✓</div>
      <span class="day-dot ${slot.day}"></span>
      <span class="slot-time">${escapeHtml(slot.time)}</span>
      <span class="slot-loc">${dayLabel(slot.day)}${sPast ? " · voorbij" : ""}</span>
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
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    t.classList.add("active");
    const target = t.dataset.tab;
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById("view-" + target).classList.add("active");
    window.scrollTo(0, 0);
  });
});

// ---- Reset ----
document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Alle vinkjes en notities resetten?")) return;
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
setupFilters();
render();

// Elke minuut opnieuw renderen zodat "voorbij" status meeloopt met de klok
setInterval(render, 60_000);
