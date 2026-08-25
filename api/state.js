// Serverless sync-endpoint (Vercel) — bewaart de gedeelde staat per klus
// in Upstash Redis (Vercel Marketplace: Storage → Upstash Redis).
// Zonder gekoppelde database antwoordt dit endpoint {sync:false} en
// draait de app gewoon lokaal (localStorage) verder.
//
// GET  /api/state?project=<id>          → { sync, state }
// POST /api/state?project=<id> {state}  → merget met server-staat → { sync, state }

// ---- merge-logica (zelfde algoritme als in app.js) ----
// Elke entry is { v, t }: waarde + ISO-timestamp. Nieuwste timestamp wint.
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
  const out = {
    slots: mergeEntryMaps(local.slots, remote.slots),
    notes: mergeEntryMaps(local.notes, remote.notes),
    assign: mergeEntryMaps(local.assign, remote.assign),
    crewRemoved: {},
    crew: []
  };
  // tombstones: hoogste timestamp wint
  const tombs = { ...(local.crewRemoved || {}) };
  for (const [id, t] of Object.entries(remote.crewRemoved || {})) {
    if (!tombs[id] || String(t) > String(tombs[id])) tombs[id] = t;
  }
  out.crewRemoved = tombs;
  // crew: unie op id, nieuwste versie wint, tenzij later verwijderd
  const crewMap = {};
  for (const m of [...(local.crew || []), ...(remote.crew || [])]) {
    const ex = crewMap[m.id];
    if (!ex || String(m.t || "") > String(ex.t || "")) crewMap[m.id] = m;
  }
  out.crew = Object.values(crewMap)
    .filter(m => !(tombs[m.id] && String(tombs[m.id]) > String(m.t || "")))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return out;
}

// ---- Upstash Redis via REST ----
function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCmd(cfg, cmdArr) {
  const r = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmdArr)
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return r.json();
}

function pickSyncFields(s) {
  if (!s || typeof s !== "object") return null;
  return {
    slots: s.slots || {},
    notes: s.notes || {},
    assign: s.assign || {},
    crew: Array.isArray(s.crew) ? s.crew : [],
    crewRemoved: s.crewRemoved || {}
  };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const cfg = redisConfig();
  if (!cfg) {
    // Geen database gekoppeld: app draait lokaal verder.
    res.status(200).json({ sync: false });
    return;
  }
  const project = String((req.query && req.query.project) || "").replace(/[^a-zA-Z0-9_-]/g, "");
  if (!project) {
    res.status(400).json({ error: "project required" });
    return;
  }
  const key = `shootlist:${project}`;
  try {
    if (req.method === "GET") {
      const out = await redisCmd(cfg, ["GET", key]);
      res.status(200).json({ sync: true, state: out.result ? JSON.parse(out.result) : null });
    } else if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
      const incoming = pickSyncFields(body && body.state);
      if (!incoming) {
        res.status(400).json({ error: "state required" });
        return;
      }
      const cur = await redisCmd(cfg, ["GET", key]);
      const merged = mergeStates(cur.result ? JSON.parse(cur.result) : null, incoming);
      await redisCmd(cfg, ["SET", key, JSON.stringify(merged)]);
      res.status(200).json({ sync: true, state: merged });
    } else {
      res.status(405).json({ error: "method not allowed" });
    }
  } catch (e) {
    res.status(502).json({ error: "redis unavailable" });
  }
};

module.exports.mergeStates = mergeStates;
module.exports.pickSyncFields = pickSyncFields;
