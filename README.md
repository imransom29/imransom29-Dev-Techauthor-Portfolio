
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WIMT Evaluation Studio · Candidate models</title>
<!-- Icons. Agar network CDN block kare, to ye package locally install karo. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
<style>
/* =====================================================================
   1) DESIGN TOKENS — Wells Fargo theme
   ===================================================================== */
:root {
  --wf-red: #D71E28;   --wf-red-dark: #A6141C;  --wf-red-tint: #FDF0F0;
  --wf-gold: #FFCD41;  --wf-gold-text: #7A5600;
  --wf-cream: #FAF7F2; --wf-page: #F3EEE7; --wf-side: #F7F1E8;
  --wf-line: #E8E1D7;  --wf-line-dark: #C9BFB3;
  --wf-ink: #3B3331;   --wf-muted: #857A70;  --wf-ok: #4E8A2E;
  --font-sans: "Wells Fargo Sans", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
  --font-serif: "Wells Fargo Serif", Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body { font-family: var(--font-sans); font-size: 13px; color: var(--wf-ink); background: var(--wf-page); -webkit-font-smoothing: antialiased; }
button, select, input { font-family: inherit; }
button { cursor: pointer; }
.muted { color: var(--wf-muted); }

/* Demo page (asli app mein ye aapka Model Playground hoga) */
.demo-page { padding: 24px; display: flex; gap: 10px; align-items: center; }
.setup-btn { height: 40px; padding: 0 14px; border: 1px solid var(--wf-line-dark); border-radius: 10px; background: #fff; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--wf-ink); }
.setup-btn .k { font-size: 11.5px; color: var(--wf-muted); }

/* =====================================================================
   2) DRAWER SHELL
   ===================================================================== */
.scrim { position: fixed; inset: 0; z-index: 20; background: rgba(59,51,49,.36); opacity: 0; pointer-events: none; transition: opacity .25s; }
.scrim.show { opacity: 1; pointer-events: auto; }
.drawer {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 21;
  width: min(820px, 100vw); background: #fff; box-shadow: -18px 0 40px rgba(40,20,10,.2);
  display: flex; flex-direction: column;
  transform: translateX(100%); transition: transform .4s cubic-bezier(.2,.8,.2,1);
}
.drawer.open { transform: translateX(0); }
.drawer .band { height: 4px; background: var(--wf-red); box-shadow: 0 2px 0 var(--wf-gold); flex: none; }
.drawer-head { padding: 18px 24px 14px; border-bottom: 1px solid var(--wf-line); flex: none; }
.drawer-head .row1 { display: flex; justify-content: space-between; align-items: flex-start; }
.drawer-head h3 { margin: 0; font-family: var(--font-serif); font-weight: 400; font-size: 21px; }
.drawer-head p { margin: 2px 0 0; color: var(--wf-muted); }
.icon-btn { border: none; background: none; font-size: 18px; color: var(--wf-muted); padding: 2px; }

/* Lineup slots */
.slots { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 12px; }
.slot {
  height: 42px; border: 1.5px dashed var(--wf-line-dark); border-radius: 10px; background: var(--wf-cream);
  display: flex; align-items: center; gap: 8px; padding: 0 10px; font-size: 11px; color: var(--wf-muted); position: relative;
}
.slot.filled { border-style: solid; background: #fff; }
.slot .letter { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 10.5px; flex: none; }
.slot .letter.empty { border: 1.5px dashed var(--wf-line-dark); color: var(--wf-line-dark); }
.slot .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: var(--wf-ink); font-size: 11.5px; }
.slot .remove { position: absolute; top: 2px; right: 4px; border: none; background: none; font-size: 10px; color: var(--wf-muted); display: none; }
.slot.filled:hover .remove { display: block; }

.drawer-body { flex: 1; min-height: 0; display: flex; }

/* Provider rail */
.rail { width: 190px; flex: none; background: var(--wf-cream); border-right: 1px solid var(--wf-line); padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; overflow: auto; }
.rail-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--wf-gold-text); opacity: .85; padding: 8px 10px 6px; }
.provider {
  display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 9px;
  font-size: 12.5px; position: relative; border: 1px solid transparent; background: none; text-align: left; color: var(--wf-ink); width: 100%;
}
.provider:hover { background: #fff; }
.provider.active { background: #fff; color: var(--wf-red-dark); font-weight: 600; border-color: var(--wf-line); }
.provider.active::before { content: ""; position: absolute; left: -10px; top: 7px; bottom: 7px; width: 3px; border-radius: 0 3px 3px 0; background: var(--wf-red); }
.provider .count { margin-left: auto; font-size: 11px; color: var(--wf-muted); font-weight: 400; }
.provider .picked { background: var(--wf-red); color: #fff; font-size: 10px; font-weight: 700; border-radius: 999px; padding: 0 6px; margin-left: 4px; }
.logo {
  width: 20px; height: 20px; border-radius: 5px; background: #fff; border: 1px solid var(--wf-line);
  padding: 2px; display: inline-flex; align-items: center; justify-content: center; flex: none;
  font-size: 10px; font-weight: 700; color: var(--wf-ink);
}
.logo img { width: 100%; height: 100%; object-fit: contain; }

.toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; font-size: 12px; border-radius: 8px; border: none; background: none; color: var(--wf-ink); width: 100%; }
.toggle-row:hover { background: #fff; }
.switch { width: 28px; height: 16px; border-radius: 999px; background: #D9D0C4; position: relative; flex: none; }
.switch::after { content: ""; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: #fff; transition: left .15s; }
.switch.on { background: var(--wf-red); }
.switch.on::after { left: 14px; }

/* Model list */
.pane { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.toolbar { display: flex; gap: 8px; align-items: center; padding: 12px 16px 10px; flex: none; }
.search-box { flex: 1; display: flex; align-items: center; gap: 8px; height: 34px; border: 1px solid var(--wf-line-dark); border-radius: 9px; padding: 0 12px; background: #FFFFFF; }
.search-box i { color: #A39A90; }
.search-box input { all: unset; flex: 1; font-size: 12.5px; color: var(--wf-ink); background: #FFFFFF; }
.search-box input::placeholder { color: #A39A90; }
.sort { height: 34px; border: 1px solid var(--wf-line-dark); border-radius: 9px; background: #fff; font-size: 12px; padding: 0 8px; color: var(--wf-ink); }

.list { flex: 1; min-height: 0; overflow: auto; margin: 0 16px 12px; border: 1px solid var(--wf-line-dark); border-radius: 12px; }
.list-head, .model-row { display: grid; grid-template-columns: 34px minmax(0,1fr) 64px 64px 96px; align-items: center; gap: 8px; padding: 0 12px; }
.list-head { position: sticky; top: 0; z-index: 2; height: 32px; background: var(--wf-red); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: .6px; border-bottom: 3px solid var(--wf-gold); }
.list-head .r { text-align: right; }
.group-head { position: sticky; top: 35px; z-index: 1; display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: var(--wf-side); font-size: 11px; font-weight: 700; border-bottom: 1px solid var(--wf-line); }
.model-row { height: 40px; width: 100%; border: none; border-bottom: 1px solid #F0EAE1; background: #fff; text-align: left; font: inherit; color: inherit; }
.model-row:hover { background: #FFF9F3; }
.model-row:disabled { opacity: .45; cursor: not-allowed; }
.check { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--wf-line-dark); display: flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 700; }
.model-name { min-width: 0; display: flex; align-items: baseline; gap: 8px; }
.model-name b { font-weight: 600; white-space: nowrap; }
.model-name .id { font-family: var(--font-mono); font-size: 10.5px; color: var(--wf-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.num { text-align: right; font-family: var(--font-mono); font-size: 12px; }
.tag { font-size: 9.5px; font-weight: 700; padding: 0 6px; border-radius: 4px; line-height: 16px; white-space: nowrap; }
.tag.new { background: var(--wf-red-tint); color: var(--wf-red-dark); }
.tag.base { background: var(--wf-ink); color: #fff; }
.tag.retired { background: #ECE5DB; color: var(--wf-muted); }
.status { font-size: 11px; display: inline-flex; align-items: center; gap: 5px; }
.status::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

/* Footer: sirf Clear + Done */
.drawer-foot { border-top: 1px solid var(--wf-line); background: var(--wf-cream); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex: none; }
.matchup { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 560px; }
.btn-clear { height: 38px; padding: 0 14px; border: 1px solid var(--wf-line-dark); border-radius: 10px; background: #fff; font-size: 13px; color: var(--wf-ink); }
.btn-done { height: 38px; padding: 0 24px; border: none; border-radius: 10px; font-weight: 600; font-size: 13px; background: var(--wf-red); color: #fff; }
.btn-done:disabled { background: #ECE5DB; color: var(--wf-muted); cursor: not-allowed; }

@media (prefers-reduced-motion: reduce) { .drawer, .scrim { transition: none; } }
</style>
</head>
<body>

<!-- Demo page: asli app mein ye button aapke Run setup mein hoga -->
<div class="demo-page">
  <button class="setup-btn" id="openModels" data-testid="open-model-drawer">
    <i class="ti ti-users-group"></i><span class="k">Models</span><span id="modelsLabel">Choose models</span>
  </button>
</div>

<div class="scrim" id="scrim"></div>

<aside class="drawer" id="modelDrawer" aria-label="Candidate models" data-testid="model-drawer">
  <div class="band"></div>
  <div class="drawer-head">
    <div class="row1">
      <div><h3>Candidate models</h3><p>Pick 2 to 5 · order sets A, B, C in results</p></div>
      <button class="icon-btn" id="closeDrawer" aria-label="Close" data-testid="model-drawer-close"><i class="ti ti-x"></i></button>
    </div>
    <div class="slots" id="slots"></div>
  </div>

  <div class="drawer-body">
    <nav class="rail" id="rail" aria-label="Providers"></nav>
    <div class="pane">
      <div class="toolbar">
        <label class="search-box"><i class="ti ti-search"></i><input id="modelSearch" placeholder="Search by name or model ID"></label>
        <select class="sort" id="sortSelect" aria-label="Sort models">
          <option value="provider">Sort: Provider</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="context">Sort: Largest context</option>
          <option value="output">Sort: Largest output</option>
        </select>
      </div>
      <div class="list" id="modelList" role="listbox" aria-multiselectable="true"></div>
    </div>
  </div>

  <div class="drawer-foot">
    <div style="min-width:0">
      <div class="muted" style="font-size:11px;font-weight:700;margin-bottom:3px" id="selCount"></div>
      <div class="matchup" id="matchup"></div>
    </div>
    <div style="display:flex;gap:10px;flex:none">
      <button class="btn-clear" id="clearBtn" data-testid="model-drawer-clear">Clear</button>
      <button class="btn-done" id="doneBtn" data-testid="model-drawer-done">Done</button>
    </div>
  </div>
</aside>

<script>
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ===================================================================
     A) DATA SOURCE — asli app mein model registry API se aayega
     Expected shape: [{ provider, name, id, inputTokens, outputTokens, status: "available"|"retired", tag: "new"|"baseline"|"" }]
     =================================================================== */
  const USE_MOCK = true;
  async function fetchModels() {
    if (!USE_MOCK) {
      const res = await fetch("/api/models");
      if (!res.ok) throw new Error("Could not load models");
      return res.json();
    }
    // Sample data — sirf demo ke liye
    const raw = {
      OpenAI: [["GPT-5","gpt-5",400000,128000,"new"],["GPT-5 mini","gpt-5-mini",400000,128000,""],["GPT-4.1","gpt-4.1",1047576,32768,"baseline"],["GPT-4.1 mini","gpt-4.1-mini",1047576,32768,""],["GPT-4.1 nano","gpt-4.1-nano",1047576,32768,""],["GPT-4o","gpt-4o",128000,16384,""],["GPT-4o mini","gpt-4o-mini",128000,16384,""],["o3","o3",200000,100000,""],["o4-mini","o4-mini",200000,100000,""],["GPT-3.5 Turbo","gpt-3.5-turbo-legacy",16000,4096,"retired"]],
      Anthropic: [["Claude Opus 4.6","claude-opus-4-6",200000,32000,"new"],["Claude Sonnet 4.5","claude-sonnet-4-5",200000,64000,""],["Claude Haiku 4.5","claude-haiku-4-5",200000,64000,""],["Claude Opus 4.1","claude-opus-4-1",200000,32000,""],["Claude Sonnet 4","claude-sonnet-4",200000,64000,""],["Claude Opus 4","claude-opus-4",200000,32000,""],["Claude 3.7 Sonnet","claude-3.7-sonnet",200000,64000,""],["Claude 3.5 Haiku","claude-3.5-haiku",200000,8192,""],["Claude 3.5 Sonnet","claude-3.5-sonnet",200000,8192,"retired"]],
      Google: [["Gemini 2.5 Pro","gemini-2.5-pro",1048576,65536,""],["Gemini 2.5 Flash","gemini-2.5-flash",1048576,65536,""],["Gemini 2.5 Flash-Lite","gemini-2.5-flash-lite",1048576,65536,"new"],["Gemini 2.0 Flash","gemini-2.0-flash",1048576,8192,""],["Gemini 2.0 Flash-Lite","gemini-2.0-flash-lite",1048576,8192,""],["Gemma 3 27B","gemma-3-27b-it",128000,8192,""],["Gemini 1.5 Pro","gemini-1.5-pro",2097152,8192,"retired"],["Gemini 1.5 Flash","gemini-1.5-flash",1048576,8192,"retired"]],
      Meta: [["Llama 4 Maverick","llama-4-maverick",1048576,16384,"new"],["Llama 4 Scout","llama-4-scout",1048576,16384,""],["Llama 3.3 70B Instruct","llama-3.3-70b-instruct",128000,8192,""],["Llama 3.1 405B","llama-3.1-405b-instruct",128000,8192,""],["Llama 3.1 70B","llama-3.1-70b-instruct",128000,8192,""],["Llama 3.1 8B","llama-3.1-8b-instruct",128000,8192,""],["Llama 3.2 11B Vision","llama-3.2-11b-vision",128000,8192,""],["Llama 3.2 3B","llama-3.2-3b-instruct",128000,8192,""],["Llama 3 70B","llama-3-70b-instruct",8192,8192,"retired"]]
    };
    const list = [];
    Object.entries(raw).forEach(([provider, rows]) => rows.forEach(([name, id, inputTokens, outputTokens, t]) =>
      list.push({ provider, name, id, inputTokens, outputTokens, status: t === "retired" ? "retired" : "available", tag: t === "retired" ? "" : t })));
    return list;
  }

  // Official logo files yahan rakho. File na mile to provider ka pehla letter dikhega.
  const PROVIDER_LOGO = {
    OpenAI: "assets/providers/openai.svg",
    Anthropic: "assets/providers/anthropic.svg",
    Google: "assets/providers/google.svg",
    Meta: "assets/providers/meta.svg"
  };

  // Lineup slot: letter, rang, text rang, tint, matchup text rang
  const SLOTS = [
    ["A", "#D71E28", "#fff", "#FDF0F0", "#D71E28"],
    ["B", "#FFCD41", "#3B3331", "#FFF7DD", "#7A5600"],
    ["C", "#3B3331", "#fff", "#F5F2EE", "#3B3331"],
    ["D", "#A6141C", "#fff", "#FDF0F0", "#A6141C"],
    ["E", "#C99A1E", "#3B3331", "#FFF7DD", "#7A5600"]
  ];
  const MAX = 5, MIN = 2;

  /* ===================================================================
     B) STATE
     =================================================================== */
  let MODELS = [];
  let PROVIDERS = [];
  const state = {
    selected: [],          // model IDs, order = A, B, C…
    draft: [],             // drawer ke andar ka kaam-chalau selection
    provider: "All",
    search: "",
    sort: "provider",
    showRetired: false,
    longContext: false,
    selectedOnly: false
  };

  /* ===================================================================
     C) HELPERS
     =================================================================== */
  const byId = (id) => MODELS.find((m) => m.id === id);
  const fmtTokens = (n) => n >= 1e6 ? (n / 1048576).toFixed(n % 1048576 ? 1 : 0).replace(".0", "") + "M" : Math.round(n / 1000) + "K";
  const isVisible = (m) => (state.showRetired || m.status !== "retired") && (!state.longContext || m.inputTokens >= 1e6);

  function logoHtml(provider) {
    const src = PROVIDER_LOGO[provider];
    const letter = esc(provider[0]);
    if (!src) return `<span class="logo">${letter}</span>`;
    return `<span class="logo"><img src="${src}" alt="" onerror="this.parentNode.textContent='${letter}'"></span>`;
  }

  /* ===================================================================
     D) RENDER
     =================================================================== */
  function renderSlots() {
    $("slots").innerHTML = SLOTS.map((s, i) => {
      const m = state.draft[i] ? byId(state.draft[i]) : null;
      if (!m) return `<div class="slot"><span class="letter empty">${s[0]}</span>${i < MIN ? "Required" : "Optional"}</div>`;
      return `<div class="slot filled" style="border-color:${s[1]}">
        <button class="remove" data-remove="${i}" aria-label="Remove ${esc(m.name)}">✕</button>
        <span class="letter" style="background:${s[1]};color:${s[2]}">${s[0]}</span><span class="name">${esc(m.name)}</span></div>`;
    }).join("");
    $("slots").querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => {
      state.draft.splice(+b.dataset.remove, 1);
      renderAll();
    }));
  }

  function renderRail() {
    const count = (p) => MODELS.filter((m) => (p === "All" || m.provider === p) && isVisible(m)).length;
    const picked = (p) => state.draft.filter((id) => p === "All" || byId(id).provider === p).length;
    const providerBtn = (p) => `
      <button class="provider ${state.provider === p ? "active" : ""}" data-provider="${esc(p)}">
        ${p === "All" ? '<i class="ti ti-layout-list" style="font-size:16px;color:#9A9088;width:20px;text-align:center"></i>' : logoHtml(p)}
        ${p === "All" ? "All models" : esc(p)}
        <span class="count">${count(p)}</span>${picked(p) ? `<span class="picked">${picked(p)}</span>` : ""}
      </button>`;
    const toggle = (key, icon, label) => `
      <button class="toggle-row" data-toggle="${key}"><span><i class="ti ti-${icon} muted"></i> ${label}</span><span class="switch ${state[key] ? "on" : ""}"></span></button>`;

    $("rail").innerHTML =
      `<div class="rail-label">PROVIDERS</div>` + ["All", ...PROVIDERS].map(providerBtn).join("") +
      `<div class="rail-label" style="margin-top:12px">FILTERS</div>` +
      toggle("longContext", "arrows-maximize", "1M+ context") +
      toggle("selectedOnly", "checks", "Selected only") +
      toggle("showRetired", "archive", "Show retired") +
      `<div class="muted" style="font-size:10.5px;line-height:1.45;padding:10px 10px 0">Retired models are hidden by default because they're no longer in production.</div>`;

    $("rail").querySelectorAll("[data-provider]").forEach((b) => b.addEventListener("click", () => { state.provider = b.dataset.provider; renderAll(); }));
    $("rail").querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => { state[b.dataset.toggle] = !state[b.dataset.toggle]; renderAll(); }));
  }

  function rowHtml(m) {
    const slot = state.draft.indexOf(m.id);
    const on = slot > -1;
    const s = on ? SLOTS[slot] : null;
    const full = !on && state.draft.length >= MAX;
    const tag = m.status === "retired" ? '<span class="tag retired">RETIRED</span>'
      : m.tag === "new" ? '<span class="tag new">NEW</span>'
      : m.tag === "baseline" ? '<span class="tag base">BASELINE</span>' : "";
    const status = m.status === "retired"
      ? '<span class="status muted">Retired</span>'
      : '<span class="status" style="color:var(--wf-ok)">Available</span>';
    return `
      <button class="model-row" role="option" aria-selected="${on}" data-model="${esc(m.id)}" ${full ? "disabled" : ""}
        style="${on ? `background:${s[3]};box-shadow:inset 3px 0 0 ${s[1]}` : ""}"
        title="${m.inputTokens.toLocaleString()} input · ${m.outputTokens.toLocaleString()} output tokens">
        <span class="check" style="${on ? `background:${s[1]};border-color:${s[1]};color:${s[2]}` : ""}">${on ? s[0] : ""}</span>
        <span class="model-name"><b>${esc(m.name)}</b><span class="id">${esc(m.id)}</span>${tag}</span>
        <span class="num">${fmtTokens(m.inputTokens)}</span>
        <span class="num">${fmtTokens(m.outputTokens)}</span>
        <span>${status}</span>
      </button>`;
  }

  function renderList() {
    const q = state.search;
    let rows = MODELS.filter((m) =>
      (state.provider === "All" || m.provider === state.provider) && isVisible(m) &&
      (!state.selectedOnly || state.draft.includes(m.id)) &&
      (m.name + " " + m.id + " " + m.provider).toLowerCase().includes(q));

    if (state.sort === "name") rows.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === "context") rows.sort((a, b) => b.inputTokens - a.inputTokens);
    if (state.sort === "output") rows.sort((a, b) => b.outputTokens - a.outputTokens);

    let html = `<div class="list-head"><span></span><span>MODEL</span><span class="r">IN</span><span class="r">OUT</span><span>STATUS</span></div>`;
    if (!rows.length) {
      html += `<div class="muted" style="text-align:center;padding:40px 0">No models match these filters</div>`;
    } else if (state.sort === "provider" && state.provider === "All") {
      PROVIDERS.forEach((p) => {
        const group = rows.filter((m) => m.provider === p);
        if (!group.length) return;
        html += `<div class="group-head">${logoHtml(p)}${esc(p)}<span class="muted" style="font-weight:400;margin-left:auto">${group.length} models</span></div>`;
        html += group.map(rowHtml).join("");
      });
    } else {
      html += rows.map(rowHtml).join("");
    }
    $("modelList").innerHTML = html;
    $("modelList").querySelectorAll("[data-model]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.model, at = state.draft.indexOf(id);
      if (at > -1) state.draft.splice(at, 1);
      else if (state.draft.length < MAX) state.draft.push(id);
      renderAll();
    }));
  }

  function renderFooter() {
    const n = state.draft.length;
    $("selCount").textContent = `${n} OF ${MAX} SELECTED`;
    $("matchup").innerHTML = n
      ? state.draft.map((id, i) => `<b style="color:${SLOTS[i][4]}">${SLOTS[i][0]}</b> ${esc(byId(id).name)}`).join(' <span style="color:#C9BFB3">vs</span> ')
      : '<span class="muted">Your matchup will appear here</span>';
    const done = $("doneBtn");
    done.textContent = "Done";                         // label hamesha "Done"
    done.disabled = n === 1;                           // sirf 1 chuna ho to rok
    done.title = n === 1 ? `Pick at least ${MIN} models` : "";
  }

  function renderAll() { renderSlots(); renderRail(); renderList(); renderFooter(); }

  /* ===================================================================
     E) OPEN / CLOSE / DONE
     =================================================================== */
  function openDrawer() {
    state.draft = [...state.selected];                 // pichla selection wapas lao
    renderAll();
    $("modelDrawer").classList.add("open");
    $("scrim").classList.add("show");
    setTimeout(() => $("modelSearch").focus(), 300);
  }
  function closeDrawer() {                             // ✕, bahar click, Esc: changes discard
    $("modelDrawer").classList.remove("open");
    $("scrim").classList.remove("show");
  }
  function applySelection() {                          // Done: changes save
    state.selected = [...state.draft];
    const names = state.selected.map((id) => byId(id).name);
    $("modelsLabel").textContent = !names.length ? "Choose models"
      : names.length > 2 ? `${names[0]} + ${names.length - 1} more` : names.join(" vs ");
    // Bahar ke page ko batao — "Run comparison" yahi event sun ke enable ho
    document.dispatchEvent(new CustomEvent("models:selected", { detail: { modelIds: state.selected } }));
    closeDrawer();
  }

  $("openModels").addEventListener("click", openDrawer);
  $("closeDrawer").addEventListener("click", closeDrawer);
  $("scrim").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("modelDrawer").classList.contains("open")) closeDrawer(); });
  $("doneBtn").addEventListener("click", applySelection);
  $("clearBtn").addEventListener("click", () => { state.draft = []; renderAll(); });
  $("modelSearch").addEventListener("input", (e) => { state.search = e.target.value.trim().toLowerCase(); renderList(); });
  $("sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderList(); });

  // Example: bahar ka page selection kaise sunega
  document.addEventListener("models:selected", (e) => console.log("Selected models:", e.detail.modelIds));

  /* ===================================================================
     F) START
     =================================================================== */
  fetchModels().then((list) => {
    MODELS = list;
    PROVIDERS = [...new Set(list.map((m) => m.provider))];
  }).catch((e) => alert(e.message));
})();
</script>
</body>
</html>
