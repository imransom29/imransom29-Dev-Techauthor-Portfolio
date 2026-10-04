<img width="813" height="623" alt="Screenshot 2026-10-05 at 5 12 25 AM" src="https://github.com/user-attachments/assets/5df4323c-bbf8-429f-a016-69a2d000aaa5" />


PROMPT 

# Task: Build the Analysis tab for the Model Testing Kit (WIMT Evaluation Studio)

## Context
WIMT Evaluation Studio is our internal tool for evaluating the AI Teammate supervisor.
The Model Testing Kit page lets a user upload a query dataset, pick an environment
(DEV/UAT) and test factors (e.g. Change Management), and run an evaluation. Each run
has three steps per factor: Query supervisor -> Pull Arize traces -> Score results.
The attached screenshot shows the current mock of the page, including a basic
Analysis tab (KPI tiles, a similarity histogram, and a "furthest from expected" list).
Your job is to build the real Analysis tab, backed by real run data.

## Step 0 — Explore before you build (report back before coding)
1. Find where run results are stored and how a scored row is represented
   (query, theme, expected answer, actual answer, score, verdict, latency, tokens).
2. Find how cosine similarity is currently computed: which embedding model,
   whether it uses full-dimension vectors, and where the pass threshold lives.
3. Find the frontend framework and any chart library already in use. Reuse it.
   Do not add a new chart library without asking.
4. Find the existing design tokens / theme (Wells Fargo red #D71E28, gold #FFCD41,
   cream #FAF7F2, ink #3B3331) and reuse them.
Send me a short summary of what you found, plus any field that is missing for the
charts below, before writing feature code.

## Metric definitions (use exactly these)
- cosine_similarity = cos(angle) between the FULL embedding of the expected answer
  and the FULL embedding of the supervisor answer. Never compute it from a 2D/3D
  projection.
- cosine_distance = 1 - cosine_similarity.
- Verdict: pass if similarity >= PASS_THRESHOLD, review if >= REVIEW_THRESHOLD,
  else fail. Defaults 0.80 and 0.70, read from config, never hard-coded in the UI.
- Rows that are not scored yet, errored, or have an empty answer are EXCLUDED from
  averages and shown as separate counts ("12 errored, 30 not scored yet").
- Every aggregate must show its denominator (e.g. "67% · 8 of 12 scored").

## Backend
Compute aggregates server-side. Do not send thousands of raw rows to the browser.
Add (or extend) endpoints, matching our existing API conventions:
- GET /runs/{run_id}/analysis?factor_id=...
  -> KPIs, histogram bins, per-theme verdict counts, threshold-sensitivity curve
     (pass rate at thresholds 0.50..0.95 step 0.01), worst-N rows, counts by status.
- GET /runs/{run_id}/analysis/points?factor_id=...&limit=2000
  -> per-row points for scatter plots (id, similarity, answer_length_tokens,
     latency_ms, theme, verdict). Sample down to `limit` if larger, and return
     total_count so the UI can say "showing 2,000 of 15,238".
- GET /runs/compare?base_run_id=...&target_run_id=...&factor_id=...
  -> per-query deltas, matched on (session_id, query_id) or query text hash.
- GET /runs/trend?dataset_id=...&factor_id=...&limit=20
  -> avg similarity and pass rate for recent completed runs on the same dataset.
Ask me before changing any existing DB schema or response shape.

## Frontend — layout of the Analysis tab (top to bottom)
1. Header row: factor selector, theme filter, "partial run" badge if the run is
   not completed ("Based on 3,504 of 15,238 scored").
2. KPI tiles: Avg similarity, Pass rate, Avg distance, Scored / total,
   Errored count. Each with its denominator.
3. Charts, each in its own card with a one-line plain-English subtitle that says
   what question it answers:
   a. Similarity histogram (bins of 0.05) with dashed threshold lines for pass and
      review. Bars colored by verdict band.
   b. Verdict by theme: horizontal stacked bar (pass/review/fail), sorted by
      fail share descending. Click a theme -> filters every chart on the tab.
   c. Threshold sensitivity: line chart of pass rate vs threshold, with a marker at
      the configured threshold. Tooltip: "At 0.78, 81% would pass".
   d. Similarity vs answer length: scatter, colored by verdict.
   e. Similarity vs latency: scatter, colored by verdict.
   f. Run trend: line chart of avg similarity and pass rate over recent runs of the
      same dataset. Hide the card if fewer than 2 runs exist.
   g. Run comparison: dumbbell chart of per-query old vs new score, sorted by
      biggest drop. Base run picked from a dropdown of earlier runs.
   h. Worst queries: table of the lowest 10 by similarity (query, theme, score,
      judge note). Clicking a row opens the existing row detail drawer / jumps to
      that row in the Dataset tab.
4. Leave a placeholder card for "Judge vs human agreement" (confusion matrix),
   shown only when human labels exist. Do not build the labeling flow.

## Behaviour and states
- Loading: skeleton blocks the size of each card, no layout jump.
- Run still running: charts refresh every 10s from the aggregate endpoint, never
  per-row; show the partial-run badge.
- Run failed: show charts for what was scored, plus "Stopped at step X" note.
- No scored rows yet: one empty state for the whole tab, not 8 empty charts.
- Cross-filtering: theme filter and theme click apply to all charts and the table.

## Visual rules
- Use existing tokens. Verdict colors everywhere: pass #4E8A2E, review #E8B425,
  fail #D71E28. Never encode meaning by color alone; add labels or icons.
- Every chart: axis titles with units, readable tooltips, no 3D effects.
- Numbers: similarity to 2 decimals, percentages as whole numbers.

## Quality
- Unit tests for the metric functions with known inputs (e.g. identical vectors
  -> 1.0, orthogonal -> 0.0, threshold boundary 0.80 -> pass).
- API tests for each endpoint, including empty, partial and failed runs.
- data-testid on each chart card: analysis-kpis, analysis-histogram,
  analysis-theme-verdicts, analysis-threshold-curve, analysis-length-scatter,
  analysis-latency-scatter, analysis-trend, analysis-compare, analysis-worst.
- Performance: the tab must render in under 2s for a run with 15,000 scored rows.

## Deliverables
- Work on a new branch, small commits.
- PR description with: screenshots of each chart (completed, partial, failed run),
  the endpoints added, and anything you assumed.
- If any metric definition above conflicts with existing code, stop and ask
  instead of picking one.


  
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Model Testing Kit · simple mock</title>
<style>
:root{--red:#D71E28;--redd:#A6141C;--redt:#FDF0F0;--gold:#FFCD41;--goldd:#7A5600;--goldt:#FFF7DD;--ok:#4E8A2E;--okt:#EEF5E8;
--page:#F3EEE7;--cream:#FAF7F2;--line:#E5DDD2;--lined:#C9BFB3;--ink:#3B3331;--mute:#7D736A;
--sans:"Segoe UI",system-ui,Arial,sans-serif;--serif:Georgia,serif;--mono:ui-monospace,Menlo,Consolas,monospace}
*{box-sizing:border-box}html,body{margin:0;height:100%}
body{font-family:var(--sans);font-size:13px;color:var(--ink);background:var(--page);display:flex;flex-direction:column}
button{font-family:inherit;cursor:pointer}
.serif{font-family:var(--serif)}.mute{color:var(--mute)}.mono{font-family:var(--mono)}.hidden{display:none!important}
.appbar{height:50px;flex:none;background:var(--red);border-bottom:3px solid var(--gold);color:#fff;display:flex;align-items:center;padding:0 20px;gap:14px}
.appbar b{font-family:var(--serif);font-size:19px;letter-spacing:1px}
.main{flex:1;min-height:0;display:flex;flex-direction:column;gap:12px;padding:14px 18px}
h1{margin:0;font-family:var(--serif);font-weight:400;font-size:22px}
.setup{flex:none;background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px 12px;display:flex;gap:10px;align-items:center}
.setup .lbl{font-size:10.5px;font-weight:700;letter-spacing:.8px;color:var(--goldd)}
.pill{height:42px;width:250px;display:flex;align-items:center;gap:10px;padding:0 12px;border:1px dashed var(--lined);border-radius:11px;background:var(--cream);text-align:left;color:var(--ink)}
.pill.done{border-style:solid;background:#fff}
.pill:disabled{opacity:.6;cursor:not-allowed}
.pill .n{width:22px;height:22px;border-radius:50%;border:1.5px dashed var(--lined);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex:none}
.pill.done .n{background:var(--ok);border:none;color:#fff}
.pill small{display:block;font-size:10.5px;color:var(--mute)}
.pill span.v{display:block;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.start{margin-left:auto;height:42px;padding:0 18px;border:none;border-radius:11px;background:var(--red);color:#fff;font-weight:600}
.start:disabled{background:#ECE5DB;color:var(--mute);cursor:not-allowed}
.card{flex:1;min-height:0;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.band{height:4px;background:var(--red);box-shadow:0 2px 0 var(--gold);flex:none}
.status{flex:none;display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--line)}
.tabs{flex:none;display:flex;gap:22px;padding:0 18px;border-bottom:1px solid var(--line)}
.tabs button{border:none;background:none;padding:10px 0;color:var(--mute);border-bottom:2px solid transparent;font-size:13px}
.tabs button.on{color:var(--redd);font-weight:600;border-bottom-color:var(--red)}
.tabs button:disabled{opacity:.4;cursor:not-allowed}
.panel{flex:1;min-height:0;overflow:auto;padding:16px 18px}
.empty{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.chip{font-size:11px;padding:2px 8px;border-radius:999px;background:#F1ECE5;color:#5A504A}
.bar{height:8px;border-radius:4px;background:#ECE5DB;overflow:hidden;margin:6px 0 3px}.bar i{display:block;height:100%;transition:width .3s}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
table{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed}
th,td{border-right:1px solid #E6DFD5;border-bottom:1px solid #E6DFD5;padding:6px 8px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px}
th:last-child,td:last-child{border-right:none}
thead tr.L th{background:#EFE8DE;color:#8A7F74;font-weight:600;text-align:center;font-size:10.5px;padding:2px}
thead tr.F th{background:var(--red);color:#fff;font-size:10.5px;letter-spacing:.4px;border-bottom:3px solid var(--gold);border-right-color:rgba(255,255,255,.25)}
thead tr.F th.res{background:#8F161D}
td.rn,th.rn{width:40px;text-align:center;background:#EFE8DE;color:#8A7F74;font-size:10.5px}
tbody tr:hover td:not(.rn){background:#FFF9F3}
.grid{border:1px solid var(--lined);border-radius:10px;overflow:auto;max-height:100%}
.v{font-size:10.5px;font-weight:700;padding:1px 8px;border-radius:999px}
.v.p{background:var(--okt);color:var(--ok)}.v.f{background:var(--redt);color:var(--redd)}.v.r{background:var(--goldt);color:var(--goldd)}.v.q{background:#F1ECE5;color:#9A9088}
.kp{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.k{background:var(--cream);border:1px solid var(--line);border-left-width:3px;border-radius:10px;padding:10px 12px}
.k small{font-size:10px;font-weight:700;letter-spacing:.5px;color:var(--mute)}.k b{display:block;font-family:var(--serif);font-size:22px}
.scrim{position:fixed;inset:0;background:rgba(59,51,49,.36);z-index:5}
.drawer{position:fixed;top:0;right:0;bottom:0;width:560px;background:#fff;z-index:6;display:flex;flex-direction:column;box-shadow:-18px 0 40px rgba(40,20,10,.2)}
.dh{padding:18px 22px 14px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between}
.db{flex:1;overflow:auto;padding:16px 22px}
.df{border-top:1px solid var(--line);background:var(--cream);padding:12px 22px;display:flex;justify-content:flex-end;gap:8px}
.btn{height:36px;padding:0 14px;border:1px solid var(--lined);border-radius:10px;background:#fff;color:var(--ink)}
.btnp{height:36px;padding:0 20px;border:none;border-radius:10px;background:var(--red);color:#fff;font-weight:600}
.btnp:disabled{background:#ECE5DB;color:var(--mute);cursor:not-allowed}
.drop{border:2px dashed var(--lined);border-radius:14px;background:var(--cream);padding:34px;text-align:center;cursor:pointer}
.drop:hover{border-color:var(--red)}
.opt{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer;width:100%;background:#fff;text-align:left;color:var(--ink)}
.opt.on{border-color:var(--red);background:var(--redt)}
.box{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--lined);flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px}
.opt.on .box{background:var(--red);border-color:var(--red)}
.menu{position:absolute;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 14px 30px rgba(0,0,0,.14);padding:6px;z-index:4;width:250px}
.menu button{width:100%;border:none;background:none;text-align:left;padding:10px 12px;border-radius:9px;color:var(--ink)}
.menu button:hover{background:var(--redt)}
</style>
</head>
<body>
<header class="appbar"><b>WELLS FARGO</b><span style="opacity:.6">|</span><span style="font-weight:600;font-size:15px">WIMT Evaluation Studio</span></header>

<main class="main">
  <div><h1>Model Testing Kit</h1><div class="mute">Simple mock with one dummy dataset (12 queries)</div></div>

  <section class="setup" style="position:relative">
    <span class="lbl">RUN SETUP</span>
    <button class="pill" id="pData"></button>
    <button class="pill" id="pEnv"></button>
    <button class="pill" id="pFac"></button>
    <button class="start" id="startBtn">Start run</button>
    <div class="menu hidden" id="envMenu"></div>
  </section>

  <section class="card">
    <div class="band"></div>
    <div class="status hidden" id="status"></div>
    <nav class="tabs" id="tabs">
      <button data-t="progress" class="on">Progress</button>
      <button data-t="dataset">Dataset</button>
      <button data-t="analysis">Analysis</button>
    </nav>
    <div class="panel" id="panel"></div>
  </section>
</main>

<div class="scrim hidden" id="scrim"></div>
<aside class="drawer hidden" id="drawer"></aside>

<script>
(function(){
"use strict";
const $=id=>document.getElementById(id);

/* ---------------- 1) DUMMY DATASET (ek hi) ---------------- */
const DATASET={
  fileName:"Dummy_CM_Golden_Dataset.xlsx", sizeKb:8.2,
  columns:["Session ID","Query ID","Query","Theme"],
  rows:[
    ["121","1","What is DCCOE?","Platforms & Advisor Tools"],
    ["121","2","Can clients without Online Access use eSign?","Document & E-Sign"],
    ["123","1","How do I send a client an eSign form?","Document & E-Sign"],
    ["123","2","Where can I access the eSign portal?","Document & E-Sign"],
    ["124","1","Who approves a change request?","Change Management"],
    ["124","2","How do I log a change ticket?","Change Management"],
    ["125","1","What is the rollback process?","Change Management"],
    ["125","2","What changed in the Q3 release?","Change Management"],
    ["126","1","How do I initiate a wire transfer?","Money Movement"],
    ["126","2","What is the cutoff for same-day ACH?","Money Movement"],
    ["127","1","How do I update a client's address?","Account Maintenance"],
    ["127","2","How do I change a beneficiary?","Account Maintenance"]
  ]
};
// Har query ka dummy result (asli app mein judge se aayega)
const RESULTS=[
  [0.93,"Matches the knowledge article."],[0.88,"Correct, cites eligibility rule."],[0.91,"Correct steps in the right order."],
  [0.62,"Points to an old portal link."],[0.84,"Right approver, grounded in policy."],[0.79,"Skips the ticket category step."],
  [0.90,"Correct rollback steps."],[0.55,"Describes the wrong release."],[0.86,"Correct wire steps."],
  [0.74,"Cutoff time stated without source."],[0.95,"Exact match with procedure."],[0.81,"Correct, minor wording gap."]
];
const verdict=s=>s>=0.8?"p":s>=0.7?"r":"f";
const VL={p:"✓ Pass",r:"! Review",f:"✕ Fail",q:"Queued"};
const FACTORS=[["cm","Change Management","Supervisor answers on change-management queries"],["hal","Hallucination","Unsupported claims in the answer"]];

/* ---------------- 2) STATE ---------------- */
const S={data:false,env:null,fac:[],phase:"setup",tab:"progress",steps:null,start:0,draft:null};
const ROWS=DATASET.rows.length;

/* ---------------- 3) SETUP BAR ---------------- */
function pill(el,n,label,value,done){el.className="pill"+(done?" done":"");el.disabled=S.phase==="running";
  el.innerHTML=`<span class="n">${done?"✓":n}</span><span style="min-width:0"><small>${label}</small><span class="v">${value}</span></span>`;}
function renderSetup(){
  pill($("pData"),1,"Dataset",S.data?`${DATASET.fileName} · ${ROWS} rows`:"Upload a query file",S.data);
  pill($("pEnv"),2,"Environment",S.env?S.env+" supervisor":"Choose DEV or UAT",!!S.env);
  const names=S.fac.map(id=>FACTORS.find(f=>f[0]===id)[1]);
  pill($("pFac"),3,"Factors",names.length?names.join(", "):"Select test factors",names.length>0);
  const ready=S.data&&S.env&&S.fac.length;
  const b=$("startBtn");
  b.disabled=S.phase==="running"||(!ready&&S.phase!=="done");
  b.textContent=S.phase==="running"?"Running…":S.phase==="done"?"New run":"Start run";
}

/* ---------------- 4) DRAWERS ---------------- */
function openDrawer(kind){
  S.draft=kind==="data"?S.data:[...S.fac];
  $("scrim").classList.remove("hidden");$("drawer").classList.remove("hidden");drawDrawer(kind);
}
function closeDrawer(){$("scrim").classList.add("hidden");$("drawer").classList.add("hidden");}
function drawDrawer(kind){
  const D=$("drawer");
  if(kind==="data"){
    D.innerHTML=`<div class="band"></div><div class="dh"><div><div class="serif" style="font-size:20px">Dataset</div><div class="mute">Upload the queries to test</div></div><button class="btn" id="dx">✕</button></div>
    <div class="db">${S.draft?`
      <div style="display:flex;gap:10px;align-items:center;border:1px solid var(--line);border-radius:10px;padding:10px 12px">
        <span style="font-size:22px">📗</span><div style="flex:1"><b>${DATASET.fileName}</b><div class="mute" style="font-size:12px">${DATASET.sizeKb} KB · ${ROWS} rows · 4 columns · query column found</div></div>
        <button class="btn" id="rm">Remove</button></div>
      <div class="grid" style="margin-top:12px"><table>
        <colgroup><col style="width:36px"><col style="width:72px"><col style="width:64px"><col><col style="width:140px"></colgroup>
        <thead><tr class="L"><th class="rn"></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
        <tr class="F"><th class="rn" style="background:#EFE8DE;color:#8A7F74">1</th>${DATASET.columns.map(c=>`<th>${c.toUpperCase()}</th>`).join("")}</tr></thead>
        <tbody>${DATASET.rows.map((r,i)=>`<tr><td class="rn">${i+2}</td>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    :`<div class="drop" id="drop"><div style="font-size:30px">⬆️</div><div class="serif" style="font-size:18px;margin-top:8px">Drag and drop your query file</div><div class="mute" style="margin-top:4px">or click to load the dummy file</div></div>`}</div>
    <div class="df"><button class="btn" id="dc">Cancel</button><button class="btnp" id="dd" ${S.draft?"":"disabled"}>Done</button></div>`;
    const drop=$("drop");
    if(drop){drop.onclick=()=>{S.draft=true;drawDrawer("data");};
      drop.ondragover=e=>e.preventDefault();drop.ondrop=e=>{e.preventDefault();S.draft=true;drawDrawer("data");};}
    const rm=$("rm");if(rm)rm.onclick=()=>{S.draft=false;drawDrawer("data");};
    $("dd").onclick=()=>{S.data=S.draft;closeDrawer();refresh();};
  } else {
    D.innerHTML=`<div class="band"></div><div class="dh"><div><div class="serif" style="font-size:20px">Test factors</div><div class="mute">What to test each answer on</div></div><button class="btn" id="dx">✕</button></div>
    <div class="db">${FACTORS.map(f=>`<button class="opt ${S.draft.includes(f[0])?"on":""}" data-f="${f[0]}"><span class="box">${S.draft.includes(f[0])?"✓":""}</span><span><b>${f[1]}</b><div class="mute" style="font-size:12px">${f[2]}</div></span></button>`).join("")}</div>
    <div class="df"><button class="btn" id="dc">Cancel</button><button class="btnp" id="dd" ${S.draft.length?"":"disabled"}>Done</button></div>`;
    D.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{const id=b.dataset.f,i=S.draft.indexOf(id);i>-1?S.draft.splice(i,1):S.draft.push(id);drawDrawer("fac");});
    $("dd").onclick=()=>{S.fac=[...S.draft];closeDrawer();refresh();};
  }
  $("dx").onclick=closeDrawer;$("dc").onclick=closeDrawer;
}
$("scrim").onclick=closeDrawer;

/* Environment dropdown */
function showEnv(){const m=$("envMenu");m.style.left=$("pEnv").offsetLeft+"px";m.style.top="58px";
  m.innerHTML=[["DEV","For trying changes"],["UAT","Closest to production"]].map(e=>`<button data-e="${e[0]}"><b>${e[0]}</b> <span class="mute">· ${e[1]}</span></button>`).join("");
  m.classList.remove("hidden");m.querySelectorAll("button").forEach(b=>b.onclick=ev=>{ev.stopPropagation();S.env=b.dataset.e;m.classList.add("hidden");refresh();});}
document.addEventListener("click",()=>$("envMenu").classList.add("hidden"));

$("pData").onclick=()=>openDrawer("data");
$("pFac").onclick=()=>openDrawer("fac");
$("pEnv").onclick=e=>{e.stopPropagation();$("envMenu").classList.contains("hidden")?showEnv():$("envMenu").classList.add("hidden");};

/* ---------------- 5) MOCK RUN ---------------- */
let timer=null;
$("startBtn").onclick=()=>{
  if(S.phase==="done"){S.phase="setup";S.steps=null;S.tab="progress";refresh();return;}
  S.phase="running";S.start=Date.now();S.tab="progress";
  S.steps=[{n:"Query supervisor",u:"queries answered",d:0,t:ROWS},{n:"Pull Arize traces",u:"traces collected",d:0,t:ROWS},{n:"Score results",u:"queries scored",d:0,t:ROWS}];
  timer=setInterval(()=>{
    const s=S.steps.find(x=>x.d<x.t);
    if(!s){clearInterval(timer);S.phase="done";S.end=Date.now();refresh();return;}
    s.d=Math.min(s.t,s.d+2);refresh();
  },350);
  refresh();
};
const scored=()=>S.steps?S.steps[2].d:0;

/* ---------------- 6) STATUS + TABS ---------------- */
function renderStatus(){
  const el=$("status");
  if(!S.steps){el.classList.add("hidden");return;}
  el.classList.remove("hidden");
  const pct=Math.round(S.steps.reduce((a,s)=>a+s.d/s.t,0)/3*100);
  const sec=Math.floor(((S.end&&S.phase==="done"?S.end:Date.now())-S.start)/1000);
  const cur=S.steps.findIndex(s=>s.d<s.t);
  el.innerHTML=`<span style="font-size:22px">${S.phase==="done"?"✅":"⏳"}</span>
    <div style="flex:1"><div class="serif" style="font-size:17px">${S.phase==="done"?"Completed":cur<0?"Finishing up…":"Running · step "+(cur+1)+" of 3, "+S.steps[cur].n}</div>
    <div style="display:flex;gap:6px;margin-top:4px"><span class="chip">${DATASET.fileName} · ${ROWS} rows</span><span class="chip">${S.env}</span><span class="chip">${S.fac.length} factor${S.fac.length>1?"s":""}</span></div></div>
    <b class="serif" style="font-size:22px;color:${S.phase==="done"?"var(--ok)":"var(--redd)"}">${pct}%</b><span class="mono mute">${sec}s</span>`;
}
$("tabs").onclick=e=>{const b=e.target.closest("button");if(!b||b.disabled)return;S.tab=b.dataset.t;renderTabs();};
function renderTabs(){
  document.querySelectorAll("#tabs button").forEach(b=>{b.classList.toggle("on",b.dataset.t===S.tab);b.disabled=b.dataset.t==="analysis"&&!scored();});
  ({progress:renderProgress,dataset:renderDataset,analysis:renderAnalysis})[S.tab]();
}

function renderProgress(){
  const P=$("panel");
  if(!S.steps){const left=[!S.data&&"upload a dataset",!S.env&&"pick an environment",!S.fac.length&&"select factors"].filter(Boolean);
    P.innerHTML=`<div class="empty"><div style="font-size:34px">${left.length?"📋":"🚀"}</div><div class="serif" style="font-size:20px;margin-top:8px">${left.length?"Set up your run":"Ready to run"}</div><div class="mute" style="margin-top:4px">${left.length?"Still to do: "+left.join(", ")+".":"Press Start run."}</div></div>`;return;}
  P.innerHTML=S.fac.map(id=>`<div style="border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px">
    <b style="font-size:14px">${FACTORS.find(f=>f[0]===id)[1]}</b>
    <div class="steps" style="margin-top:10px">${S.steps.map((s,i)=>`<div><div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600"><span>${s.d>=s.t?"✓ ":""}${i+1}. ${s.n}</span><span class="mute">${Math.round(s.d/s.t*100)}%</span></div>
      <div class="bar"><i style="width:${s.d/s.t*100}%;background:${s.d>=s.t?"var(--ok)":"var(--red)"}"></i></div><div class="mute" style="font-size:11px">${s.d} of ${s.t} ${s.u}</div></div>`).join("")}</div></div>`).join("")+
    (scored()?`<div style="background:var(--cream);border:1px solid var(--line);border-radius:12px;padding:12px 14px">💡 ${summary()}</div>`:"");
}
function summary(){const n=scored(),list=RESULTS.slice(0,n),p=list.filter(r=>verdict(r[0])==="p").length;
  return `${n} of ${ROWS} queries scored so far. <b>${p} passed</b> (${Math.round(p/n*100)}%), average similarity <b>${(list.reduce((a,r)=>a+r[0],0)/n).toFixed(2)}</b>.`;}

function renderDataset(){
  const P=$("panel");
  if(!S.data){P.innerHTML=`<div class="empty"><div style="font-size:34px">📄</div><div class="serif" style="font-size:18px;margin-top:8px">No dataset yet</div><div class="mute">Upload one from the Dataset pill.</div></div>`;return;}
  const n=scored();
  P.innerHTML=`<div class="grid"><table>
    <colgroup><col style="width:40px"><col style="width:80px"><col style="width:70px"><col style="width:300px"><col style="width:180px"><col style="width:96px"><col style="width:70px"><col></colgroup>
    <thead><tr class="L"><th class="rn"></th>${"ABCDEFG".split("").map(c=>`<th>${c}</th>`).join("")}</tr>
    <tr class="F"><th class="rn" style="background:#EFE8DE;color:#8A7F74">1</th><th>SESSION ID</th><th>QUERY ID</th><th>QUERY</th><th>THEME</th><th class="res">STATUS</th><th class="res">SCORE</th><th class="res">JUDGE NOTE</th></tr></thead>
    <tbody>${DATASET.rows.map((r,i)=>{const done=i<n,res=RESULTS[i],v=done?verdict(res[0]):"q";
      return `<tr><td class="rn">${i+2}</td>${r.map(c=>`<td>${c}</td>`).join("")}<td><span class="v ${v}">${VL[v]}</span></td><td class="mono">${done?res[0].toFixed(2):"—"}</td><td class="mute">${done?res[1]:"—"}</td></tr>`;}).join("")}</tbody></table></div>
    <div class="mute" style="font-size:11.5px;margin-top:8px;text-align:right">Rows: <b>${ROWS}</b> · Scored: <b>${n}</b></div>`;
}

function renderAnalysis(){
  const P=$("panel"),n=scored(),list=RESULTS.slice(0,n).map((r,i)=>({q:DATASET.rows[i][2],s:r[0],note:r[1]}));
  const avg=list.reduce((a,x)=>a+x.s,0)/n,pass=list.filter(x=>x.s>=0.8).length;
  const bands=[[0.5,0.6],[0.6,0.7],[0.7,0.8],[0.8,0.9],[0.9,1.01]],cnt=bands.map(b=>list.filter(x=>x.s>=b[0]&&x.s<b[1]).length),mx=Math.max(1,...cnt);
  const worst=[...list].sort((a,b)=>a.s-b.s).slice(0,3);
  P.innerHTML=`<div class="kp">
    <div class="k" style="border-left-color:var(--red)"><small>AVG SIMILARITY</small><b>${avg.toFixed(2)}</b></div>
    <div class="k" style="border-left-color:var(--ok)"><small>PASS RATE (≥ 0.80)</small><b>${Math.round(pass/n*100)}%</b></div>
    <div class="k" style="border-left-color:#E8B425"><small>AVG DISTANCE</small><b>${(1-avg).toFixed(2)}</b></div>
    <div class="k" style="border-left-color:var(--ink)"><small>SCORED</small><b>${n} / ${ROWS}</b></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div style="border:1px solid var(--line);border-radius:12px;padding:14px"><b>Similarity spread</b>
        <div style="display:flex;gap:10px;align-items:flex-end;height:140px;margin-top:10px">${bands.map((b,i)=>`<div style="flex:1;text-align:center"><div class="mute" style="font-size:11px">${cnt[i]}</div>
          <div style="height:${cnt[i]/mx*100}px;background:${b[0]>=0.8?"var(--ok)":b[0]>=0.7?"#E8B425":"var(--red)"};border-radius:4px 4px 0 0;margin-top:3px"></div>
          <div class="mute" style="font-size:10.5px;margin-top:4px">${b[0].toFixed(1)}–${Math.min(1,b[1]).toFixed(1)}</div></div>`).join("")}</div>
        <div class="mute" style="font-size:11px;margin-top:8px">Green bands pass (cos ≥ 0.80). Cosine similarity 1 = same meaning as expected.</div></div>
      <div style="border:1px solid var(--line);border-radius:12px;padding:14px"><b>Furthest from expected</b>
        ${worst.map(w=>`<div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #F1ECE5">
          <b class="serif" style="font-size:18px;width:46px;color:${verdict(w.s)==="f"?"var(--redd)":"var(--goldd)"}">${w.s.toFixed(2)}</b>
          <div><div style="font-weight:600">${w.q}</div><div class="mute" style="font-size:12px">${w.note}</div></div></div>`).join("")}</div>
    </div>`;
}

/* ---------------- 7) START ---------------- */
function refresh(){renderSetup();renderStatus();renderTabs();}
refresh();
})();
</script>
</body>
</html>
