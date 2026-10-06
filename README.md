<img width="1468" height="726" alt="Screenshot 2026-10-06 at 12 14 23 PM" src="https://github.com/user-attachments/assets/1b716e24-c577-46de-be96-43ba9c334035" />


<img width="150" height="150" alt="app-tile" src="https://github.com/user-attachments/assets/387d9e86-7075-4878-a877-1461df49d5c5" />
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="WIMT Evaluation Studio"><title>WIMT Evaluation Studio</title><rect width="40" height="40" rx="11" fill="#FFFFFF"/><g transform="translate(5 5) scale(.75)"><path d="M7 33L33 27" stroke="#E8B425" stroke-width="4.2" stroke-linecap="round"/><path d="M7 33L24 9" stroke="#C8202A" stroke-width="4.2" stroke-linecap="round"/><path d="M17.3 30.6A11 11 0 0 0 13.2 24" fill="none" stroke="#C8202A" stroke-width="2.4" stroke-linecap="round" opacity=".55"/><circle cx="33" cy="27" r="3.6" fill="#E8B425"/><circle cx="24" cy="9" r="3.6" fill="#C8202A"/><circle cx="7" cy="33" r="3" fill="#C8202A"/></g></svg>


CODE :

IT HAS ANIMATION AS WELL

Wimt home · HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Home · WIMT Evaluation Studio</title>
<!-- Brand kit files (wimt-angle-logo/) ko /brand/ mein rakho -->
<link rel="icon" type="image/svg+xml" href="/brand/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32.png" />
<link rel="apple-touch-icon" href="/brand/favicon-180.png" />
<style>
/* =====================================================================
   1) TOKENS — saare rang seedhe (hex) diye hain, taaki dark mode ya
      koi doosri global style inhe badal na sake.
   ===================================================================== */
:root {
  --red: #C8202A; --red-strong: #D71E28; --red-dark: #A6141C; --red-tint: #FDF0F0;
  --gold: #FFCD41; --gold-mark: #E8B425; --gold-text: #7A5600; --gold-tint: #FFF7DD;
  --ok: #4E8A2E; --ok-tint: #EEF5E8;
  --ink: #2F2826; --muted: #7E746C; --faint: #ADA399;
  --page: #F7F3EE; --surface: #FFFFFF;
  --sans: "Wells Fargo Sans", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
  --serif: "Wells Fargo Serif", Georgia, "Times New Roman", serif;
 
  /* Fluid sizes: laptop se 4K tak barabar badhte hain */
  --bar-h: clamp(52px, 3.2vw, 72px);
  --side-w: clamp(220px, 13vw, 300px);
  --col-w: clamp(620px, 42vw, 1040px);
  --h1: clamp(30px, 2.6vw, 62px);
  --body: clamp(13px, .85vw, 17px);
  color-scheme: light;
}
* { box-sizing: border-box; margin: 0; }
html, body { height: 100%; }
body {
  font-family: var(--sans); font-size: var(--body); color: var(--ink); background: var(--page);
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;
  display: flex; flex-direction: column; overflow: hidden;
}
svg { display: block; flex: none; }
button, input { font: inherit; }
 
/* =====================================================================
   2) APP BAR
   ===================================================================== */
.appbar {
  height: var(--bar-h); flex: none; display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(16px, 1.4vw, 32px); background: var(--red); border-bottom: 3px solid var(--gold); color: #FFFFFF;
}
.appbar .left, .appbar .right { display: flex; align-items: center; gap: clamp(14px, 1.1vw, 26px); }
.icon-btn { all: unset; cursor: pointer; width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; color: #FFFFFF; }
.icon-btn:hover { background: rgba(255,255,255,.12); }
.icon-btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
/* Yahan brand team ki official Wells Fargo logo file lagao */
.wf-logo { font-family: var(--serif); font-weight: 700; font-size: clamp(18px, 1.35vw, 28px); letter-spacing: .06em; color: #FFFFFF; white-space: nowrap; }
.divider { width: 1px; height: clamp(24px, 1.8vw, 38px); background: rgba(255,213,107,.75); }
.lockup { display: flex; align-items: center; gap: 12px; color: #FFFFFF; text-decoration: none; }
.lockup .tile { width: clamp(36px, 2.4vw, 52px); height: clamp(36px, 2.4vw, 52px); border-radius: 28%; background: #FFFFFF; display: grid; place-items: center; box-shadow: 0 4px 10px rgba(80,0,0,.22); }
.lockup .tile svg { width: 72%; height: 72%; }
.lockup .top { font-size: clamp(9.5px, .62vw, 13px); font-weight: 700; letter-spacing: .28em; color: var(--gold); line-height: 1; }
.lockup .name { font-family: var(--serif); font-size: clamp(17px, 1.2vw, 26px); color: #FFFFFF; line-height: 1.1; margin-top: 3px; white-space: nowrap; }
.user { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: clamp(13px, .8vw, 16px); }
.avatar { width: clamp(30px, 2vw, 42px); height: clamp(30px, 2vw, 42px); border-radius: 50%; background: #FFFFFF; color: var(--red-strong); display: grid; place-items: center; font-weight: 700; }
 
/* =====================================================================
   3) SIDEBAR
   ===================================================================== */
.layout { flex: 1; display: flex; min-height: 0; }
.sidebar {
  width: var(--side-w); flex: none; display: flex; flex-direction: column;
  padding: clamp(16px, 1.1vw, 26px) clamp(12px, .8vw, 18px); background: linear-gradient(180deg, #B5141E 0%, #A3121B 100%);
}
.nav-label { font-size: clamp(10px, .6vw, 12.5px); font-weight: 700; letter-spacing: .14em; color: #FFD56B; padding: 0 12px; margin: 4px 0 8px; }
.nav-gap { height: clamp(12px, .9vw, 20px); }
.nav-item {
  all: unset; cursor: pointer; display: flex; align-items: center; gap: 12px; height: clamp(40px, 2.5vw, 52px);
  padding: 0 12px; border-radius: 11px; margin-bottom: 2px; color: rgba(255,255,255,.92); font-size: clamp(13px, .82vw, 16.5px);
  transition: background .15s ease;
}
.nav-item svg { width: clamp(18px, 1.1vw, 22px); height: clamp(18px, 1.1vw, 22px); }
.nav-item:hover { background: rgba(255,255,255,.10); }
.nav-item:focus-visible { outline: 2px solid var(--gold); outline-offset: 1px; }
.nav-item[aria-current="page"] { background: #FFFFFF; color: var(--red-dark); font-weight: 600; box-shadow: 0 6px 14px rgba(60,0,0,.18); }
.sidebar-foot { margin-top: auto; display: flex; flex-direction: column; gap: 8px; }
.connected { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; background: rgba(0,0,0,.14); }
.connected .dot { width: 30px; height: 30px; border-radius: 50%; background: #FFFFFF; color: var(--red-dark); font-weight: 700; font-size: 12px; display: grid; place-items: center; position: relative; }
.connected .dot::after { content: ""; position: absolute; right: -1px; bottom: -1px; width: 9px; height: 9px; border-radius: 50%; background: #6BC04B; border: 2px solid #A3121B; }
.connected b { display: block; font-size: 12.5px; color: #FFFFFF; }
.connected small { display: block; font-size: 11px; color: rgba(255,255,255,.72); }
 
/* =====================================================================
   4) MAIN — ek hi column, sab uske andar, taaki sab ek rekha pe ho
   ===================================================================== */
.main {
  flex: 1; min-width: 0; display: flex; flex-direction: column; overflow-y: auto;
  position: relative; isolation: isolate;
  background: linear-gradient(180deg, #FCFBF9 0%, #F6F3EF 100%);
}
/* HD layer 1: 1px dot grid, beech mein saaf, kinaron pe gayab */
.main::before {
  content: ""; position: absolute; inset: 0; z-index: -2; pointer-events: none;
  background-image: radial-gradient(rgba(47,40,38,.16) 1px, transparent 1.2px);
  background-size: 22px 22px; background-position: center;
  -webkit-mask-image: radial-gradient(70% 60% at 50% 42%, #000 0%, rgba(0,0,0,.55) 45%, transparent 85%);
          mask-image: radial-gradient(70% 60% at 50% 42%, #000 0%, rgba(0,0,0,.55) 45%, transparent 85%);
}
/* HD layer 2: chalta hua vector field (canvas, devicePixelRatio pe tez) */
#field { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; pointer-events: none; }
.page-head { padding: clamp(14px, 1vw, 24px) clamp(24px, 1.8vw, 40px) 0; }
.page-head h2 { font-size: clamp(17px, 1.05vw, 22px); font-weight: 700; color: var(--ink); }
.page-head p { font-size: clamp(12px, .72vw, 14.5px); color: var(--muted); margin-top: 2px; }
 
.column { width: min(var(--col-w), calc(100% - 48px)); margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.hero { flex: 1; display: flex; align-items: center; padding: clamp(20px, 2vw, 48px) 0; }
 
.mark {
  width: clamp(56px, 3.6vw, 80px); height: clamp(56px, 3.6vw, 80px); border-radius: 28%; background: #FFFFFF;
  display: grid; place-items: center; position: relative;
  box-shadow: inset 0 1px 0 #FFFFFF, 0 0 0 1px rgba(47,40,38,.08), 0 1px 2px rgba(47,40,38,.06), 0 12px 32px -8px rgba(47,40,38,.18);
}
.mark svg { width: 62%; height: 62%; }
.mark::after { content: ""; position: absolute; inset: -7px; border-radius: 32%; border: 1px solid rgba(200,32,42,.28); animation: ring 2.6s ease-in-out infinite; }
@keyframes ring { 50% { inset: -14px; opacity: 0; } }
 
h1 { font-family: var(--serif); font-weight: 400; font-size: var(--h1); line-height: 1.12; letter-spacing: -.01em; color: var(--ink); text-align: center; margin-top: clamp(18px, 1.4vw, 30px); }
h1 { letter-spacing: -.02em; }
h1 span { color: #A6141C; background: linear-gradient(135deg, #D71E28 0%, #8F0F17 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-style: italic; padding-right: .04em; }
.subtitle { font-size: clamp(14px, .95vw, 19px); line-height: 1.5; color: var(--muted); text-align: center; margin-top: 10px; max-width: 46ch; }
 
.cards { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px, .8vw, 18px); margin-top: clamp(24px, 2vw, 42px); }
.card {
  all: unset; cursor: pointer; background: var(--surface); border-radius: clamp(14px, 1vw, 20px);
  padding: clamp(14px, 1.05vw, 22px); display: grid; grid-template-columns: auto 1fr 18px; gap: clamp(12px, .9vw, 18px); align-items: center;
  position: relative; background: rgba(255,255,255,.86); -webkit-backdrop-filter: blur(10px) saturate(140%); backdrop-filter: blur(10px) saturate(140%);
  box-shadow: inset 0 1px 0 #FFFFFF, 0 0 0 1px rgba(47,40,38,.07), 0 1px 2px rgba(47,40,38,.05), 0 8px 24px -10px rgba(47,40,38,.14);
  transition: transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .22s ease;
}
.card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; opacity: 0; transition: opacity .22s ease;
  background: linear-gradient(135deg, #D71E28, rgba(215,30,40,.15) 45%, rgba(232,180,37,.6));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
.card:hover { transform: translateY(-3px); box-shadow: inset 0 1px 0 #FFFFFF, 0 0 0 1px rgba(47,40,38,.04), 0 2px 4px rgba(47,40,38,.05), 0 22px 40px -14px rgba(47,40,38,.22); }
.card:hover::after { opacity: 1; }
.card:focus-visible, .card[aria-pressed="true"] { box-shadow: inset 0 1px 0 #FFFFFF, 0 0 0 2px #D71E28, 0 22px 40px -14px rgba(215,30,40,.25); }
.card .icon { width: clamp(40px, 2.6vw, 54px); height: clamp(40px, 2.6vw, 54px); border-radius: 30%; display: grid; place-items: center; }
.card .icon svg { width: 50%; height: 50%; }
.card .title { font-size: clamp(14px, .92vw, 18px); font-weight: 600; color: var(--ink); line-height: 1.3; }
.card .desc { font-size: clamp(12.5px, .8vw, 15.5px); color: var(--muted); line-height: 1.4; margin-top: 3px; }
.card .arrow { opacity: 0; transition: opacity .18s ease; color: var(--red-dark); }
.card:hover .arrow, .card[aria-pressed="true"] .arrow { opacity: 1; }
 
.composer-wrap { padding: 0 0 clamp(18px, 1.6vw, 34px); }
.composer {
  width: 100%; height: clamp(56px, 3.6vw, 74px); background: #FFFFFF; border-radius: clamp(16px, 1.1vw, 22px);
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 0 8px 0 18px;
  background: rgba(255,255,255,.9); -webkit-backdrop-filter: blur(14px) saturate(150%); backdrop-filter: blur(14px) saturate(150%);
  box-shadow: inset 0 1px 0 #FFFFFF, 0 0 0 1px rgba(47,40,38,.08), 0 2px 4px rgba(47,40,38,.04), 0 18px 40px -16px rgba(47,40,38,.25); transition: box-shadow .15s ease;
}
.composer:focus-within { box-shadow: inset 0 1px 0 #FFFFFF, 0 0 0 2px #D71E28, 0 18px 40px -16px rgba(215,30,40,.25); }
.composer input { all: unset; width: 100%; height: 100%; font-size: clamp(14.5px, .95vw, 18px); color: var(--ink); -webkit-text-fill-color: var(--ink); }
.composer input::placeholder { color: var(--faint); -webkit-text-fill-color: var(--faint); }
.send {
  all: unset; cursor: pointer; width: clamp(40px, 2.6vw, 54px); height: clamp(40px, 2.6vw, 54px); border-radius: 30%;
  background: var(--red-strong); display: grid; place-items: center; box-shadow: 0 6px 14px rgba(215,30,40,.25); transition: transform .15s ease, background .15s ease;
}
.send { background: linear-gradient(160deg, #E0303A 0%, #B3121B 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 6px 14px -4px rgba(215,30,40,.5); }
.send:hover { transform: translateY(-2px); background: linear-gradient(160deg, #D71E28 0%, #A3121B 100%); }
.send:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.send:disabled { background: #E5DDD2; box-shadow: none; cursor: not-allowed; transform: none; }
.hint { font-size: clamp(11.5px, .7vw, 14px); color: #9C9289; text-align: center; margin-top: 8px; }
.kbd { display: inline-block; font-size: .9em; background: #FFFFFF; border-radius: 5px; padding: 0 6px; box-shadow: 0 1px 0 rgba(60,30,10,.15); color: #5A504A; }
 
/* Patli screens: sidebar sirf icons, cards ek ke neeche ek */
@media (max-width: 900px) {
  .sidebar { width: 64px; padding: 14px 8px; }
  .nav-item span, .nav-label, .connected div { display: none; }
  .nav-item { justify-content: center; padding: 0; }
  .connected { justify-content: center; background: none; }
  .wf-logo, .divider { display: none; }
  .cards { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { .mark::after, .card, .send { animation: none; transition: none; } }
</style>
</head>
<body>
 
<header class="appbar">
  <div class="left">
    <button class="icon-btn" aria-label="Menu" data-icon="menu"></button>
    <span class="wf-logo" title="Replace with the official Wells Fargo logo file">WELLS FARGO</span>
    <span class="divider" aria-hidden="true"></span>
    <a class="lockup" href="#/home" aria-label="WIMT Evaluation Studio home">
      <span class="tile" data-mark="red"></span>
      <span><span class="top" style="display:block">WIMT</span><span class="name">Evaluation Studio</span></span>
    </a>
  </div>
  <div class="right">
    <button class="icon-btn" aria-label="Evaluation" data-icon="eval"></button>
    <button class="icon-btn" aria-label="Data and traces" data-icon="db"></button>
    <button class="icon-btn" aria-label="Settings" data-icon="gear"></button>
    <span class="user">Rahul <span class="avatar" aria-hidden="true">R</span></span>
  </div>
</header>
 
<div class="layout">
  <nav class="sidebar" aria-label="Main">
    <div class="nav-label">WORKSPACE</div>
    <a class="nav-item" href="#/home" aria-current="page" data-icon="grid"><span>Home</span></a>
    <a class="nav-item" href="#/evaluate" data-icon="eval"><span>Evaluation</span></a>
    <a class="nav-item" href="#/playground" data-icon="play"><span>Model Playground</span></a>
    <div class="nav-gap"></div>
    <div class="nav-label">LIBRARY</div>
    <a class="nav-item" href="#/prompts" data-icon="doc"><span>Prompt Hub</span></a>
    <a class="nav-item" href="#/golden" data-icon="table"><span>Golden Dataset</span></a>
    <a class="nav-item" href="#/traces" data-icon="db"><span>Data &amp; Traces</span></a>
    <div class="sidebar-foot">
      <a class="nav-item" href="#/settings" data-icon="gear"><span>Settings</span></a>
      <div class="connected"><span class="dot">S</span><div><b>Connected</b><small>Tachyon Overwatch</small></div></div>
    </div>
  </nav>
 
  <main class="main">
    <canvas id="field" aria-hidden="true"></canvas>
    <div class="page-head"><h2>Home</h2><p>Describe a check and the assistant drafts the evaluator</p></div>
 
    <section class="hero"><div class="column">
      <div class="mark" data-mark="red" aria-hidden="true"></div>
      <h1>What should we <span>evaluate</span>?</h1>
      <p class="subtitle">Describe a quality check. The assistant drafts an evaluator you can refine, save and run.</p>
      <div class="cards" id="cards" role="list"></div>
    </div></section>
 
    <div class="composer-wrap"><div class="column">
      <form class="composer" id="composer">
        <span data-icon="spark" style="color:#D71E28" aria-hidden="true"></span>
        <input id="prompt" aria-label="Describe a quality check" autocomplete="off" />
        <button class="send" id="send" type="submit" aria-label="Draft evaluator" data-icon="up" disabled></button>
      </form>
      <p class="hint">Press <span class="kbd">Enter</span> to draft · or pick a card</p>
    </div></div>
  </main>
</div>
 
<script>
(function () {
  "use strict";
 
  /* ---------- Icons: inline SVG, kyunki icon CDN bank network pe block hota hai ---------- */
  const P = {
    menu: "M4 6h16M4 12h16M4 18h16",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    eval: "M4 6a2 2 0 1 0 4 0a2 2 0 1 0-4 0M16 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0M11 6h5a2 2 0 0 1 2 2v8M13 18H8a2 2 0 0 1-2-2V8",
    play: "M11 16h10M11 16l4 4M11 16l4-4M13 8H3M13 8l-4 4M13 8L9 4",
    doc: "M14 3v4a1 1 0 0 0 1 1h4M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2zM9 13h6M9 17h6",
    table: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M10 3v18",
    db: "M4 6a8 3 0 1 0 16 0a8 3 0 1 0-16 0M4 6v6a8 3 0 0 0 16 0V6M4 12v6a8 3 0 0 0 16 0v-6",
    gear: "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
    spark: "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z",
    up: "M12 19V5M5 12l7-7 7 7",
    arrow: "M5 12h14M13 18l6-6M13 6l6 6",
    question: "M8 9h8M8 13h5M12 21l-3-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-3z",
    search: "M14 3v4a1 1 0 0 0 1 1h4M12 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v4.5M16.5 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M20.2 19.2L22 21",
    smile: "M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0",
    shield: "M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21 12 12 0 0 1 3.5 6 12 12 0 0 0 12 3M10 12h4v4h-4zM11 12v-1.5a1 1 0 0 1 2 0V12"
  };
  const icon = (name, color, size, sw) =>
    `<svg width="${size || 20}" height="${size || 20}" viewBox="0 0 24 24" fill="none" stroke="${color || "currentColor"}" stroke-width="${sw || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[name]}"/></svg>`;
 
  /* ---------- The Angle mark (brand kit: mark-red.svg) ---------- */
  const ANGLE = `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M7 33L33 27" stroke="#E8B425" stroke-width="4.2" stroke-linecap="round"/>
    <path d="M7 33L24 9" stroke="#C8202A" stroke-width="4.2" stroke-linecap="round"/>
    <path d="M17.3 30.6A11 11 0 0 0 13.2 24" fill="none" stroke="#C8202A" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
    <circle cx="33" cy="27" r="3.6" fill="#E8B425"/><circle cx="24" cy="9" r="3.6" fill="#C8202A"/><circle cx="7" cy="33" r="3" fill="#C8202A"/></svg>`;
  document.querySelectorAll("[data-mark]").forEach((el) => (el.innerHTML = ANGLE));
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.dataset.icon;
    const isNav = el.classList.contains("nav-item");
    const color = name === "up" ? "#FFFFFF" : null;
    el.insertAdjacentHTML("afterbegin", icon(name, color, name === "up" ? 20 : isNav ? null : 20, name === "up" ? 2.4 : 2));
  });
 
  /* ---------- Starter cards ---------- */
  const CARDS = [
    { icon: "question", bg: "#FDF0F0", fg: "#D71E28", title: "Answers the question", desc: "Does the response address what the user asked?" },
    { icon: "search",   bg: "#FFF7DD", fg: "#7A5600", title: "Grounded in context",  desc: "Are claims supported by the retrieved context?" },
    { icon: "smile",    bg: "#EEF5E8", fg: "#4E8A2E", title: "Professional tone",    desc: "Is the reply courteous and on-brand?" },
    { icon: "shield",   bg: "#F1ECE5", fg: "#3B3331", title: "Sensitive data leaks", desc: "Does the reply expose account numbers or PII?" }
  ];
  const cards = document.getElementById("cards");
  const input = document.getElementById("prompt");
  const send = document.getElementById("send");
  cards.innerHTML = CARDS.map((c, i) => `
    <button class="card" type="button" role="listitem" aria-pressed="false" data-i="${i}">
      <span class="icon" style="background:${c.bg}">${icon(c.icon, c.fg)}</span>
      <span><span class="title" style="display:block">${c.title}</span><span class="desc" style="display:block">${c.desc}</span></span>
      <span class="arrow">${icon("arrow", null, 18)}</span>
    </button>`).join("");
  cards.addEventListener("click", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    cards.querySelectorAll(".card").forEach((c) => c.setAttribute("aria-pressed", String(c === card)));
    input.value = CARDS[+card.dataset.i].desc;
    send.disabled = false;
    input.focus();
  });
 
  /* ---------- Composer ---------- */
  input.addEventListener("input", () => { send.disabled = !input.value.trim(); });
  document.getElementById("composer").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim(); if (!text) return;
    // Asli app: Evaluator Builder kholo is text ke saath
    document.dispatchEvent(new CustomEvent("home:draft", { detail: { text } }));
    console.log("draft evaluator:", text);
  });
 
  // Placeholder har 3 second mein ek wealth example dikhata hai
  const EXAMPLES = [
    "Ask the assistant to build an evaluator…",
    "e.g. Flag answers that give a wire cutoff not in the policy",
    "e.g. Fail any reply that recommends buying a fund",
    "e.g. Check the answer names the right workflow"
  ];
  let k = 0; input.placeholder = EXAMPLES[0];
  setInterval(() => {
    if (document.activeElement !== input && !input.value) { k = (k + 1) % EXAMPLES.length; input.placeholder = EXAMPLES[k]; }
  }, 3000);
 
  /* ---------- HD vector field: "meaning space" jo The Angle logo se aata hai ----------
     Har line ek answer-vector hai, ek hi origin se. Bahut halka, bahut dheema,
     aur devicePixelRatio pe bana, isliye 4K pe bhi 1px jitna tez. */
  (function field() {
    const cv = document.getElementById("field"), main = cv.parentElement, ctx = cv.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, t = 0, mx = 0, my = 0, tx = 0, ty = 0;
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const V = Array.from({ length: 64 }, (_, i) => {
      const th = Math.acos(1 - 2 * rnd()), ph = rnd() * Math.PI * 2, r = .55 + rnd() * .45;
      return { v: [Math.sin(th) * Math.cos(ph) * r, Math.cos(th) * r, Math.sin(th) * Math.sin(ph) * r], gold: i % 9 === 0, red: i % 13 === 0 };
    });
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      const r = main.getBoundingClientRect(); W = r.width; H = main.scrollHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function proj(v, ry, rx) {
      let x = v[0] * Math.cos(ry) + v[2] * Math.sin(ry), z = -v[0] * Math.sin(ry) + v[2] * Math.cos(ry);
      let y = v[1] * Math.cos(rx) - z * Math.sin(rx); z = v[1] * Math.sin(rx) + z * Math.cos(rx);
      const f = 3 / (3 + z), S = Math.min(W, H) * .46;
      return [W / 2 + x * S * f, H * .4 - y * S * f, z, f];
    }
    function draw() {
      tx += (mx - tx) * .04; ty += (my - ty) * .04;
      const ry = t * .00012 + tx * .25, rx = -.35 + ty * .15;
      ctx.clearRect(0, 0, W, H);
      const o = proj([0, 0, 0], ry, rx);
      // halki orbit rings
      ctx.lineWidth = 1;
      [1, .66].forEach((r, k) => {
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2, p = proj([Math.cos(a) * r, 0, Math.sin(a) * r], ry, rx); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = `rgba(47,40,38,${k ? .05 : .07})`; ctx.stroke();
      });
      V.map((d) => ({ d, p: proj(d.v, ry, rx) })).sort((a, b) => b.p[2] - a.p[2]).forEach(({ d, p }) => {
        const depth = Math.max(.15, Math.min(1, (1.6 - p[2]) / 2));
        const col = d.red ? "200,32,42" : d.gold ? "200,150,30" : "47,40,38";
        const g = ctx.createLinearGradient(o[0], o[1], p[0], p[1]);
        g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${(d.red || d.gold ? .32 : .14) * depth})`);
        ctx.strokeStyle = g; ctx.lineWidth = d.red || d.gold ? 1.25 : .75;
        ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
        ctx.fillStyle = `rgba(${col},${(d.red || d.gold ? .55 : .22) * depth})`;
        ctx.beginPath(); ctx.arc(p[0], p[1], (d.red || d.gold ? 2.6 : 1.6) * p[3], 0, Math.PI * 2); ctx.fill();
      });
      if (!reduce) { t += 16; requestAnimationFrame(draw); }
    }
    main.addEventListener("pointermove", (e) => { const r = main.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
    new ResizeObserver(() => { size(); if (reduce) draw(); }).observe(main);
    size(); draw();
  })();
})();
</script>
</body>
</html>
 

