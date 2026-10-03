<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WIMT Evaluation Studio · Evaluation Run</title>
<!-- Icons. Agar network CDN block kare, to ye package locally install karo. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
<style>
/* =====================================================================
   1) DESIGN TOKENS — Wells Fargo theme. Rang yahin se badlo.
   ===================================================================== */
:root {
  --wf-red: #D71E28;   --wf-red-dark: #A6141C;  --wf-red-tint: #FDF0F0;
  --wf-gold: #FFCD41;  --wf-gold-bar: #E8B425;  --wf-gold-text: #7A5600; --wf-gold-tint: #FFF7DD;
  --wf-ok: #4E8A2E;    --wf-ok-tint: #EEF5E8;
  --wf-page: #F3EEE7;  --wf-cream: #FAF7F2;     --wf-side: #F7F1E8;
  --wf-line: #E5DDD2;  --wf-line-dark: #C9BFB3; --wf-grid: #E3DBD0;
  --wf-ink: #3B3331;   --wf-muted: #7D736A;

  --font-sans: "Wells Fargo Sans", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
  --font-serif: "Wells Fargo Serif", Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  font-family: var(--font-sans); font-size: 13px; color: var(--wf-ink);
  background: var(--wf-page); -webkit-font-smoothing: antialiased;
  display: flex; flex-direction: column; overflow: hidden;   /* sirf andar ke panels scroll honge */
}
button, select, input { font-family: inherit; }
button { cursor: pointer; }
.serif { font-family: var(--font-serif); }
.muted { color: var(--wf-muted); }
.mono { font-family: var(--font-mono); }

/* =====================================================================
   2) APP SHELL — red top bar (sirf yahi bada red hissa hai)
   ===================================================================== */
.appbar {
  height: 56px; flex: none;
  background: var(--wf-red); border-bottom: 3px solid var(--wf-gold);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 22px; color: #fff;
}
.appbar .left, .appbar .right { display: flex; align-items: center; gap: 18px; }
.appbar .brand { font-family: var(--font-serif); font-size: 20px; font-weight: 700; letter-spacing: 1px; }
.appbar .divider { width: 1px; height: 24px; background: rgba(255,213,107,.7); }
.appbar .title { font-size: 16px; font-weight: 600; }
.appbar i { font-size: 18px; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--wf-gold); color: var(--wf-ink);
  font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center;
}

.layout { flex: 1; display: flex; min-height: 0; }

/* Sidebar: halka cream, taaki top bar ke red se na takraaye */
.sidebar {
  width: 210px; flex: none; position: relative; overflow: hidden;
  background: var(--wf-side); border-right: 1px solid var(--wf-line);
  display: flex; flex-direction: column; padding: 16px 12px;
}
.sidebar .pattern { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.sidebar > *:not(.pattern) { position: relative; }
.nav-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--wf-gold-text); opacity: .8; padding: 4px 12px 8px; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px; margin-bottom: 2px;
  border-radius: 10px; color: #4A413C; text-decoration: none; position: relative;
}
.nav-item i { font-size: 16px; color: #9A9088; }
.nav-item:hover { background: rgba(255,255,255,.7); }
.nav-item.active { background: #fff; color: var(--wf-red-dark); font-weight: 600; border: 1px solid var(--wf-line); }
.nav-item.active i { color: var(--wf-red); }
.nav-item.active::before {
  content: ""; position: absolute; left: -12px; top: 8px; bottom: 8px;
  width: 4px; border-radius: 0 3px 3px 0; background: var(--wf-red);
}
.status-card { margin-top: auto; background: #fff; border: 1px solid var(--wf-line); border-radius: 12px; padding: 10px 12px; font-size: 12px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--wf-ok); box-shadow: 0 0 0 3px var(--wf-ok-tint); display: inline-block; }

.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

/* Run setup band */
.setup {
  flex: none; background: #fff; border-bottom: 1px solid var(--wf-line);
  padding: 12px 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.setup h1 { margin: 0 8px 0 0; font-family: var(--font-serif); font-weight: 400; font-size: 20px; }
.field {
  height: 34px; display: inline-flex; align-items: center; gap: 6px;
  border: 1px solid var(--wf-line-dark); border-radius: 9px; background: #fff; padding: 0 4px 0 10px;
}
.field span { font-size: 10.5px; color: var(--wf-muted); }
.field select {
  border: none; background: transparent; font-size: 12.5px; color: var(--wf-ink);
  height: 30px; padding-right: 4px; outline: none; cursor: pointer;
}
.btn-primary {
  height: 34px; padding: 0 16px; border: none; border-radius: 9px; margin-left: auto;
  background: var(--wf-red); color: #fff; font-weight: 600; font-size: 13px;
  display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 6px 14px rgba(215,30,40,.22);
}
.btn-primary:disabled { background: #ECE5DB; color: var(--wf-muted); box-shadow: none; cursor: not-allowed; }
.btn {
  height: 30px; padding: 0 10px; border: 1px solid var(--wf-line-dark); border-radius: 8px;
  background: #fff; color: var(--wf-ink); font-size: 12px; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
}
.btn:hover { border-color: var(--wf-red); color: var(--wf-red-dark); }

/* Do column: results (left) + history (right) */
.workspace { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 330px; gap: 12px; padding: 12px 16px 14px; }

.card {
  background: #fff; border: 1px solid var(--wf-line); border-radius: 14px;
  overflow: hidden; display: flex; flex-direction: column; min-height: 0;
}
.card .band { height: 4px; background: var(--wf-red); box-shadow: 0 2px 0 var(--wf-gold); flex: none; }

/* =====================================================================
   3) RESULTS PANEL
   ===================================================================== */
.results-head { flex: none; padding: 12px 18px 10px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.results-head h2 { margin: 0; font-family: var(--font-serif); font-weight: 400; font-size: 19px; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
.chip { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: #F1ECE5; color: #5A504A; }
.live-pill { font-size: 10.5px; font-weight: 700; color: var(--wf-red); display: inline-flex; align-items: center; gap: 5px; }
.live-pill::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--wf-red); animation: blink 1.2s infinite; }
@keyframes blink { 50% { opacity: .3; } }

.kpis { flex: none; display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 8px; padding: 0 18px 10px; }
.kpi { background: var(--wf-cream); border: 1px solid var(--wf-line); border-left-width: 3px; border-radius: 10px; padding: 8px 10px; }
.kpi .label { font-size: 10px; font-weight: 700; letter-spacing: .5px; color: var(--wf-muted); }
.kpi .value { font-family: Georgia, serif; font-size: 20px; font-weight: 700; }
.mix-bar { height: 7px; border-radius: 4px; background: #ECE5DB; overflow: hidden; display: flex; margin-top: 5px; }
.mix-bar i { height: 100%; transition: width .4s; }

.verdict-tabs { flex: none; display: flex; gap: 4px; background: #F1ECE5; border-radius: 9px; padding: 3px; margin: 0 18px 10px; }
.verdict-tabs button { flex: 1; border: none; background: none; padding: 5px 10px; border-radius: 7px; font-size: 12px; color: var(--wf-muted); }
.verdict-tabs button.active { background: #fff; color: var(--wf-red-dark); font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,.08); }

/* Table box: bachi jagah lo, andar scroll karo */
.table-box { flex: 1; min-height: 0; margin: 0 18px 14px; border: 1px solid var(--wf-line-dark); border-radius: 12px; overflow: auto; }
.span-table { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; }
.span-table th, .span-table td { border-right: 1px solid var(--wf-grid); border-bottom: 1px solid var(--wf-grid); }
.span-table th:last-child, .span-table td:last-child { border-right: none; }
.span-table tbody tr:last-child td { border-bottom: none; }
.span-table thead th {
  position: sticky; top: 0; z-index: 1;
  background: var(--wf-red); color: #fff; border-right-color: rgba(255,255,255,.25); border-bottom: 3px solid var(--wf-gold);
  padding: 8px 10px; font-size: 10.5px; font-weight: 700; letter-spacing: .5px; text-align: left;
}
.span-table td { padding: 8px 10px; font-size: 12px; vertical-align: top; line-height: 1.45; }
.span-table tbody tr:hover td { background: #FFF9F3; }
.span-table tr.fresh td { animation: fresh 1.2s ease; }
@keyframes fresh { from { background: var(--wf-gold-tint); } }
.verdict { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; white-space: nowrap; }
.verdict.pass { background: var(--wf-ok-tint); color: var(--wf-ok); }
.verdict.fail { background: var(--wf-red-tint); color: var(--wf-red-dark); }
.verdict.review { background: var(--wf-gold-tint); color: var(--wf-gold-text); }

.empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; }
.empty i { font-size: 32px; color: var(--wf-line-dark); }

/* =====================================================================
   4) HISTORY PANEL
   ===================================================================== */
.history-head { flex: none; padding: 12px 14px 8px; }
.history-head h2 { margin: 0; font-family: var(--font-serif); font-weight: 400; font-size: 16px; }
.toggle { display: flex; background: #F1ECE5; border-radius: 8px; padding: 3px; margin-top: 8px; }
.toggle button { flex: 1; border: none; background: none; padding: 4px 0; border-radius: 6px; font-size: 11.5px; color: var(--wf-muted); }
.toggle button.active { background: #fff; color: var(--wf-red-dark); font-weight: 600; }
.search-box {
  display: flex; align-items: center; gap: 6px; height: 32px; margin-top: 8px;
  border: 1px solid var(--wf-line-dark); border-radius: 8px; padding: 0 10px; background: #FFFFFF;
}
.search-box i { color: #A39A90; }
.search-box input { all: unset; flex: 1; font-size: 12px; color: var(--wf-ink); background: #FFFFFF; }
.search-box input::placeholder { color: #A39A90; }

.history-list { flex: 1; overflow: auto; padding: 4px 10px 12px; }
.day-label { font-size: 10px; font-weight: 700; letter-spacing: .8px; color: var(--wf-muted); padding: 8px 4px 4px; }
.run-item {
  width: 100%; text-align: left; font: inherit; color: inherit;
  border: 1px solid var(--wf-line); border-radius: 10px; padding: 9px 11px; margin-bottom: 6px;
  background: #fff; transition: border-color .15s, box-shadow .15s;
}
.run-item:hover { border-color: var(--wf-line-dark); box-shadow: 0 3px 10px rgba(0,0,0,.05); }
.run-item.active { border-color: var(--wf-red); background: var(--wf-red-tint); box-shadow: inset 3px 0 0 var(--wf-red); }
.run-item .row1 { display: flex; justify-content: space-between; align-items: baseline; }
.run-item .rid { font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; }
.run-item .rate { font-family: Georgia, serif; font-weight: 700; font-size: 15px; }
.run-item .project { font-size: 12px; font-weight: 600; margin-top: 2px; display: block; }
.run-item .mix-bar { height: 4px; margin: 6px 0 4px; }
.run-item .meta { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--wf-muted); gap: 6px; }
</style>
</head>
<body>

<header class="appbar">
  <div class="left">
    <i class="ti ti-menu-2"></i>
    <span class="brand">WELLS FARGO</span>
    <span class="divider"></span>
    <span class="title">WIMT Evaluation Studio</span>
  </div>
  <div class="right">
    <i class="ti ti-git-compare"></i><i class="ti ti-database"></i><i class="ti ti-settings"></i>
    <span style="font-size:13px;font-weight:600" id="userName">Rahul</span>
    <span class="avatar">R</span>
  </div>
</header>

<div class="layout">
  <nav class="sidebar" aria-label="Main">
    <svg class="pattern" id="sidePattern" aria-hidden="true"></svg>
    <div class="nav-label">WORKSPACE</div>
    <a class="nav-item" href="#/"><i class="ti ti-layout-grid"></i>Home</a>
    <a class="nav-item active" href="#/evaluate"><i class="ti ti-git-compare"></i>Evaluation</a>
    <a class="nav-item" href="#/playground"><i class="ti ti-arrows-diff"></i>Model Playground</a>
    <div class="nav-label" style="margin-top:8px">LIBRARY</div>
    <a class="nav-item" href="#/prompts"><i class="ti ti-file-text"></i>Prompt Hub</a>
    <a class="nav-item" href="#/golden"><i class="ti ti-table"></i>Golden Dataset</a>
    <a class="nav-item" href="#/traces"><i class="ti ti-database"></i>Data &amp; Traces</a>
    <div class="status-card">
      <div style="display:flex;align-items:center;gap:8px;font-weight:600"><span class="status-dot"></span>Connected</div>
      <div class="muted" style="margin-top:3px">Tachyon Overwatch · dev</div>
    </div>
    <a class="nav-item" href="#/settings" style="margin-top:8px"><i class="ti ti-settings"></i>Settings</a>
  </nav>

  <main class="main">
    <!-- ===================== RUN SETUP ===================== -->
    <section class="setup" aria-label="Run setup">
      <h1>Evaluation Run</h1>
      <label class="field"><span>Project</span>
        <select id="setProject" data-testid="select-project">
          <option value="">Select project</option>
          <option>advisor-ai-teammate</option>
          <option>wealth-operations</option>
        </select>
      </label>
      <label class="field"><span>Scope</span>
        <select id="setScope"><option>Span</option><option>Trace</option></select>
      </label>
      <label class="field"><span>Range</span>
        <select id="setRange"><option>1 hour</option><option>6 hours</option><option selected>24 hours</option><option>7 days</option><option>30 days</option></select>
      </label>
      <label class="field"><span>Limit</span>
        <select id="setLimit"><option>25</option><option>50</option><option selected>All</option></select>
      </label>
      <label class="field"><span>Factor</span>
        <select id="setFactor"><option>Hallucination</option><option>Correctness</option></select>
      </label>
      <button class="btn-primary" id="runBtn" data-testid="run-evaluation" disabled><i class="ti ti-player-play"></i>Run evaluation</button>
    </section>

    <div class="workspace">
      <!-- ===================== RESULTS ===================== -->
      <section class="card" id="resultsPanel" aria-live="polite"></section>

      <!-- ===================== HISTORY ===================== -->
      <aside class="card" aria-label="Run history">
        <div class="band"></div>
        <div class="history-head">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h2>Run history</h2><span class="muted" style="font-size:11px" id="historyCount"></span>
          </div>
          <div class="toggle" id="ownerToggle">
            <button class="active" data-owner="me">My runs</button>
            <button data-owner="all">Team runs</button>
          </div>
          <label class="search-box"><i class="ti ti-search"></i><input id="historySearch" placeholder="Search by run ID or project"></label>
        </div>
        <div class="history-list" id="historyList"></div>
      </aside>
    </div>
  </main>
</div>

<script>
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ===================================================================
     A) API LAYER
     Abhi USE_MOCK = true hai, isliye sample data aata hai.
     Backend ready hone par USE_MOCK = false karo aur neeche ke
     endpoints apne hisaab se badlo. Baaki UI ko chhoona nahi padega.
     =================================================================== */
  const USE_MOCK = true;
  const API_BASE = "/api";               // apna base URL yahan
  const CURRENT_USER = { id: "me", name: "Rahul" };

  // Runs ki list — sirf summary (counts, pass %), poore spans nahi
  async function apiListRuns(owner) {
    if (USE_MOCK) return mock.listRuns(owner);
    const res = await fetch(`${API_BASE}/evaluation-runs?owner=${owner}&limit=50`);
    if (!res.ok) throw new Error("Could not load run history");
    return res.json();   // expected: [{ id, project, createdAt, createdBy, factor, scope, range, total, passed, failed, review }]
  }

  // Ek run ke poore results — sirf click hone par
  async function apiGetRun(runId) {
    if (USE_MOCK) return mock.getRun(runId);
    const res = await fetch(`${API_BASE}/evaluation-runs/${encodeURIComponent(runId)}`);
    if (!res.ok) throw new Error("Could not load this run");
    return res.json();   // expected: { ...summary, spans: [{ id, query, verdict: "pass"|"fail"|"review", score, reason, latencyMs }] }
  }

  // Naya run shuru karo; har span aate hi onSpan call hota hai
  async function apiStartRun(settings, onSpan) {
    if (USE_MOCK) return mock.startRun(settings, onSpan);
    // Asli app: yahan streaming endpoint (SSE / WebSocket) se spans padho
    // aur har span ke liye onSpan(span) call karo. Aakhir mein run summary return karo.
    throw new Error("Connect apiStartRun to the streaming endpoint");
  }

  /* ===================================================================
     B) MOCK DATA — sirf demo ke liye
     =================================================================== */
  const mock = (() => {
    const QUERIES = [
      "How much should I save each month to retire at 62?", "Traditional IRA vs Roth IRA tax timing?",
      "Pay down mortgage or raise 401(k) contribution?", "Can a 529 plan cover graduate tuition?",
      "Is a target-date fund right for me?", "How do required minimum distributions work?",
      "What happens to my 401(k) if I change jobs?", "How should I rebalance after a market drop?",
      "What is the 4% withdrawal rule?", "Should I convert my IRA to a Roth this year?",
      "How is a fiduciary different from a broker?", "What does my portfolio's beta mean?"
    ];
    const REASONS = {
      pass: ["Grounded in retrieved account context.", "All figures match source documents.", "Answer stays within the provided policy text."],
      fail: ["Cites a contribution limit not in the sources.", "States a guaranteed return, not supported.", "Invents a tax rule for the client's state."],
      review: ["Partly supported; one claim needs checking.", "Source is ambiguous on eligibility.", "Judge confidence below threshold."]
    };
    const seeded = (seed) => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    function makeSpan(rand, i, base) {
      const x = rand();
      const verdict = x < 0.72 ? "pass" : x < 0.88 ? "fail" : "review";
      return {
        id: `sp-${(4100 + i * 7 + base) % 9999}`,
        query: QUERIES[Math.floor(rand() * QUERIES.length)],
        verdict,
        score: verdict === "pass" ? 0.82 + rand() * 0.17 : verdict === "fail" ? 0.2 + rand() * 0.3 : 0.5 + rand() * 0.2,
        reason: REASONS[verdict][Math.floor(rand() * 3)],
        latencyMs: Math.round(420 + rand() * 700)
      };
    }
    const now = Date.now(), H = 3600e3;
    const runs = [
      { id: "R-1046", project: "advisor-ai-teammate", createdAt: now - 1.5 * H, createdBy: "me", factor: "Hallucination", scope: "Span", range: "24 hours", total: 42 },
      { id: "R-1043", project: "wealth-operations", createdAt: now - 18 * H, createdBy: "me", factor: "Correctness", scope: "Trace", range: "7 days", total: 36 },
      { id: "R-1041", project: "advisor-ai-teammate", createdAt: now - 22 * H, createdBy: "Teammate", factor: "Hallucination", scope: "Span", range: "24 hours", total: 40 },
      { id: "R-1038", project: "wealth-operations", createdAt: now - 3 * 24 * H, createdBy: "me", factor: "Hallucination", scope: "Span", range: "7 days", total: 55 },
      { id: "R-1032", project: "advisor-ai-teammate", createdAt: now - 4 * 24 * H, createdBy: "me", factor: "Correctness", scope: "Span", range: "30 days", total: 60 },
      { id: "R-1029", project: "advisor-ai-teammate", createdAt: now - 5 * 24 * H, createdBy: "Teammate", factor: "Hallucination", scope: "Trace", range: "7 days", total: 30 }
    ];
    runs.forEach((r) => {
      const rand = seeded(parseInt(r.id.slice(2), 10));
      r.spans = Array.from({ length: r.total }, (_, i) => makeSpan(rand, i, parseInt(r.id.slice(2), 10)));
      summarize(r);
    });
    function summarize(r) {
      r.passed = r.spans.filter((s) => s.verdict === "pass").length;
      r.failed = r.spans.filter((s) => s.verdict === "fail").length;
      r.review = r.spans.filter((s) => s.verdict === "review").length;
      r.total = r.spans.length;
    }
    const summaryOf = ({ spans, ...rest }) => ({ ...rest });
    let nextId = 1047;
    return {
      listRuns: async (owner) => runs.filter((r) => owner === "all" || r.createdBy === "me").map(summaryOf),
      getRun: async (id) => {
        const r = runs.find((x) => x.id === id);
        if (!r) throw new Error("Run not found");
        return { ...r, spans: [...r.spans] };
      },
      startRun: (settings, onSpan) => new Promise((resolve) => {
        const id = `R-${nextId++}`;
        const run = { id, project: settings.project, createdAt: Date.now(), createdBy: "me", factor: settings.factor, scope: settings.scope, range: settings.range, spans: [], total: 0, passed: 0, failed: 0, review: 0 };
        runs.unshift(run);
        const count = settings.limit === "All" ? 24 : Math.min(24, +settings.limit);
        const rand = seeded(nextId * 13);
        let i = 0;
        const timer = setInterval(() => {
          const span = makeSpan(rand, i, nextId);
          run.spans.push(span);
          summarize(run);
          onSpan(span, summaryOf(run));
          if (++i >= count) { clearInterval(timer); resolve(summaryOf(run)); }
        }, 180);
      })
    };
  })();

  /* ===================================================================
     C) STATE
     =================================================================== */
  const state = {
    owner: "me",
    search: "",
    runs: [],          // history list (summaries)
    current: null,     // jo run abhi dikh raha hai (spans ke saath)
    verdictTab: "all",
    runningId: null    // jo run abhi stream ho raha hai
  };

  /* ===================================================================
     D) HELPERS
     =================================================================== */
  const passRate = (r) => (r.total ? Math.round((r.passed / r.total) * 100) : 0);
  const rateColor = (p) => (p >= 75 ? "var(--wf-ok)" : p >= 65 ? "var(--wf-gold-text)" : "var(--wf-red-dark)");
  const mixBar = (r) => r.total
    ? `<span class="mix-bar"><i style="width:${(r.passed / r.total) * 100}%;background:var(--wf-ok)"></i><i style="width:${(r.review / r.total) * 100}%;background:var(--wf-gold-bar)"></i><i style="width:${(r.failed / r.total) * 100}%;background:var(--wf-red)"></i></span>`
    : `<span class="mix-bar"></span>`;

  function dayLabel(ts) {
    const d = new Date(ts), today = new Date();
    const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diff = (start(today) - start(d)) / 86400e3;
    return diff === 0 ? "TODAY" : diff === 1 ? "YESTERDAY" : "EARLIER";
  }
  function timeLabel(ts) {
    const d = new Date(ts);
    const t = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const lbl = dayLabel(ts);
    return lbl === "TODAY" ? `Today · ${t}` : lbl === "YESTERDAY" ? `Yesterday · ${t}` : `${d.toLocaleDateString([], { day: "numeric", month: "short" })} · ${t}`;
  }
  const VERDICT_LABEL = { pass: "✓ Factual", fail: "✕ Hallucinated", review: "! Review" };

  /* ===================================================================
     E) HISTORY LIST
     =================================================================== */
  async function loadHistory() {
    try {
      state.runs = await apiListRuns(state.owner);
    } catch (e) {
      $("historyList").innerHTML = `<div class="empty"><i class="ti ti-alert-triangle"></i><div style="margin-top:8px">${esc(e.message)}</div></div>`;
      return;
    }
    renderHistory();
  }

  function renderHistory() {
    const q = state.search;
    const list = state.runs.filter((r) => !q || (r.id + " " + r.project).toLowerCase().includes(q));
    $("historyCount").textContent = `${list.length} runs`;
    if (!list.length) {
      $("historyList").innerHTML = `<div class="empty" style="padding:30px 10px"><i class="ti ti-history"></i><div class="muted" style="margin-top:8px">No runs found</div></div>`;
      return;
    }
    let html = "", lastDay = "";
    list.forEach((r, idx) => {
      const day = dayLabel(r.createdAt);
      if (day !== lastDay) { html += `<div class="day-label">${day}</div>`; lastDay = day; }
      const p = passRate(r);
      const isActive = state.current && state.current.id === r.id;
      const tag = r.id === state.runningId ? ' <span class="live-pill">RUNNING</span>' : idx === 0 && day === "TODAY" ? ' <span class="live-pill" style="color:var(--wf-gold-text)">LATEST</span>' : "";
      html += `
        <button class="run-item ${isActive ? "active" : ""}" data-run="${esc(r.id)}">
          <span class="row1"><span class="rid">${esc(r.id)}${tag}</span><span class="rate" style="color:${rateColor(p)}">${p}%</span></span>
          <span class="project">${esc(r.project)}</span>
          ${mixBar(r)}
          <span class="meta"><span>${timeLabel(r.createdAt)}</span><span>${esc(r.factor)} · ${r.total} spans${r.createdBy !== "me" ? " · " + esc(r.createdBy) : ""}</span></span>
        </button>`;
    });
    $("historyList").innerHTML = html;
    $("historyList").querySelectorAll("[data-run]").forEach((b) => b.addEventListener("click", () => openRun(b.dataset.run)));
  }

  $("ownerToggle").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $("ownerToggle").querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
    state.owner = b.dataset.owner;
    loadHistory();
  });
  $("historySearch").addEventListener("input", (e) => { state.search = e.target.value.trim().toLowerCase(); renderHistory(); });

  /* ===================================================================
     F) RESULTS PANEL
     =================================================================== */
  async function openRun(runId) {
    try {
      state.current = await apiGetRun(runId);
      state.verdictTab = "all";
      renderResults();
      renderHistory();
    } catch (e) {
      $("resultsPanel").innerHTML = `<div class="band"></div><div class="empty"><i class="ti ti-alert-triangle"></i><div style="margin-top:8px">${esc(e.message)}</div></div>`;
    }
  }

  function renderEmpty() {
    $("resultsPanel").innerHTML = `
      <div class="band"></div>
      <div class="empty">
        <i class="ti ti-player-play"></i>
        <div class="serif" style="font-size:18px;margin-top:10px">No run selected</div>
        <div class="muted" style="margin-top:4px;max-width:360px;line-height:1.5">
          Pick a run from the history on the right, or choose a project above and press <b style="color:var(--wf-red-dark)">Run evaluation</b>.
        </div>
      </div>`;
  }

  function renderResults() {
    const r = state.current;
    if (!r) return renderEmpty();
    const p = passRate(r);
    const running = r.id === state.runningId;
    const owner = r.createdBy === "me" ? "Run by you" : "Run by " + esc(r.createdBy);

    $("resultsPanel").innerHTML = `
      <div class="band"></div>
      <div class="results-head">
        <div>
          <div style="display:flex;align-items:center;gap:10px">
            <h2>Run ${esc(r.id)}</h2><span class="muted">·</span><span style="font-weight:600">${esc(r.project)}</span>
            ${running ? '<span class="live-pill">RUNNING</span>' : ""}
          </div>
          <div class="chips">
            <span class="chip"><i class="ti ti-clock"></i> ${timeLabel(r.createdAt)}</span>
            <span class="chip">${esc(r.scope)} scope</span>
            <span class="chip">${esc(r.range)}</span>
            <span class="chip">Judge: LLM · ${esc(r.factor)}</span>
            <span class="chip">${owner}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn" id="rerunBtn" ${running ? "disabled" : ""}><i class="ti ti-refresh"></i>Re-run</button>
          <button class="btn" data-testid="push-overwatch"><i class="ti ti-upload"></i>Push to Overwatch</button>
          <button class="btn" id="exportBtn"><i class="ti ti-download"></i>Export</button>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi" style="border-left-color:var(--wf-red)"><div class="label">PASS SCORE</div><div class="value" id="kPass" style="color:${rateColor(p)}">${p}%</div><span id="kMix">${mixBar(r)}</span></div>
        <div class="kpi" style="border-left-color:var(--wf-ink)"><div class="label">TOTAL</div><div class="value" id="kTotal">${r.total}</div></div>
        <div class="kpi" style="border-left-color:var(--wf-ok)"><div class="label">PASSED</div><div class="value" id="kPassed">${r.passed}</div></div>
        <div class="kpi" style="border-left-color:var(--wf-red)"><div class="label">FAILED</div><div class="value" id="kFailed">${r.failed}</div></div>
        <div class="kpi" style="border-left-color:var(--wf-gold-bar)"><div class="label">REVIEW</div><div class="value" id="kReview">${r.review}</div></div>
      </div>
      <div class="verdict-tabs" id="verdictTabs">${tabsHtml(r)}</div>
      <div class="table-box">
        <table class="span-table">
          <colgroup><col style="width:86px"><col style="width:34%"><col style="width:112px"><col style="width:64px"><col><col style="width:76px"></colgroup>
          <thead><tr><th>SPAN</th><th>QUERY</th><th>VERDICT</th><th>SCORE</th><th>JUDGE REASON</th><th>LATENCY</th></tr></thead>
          <tbody id="spanRows"></tbody>
        </table>
      </div>`;

    $("verdictTabs").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      state.verdictTab = b.dataset.tab;
      $("verdictTabs").innerHTML = tabsHtml(state.current);
      renderRows();
    });
    $("rerunBtn").addEventListener("click", () => startRun({ project: r.project, scope: r.scope, range: r.range, factor: r.factor, limit: "All" }));
    $("exportBtn").addEventListener("click", () => exportCsv(state.current));
    renderRows();
  }

  function tabsHtml(r) {
    const t = state.verdictTab;
    return `
      <button data-tab="all" class="${t === "all" ? "active" : ""}">All ${r.total}</button>
      <button data-tab="pass" class="${t === "pass" ? "active" : ""}">Factual ${r.passed}</button>
      <button data-tab="fail" class="${t === "fail" ? "active" : ""}">Hallucinated ${r.failed}</button>
      <button data-tab="review" class="${t === "review" ? "active" : ""}">Needs review ${r.review}</button>`;
  }

  function rowHtml(s, fresh) {
    return `<tr class="${fresh ? "fresh" : ""}">
      <td class="mono muted" style="font-size:11px">${esc(s.id)}</td>
      <td style="font-weight:600">${esc(s.query)}</td>
      <td><span class="verdict ${s.verdict}">${VERDICT_LABEL[s.verdict]}</span></td>
      <td class="mono">${s.score.toFixed(2)}</td>
      <td class="muted">${esc(s.reason)}</td>
      <td class="mono muted">${s.latencyMs} ms</td></tr>`;
  }

  function renderRows() {
    const r = state.current, t = state.verdictTab;
    const rows = r.spans.filter((s) => t === "all" || s.verdict === t);
    $("spanRows").innerHTML = rows.length
      ? rows.map((s) => rowHtml(s, false)).join("")
      : `<tr><td colspan="6" class="muted" style="text-align:center;padding:24px">${r.id === state.runningId ? "Waiting for spans…" : "No spans in this view"}</td></tr>`;
  }

  // Streaming ke dauraan sirf numbers aur nayi row update karo, poora panel nahi
  function applyLiveUpdate(span, summary) {
    const r = state.current;
    if (!r || r.id !== summary.id) return;
    r.spans.push(span);
    Object.assign(r, { total: summary.total, passed: summary.passed, failed: summary.failed, review: summary.review });
    const p = passRate(r);
    $("kPass").textContent = p + "%";
    $("kPass").style.color = rateColor(p);
    $("kMix").innerHTML = mixBar(r);
    $("kTotal").textContent = r.total; $("kPassed").textContent = r.passed;
    $("kFailed").textContent = r.failed; $("kReview").textContent = r.review;
    $("verdictTabs").innerHTML = tabsHtml(r);
    if (state.verdictTab === "all" || state.verdictTab === span.verdict) {
      const body = $("spanRows");
      if (body.querySelector("td[colspan]")) body.innerHTML = "";
      body.insertAdjacentHTML("afterbegin", rowHtml(span, true));   // naya span upar aata hai
    }
  }

  function exportCsv(r) {
    const head = ["span_id", "query", "verdict", "score", "reason", "latency_ms"];
    const lines = [head.join(",")].concat(r.spans.map((s) =>
      [s.id, s.query, s.verdict, s.score.toFixed(3), s.reason, s.latencyMs].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${r.id}-results.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ===================================================================
     G) NEW RUN
     =================================================================== */
  const settings = () => ({
    project: $("setProject").value, scope: $("setScope").value, range: $("setRange").value,
    limit: $("setLimit").value, factor: $("setFactor").value
  });
  $("setProject").addEventListener("change", () => { $("runBtn").disabled = !$("setProject").value || !!state.runningId; });
  $("runBtn").addEventListener("click", () => startRun(settings()));

  async function startRun(s) {
    if (!s.project || state.runningId) return;
    $("runBtn").disabled = true;
    let first = true;
    try {
      await apiStartRun(s, (span, summary) => {
        if (first) {
          // Pehla span aate hi naya run history mein aur beech mein dikhao
          first = false;
          state.runningId = summary.id;
          state.current = { ...summary, spans: [] };
          state.verdictTab = "all";
          renderResults();
          state.runs.unshift(summary);   // naya run history mein sabse upar
        }
        applyLiveUpdate(span, summary);
        const item = state.runs.find((x) => x.id === summary.id);
        if (item) Object.assign(item, summary);
        renderHistory();
      });
    } catch (e) {
      alert(e.message);
    } finally {
      state.runningId = null;
      $("runBtn").disabled = !$("setProject").value;
      if (state.current) renderResults();
      renderHistory();
    }
  }

  /* ===================================================================
     H) SIDEBAR PATTERN — sign-in page ki deewar, bahut halke rang mein
     =================================================================== */
  function drawSidebarPattern() {
    const svg = $("sidePattern");
    const w = svg.clientWidth || 210, h = svg.clientHeight || 800;
    let seed = 11;
    const r = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const cw = 96, ch = 60, gap = 10, step = 104;
    let out = "";
    for (let c = 0; c * step < w + cw; c++) {
      for (let y = c % 2 ? -30 : -8; y < h; y += ch + gap) {
        const x = -14 + c * step;
        out += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="9" fill="rgba(255,255,255,0.45)" stroke="rgba(166,20,28,0.06)"/>`;
        for (let i = 0; i < 2; i++) out += `<rect x="${x + 9}" y="${y + 12 + i * 10}" width="${20 + r() * 34}" height="4" rx="2" fill="rgba(166,20,28,0.05)"/>`;
        const t = r();
        if (t < 0.3) {
          let p = "", v = ch - 8;
          for (let k = 0; k < 8; k++) { v = Math.max(ch * 0.55, v - (r() * 6 - 1.5)); p += `${x + 9 + k * 10},${y + v} `; }
          out += `<polyline points="${p}" fill="none" stroke="rgba(215,30,40,0.12)" stroke-width="1.2"/>`;
        } else if (t < 0.5) {
          for (let k = 0; k < 6; k++) { const bh = 4 + r() * 12; out += `<rect x="${x + 9 + k * 12}" y="${y + ch - 6 - bh}" width="7" height="${bh}" rx="1" fill="rgba(232,180,37,0.14)"/>`; }
        }
        if (r() < 0.28) out += `<circle cx="${x + cw - 12}" cy="${y + 12}" r="6" fill="none" stroke="${r() < 0.75 ? "rgba(78,138,46,.16)" : "rgba(232,180,37,.3)"}" stroke-width="1.1"/>`;
      }
    }
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.innerHTML = out;
  }

  /* ===================================================================
     I) START
     =================================================================== */
  drawSidebarPattern();
  window.addEventListener("resize", () => { clearTimeout(drawSidebarPattern._t); drawSidebarPattern._t = setTimeout(drawSidebarPattern, 200); });
  $("userName").textContent = CURRENT_USER.name;
  renderEmpty();
  loadHistory().then(() => { if (state.runs[0]) openRun(state.runs[0].id); });   // sabse naya run pehle dikhao
})();
</script>
</body>
</html>
