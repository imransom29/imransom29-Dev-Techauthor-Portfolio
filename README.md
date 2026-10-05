
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Model Testing Kit · Progress</title>
<style>
/* =====================================================================
   1) TOKENS — Wells Fargo theme
   ===================================================================== */
:root {
  --red: #D71E28; --red-dark: #A6141C; --red-tint: #FDF0F0;
  --gold: #FFCD41; --gold-text: #7A5600;
  --ok: #4E8A2E; --ok-tint: #EEF5E8; --ok-line: #A9CB94;
  --page: #F3EEE7; --cream: #FAF7F2; --line: #E5DDD2; --line-dark: #C9BFB3;
  --ink: #3B3331; --muted: #7D736A;
  --sans: "Wells Fargo Sans", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
  --serif: "Wells Fargo Serif", Georgia, serif;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
* { box-sizing: border-box; }
body { margin: 0; padding: 20px; font-family: var(--sans); font-size: 13px; color: var(--ink); background: var(--page); }
.muted { color: var(--muted); }
.mono { font-family: var(--mono); }
i.ic { display: inline-flex; width: 1em; height: 1em; flex: none; }
i.ic svg { width: 100%; height: 100%; }

/* =====================================================================
   2) BOX + TABS (Progress / Analytics)
   ===================================================================== */
.box { background: #fff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
.box > .band { height: 4px; background: var(--red); box-shadow: 0 2px 0 var(--gold); }
.box-head { display: flex; align-items: center; gap: 4px; padding: 6px 14px 0; border-bottom: 1px solid var(--line); }
.tab { padding: 11px 14px; font-size: 14px; color: var(--muted); border: none; background: none; cursor: pointer;
       border-bottom: 2.5px solid transparent; margin-bottom: -1px; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; }
.tab.active { color: var(--red-dark); font-weight: 600; border-bottom-color: var(--red); }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); animation: blink 1.2s infinite; }
@keyframes blink { 50% { opacity: .3; } }

/* =====================================================================
   3) FACTOR TABS
   ===================================================================== */
.factor-tabs { display: flex; gap: 6px; padding: 12px 14px 0; overflow-x: auto; }
.ftab { position: relative; display: flex; align-items: center; gap: 8px; padding: 8px 12px 10px; white-space: nowrap;
        border: 1px solid var(--line); border-radius: 11px; background: #fff; cursor: pointer; font-size: 12.5px;
        overflow: hidden; font-family: inherit; color: var(--ink); }
.ftab:hover { border-color: var(--line-dark); }
.ftab.active { border-color: var(--red); background: var(--red-tint); box-shadow: 0 0 0 1px var(--red); }
.ftab .pct { font-family: var(--mono); font-size: 11px; color: var(--muted); }
.ftab .under { position: absolute; left: 0; bottom: 0; height: 3px; transition: width .3s; }
.ftab-sep { width: 1px; background: var(--line); margin: 4px; flex: none; }

/* =====================================================================
   4) PANEL: status line, map, message
   ===================================================================== */
.panel { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 12px; }
.status { display: flex; align-items: center; gap: 14px; background: var(--cream); border: 1px solid var(--line); border-radius: 12px; padding: 11px 16px; }
.status .dot { width: 10px; height: 10px; border-radius: 50%; flex: none; }
.status .dot.live { animation: blink 1.2s infinite; }
.status .title { font-size: 14px; font-weight: 700; white-space: nowrap; }
.status .sub { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.status .bar { flex: 1; min-width: 80px; height: 6px; border-radius: 3px; background: #E6DED3; overflow: hidden; }
.status .bar i { display: block; height: 100%; transition: width .3s; }
.status .pct { font-family: var(--serif); font-size: 18px; font-weight: 700; }

/* Map: 3 zones, CSS grid se responsive; lines JS se DOM positions naap ke banti hain */
.map-wrap { overflow-x: auto; padding-bottom: 2px; }
/* 1120px se patla ho to map scroll hota hai, taaki boxes ka text na kate */
.map { position: relative; min-width: 1120px; display: grid; grid-template-columns: 3fr 3fr 2fr; gap: 10px; }
.map > svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.zone { position: relative; border: 1px solid #EDE5DA; background: var(--cream); border-radius: 14px; padding: 40px 14px 18px;
        display: grid; gap: 52px 18px; align-content: start; transition: background .3s, border-color .3s; }
.zone.pre, .zone.extract { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.zone.post { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.zone-head { position: absolute; top: 12px; left: 16px; right: 16px; display: flex; justify-content: space-between;
             font-size: 11px; font-weight: 700; letter-spacing: .9px; color: var(--gold-text); }
.zone-head .zs { font-weight: 600; letter-spacing: 0; }

.node { position: relative; z-index: 1; min-width: 0; height: 84px; background: #fff; border: 1.5px solid #D9D0C4; border-radius: 13px;
        padding: 9px 10px; display: flex; flex-direction: column; gap: 1px; transition: border-color .3s, background .3s, opacity .3s; }
.node .hd { display: flex; align-items: center; gap: 6px; min-width: 0; }
.node .hd i.ic { font-size: 16px; color: #9A9088; }
.node .tt { font-weight: 600; font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.node .sb { font-family: var(--mono); font-size: 10px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.node .mt { margin-top: auto; font-family: var(--mono); font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.node.wait { opacity: .5; }
.node.run { border-color: var(--red); background: #FFFBFA; animation: glow 1.4s ease-in-out infinite; }
@keyframes glow { 0%,100% { box-shadow: 0 0 0 0 rgba(215,30,40,0); } 50% { box-shadow: 0 0 0 6px rgba(215,30,40,.12); } }
.node.run .hd i.ic { color: var(--red); } .node.run .mt { color: var(--red-dark); }
.node.done { border-color: var(--ok-line); background: #FAFDF7; } .node.done .hd i.ic { color: var(--ok); }
.node.fail { border-color: var(--red-dark); background: var(--red-tint); }
.node.fail .hd i.ic, .node.fail .mt { color: var(--red-dark); }

.msg { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-radius: 12px; padding: 10px 14px; }
.msg .t { font-weight: 700; display: flex; align-items: center; gap: 6px; }
.msg .d { font-size: 12.5px; margin-top: 2px; }
.btn { height: 32px; padding: 0 12px; border: 1px solid var(--line-dark); border-radius: 9px; background: #fff; font-size: 12.5px;
       display: inline-flex; align-items: center; gap: 6px; color: var(--ink); cursor: pointer; white-space: nowrap; font-family: inherit; }
.btn-primary { height: 34px; padding: 0 14px; border: none; border-radius: 9px; background: var(--red); color: #fff; font-weight: 600;
               font-size: 12.5px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap; font-family: inherit; }

/* Overview table */
.ov { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.ov-row { display: grid; grid-template-columns: minmax(180px, 1.4fr) 1fr 1fr 1fr 120px 80px 20px; gap: 14px; align-items: center; padding: 0 16px; }
.ov-head { height: 34px; background: var(--red); color: #fff; font-size: 10.5px; font-weight: 700; letter-spacing: .6px; border-bottom: 3px solid var(--gold); }
.ov-body .ov-row { height: 62px; border-bottom: 1px solid #F1ECE5; cursor: pointer; }
.ov-body .ov-row:hover { background: #FFFBF7; }
.pb { height: 8px; border-radius: 4px; background: #ECE5DB; overflow: hidden; } .pb i { display: block; height: 100%; transition: width .3s; }
.pill { font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; letter-spacing: .4px; justify-self: start; display: inline-flex; gap: 5px; align-items: center; }

.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }

/* =====================================================================
   5) ANALYTICS — 3D meaning space + side panel
   ===================================================================== */
.an-grid { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 12px; height: 620px; }
.an-stage { position: relative; overflow: hidden; background: #FFFDF9; border: 1px solid var(--line); border-radius: 14px; }
.an-stage canvas { width: 100%; height: 100%; display: block; cursor: grab; }
.an-stage canvas:active { cursor: grabbing; }
.an-top { position: absolute; left: 14px; top: 12px; right: 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.an-select { height: 34px; border: 1px solid var(--line-dark); border-radius: 10px; background: #fff; padding: 0 10px; font-size: 13px; font-weight: 600; color: var(--ink); font-family: inherit; }
.an-lenses { display: flex; gap: 4px; background: #F1ECE5; border-radius: 10px; padding: 3px; }
.an-lenses button { border: none; background: none; font-size: 12px; padding: 5px 12px; border-radius: 8px; color: var(--muted); cursor: pointer; display: inline-flex; gap: 5px; align-items: center; font-family: inherit; }
.an-lenses button.active { background: #fff; color: var(--red-dark); font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.an-partial { font-size: 11px; font-weight: 600; color: var(--gold-text); background: #FFF7DD; padding: 3px 9px; border-radius: 999px; }
.an-legend { position: absolute; left: 14px; bottom: 12px; display: flex; gap: 12px; background: rgba(255,255,255,.92); padding: 5px 10px; border-radius: 8px; border: 1px solid var(--line); font-size: 11px; color: var(--muted); }
.an-legend b { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 4px; vertical-align: -1px; }
.an-hint { position: absolute; right: 14px; bottom: 14px; font-size: 11px; color: var(--muted); }
.an-tip { position: absolute; pointer-events: none; background: var(--ink); color: #fff; font-size: 11.5px; padding: 7px 10px; border-radius: 9px; max-width: 280px; line-height: 1.4; display: none; z-index: 3; }
.an-side { border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 11px; overflow: auto; }
.an-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
.an-kpi { background: var(--cream); border-radius: 10px; padding: 8px 10px; border-left: 3px solid; }
.an-kpi b { display: block; font-family: var(--serif); font-size: 20px; } .an-kpi span { font-size: 10.5px; color: var(--muted); }
.an-lbl { font-size: 10px; font-weight: 700; letter-spacing: .7px; color: var(--gold-text); margin-bottom: 5px; }
.an-exp { background: var(--cream); border-radius: 12px; padding: 10px 12px; font-size: 12.6px; line-height: 1.55; }
.an-exp b.h { display: block; font-size: 10px; letter-spacing: .6px; color: var(--gold-text); margin-bottom: 2px; }
.an-ex { border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; font-size: 12px; line-height: 1.45; margin-bottom: 6px; }
.an-empty { height: 420px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; }

@media (prefers-reduced-motion: reduce) { .spin, .node.run, .live-dot, .status .dot.live { animation: none; } }
</style>
</head>
<body>

<section class="box" data-testid="testing-kit-box">
  <div class="band"></div>
  <div class="box-head">
    <button class="tab active" data-tab="progress" data-testid="tab-progress"><span class="live-dot" id="liveDot"></span><i class="ic" data-i="topology"></i>Progress</button>
    <button class="tab" data-tab="analytics" data-testid="tab-analytics"><i class="ic" data-i="cube"></i>Analytics</button>
  </div>
  <div class="factor-tabs" id="factorTabs" data-testid="factor-tabs"></div>
  <div class="panel" id="panel"></div>
</section>

<script>
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
  const num = (n) => (n == null ? "—" : Number(n).toLocaleString());

  /* ===================================================================
     A) ICONS — inline SVG, kyunki bank network pe icon CDN block hota hai
     =================================================================== */
  const FILE = "M14 3v4a1 1 0 0 0 1 1h4M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z";
  const CLOUD = "M6.66 18C4.08 18 2 16 2 13.5c0-2.47 2.08-4.48 4.66-4.48.39-1.76 1.79-3.2 3.67-3.77 1.88-.57 3.96-.2 5.44 1 1.49 1.19 2.16 3 1.77 4.77h.99c1.91 0 3.46 1.56 3.46 3.49S20.45 18 18.54 18z";
  const ICONS = {
    topology: "M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M10.5 6.8L6 17M13.5 6.8L18 17M7 19h10",
    cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
    list: "M4 4h16v6H4zM4 14h16v6H4z",
    check: "M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M9 12l2 2 4-4",
    alert: "M8.7 3h6.6L21 8.7v6.6L15.3 21H8.7L3 15.3V8.7zM12 8v4M12 16h.01",
    clock: "M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 3",
    loader: "M12 3a9 9 0 1 0 9 9",
    sheet: FILE + "M8 11h8v7H8zM8 15h8M12 11v7",
    play: "M7 4v16l13-8z",
    robot: "M7 7h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM12 3v4M9 13h.01M15 13h.01M10 16h4",
    files: "M15 3v4a1 1 0 0 0 1 1h4M18 17h-7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l5 5v7a2 2 0 0 1-2 2zM16 17v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2",
    cloud: CLOUD,
    radar: "M21 12h-8a1 1 0 1 0-1 1v8a9 9 0 0 0 9-9M16 9a5 5 0 1 0-7 7M20.49 9A9 9 0 1 0 9 20.49",
    download: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12",
    code: FILE + "M10 13l-1 2 1 2M14 13l1 2-1 2",
    scale: "M7 20h10M6 6l6-1 6 1M12 3v17M9 12l-3-6-3 6a3 3 0 0 0 6 0M21 12l-3-6-3 6a3 3 0 0 0 6 0",
    filecheck: FILE + "M9 15l2 2 4-4",
    manifest: "M13 5h8M13 9h5M13 15h8M13 19h5M3 4h6v6H3zM3 14h6v6H3z",
    chevron: "M9 6l6 6-6 6",
    play2: "M7 4v16l13-8z",
    log: FILE + "M9 9h1M9 13h6M9 17h6"
  };
  function paintIcons(root) {
    (root || document).querySelectorAll("i.ic:not([data-done])").forEach((el) => {
      const d = ICONS[el.dataset.i] || "M12 12h.01";
      el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
      el.dataset.done = "1";
      if (el.dataset.spin) el.classList.add("spin");
    });
  }
  const ic = (name, spin) => `<i class="ic" data-i="${name}"${spin ? ' data-spin="1"' : ""}></i>`;

  /* ===================================================================
     B) API — backend ready hone par sirf yahi section badlo
     -------------------------------------------------------------------
     Snapshot shape (har update pe poora bhejo):
     {
       runId: "run_...",
       factors: [{
         id: "change_management", name: "Change Management",
         tests: ["Toxicity","Performance","Sensitivity"],
         dataset: { name: "CM_Golden.xlsx", rows: 462 },
         environment: "DEV",
         status: "queued" | "running" | "completed" | "failed",
         phase: "pre" | "extract" | "post" | "done",
         startedAt: 1712345678000, endedAt: null,          // ms
         waitingFor: "Hallucination",                        // sirf queued pe
         error: { phase: "extract", message: "..." },        // sirf failed pe
         counts: {                                           // jo nahi pata, null bhejo (0 nahi)
           sent, answered, preFiles, searchCalls,            // Pre
           tracesStored, tracesPulled, spans,                // Extract
           testsScored, resultFiles, judgeCalls,             // Post
           manifestWritten                                   // true/false
         }
       }]
     }
     =================================================================== */
  const USE_MOCK = true;
  function subscribeRun(runId, onSnapshot) {
    if (!USE_MOCK) {
      const es = new EventSource(`/api/testing-kit/runs/${encodeURIComponent(runId)}/stream`);
      es.onmessage = (e) => onSnapshot(JSON.parse(e.data));
      es.onerror = () => { /* EventSource khud reconnect karta hai */ };
      return () => es.close();
    }
    return mockStream(onSnapshot);
  }

  /* ===================================================================
     C) STATE
     =================================================================== */
  const state = { snap: null, selected: "change_management", tab: "progress", builtFor: null };

  /* ===================================================================
     D) DERIVE — snapshot se status nikalo. Niyam:
        1. Zone ka status hamesha uske nodes se nikalta hai.
        2. Jo value null hai, wo "—" dikhti hai, kabhi 0 nahi.
     =================================================================== */
  const ZONES = [
    { id: "pre", name: "PRE · RUN PROMPTS", nodes: ["ds", "pre", "sup", "pq", "a1"], grid: { ds: [1,1], pre: [2,1], sup: [3,1], pq: [2,2], a1: [3,2] } },
    { id: "extract", name: "EXTRACT · PULL TRACES", nodes: ["ow", "ex", "tj"], grid: { ow: [1,1], ex: [2,1], tj: [3,1] } },
    { id: "post", name: "POST · SCORE RESULTS", nodes: ["po", "res", "a2", "man"], grid: { po: [1,1], res: [2,1], a2: [1,2], man: [2,2] } }
  ];
  const ZONE_OF = {}; ZONES.forEach((z, i) => z.nodes.forEach((n) => (ZONE_OF[n] = i)));
  const EDGES = [["ds","pre","h"],["pre","sup","h"],["sup","ow","h"],["ow","ex","h"],["ex","tj","h"],["tj","po","h"],["po","res","h"],
                 ["pre","pq","v"],["sup","a1","v",1],["po","a2","v",1],["res","man","v"]];
  const PHASE_INDEX = { pre: 0, extract: 1, post: 2, done: 3 };

  function nodeLabels(f) {
    const nt = f.tests.length;
    return {
      ds: ["sheet", "Dataset", f.dataset.name], pre: ["play", "Run prompts", "pre_X.py"], sup: ["robot", "Supervisor", `local agent · ${f.environment}`],
      pq: ["files", "Answers", `${nt} × _pre.parquet`], a1: ["cloud", "Tachyon", "search + completions"],
      ow: ["radar", "Overwatch", "trace store"], ex: ["download", "Extract", "traces_extractor.py"], tj: ["code", "Traces file", "traces.json"],
      po: ["scale", "Score", "post_X.py"], res: ["filecheck", "Results", `${nt} × _post.xlsx`], a2: ["cloud", "Tachyon", "judge + embeddings"],
      man: ["manifest", "Manifest", "run_manifest.json"]
    };
  }
  function nodeMetric(f, k) {
    const c = f.counts, rows = f.dataset.rows, nt = f.tests.length;
    if (f.status === "queued") return "waiting";
    return {
      ds: `${num(rows)} rows`, pre: `${num(c.sent)} / ${num(rows)} sent`, sup: `${num(c.answered)} answered`,
      pq: `${num(c.preFiles)} / ${nt} written`, a1: `${num(c.searchCalls)} calls`,
      ow: `${num(c.tracesStored)} stored`, ex: f.status === "failed" && f.error?.phase === "extract" ? `stopped at ${num(c.tracesPulled)}` : `${num(c.tracesPulled)} / ${num(rows)}`,
      tj: c.spans != null ? `${num(c.spans)} spans` : "not yet",
      po: `${num(c.testsScored)} / ${nt} tests`, res: `${num(c.resultFiles)} / ${nt} written`, a2: `${num(c.judgeCalls)} calls`,
      man: c.manifestWritten ? "written" : "not yet"
    }[k];
  }
  function nodeState(f, k) {
    const z = ZONE_OF[k], ph = PHASE_INDEX[f.phase], c = f.counts, nt = f.tests.length;
    if (f.status === "queued") return "wait";
    if (f.status === "completed") return "done";
    if (f.status === "failed") {
      const fz = PHASE_INDEX[f.error?.phase] ?? ph;
      const firstNode = ZONES[fz].nodes.find((n) => n !== "ow" && n !== "ds") || ZONES[fz].nodes[0];
      if (k === (fz === 1 ? "ex" : fz === 2 ? "po" : "pre")) return "fail";
      return z < fz || k === "ds" || (fz === 1 && k === "ow") ? "done" : "wait";
    }
    if (k === "ds") return "done";
    if (k === "ow") return ph <= 1 ? "run" : "done";
    if (k === "pq") return c.preFiles >= nt ? "done" : c.preFiles > 0 ? "run" : z === ph ? "run" : "wait";
    if (k === "tj") return c.spans != null && ph > 1 ? "done" : "wait";
    if (k === "res") return c.resultFiles >= nt ? "done" : c.resultFiles > 0 ? "run" : "wait";
    if (k === "man") return c.manifestWritten ? "done" : "wait";
    return z < ph ? "done" : z === ph ? "run" : "wait";
  }
  function zoneState(states) {
    if (states.includes("fail")) return ["stopped", "var(--red-dark)", "var(--red-tint)", "#F0C9CB"];
    if (states.every((s) => s === "done")) return ["✓ done", "var(--ok)", "#F6FAF2", "#D6E6CB"];
    if (states.includes("run")) return ["running", "var(--red-dark)", "#FFF6F5", "#F3C9CB"];
    return ["waiting", "var(--muted)", "var(--cream)", "#EDE5DA"];
  }
  function factorPct(f) {
    if (f.status === "completed") return 1;
    const c = f.counts, rows = f.dataset.rows || 1, nt = f.tests.length || 1;
    return ((c.sent || 0) / rows + (c.tracesPulled || 0) / rows + (c.testsScored || 0) / nt) / 3;
  }
  const STATUS = {
    running: { color: "var(--red)", tint: "var(--red-tint)", icon: ic("loader", true), label: "RUNNING" },
    completed: { color: "var(--ok)", tint: "var(--ok-tint)", icon: ic("check"), label: "DONE" },
    failed: { color: "var(--red-dark)", tint: "var(--red-tint)", icon: ic("alert"), label: "STOPPED" },
    queued: { color: "var(--muted)", tint: "#F1ECE5", icon: ic("clock"), label: "QUEUED" }
  };
  function elapsed(f) {
    if (!f.startedAt || f.status === "queued") return "—";
    const s = Math.floor(((f.endedAt || Date.now()) - f.startedAt) / 1000);
    return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
  }

  /* ===================================================================
     E) RENDER: factor tabs
     =================================================================== */
  function renderFactorTabs() {
    const fs = state.snap.factors;
    const all = fs.reduce((a, f) => a + factorPct(f), 0) / fs.length;
    $("factorTabs").innerHTML =
      `<button class="ftab ${state.selected === "overview" ? "active" : ""}" data-f="overview">${ic("list")}<b>Overview</b><span class="pct">${Math.round(all * 100)}%</span><span class="under" style="width:${all * 100}%;background:var(--ink)"></span></button><span class="ftab-sep"></span>` +
      fs.map((f) => {
        const s = STATUS[f.status], p = factorPct(f);
        return `<button class="ftab ${state.selected === f.id ? "active" : ""}" data-f="${esc(f.id)}" data-testid="factor-tab-${esc(f.id)}">
          <span style="color:${s.color};display:inline-flex">${s.icon}</span>${esc(f.name)}
          <span class="pct">${f.status === "queued" ? "queued" : Math.round(p * 100) + "%"}</span>
          <span class="under" style="width:${p * 100}%;background:${s.color}"></span></button>`;
      }).join("");
    $("liveDot").style.display = fs.some((f) => f.status === "running") ? "" : "none";
    paintIcons($("factorTabs"));
  }
  $("factorTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-f]"); if (!b) return;
    state.selected = b.dataset.f; state.builtFor = null; render();
  });

  /* ===================================================================
     F) RENDER: overview
     =================================================================== */
  function renderOverview() {
    const fs = state.snap.factors;
    const bar = (v, f, on) => `<div><div class="pb"><i style="width:${v * 100}%;background:${v >= 1 ? "var(--ok)" : f.status === "failed" && on ? "repeating-linear-gradient(135deg,#A6141C 0 5px,#C2353C 5px 10px)" : "var(--red)"}"></i></div><div class="muted mono" style="font-size:10.5px;margin-top:4px">${Math.round(v * 100)}%</div></div>`;
    $("panel").innerHTML = `<div class="ov"><div class="ov-row ov-head"><span>FACTOR</span><span>PRE</span><span>EXTRACT</span><span>POST</span><span>STATUS</span><span>TIME</span><span></span></div><div class="ov-body">` +
      fs.map((f) => {
        const s = STATUS[f.status], c = f.counts, rows = f.dataset.rows || 1, ph = PHASE_INDEX[f.phase];
        return `<div class="ov-row" data-f="${esc(f.id)}"><div><b>${esc(f.name)}</b><div class="muted" style="font-size:11.5px">${f.tests.length > 1 ? esc(f.tests.join(" · ")) : esc(f.dataset.name)}</div></div>
          ${bar(f.status === "completed" ? 1 : (c.sent || 0) / rows, f, ph === 0)}${bar(f.status === "completed" ? 1 : (c.tracesPulled || 0) / rows, f, ph === 1)}${bar(f.status === "completed" ? 1 : (c.testsScored || 0) / f.tests.length, f, ph === 2)}
          <span class="pill" style="background:${s.tint};color:${s.color}">${s.icon}${s.label}</span><span class="mono muted">${elapsed(f)}</span><span class="muted">${ic("chevron")}</span></div>`;
      }).join("") + `</div></div>`;
    $("panel").querySelectorAll(".ov-row[data-f]").forEach((r) => r.onclick = () => { state.selected = r.dataset.f; state.builtFor = null; render(); });
    paintIcons($("panel"));
  }

  /* ===================================================================
     G) RENDER: ek factor ka system map
     =================================================================== */
  function buildMap(f) {
    const L = nodeLabels(f);
    $("panel").innerHTML = `<div class="status" id="status"></div>
      <div class="map-wrap"><div class="map" id="map"><svg id="edges"><g id="lines"></g><g id="packets"></g></svg>${ZONES.map((z, zi) => `
        <div class="zone ${z.id}" id="zone${zi}"><div class="zone-head"><span>${z.name}</span><span class="zs" id="zs${zi}"></span></div>
          ${z.nodes.map((k) => `<div class="node" id="n_${k}" style="grid-column:${z.grid[k][0]};grid-row:${z.grid[k][1]}" title="${esc(L[k][1])} · ${esc(L[k][2])}">
            <div class="hd">${ic(L[k][0])}<span class="tt">${esc(L[k][1])}</span></div><span class="sb">${esc(L[k][2])}</span><span class="mt" id="m_${k}"></span></div>`).join("")}
        </div>`).join("")}</div></div><div id="msg"></div>`;
    paintIcons($("panel"));
    state.builtFor = f.id;
    layoutEdges();
  }

  // Lines ko DOM se naap ke banao, taaki map kisi bhi chaudai mein sahi rahe
  let edgeGeom = [];
  function layoutEdges() {
    const map = $("map"); if (!map) return;
    const m = map.getBoundingClientRect();
    const box = (k) => { const r = $("n_" + k).getBoundingClientRect(); return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height }; };
    edgeGeom = EDGES.map((e) => {
      const a = box(e[0]), b = box(e[1]);
      return e[2] === "h" ? [a.x + a.w, a.y + a.h / 2, b.x, b.y + b.h / 2] : [a.x + a.w / 2, a.y + a.h, b.x + b.w / 2, b.y];
    });
    $("lines").innerHTML = edgeGeom.map((p, i) => `<line id="e${i}" x1="${p[0]}" y1="${p[1]}" x2="${p[2]}" y2="${p[3]}" stroke="#E3DBD0" stroke-width="3" stroke-linecap="round"/>`).join("");
    updateMap();
  }
  new ResizeObserver(() => { if ($("map")) layoutEdges(); }).observe(document.body);

  let nodeStates = {};
  function updateMap() {
    const f = state.snap.factors.find((x) => x.id === state.selected); if (!f || !$("map")) return;
    const s = STATUS[f.status], p = factorPct(f);
    const phaseName = { pre: "Pre phase", extract: "Extract phase", post: "Post phase", done: "finished" }[f.phase];
    const head = f.status === "running" ? phaseName : f.status === "completed" ? "finished" : f.status === "failed" ? `stopped in ${cap(f.error?.phase || "run")}` : "queued";
    $("status").innerHTML = `<span class="dot ${f.status === "running" ? "live" : ""}" style="background:${s.color}"></span>
      <span class="title">${esc(f.name)} · ${esc(head)}</span><span class="sub muted">${f.tests.length > 1 ? f.tests.length + " tests: " + esc(f.tests.join(", ")) : esc(f.dataset.name)}</span>
      <div class="bar"><i style="width:${p * 100}%;background:${s.color}"></i></div><span class="pct" style="color:${s.color}">${f.status === "queued" ? "—" : Math.round(p * 100) + "%"}</span><span class="mono muted">${elapsed(f)}</span>`;

    nodeStates = {};
    Object.keys(ZONE_OF).forEach((k) => { nodeStates[k] = nodeState(f, k); $("n_" + k).className = "node " + nodeStates[k]; $("m_" + k).textContent = nodeMetric(f, k); });
    ZONES.forEach((z, i) => {
      const zs = zoneState(z.nodes.map((k) => nodeStates[k]));
      $("zs" + i).textContent = zs[0]; $("zs" + i).style.color = zs[1];
      $("zone" + i).style.background = zs[2]; $("zone" + i).style.borderColor = zs[3];
    });
    EDGES.forEach((e, i) => {
      const a = nodeStates[e[0]], b = nodeStates[e[1]], el = $("e" + i); if (!el) return;
      el.setAttribute("stroke", a === "fail" || b === "fail" ? "#E8A0A4" : a === "done" && b === "done" ? "#BCD9A8" : (a === "run" || b === "run") && b !== "wait" ? "#F0B3B6" : "#E3DBD0");
    });

    // Neeche ka sandesh
    const scored = (f.counts.testsScored || 0) > 0 || (f.counts.resultFiles || 0) > 0;
    let html = "";
    if (f.status === "failed") html = `<div class="msg" style="background:var(--red-tint);border:1px solid #F0C9CB"><div><div class="t" style="color:var(--red-dark)">${ic("alert")}${esc(f.name)} stopped in ${esc(cap(f.error?.phase || ""))}</div><div class="d">${esc(f.error?.message || "")} Other factors keep running, and this one's answers are saved.</div></div>
      <div style="display:flex;gap:8px"><button class="btn" data-act="log">${ic("log")}View error log</button><button class="btn-primary" data-act="resume">${ic("play2")}Resume this factor</button></div></div>`;
    else if (f.status === "queued") html = `<div class="msg" style="background:#F7F1E8;border:1px solid var(--line)"><div><div class="t">${ic("clock")}Waiting for ${esc(f.waitingFor || "another factor")}</div><div class="d">It starts right after.</div></div></div>`;
    else if (f.status === "completed") html = `<div class="msg" style="background:var(--ok-tint);border:1px solid #CFE3C1"><div><div class="t" style="color:var(--ok)">${ic("check")}${esc(f.name)} finished</div><div class="d">See how its answers compare to what was expected.</div></div><button class="btn-primary" data-act="analytics">${ic("cube")}Open in Analytics</button></div>`;
    else if (scored) html = `<div class="msg" style="background:#F7F1E8;border:1px solid var(--line)"><div><div class="t">${ic("cube")}Some answers are already scored</div><div class="d">You can look at the scored part while the rest runs.</div></div><button class="btn-primary" data-act="analytics">${ic("cube")}Open in Analytics</button></div>`;
    $("msg").innerHTML = html;
    paintIcons($("msg"));
    $("msg").querySelectorAll("[data-act]").forEach((b) => b.onclick = () => {
      // Page ko batao; asli app mein yahan apna handler lagao
      document.dispatchEvent(new CustomEvent("testingkit:action", { detail: { action: b.dataset.act, factorId: f.id, runId: state.snap.runId } }));
      if (b.dataset.act === "analytics") { state.selected = f.id; an.lens = null; switchTab("analytics"); }
    });
    paintIcons($("status"));
  }

  // Chalte bindu sirf active lines pe
  function animatePackets() {
    const g = $("packets");
    if (g && state.tab === "progress" && state.selected !== "overview") {
      const f = state.snap?.factors.find((x) => x.id === state.selected);
      let h = "";
      if (f && f.status === "running") {
        const t = performance.now() / 1000;
        EDGES.forEach((e, i) => {
          const a = nodeStates[e[0]], b = nodeStates[e[1]], p = edgeGeom[i];
          if (!p || !((a === "run" || b === "run") && b !== "wait" && !(a === "done" && b === "done"))) return;
          for (let j = 0; j < 3; j++) {
            let fr = (t * 0.9 + j / 3) % 1; if (e[3] && j % 2) fr = 1 - fr;
            h += `<circle cx="${p[0] + (p[2] - p[0]) * fr}" cy="${p[1] + (p[3] - p[1]) * fr}" r="4" fill="#D71E28" opacity="${(Math.sin(fr * Math.PI) * 0.85 + 0.15).toFixed(2)}"/>`;
          }
        });
      }
      g.innerHTML = h;
    }
    requestAnimationFrame(animatePackets);
  }


  /* ===================================================================
     K) ANALYTICS — 3D meaning space, ek factor ke liye
     -------------------------------------------------------------------
     Asli app mein ye data backend se aayega:
       GET /api/testing-kit/runs/{runId}/analytics?factor={id}&lens={lens}
       → { points:[{xyz:[x,y,z], kind, color, text}], lines:[{from:[..],to:[..],kind}],
           labels:[{xyz, text, sub}], kpis:[[value,label,tone]], chart:{title,bars:[[label,value,tone]],limitIndex},
           see:"...", means:"...", examples:[[title, text, score]] }
     xyz backend pe UMAP/PCA se ek baar banta hai. Score hamesha poore
     vector se nikalta hai, 3D ki doori se nahi.
     =================================================================== */
  const LENSES = { change_management: ["drift", "stability", "safety"], hallucination: ["grounding"], replication: ["consistency"], explainability: ["drift"], parameter_calibration: ["drift"] };
  const LENS_NAME = { drift: ["Relevancy", "scale"], stability: ["Sensitivity", "radar"], safety: ["Toxicity", "alert"], grounding: ["Grounding", "cloud"], consistency: ["Consistency", "files"] };
  const TONE = { ok: "#4E8A2E", warn: "#E8B425", bad: "#D71E28", ink: "#3B3331" };
  const an = { factorId: null, lens: null, scene: null, ry: 0.6, rx: -0.3, drag: null, hover: -1, proj: [] };
  const canAnalyze = (f) => f.status === "completed" || (f.counts.testsScored || 0) > 0;

  async function fetchAnalytics(runId, factorId, lens) {
    if (!USE_MOCK) {
      const r = await fetch(`/api/testing-kit/runs/${encodeURIComponent(runId)}/analytics?factor=${encodeURIComponent(factorId)}&lens=${lens}`);
      if (!r.ok) throw new Error("Could not load analytics");
      return r.json();
    }
    return mockAnalytics(lens);
  }

  function renderAnalytics() {
    const fs = state.snap.factors;
    let f = fs.find((x) => x.id === state.selected);
    if (!f || !canAnalyze(f)) f = fs.find(canAnalyze) || f || fs[0];
    an.factorId = f.id;
    const lenses = LENSES[f.id] || ["drift"];
    if (!lenses.includes(an.lens)) an.lens = lenses[0];
    const opts = fs.map((x) => `<option value="${esc(x.id)}" ${x.id === f.id ? "selected" : ""} ${canAnalyze(x) ? "" : "disabled"}>${esc(x.name)}${canAnalyze(x) ? "" : " · no scores yet"}</option>`).join("");
    const P = $("panel");
    if (!canAnalyze(f)) {
      P.innerHTML = `<div><select class="an-select" id="anSel">${opts}</select></div><div class="an-empty">${ic("cube")}<b style="font-family:var(--serif);font-size:19px">No factor has scores yet</b><span class="muted">Analytics opens as soon as the first answers are scored.</span></div>`;
      paintIcons(P); $("anSel").onchange = (e) => { state.selected = e.target.value; renderAnalytics(); }; an.scene = null; return;
    }
    P.innerHTML = `<div class="an-grid">
      <div class="an-stage" id="anStage"><canvas id="anCanvas"></canvas><div class="an-tip" id="anTip"></div>
        <div class="an-top"><select class="an-select" id="anSel" data-testid="analytics-factor">${opts}</select>
          ${lenses.length > 1 ? `<div class="an-lenses">${lenses.map((l) => `<button class="${l === an.lens ? "active" : ""}" data-l="${l}">${ic(LENS_NAME[l][1])}${LENS_NAME[l][0]}</button>`).join("")}</div>` : `<span class="muted" style="font-size:12px;display:inline-flex;gap:5px;align-items:center">${ic(LENS_NAME[an.lens][1])}${LENS_NAME[an.lens][0]}</span>`}
          <span class="an-partial" id="anPartial" style="${f.status === "completed" ? "display:none" : ""}">Partial · scoring still running</span></div>
        <div class="an-legend" id="anLegend"></div><span class="an-hint">Drag to turn · hover a dot</span></div>
      <div class="an-side" id="anSide"><div class="muted">Loading…</div></div></div>`;
    paintIcons(P);
    $("anSel").onchange = (e) => { state.selected = e.target.value; renderAnalytics(); };
    P.querySelectorAll(".an-lenses [data-l]").forEach((b) => b.onclick = () => { an.lens = b.dataset.l; renderAnalytics(); });
    const cv = $("anCanvas");
    requestAnimationFrame(() => { const r = cv.getBoundingClientRect(); cv.width = r.width * 2; cv.height = r.height * 2; });
    cv.onmousedown = (e) => { an.drag = { x: e.clientX, y: e.clientY, ry: an.ry, rx: an.rx }; };
    fetchAnalytics(state.snap.runId, f.id, an.lens).then((d) => { an.scene = d; an.ry = 0.6; an.rx = -0.3; renderSide(d); }).catch((err) => { $("anSide").innerHTML = `<div style="color:var(--red-dark)">${esc(err.message)}</div>`; });
  }

  function renderSide(d) {
    $("anLegend").innerHTML = d.legend.map((l) => `<span><b style="background:${l[0]}"></b>${esc(l[1])}</span>`).join("");
    const max = Math.max(...d.chart.bars.map((b) => b[1])), W = 340, H = 110, bw = (W - 20) / d.chart.bars.length;
    const svg = `<svg viewBox="0 0 ${W} ${H + 22}" width="100%">${d.chart.bars.map((b, i) => `<rect x="${10 + i * bw + 4}" y="${H - b[1] / max * 90}" width="${bw - 8}" height="${b[1] / max * 90}" rx="3" fill="${TONE[b[2]]}"/><text x="${10 + i * bw + bw / 2}" y="${H - b[1] / max * 90 - 4}" font-size="10" text-anchor="middle" fill="#3B3331">${b[1]}</text><text x="${10 + i * bw + bw / 2}" y="${H + 14}" font-size="9.5" text-anchor="middle" fill="#7D736A">${esc(b[0])}</text>`).join("")}${d.chart.limitIndex != null ? `<line x1="${10 + d.chart.limitIndex * bw}" y1="10" x2="${10 + d.chart.limitIndex * bw}" y2="${H}" stroke="#A6141C" stroke-dasharray="3 3"/><text x="${12 + d.chart.limitIndex * bw}" y="16" font-size="9.5" fill="#A6141C">limit</text>` : ""}</svg>`;
    $("anSide").innerHTML = `<div class="an-kpis">${d.kpis.map((k) => `<div class="an-kpi" style="border-left-color:${TONE[k[2]]}"><b style="color:${TONE[k[2]]}">${esc(k[0])}</b><span>${esc(k[1])}</span></div>`).join("")}</div>
      <div><div class="an-lbl">${esc(d.chart.title.toUpperCase())}</div>${svg}</div>
      <div class="an-exp"><b class="h">WHAT YOU'RE SEEING</b>${esc(d.see)}</div>
      <div class="an-exp" style="background:#FFF7DD"><b class="h">WHAT IT MEANS</b>${esc(d.means)}</div>
      <div><div class="an-lbl">EXAMPLES</div>${d.examples.map((e) => `<div class="an-ex"><b>${esc(e[0])}</b><div class="muted">${esc(e[1])}</div>${e[2] ? `<div class="mono" style="font-size:11px;color:var(--red-dark);margin-top:2px">similarity ${esc(e[2])}</div>` : ""}</div>`).join("")}</div>`;
  }

  // 3D: simple perspective projection, dheema rotation
  function project(cv, v) {
    const cy = Math.cos(an.ry), sy = Math.sin(an.ry), cx = Math.cos(an.rx), sx = Math.sin(an.rx);
    let x = v[0] * cy + v[2] * sy, z = -v[0] * sy + v[2] * cy, y = v[1] * cx - z * sx; z = v[1] * sx + z * cx;
    const f = 3.8 / (3.8 + z), s = Math.min(cv.width, cv.height) * 0.34;
    return [cv.width / 2 + x * s * f, cv.height * 0.56 - y * s * f, z, f];
  }
  function drawPill(ctx, t, x, y, col, size) {
    ctx.font = `700 ${size}px Segoe UI, system-ui, sans-serif`; const w = ctx.measureText(t).width;
    ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.beginPath(); ctx.roundRect(x - w / 2 - 10, y - size - 5, w + 20, size + 13, 9); ctx.fill();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(t, x, y); ctx.textAlign = "left";
  }
  function drawScene() {
    const cv = $("anCanvas"), d = an.scene;
    if (state.tab !== "analytics" || !cv || !d || !cv.width) return;
    const ctx = cv.getContext("2d"); ctx.clearRect(0, 0, cv.width, cv.height);
    (d.blobs || []).forEach((b) => { const p = project(cv, b.xyz); ctx.fillStyle = b.dashed ? "rgba(185,174,159,.15)" : "rgba(232,180,37,.07)"; ctx.beginPath(); ctx.arc(p[0], p[1], b.r * Math.min(cv.width, cv.height) * 0.34 * p[3], 0, 7); ctx.fill();
      if (b.dashed) { ctx.setLineDash([6, 6]); ctx.strokeStyle = "rgba(150,140,128,.4)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]); } });
    d.lines.forEach((l) => { const a = project(cv, l.from), b = project(cv, l.to); ctx.globalAlpha = l.alpha ?? 1; ctx.strokeStyle = l.color; ctx.lineWidth = (l.width || 1) * 2; if (l.dashed) ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; });
    an.proj = d.points.map((o, i) => ({ i, q: project(cv, o.xyz) })).sort((a, b) => b.q[2] - a.q[2]);
    an.proj.forEach((o) => { const p = d.points[o.i], h = o.i === an.hover, r = p.r * 2 * o.q[3] * (h ? 1.7 : 1);
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(o.q[0], o.q[1], r, 0, 7); ctx.fill();
      if (p.stroke) { ctx.strokeStyle = p.stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
      if (p.ring || h) { ctx.strokeStyle = "#fff"; ctx.lineWidth = h ? 3 : 1.5; ctx.stroke(); } });
    d.labels.forEach((l) => { const p = project(cv, l.xyz);
      if (l.small) { ctx.font = "19px Segoe UI, system-ui, sans-serif"; ctx.fillStyle = l.red ? "#A6141C" : "#5A504A"; ctx.fillText(l.text, p[0] + 10, p[1]); return; }
      drawPill(ctx, l.text, p[0], p[1], l.red ? "#A6141C" : "#3B3331", l.red ? 20 : 24);
      if (l.sub) { ctx.font = "18px Segoe UI, system-ui, sans-serif"; ctx.fillStyle = "#7D736A"; ctx.textAlign = "center"; ctx.fillText(l.sub, p[0], p[1] + 24); ctx.textAlign = "left"; } });
  }
  window.addEventListener("mouseup", () => { an.drag = null; });
  window.addEventListener("mousemove", (e) => {
    const cv = $("anCanvas"); if (state.tab !== "analytics" || !cv || !an.scene) return;
    if (an.drag) { an.ry = an.drag.ry + (e.clientX - an.drag.x) * 0.006; an.rx = Math.max(-1.2, Math.min(0.8, an.drag.rx + (e.clientY - an.drag.y) * 0.006)); $("anTip").style.display = "none"; return; }
    const b = cv.getBoundingClientRect(), tip = $("anTip");
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) { an.hover = -1; tip.style.display = "none"; return; }
    const k = cv.width / b.width, mx = (e.clientX - b.left) * k, my = (e.clientY - b.top) * k;
    let best = -1, bd = 26; an.proj.forEach((o) => { const dd = Math.hypot(o.q[0] - mx, o.q[1] - my); if (dd < bd) { bd = dd; best = o.i; } });
    an.hover = best;
    if (best >= 0) { tip.innerHTML = an.scene.points[best].text; tip.style.display = "block"; tip.style.left = Math.min(e.clientX - b.left + 14, b.width - 290) + "px"; tip.style.top = (e.clientY - b.top + 14) + "px"; }
    else tip.style.display = "none";
  });
  function animateScene() { if (state.tab === "analytics" && an.scene && !an.drag) an.ry += 0.0012; drawScene(); requestAnimationFrame(animateScene); }

  /* --- Mock analytics: sirf demo. Asli data backend se, upar wale shape mein --- */
  function mockAnalytics(lens) {
    let sd = 11; const rnd = () => { sd = (sd * 9301 + 49297) % 233280; return sd / 233280; };
    const g = () => { let u = 0; for (let i = 0; i < 4; i++) u += rnd(); return (u - 2) / 1.15; };
    const nz = (v) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
    const OK = TONE.ok, WN = TONE.warn, BD = TONE.bad;
    const QS = ["How to submit IRA Termination via Check?", "How do I submit a Distribution for QCD?", "How to submit Contribution via ACH?", "How do I initiate a wire?", "How can I edit a Periodic Distribution?", "What is the ACH cutoff?"];
    const d = { points: [], lines: [], labels: [], blobs: [] };
    if (lens === "drift") {
      const T = [["IRA termination", "Retirement", [-.95, .35, -.15]], ["Distributions · QCD", "Retirement", [-.25, -.7, .6]], ["ACH contributions", "Money Movement", [.8, .45, .4]], ["Wire transfers", "Money Movement", [.6, -.35, -.75]]];
      const bad = { 0: [5, 3], 1: [4, 3], 2: [1, 0], 3: [1, 0] };
      T.forEach((t, k) => { d.blobs.push({ xyz: t[2], r: .45 }); d.labels.push({ xyz: t[2].map((v, i) => i === 1 ? v + .32 : v), text: t[0], sub: t[1] });
        for (let i = 0; i < 25; i++) { const e = t[2].map((v) => v + g() * .15); const off = i < bad[k][0]; let a, s;
          if (off) { a = T[bad[k][1]][2].map((v) => v + g() * .14); s = .4 + rnd() * .25; } else { s = .82 + rnd() * .16; const dd = nz([g(), g(), g()]); a = e.map((v, m) => v + dd[m] * (1 - s) * 1.3); }
          const q = QS[(k * 7 + i) % 6];
          d.points.push({ xyz: e, color: "#E8B425", stroke: "#9C7410", r: 4.5, text: `<b>Expected</b> · ${t[0]}<br>${q}` });
          d.points.push({ xyz: a, color: off ? BD : OK, r: off ? 6 : 4.5, text: `<b>Supervisor · ${off ? "landed in " + T[bad[k][1]][0] : "on topic"}</b><br>${q}<br>similarity ${s.toFixed(2)}` });
          d.lines.push({ from: e, to: a, color: off ? BD : OK, width: off ? 2.4 : 1.4, alpha: off ? .8 : .4 }); } });
      Object.assign(d, { legend: [["#E8B425", "Expected"], [OK, "On topic"], [BD, "Off topic"]], kpis: [["89%", "on topic", "ok"], ["11", "off topic", "bad"], ["0.84", "avg similarity", "ink"]],
        chart: { title: "Similarity of each answer to its expected answer", bars: [["0.4", 2, "bad"], ["0.5", 4, "bad"], ["0.7", 5, "warn"], ["0.8", 9, "ok"], ["0.85", 38, "ok"], ["0.9+", 42, "ok"]], limitIndex: 3 },
        see: "Each gold dot is an expected answer, placed by meaning. The coloured dot joined to it is what the supervisor said. Short lines stay in the same topic. Long red lines jump to another topic.",
        means: "9 of the 11 off-topic answers left a Retirement topic for Money Movement. That points to one cause, likely search pulling the wrong articles.",
        examples: [["How to submit IRA Termination via Check?", "Talked about sending a wire from Money Movement.", "0.48"], ["How can I edit a Periodic Distribution?", "Described a one-time ACH contribution.", "0.55"]] });
    }
    if (lens === "stability" || lens === "consistency") {
      const rep = lens === "consistency", N = rep ? 14 : 12, K = rep ? 3 : 6;
      for (let i = 0; i < N; i++) { const o = nz([g(), g() * .8, g()]).map((v) => v * (.75 + rnd() * .45)); const x = rnd(), cs = x < .68 ? .88 + rnd() * .1 : x < .86 ? .76 + rnd() * .09 : .5 + rnd() * .24, col = cs >= .85 ? OK : cs >= .75 ? WN : BD, q = QS[i % 6];
        d.points.push({ xyz: o, color: "#3B3331", r: 6, text: `<b>${rep ? "First answer" : "Original question"}</b><br>${q}` });
        if (i % 4 === 0) d.labels.push({ xyz: o.map((v, m) => m === 1 ? v + .18 : v), text: "“" + q.slice(0, 28) + "…”", small: 1 });
        const vs = [];
        for (let j = 0; j < K; j++) { const dd = nz([g(), g(), g()]), rr = (1 - cs) * 1.6 * (.7 + rnd() * .6), v = o.map((a, m) => a + dd[m] * rr); vs.push(v);
          d.points.push({ xyz: v, color: col, r: 3.6, text: `<b>${rep ? "Repeat " + (j + 2) : ["Typo", "Paraphrase", "Word order", "Synonym", "Extra words", "Short form"][j]}</b><br>${q}<br>similarity ${(cs + (rnd() - .5) * .04).toFixed(2)}` });
          d.lines.push({ from: o, to: v, color: col, width: 1.3, alpha: .7 }); }
        if (rep) d.lines.push({ from: vs[0], to: vs[1], color: col, width: 1, alpha: .4 }, { from: vs[1], to: vs[2], color: col, width: 1, alpha: .4 }); }
      Object.assign(d, rep ? { legend: [["#3B3331", "First answer"], [OK, "Consistent"], [WN, "Small changes"], [BD, "Inconsistent"]], kpis: [["86%", "consistent", "ok"], ["10%", "small changes", "warn"], ["2", "inconsistent", "bad"]],
        chart: { title: "Spread between repeat answers", bars: [["<.05", 96, "ok"], ["–.1", 12, "ok"], ["–.2", 4, "warn"], [".2+", 2, "bad"]] },
        see: "The same question was asked three times. The dark dot is the first answer, the coloured dots are the repeats. A tight knot means the same answer every time.",
        means: "Only 2 questions gave different steps on repeat. Both are about QCD eligibility, where the source is ambiguous.",
        examples: [["Who can request a QCD?", "Repeat 2 added an age rule the others didn't.", "0.63"]] }
      : { legend: [["#3B3331", "Original"], [OK, "Stable"], [WN, "Drifts"], [BD, "Unstable"]], kpis: [["79%", "stable", "ok"], ["16%", "drift", "warn"], ["5%", "unstable", "bad"]],
        chart: { title: "Average drift by kind of rewording", bars: [["Typo", 31, "bad"], ["Short", 12, "warn"], ["Extra", 9, "warn"], ["Order", 8, "ok"], ["Synon.", 6, "ok"], ["Para.", 5, "ok"]] },
        see: "Each dark star is the answer to an original question. Around it are the answers to its reworded versions. Short spokes mean rewording didn't change the meaning.",
        means: "Typos cause most drift. Paraphrases are handled well, so users who misspell get worse answers.",
        examples: [["“How do I submt a QCD”", "Answer switched to general distributions.", "0.61"], ["“ACH cutof?”", "Gave the wire cutoff instead.", "0.58"]] });
    }
    if (lens === "safety") {
      const n = nz([.55, .6, -.58]), T = 1.05;
      for (let i = 0; i < 220; i++) { let p = [g() * .6, g() * .6, g() * .6]; if (i < 2) p = n.map((v) => v * (T + .2 + rnd() * .2)).map((v) => v + g() * .1);
        const s = p[0] * n[0] + p[1] * n[1] + p[2] * n[2], c = s > T ? BD : s > T - .3 ? WN : OK;
        d.points.push({ xyz: p, color: c, r: 3.6, text: `<b>${s > T ? "Flagged" : s > T - .3 ? "Close to the line" : "Safe"}</b><br>${QS[i % 6]}<br>toxicity ${(Math.max(0, s) / 1.6).toFixed(2)}` }); }
      d.lines.push({ from: [0, 0, 0], to: n.map((v) => v * 1.6), color: BD, width: 3.5 });
      d.labels.push({ xyz: n.map((v) => v * 1.75), text: "toward unsafe language", red: 1 });
      const u = nz([n[1], -n[0], 0]), v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]], c0 = n.map((x) => x * T);
      for (let k = -4; k <= 4; k++) { const t = k / 4 * .6;
        d.lines.push({ from: c0.map((x, m) => x + u[m] * t - v[m] * .6), to: c0.map((x, m) => x + u[m] * t + v[m] * .6), color: "rgba(215,30,40,.25)", width: 1 },
                     { from: c0.map((x, m) => x + v[m] * t - u[m] * .6), to: c0.map((x, m) => x + v[m] * t + u[m] * .6), color: "rgba(215,30,40,.25)", width: 1 }); }
      d.labels.push({ xyz: c0.map((x, m) => x + u[m] * .65), text: "limit", red: 1, small: 1 /* grid ke kinare pe */ });
      Object.assign(d, { legend: [[OK, "Safe"], [WN, "Close"], [BD, "Flagged"]], kpis: [["2", "flagged", "bad"], ["9", "close to line", "warn"], ["209", "safe", "ok"]],
        chart: { title: "Toxicity score of each answer", bars: [["0–.2", 168, "ok"], ["–.4", 41, "ok"], ["–.6", 9, "warn"], ["–.8", 0, "warn"], [".8+", 2, "bad"]], limitIndex: 4 },
        see: "The red arrow points toward unsafe language. The red grid is the limit. Each dot is an answer, and only distance along the arrow matters.",
        means: "Only 2 answers crossed the line, both mildly blunt replies about fees. Safe to proceed with a quick review.",
        examples: [["Why was I charged a wire fee?", "“That's just how it works.”", "0.71"]] });
    }
    if (lens === "grounding") {
      const C = [["IRA termination guide", [-.8, .3, -.3]], ["Wire policy", [.7, .5, .4]], ["ACH handbook", [.1, -.7, .6]], ["QCD procedure", [.5, -.3, -.8]]], src = [];
      C.forEach((c) => { d.blobs.push({ xyz: c[1], r: .38, dashed: 1 }); d.labels.push({ xyz: c[1].map((v, i) => i === 1 ? v + .35 : v), text: c[0], sub: "source documents" });
        for (let i = 0; i < 45; i++) { const p = c[1].map((v) => v + g() * .18); src.push(p); d.points.push({ xyz: p, color: "rgba(150,140,128,.55)", r: 2.5, text: `Source chunk · ${c[0]}` }); } });
      for (let i = 0; i < 90; i++) { const z = rnd(); let p, c, lab;
        if (z < .84) { p = C[i % 4][1].map((v) => v + g() * .15); c = OK; lab = "supported by a source"; }
        else if (z < .94) { p = [g() * .9, g() * .9, g() * .9]; c = WN; lab = "not found in any source"; }
        else { const dd = nz([g(), g(), g()]); p = C[1][1].map((v, k) => v + dd[k] * .55); c = BD; lab = "contradicts the wire policy"; }
        let best = src[0], bd = 9; src.forEach((s) => { const dd = Math.hypot(s[0] - p[0], s[1] - p[1], s[2] - p[2]); if (dd < bd) { bd = dd; best = s; } });
        d.points.push({ xyz: p, color: c, r: 5, ring: 1, text: `<b>Claim · ${lab}</b><br>${["“Wires after 2 PM settle next day”", "“Use the retirement workflow”", "“A $25 fee is waived”", "“Attach the signed form”"][i % 4]}` });
        if (c !== OK) d.lines.push({ from: p, to: best, color: c, width: 1.3, alpha: .7, dashed: 1 }); }
      Object.assign(d, { legend: [["#B9AE9F", "Source"], [OK, "Supported"], [WN, "Not in sources"], [BD, "Contradicts"]], kpis: [["91%", "grounded", "ok"], ["6%", "not in sources", "warn"], ["3%", "contradicts", "bad"]],
        chart: { title: "Hallucinated claims by topic", bars: [["Wires", 11, "bad"], ["ACH", 3, "warn"], ["QCD", 2, "warn"], ["IRA", 1, "ok"]] },
        see: "Grey clouds are the source documents the supervisor retrieved. Each coloured dot is one claim from an answer. Inside a cloud means a source backs it.",
        means: "The red claims all sit around the Wire policy cloud: invented cutoff times and fee waivers. Fix the wire answers first.",
        examples: [["Wire termination answer", "“Wires after 2 PM settle the next day” · not in policy", ""], ["Fee question", "“$25 fee is waived for Premier” · contradicts policy", ""]] });
    }
    return Promise.resolve(d);
  }

  /* ===================================================================
     H) MAIN RENDER
     =================================================================== */
  function render() {
    if (!state.snap) return;
    renderFactorTabs();
    if (state.tab !== "progress") {                // Analytics: sirf "partial" label taaza karo, 3D ko dobara mat banao
      const f = state.snap.factors.find((x) => x.id === an.factorId), el = $("anPartial");
      if (f && el) el.style.display = f.status === "completed" ? "none" : "";
      return;
    }
    if (state.selected === "overview") { state.builtFor = null; renderOverview(); return; }
    if (!state.snap.factors.some((f) => f.id === state.selected)) state.selected = state.snap.factors[0].id;
    if (state.builtFor !== state.selected) buildMap(state.snap.factors.find((f) => f.id === state.selected));
    else updateMap();
  }

  function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x.dataset.tab === tab));
    $("factorTabs").style.display = tab === "progress" ? "" : "none";
    if (tab === "progress") { state.builtFor = null; an.scene = null; render(); } else renderAnalytics();
    document.dispatchEvent(new CustomEvent("testingkit:tab", { detail: { tab, factorId: state.selected } }));
  }
  document.querySelectorAll(".tab").forEach((b) => b.onclick = () => {
    state.tab = b.dataset.tab;
    document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === b));
    $("factorTabs").style.display = state.tab === "progress" ? "" : "none";
    if (state.tab === "progress") { state.builtFor = null; an.scene = null; render(); }
    else renderAnalytics();
    document.dispatchEvent(new CustomEvent("testingkit:tab", { detail: { tab: state.tab, factorId: state.selected } }));
  });

  /* ===================================================================
     I) MOCK STREAM — sirf demo ke liye
     =================================================================== */
  function mockStream(onSnapshot) {
    const now = Date.now(), min = 60000;
    const mk = (id, name, tests, ds, rows, extra) => Object.assign({ id, name, tests, dataset: { name: ds, rows }, environment: "DEV", status: "running", phase: "pre", startedAt: now, endedAt: null,
      counts: { sent: 0, answered: 0, preFiles: 0, searchCalls: 0, tracesStored: 0, tracesPulled: 0, spans: null, testsScored: 0, resultFiles: 0, judgeCalls: null, manifestWritten: false } }, extra);
    const F = [
      mk("change_management", "Change Management", ["Toxicity", "Performance", "Sensitivity"], "CM_Golden.xlsx", 462, { phase: "post", startedAt: now - 22 * min }),
      mk("hallucination", "Hallucination", ["Hallucination"], "hallucinated_dataset", 120, { phase: "extract", startedAt: now - 8 * min }),
      mk("replication", "Replication", ["Replication"], "sample × 3 repeats", 150, { status: "completed", phase: "done", startedAt: now - 15 * min, endedAt: now - 1 * min }),
      mk("explainability", "Explainability", ["Explainability"], "CM_Golden.xlsx", 462, { status: "failed", phase: "extract", startedAt: now - 19 * min, endedAt: now - 2 * min, error: { phase: "extract", message: "Overwatch stopped responding after 210 of 462 traces." } }),
      mk("parameter_calibration", "Parameter calibration", ["Calibration"], "462 × 4 settings", 1848, { status: "queued", startedAt: null, waitingFor: "Hallucination" })
    ];
    const fill = (f, upTo) => { const c = f.counts, r = f.dataset.rows, nt = f.tests.length;
      if (upTo >= 0) Object.assign(c, { sent: r, answered: r, preFiles: nt, searchCalls: r * 31, tracesStored: r });
      if (upTo >= 1) Object.assign(c, { tracesPulled: r, spans: r * 33 });
      if (upTo >= 2) Object.assign(c, { testsScored: nt, resultFiles: nt, judgeCalls: r * 7, manifestWritten: true }); };
    fill(F[0], 1); F[0].counts.testsScored = 1; F[0].counts.resultFiles = 1; F[0].counts.judgeCalls = 1600;
    fill(F[1], 0); F[1].counts.tracesPulled = 30; F[1].counts.tracesStored = 120;
    fill(F[2], 2);
    fill(F[3], 0); F[3].counts.tracesPulled = 210;
    const sub = {};                                       // post phase ke andar test-wise progress
    const t = setInterval(() => {
      F.forEach((f) => {
        if (f.status === "queued") { const dep = F.find((x) => x.name === f.waitingFor); if (dep.status === "completed") { f.status = "running"; f.startedAt = Date.now(); } return; }
        if (f.status !== "running") return;
        const c = f.counts, r = f.dataset.rows, nt = f.tests.length, step = Math.ceil(r / 35);
        if (f.phase === "pre") { c.sent = Math.min(r, c.sent + step); c.answered = c.sent; c.tracesStored = c.sent; c.searchCalls += step * 31; c.preFiles = Math.floor(c.sent / r * nt); if (c.sent >= r) { c.preFiles = nt; f.phase = "extract"; } }
        else if (f.phase === "extract") { c.tracesPulled = Math.min(r, c.tracesPulled + step); if (c.tracesPulled >= r) { c.spans = r * 33; f.phase = "post"; c.judgeCalls = c.judgeCalls || 0; } }
        else if (f.phase === "post") { sub[f.id] = (sub[f.id] || 0) + 0.08; c.judgeCalls += step * 2; if (sub[f.id] >= 1) { sub[f.id] = 0; c.testsScored++; c.resultFiles = c.testsScored; }
          if (c.testsScored >= nt) { c.manifestWritten = true; f.phase = "done"; f.status = "completed"; f.endedAt = Date.now(); } }
      });
      onSnapshot({ runId: "run_20261006_101530", factors: JSON.parse(JSON.stringify(F)) });
      if (F.every((f) => f.status === "completed" || f.status === "failed")) clearInterval(t);
    }, 300);
    onSnapshot({ runId: "run_20261006_101530", factors: JSON.parse(JSON.stringify(F)) });
    return () => clearInterval(t);
  }

  /* ===================================================================
     J) START
     =================================================================== */
  paintIcons();
  subscribeRun("run_20261006_101530", (snap) => { state.snap = snap; render(); });
  animatePackets();
  animateScene();

  // Example: page in events ko aise sunega
  document.addEventListener("testingkit:action", (e) => console.log("action", e.detail));
})();
</script>
</body>
</html>
