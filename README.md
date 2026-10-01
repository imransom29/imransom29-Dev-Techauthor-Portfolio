
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WIMT Evaluation Studio · Model Playground</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
<style>
/* =====================================================================
   1) DESIGN TOKENS — Wells Fargo theme. Rang badalne hon to sirf yahan.
   ===================================================================== */
:root {
  --wf-red: #D71E28;   --wf-red-dark: #A6141C;  --wf-red-tint: #FDF0F0;
  --wf-gold: #FFCD41;  --wf-gold-text: #7A5600; --wf-gold-tint: #FFF7DD;
  --wf-cream: #FAF7F2; --wf-page: #F3EEE7;
  --wf-line: #E2DACF;  --wf-line-dark: #B9AD9F; --wf-grid: #D9D0C4;
  --wf-ink: #3B3331;   --wf-muted: #7D736A;
  --wf-ok: #5E9E3A;    --wf-warn: #E8A317;

  --font-sans: "Wells Fargo Sans", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
  --font-serif: "Wells Fargo Serif", Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--wf-ink);
  background: var(--wf-page);
  -webkit-font-smoothing: antialiased;
}
button { font-family: inherit; cursor: pointer; }
.serif { font-family: var(--font-serif); }
.muted { color: var(--wf-muted); }

/* =====================================================================
   2) APP SHELL — top bar + page
   ===================================================================== */
.appbar {
  height: 56px;
  background: var(--wf-red);
  border-bottom: 3px solid var(--wf-gold);   /* Wells Fargo red + gold motif */
  color: #fff;
  display: flex; align-items: center; gap: 28px;
  padding: 0 24px;
}
.appbar .brand { font-family: var(--font-serif); font-size: 20px; font-weight: 700; letter-spacing: 1px; }
.appbar .title { font-size: 17px; font-weight: 600; }

.page { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; height: calc(100vh - 59px); }

.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex: none; }
.page-head h1 { margin: 0; font-family: var(--font-serif); font-weight: 400; font-size: 24px; }

.setup { display: flex; gap: 10px; flex: none; }
.setup-btn {
  height: 40px; padding: 0 14px;
  border: 1px solid var(--wf-line-dark); border-radius: 10px;
  background: #fff; color: var(--wf-ink); font-size: 13px;
  display: inline-flex; align-items: center; gap: 8px;
}
.setup-btn .k { color: var(--wf-muted); font-size: 11.5px; }
.btn-primary {
  height: 40px; padding: 0 18px; border: none; border-radius: 10px;
  background: var(--wf-red); color: #fff; font-weight: 600; font-size: 13px;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn-primary:disabled { background: #ECE5DB; color: var(--wf-muted); cursor: not-allowed; }

/* =====================================================================
   3) A/B REVIEW CARD + TABLE
   ===================================================================== */
.ab-card {
  background: #fff;
  border: 1px solid var(--wf-line);
  border-radius: 14px;
  display: flex; flex-direction: column;
  min-height: 0; max-height: 100%;          /* card screen se bada nahi hoga */
  overflow: hidden;
}
.ab-card .band { height: 4px; background: var(--wf-red); box-shadow: 0 2px 0 var(--wf-gold); flex: none; }

.ab-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 12px; flex: none; }
.ab-toolbar h2 { margin: 0; font-family: var(--font-serif); font-weight: 400; font-size: 19px; }

.tabs { display: flex; gap: 22px; margin-left: 22px; }
.tabs button {
  border: none; background: none; padding: 4px 0;
  font-size: 13px; color: var(--wf-muted);
  border-bottom: 2px solid transparent;
}
.tabs button .count {
  margin-left: 5px; font-size: 11px; border-radius: 999px; padding: 1px 7px;
  background: #F1ECE5; color: var(--wf-muted);
}
.tabs button.active { color: var(--wf-red-dark); font-weight: 600; border-bottom-color: var(--wf-red); }
.tabs button.active .count { background: var(--wf-red); color: #fff; }

.search-box {
  display: flex; align-items: center; gap: 8px;
  height: 34px; width: 220px; padding: 0 12px;
  border: 1px solid var(--wf-line-dark); border-radius: 9px;
  background: #FFFFFF;
}
.search-box input {
  all: unset; flex: 1;
  font-family: inherit; font-size: 12.5px;
  color: var(--wf-ink); background: #FFFFFF;   /* dark mode mein bhi white rahe */
}
.search-box input::placeholder { color: #A39A90; }

/* Scoreboard */
.board {
  margin: 0 20px 12px; padding: 10px 16px 10px 20px;
  border: 1px solid var(--wf-line); border-radius: 12px; background: var(--wf-cream);
  display: flex; align-items: center; gap: 18px; position: relative; overflow: hidden; flex: none;
}
.board::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--wf-red); box-shadow: 3px 0 0 var(--wf-gold); }
.mono { width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex: none; }
.mono.a { background: var(--wf-red); color: #fff; }
.mono.b { background: var(--wf-gold); color: var(--wf-ink); }
.board .score { font-family: var(--font-serif); font-size: 28px; font-weight: 700; }
.tug { flex: 1; height: 10px; border-radius: 999px; background: #EAE3D9; overflow: hidden; display: flex; }
.tug .a, .tug .b { width: 0; transition: width 1s cubic-bezier(.2,.8,.2,1); }
.tug .a { background: var(--wf-red); }
.tug .b { background: var(--wf-gold); margin-left: auto; }

/* Table box: content jitna, zyada ho to andar scroll */
.table-box {
  margin: 0 20px;
  flex: 0 1 auto;          /* 0 = khud nahi badhegi, 1 = zaroorat pe sikudegi */
  min-height: 0;           /* iske bina andar scroll nahi aata */
  overflow: auto;
  border: 1px solid var(--wf-line-dark);
  border-radius: 12px;
}
.ab-table { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; }
.ab-table th, .ab-table td { border-right: 1px solid var(--wf-grid); border-bottom: 1px solid var(--wf-grid); }
.ab-table th:last-child, .ab-table td:last-child { border-right: none; }
.ab-table tbody tr:last-child td { border-bottom: none; }

.ab-table thead th {
  position: sticky; top: 0; z-index: 2;
  background: var(--wf-red); color: #fff;
  border-right-color: rgba(255,255,255,.25);
  border-bottom: 3px solid var(--wf-gold);
  padding: 10px 12px; text-align: left;
  font-size: 11px; font-weight: 600; letter-spacing: .3px; white-space: nowrap;
}
.ab-table thead th.center { text-align: center; }
.col-head { display: flex; align-items: center; gap: 8px; }
.col-head .mono { width: 24px; height: 24px; font-size: 12px; }
.col-head .mono.a { background: #fff; color: var(--wf-red); }
.col-head .name { font-size: 12.5px; font-weight: 600; }

.ab-table td { padding: 12px; vertical-align: top; line-height: 1.5; font-size: 12.5px; }
.ab-table tbody tr.row { cursor: pointer; }
.ab-table tbody tr.row:nth-child(4n+3) td { background: #FDFBF8; }   /* halka zebra */
.ab-table tbody tr.row:hover td { background: #FFF9F3; }
.ab-table tbody tr.row:hover .row-actions { opacity: 1; }

td.win-a { background: var(--wf-red-tint) !important; box-shadow: inset 0 3px 0 var(--wf-red); }
td.win-b { background: var(--wf-gold-tint) !important; box-shadow: inset 0 3px 0 var(--wf-gold); }
td.lose .answer { color: #9A9088; }

.cat { font-size: 10px; font-weight: 600; color: var(--wf-red-dark); background: var(--wf-red-tint); border-radius: 4px; padding: 1px 6px; margin-right: 6px; }
.qid { font-size: 10px; color: var(--wf-muted); font-family: var(--font-mono); }
.prompt { font-weight: 600; line-height: 1.4; margin-top: 5px; }
.row-actions { display: flex; gap: 10px; margin-top: 8px; color: var(--wf-muted); font-size: 15px; opacity: 0; transition: opacity .2s; }

.ans-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.status { font-size: 10.5px; padding: 0 7px; border-radius: 999px; border: 1px solid var(--wf-line-dark); color: var(--wf-muted); background: #fff; line-height: 18px; }
.status.pass { border-color: var(--wf-ink); color: var(--wf-ink); font-weight: 600; }
.status.na { border-color: var(--wf-red); color: var(--wf-red-dark); }
.winner-tag { font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 4px; margin-left: 6px; }
.winner-tag.a { background: var(--wf-red); color: #fff; }
.winner-tag.b { background: var(--wf-gold); color: var(--wf-ink); }
.ring { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 12px; }
.answer { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
tr.open .answer { -webkit-line-clamp: unset; }

mark.only-a { background: #F9D3D5; color: #7A0F14; border-radius: 2px; padding: 0 1px; }
mark.only-b { background: #FFE89A; color: #5A4000; border-radius: 2px; padding: 0 1px; }

.delta { font-family: var(--font-serif); font-weight: 700; font-size: 17px; text-align: center; }
.gauge { position: relative; height: 10px; background: #EFE9E0; border-radius: 999px; margin: 8px 0 4px; overflow: hidden; }
.gauge::after { content: ""; position: absolute; left: 50%; top: 0; width: 1px; height: 100%; background: var(--wf-line-dark); }
.gauge .fill { position: absolute; top: 0; height: 100%; width: 0; transition: width .9s cubic-bezier(.2,.8,.2,1); }
.gauge-labels { display: flex; justify-content: space-between; font-size: 9.5px; color: var(--wf-muted); }

/* Judge: seedha, simple badge (koi tilt nahi) */
.judge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 11.5px; }
.judge.a { background: var(--wf-red); color: #fff; }
.judge.b { background: var(--wf-gold); color: var(--wf-ink); }
.judge.x { background: #fff; color: var(--wf-red-dark); border: 1px solid var(--wf-red); }
.conf { font-size: 10.5px; color: var(--wf-muted); margin-top: 8px; }
.conf-bar { height: 4px; border-radius: 2px; background: #EAE3D9; margin-top: 3px; overflow: hidden; }

tr.reason td { background: #FFF9F3; padding-top: 4px; font-size: 12px; }
.why { border-left: 3px solid; padding: 4px 8px; }

.ab-foot { display: flex; justify-content: space-between; padding: 12px 20px 14px; font-size: 11.5px; color: var(--wf-muted); flex: none; }

/* =====================================================================
   4) DRAWERS (side panels) — dono drawers yahi styles share karte hain
   ===================================================================== */
.scrim {
  position: fixed; inset: 59px 0 0 0; z-index: 20;
  background: rgba(59,51,49,.38);
  opacity: 0; pointer-events: none; transition: opacity .25s;
}
.scrim.show { opacity: 1; pointer-events: auto; }

.drawer {
  position: fixed; top: 59px; right: 0; bottom: 0; z-index: 21;
  width: min(540px, 100vw);
  background: #fff;
  box-shadow: -18px 0 40px rgba(40,20,10,.22);
  display: flex; flex-direction: column;
  transform: translateX(100%);              /* band: screen ke bahar */
  transition: transform .4s cubic-bezier(.2,.8,.2,1);
}
.drawer.open { transform: translateX(0); }  /* khula: slide hoke andar */
.drawer .band { height: 4px; background: var(--wf-red); box-shadow: 0 2px 0 var(--wf-gold); flex: none; }
.drawer-head { padding: 24px 28px 18px; border-bottom: 1px solid var(--wf-line); flex: none; }
.drawer-head .row1 { display: flex; justify-content: space-between; align-items: flex-start; }
.drawer-head h3 { margin: 0; font-family: var(--font-serif); font-weight: 400; font-size: 22px; }
.drawer-head p { margin: 4px 0 0; color: var(--wf-muted); }
.icon-btn { border: none; background: none; font-size: 18px; color: var(--wf-muted); padding: 2px; }
.drawer-body { flex: 1; overflow: auto; padding: 8px 28px 24px; }
.drawer-foot {
  border-top: 1px solid var(--wf-line); background: var(--wf-cream);
  padding: 16px 28px; flex: none;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.link-btn { border: none; background: none; color: var(--wf-muted); font-size: 12.5px; }

/* ---------- Model drawer ---------- */
.slots { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 20px; }
.slot {
  height: 60px; border: 1.5px dashed var(--wf-line-dark); border-radius: 12px; background: var(--wf-cream);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  font-size: 10.5px; color: var(--wf-muted); position: relative;
}
.slot.filled { border-style: solid; background: #fff; cursor: grab; }
.slot.drag-over { box-shadow: 0 0 0 2px var(--wf-gold); }
.slot .letter { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; }
.slot .letter.empty { border: 1.5px dashed var(--wf-line-dark); color: var(--wf-line-dark); }
.slot .name { max-width: 80px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--wf-ink); font-weight: 600; }
.slot .remove { position: absolute; top: 3px; right: 6px; border: none; background: none; font-size: 11px; color: var(--wf-muted); display: none; }
.slot.filled:hover .remove { display: block; }

.search-row { display: flex; gap: 10px; margin-top: 18px; }
.search-row .search-box { flex: 1; width: auto; height: 40px; }
.dropdown { position: relative; }
.dropdown-menu {
  position: absolute; right: 0; top: 46px; width: 230px; z-index: 5;
  background: #fff; border: 1px solid var(--wf-line); border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0,0,0,.14); padding: 6px; display: none;
}
.dropdown-menu.show { display: block; }
.dropdown-menu button {
  width: 100%; border: none; background: none; text-align: left;
  padding: 9px 10px; border-radius: 7px; font-size: 12.5px; color: var(--wf-ink);
  display: flex; gap: 8px; align-items: center;
}
.dropdown-menu button:hover { background: var(--wf-red-tint); color: var(--wf-red-dark); }

.provider-head { display: flex; align-items: center; justify-content: space-between; margin: 22px 0 12px; }
.provider-head .pname { display: flex; align-items: center; font-weight: 600; font-size: 14px; }
.provider-logo {
  width: 26px; height: 26px; border-radius: 7px; margin-right: 10px; padding: 3px;
  background: #fff; border: 1px solid var(--wf-line);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 12px;
}
.provider-logo img { width: 100%; height: 100%; object-fit: contain; }

.model-card {
  display: grid; grid-template-columns: 24px 1fr auto; gap: 14px; align-items: center;
  width: 100%; text-align: left; font: inherit; color: inherit;
  padding: 14px 16px; margin-bottom: 10px;
  border: 1px solid var(--wf-line); border-radius: 12px; background: #fff;
  transition: border-color .18s, box-shadow .18s;
}
.model-card:hover { border-color: var(--wf-line-dark); box-shadow: 0 4px 12px rgba(0,0,0,.05); }
.model-card:disabled { opacity: .45; cursor: not-allowed; }
.check { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--wf-line-dark); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.model-name { font-weight: 600; font-size: 13.5px; display: flex; align-items: center; }
.model-id { font-family: var(--font-mono); font-size: 11px; color: var(--wf-muted); margin-top: 3px; }
.model-right { text-align: right; font-size: 11.5px; color: var(--wf-muted); line-height: 1.6; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-left: 8px; }
.tag { font-size: 9.5px; font-weight: 700; padding: 0 6px; border-radius: 4px; margin-left: 8px; line-height: 16px; }
.tag.base { background: var(--wf-ink); color: #fff; }
.tag.new { background: var(--wf-red-tint); color: var(--wf-red-dark); }
.matchup { font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }

/* ---------- Query drawer ---------- */
.step { margin-top: 22px; }
.step-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.step-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; background: var(--wf-cream); border: 1.5px solid var(--wf-line-dark); color: var(--wf-muted); flex: none; }
.step-num.current { background: var(--wf-red); border-color: var(--wf-red); color: #fff; }
.step-num.done { background: var(--wf-ink); border-color: var(--wf-ink); color: #fff; }
.step-title { font-weight: 600; font-size: 14px; }
.step-sub { font-size: 11.5px; color: var(--wf-muted); margin-left: auto; text-align: right; }

.sources { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.source { border: 1px solid var(--wf-line); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 6px; background: #fff; }
.source.active { border-color: var(--wf-red); box-shadow: 0 0 0 1px var(--wf-red); background: var(--wf-red-tint); }
.source.soon { background: var(--wf-cream); color: var(--wf-muted); }
.soon-badge { font-size: 9.5px; font-weight: 700; background: #ECE5DB; color: var(--wf-muted); border-radius: 4px; padding: 0 6px; line-height: 16px; align-self: flex-start; }

.field-label { font-size: 11.5px; color: var(--wf-muted); font-weight: 600; margin: 14px 0 8px; }
.projects { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.project {
  border: 1px solid var(--wf-line); border-radius: 12px; padding: 12px 14px; background: #fff;
  display: flex; align-items: center; gap: 10px; text-align: left; font: inherit; color: inherit;
}
.project .radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--wf-line-dark); flex: none; display: flex; align-items: center; justify-content: center; }
.project.active { border-color: var(--wf-red); box-shadow: 0 0 0 1px var(--wf-red); background: var(--wf-red-tint); }
.project.active .radio { border-color: var(--wf-red); }
.project.active .radio::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--wf-red); }

.chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { height: 32px; padding: 0 13px; border-radius: 9px; border: 1px solid var(--wf-line); font-size: 12.5px; background: #fff; color: var(--wf-ink); }
.chip.active { background: var(--wf-ink); border-color: var(--wf-ink); color: #fff; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 18px; }
.fetch-btn { margin-top: 18px; width: 100%; height: 42px; justify-content: center; }

.empty { border: 1.5px dashed var(--wf-line-dark); border-radius: 12px; padding: 28px 16px; text-align: center; color: var(--wf-muted); background: var(--wf-cream); }
.query-tools { display: flex; gap: 12px; align-items: center; margin-bottom: 10px; }
.query-tools .search-box { flex: 1; width: auto; height: 36px; }
.text-btn { border: none; background: none; font-size: 12px; font-weight: 600; color: var(--wf-red-dark); white-space: nowrap; padding: 0; }
.query-item {
  display: grid; grid-template-columns: 20px 1fr; gap: 12px; align-items: flex-start;
  width: 100%; text-align: left; font: inherit; color: inherit;
  padding: 12px 14px; margin-bottom: 8px; border: 1px solid var(--wf-line); border-radius: 10px; background: #fff;
}
.query-item.selected { border-color: var(--wf-red); background: var(--wf-red-tint); }
.checkbox { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--wf-line-dark); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; margin-top: 1px; }
.query-item.selected .checkbox { background: var(--wf-red); border-color: var(--wf-red); }
.query-meta { font-size: 10.5px; color: var(--wf-muted); margin-top: 3px;


cards should be come this way this decision you've toshow ..

Pehle ek zero se baat: model comparator ka asli kaam ek sawaal ka jawab dena hai, "kya hume model badalna chahiye, aur kitne bharose ke saath?" Isliye har field ko teen mein se kisi ek sawaal ka jawab dena chahiye: kaun behtar hai, kitna pakka hai, aur kis keemat pe. Neeche fields unhi groups mein hain. Jo ✅ hain wo aapke tool mein already hain, baaki naye hain.
1. Quality — answer kitna accha hai
✅ Judge score (0–1) aur Pass/Mixed verdict: base number, kyunki baaki sab isi se banta hai.
Dimension scores: Groundedness, Correctness, Completeness, Relevance, Clarity alag-alag. Kyunki 0.84 batata hai kitna accha, par ye batata hai kahan kamzor hai.
Hallucination spans: answer ka kaunsa hissa source se match nahi karta, highlighted. Isliye reviewer ko poora answer nahi padhna padta.
Citation accuracy (RAG answers ke liye): jo source quote kiya, kya usme sach mein wo baat hai.
Refusal / over-refusal flag: model ne bina wajah mana to nahi kiya. Kyunki bahut "safe" model advisor ke kaam ka nahi.
Format compliance: kya model ne instruction ka format follow kiya (JSON, length, tone).
2. Comparison — fark asli hai ya kismat
✅ Δ score, win/loss, win rate.
Tie ko alag count karo, kyunki "dono barabar" bhi ek important result hai.
Confidence interval (jaise "win rate 67%, range 52–80%"). Kyunki 4 queries pe 67% aur 400 queries pe 67% bilkul alag bharosa dete hain.
Statistical significance (paired bootstrap ya sign test): "ye fark kismat se aa sakta hai ya nahi".
Minimum sample size warning: 30 se kam scored pairs pe "Inconclusive" dikhao, winner nahi.
3. Judge ka bharosa — judge khud sahi hai?
✅ Judge rationale.
Judge model aur judge prompt ka version: kyunki judge badla to purane aur naye scores compare nahi ho sakte.
Judge confidence (jo table design mein tha).
Position bias check: A aur B ki jagah badal ke dobara judge karo. Agar verdict palat gaya, to wo row "unstable" hai.
Human agreement rate (Cohen's kappa): human reviewers judge se kitna agree karte hain. MRM validation mein ye sabse pehle poocha jayega.
Self-preference warning: agar judge aur candidate ek hi company ke models hain, to judge apne parivaar ke model ko favour kar sakta hai.
4. Safety aur compliance — bank ke liye zaroori
PII leakage: answer mein account number, SSN jaisi cheez to nahi aayi.
Prohibited phrases: "guaranteed returns", "risk-free" jaise shabd, kyunki financial advice regulations inhe mana karte hain.
Disclaimer / suitability language: jahan zaroori ho, wahan "consult your advisor" type line hai ya nahi.
Toxicity aur prompt-injection resistance.
Safety regression count: naya model kitni jagah baseline se zyada unsafe tha. Ye number zero se upar hua, to baaki kitna bhi accha ho, model block.
5. Cost
✅ Tokens in/out, cost per query, cost per scored win.
Projected monthly cost production volume pe (jaise "10 lakh queries/month pe $X"). Kyunki $0.0002 ka fark chhota lagta hai, par scale pe bada ho jaata hai.
Rate card version: kaunsi pricing se cost nikali, audit ke liye.
6. Speed aur reliability
✅ Avg latency, failed calls.
p50, p95, p99 latency: average chhupa leta hai ki 5% users ko 8 second wait karna pada.
Time to first token: streaming UI mein user ko yahi "speed" lagti hai.
Timeout, rate-limit aur retry counts.
Truncation count: kitne answers output limit pe kat gaye.
7. Consistency
Run-to-run variance: same query 3 baar chalao, score kitna hilta hai. Kyunki jo model kabhi 0.9 aur kabhi 0.5 de, wo production mein risky hai.
Paraphrase sensitivity: same sawaal alag shabdon mein, answer kitna badla.
8. Slicing — kahan jeeta, kahan haara
Category / intent (Retirement, Tax, Debt…), query length, project, time window.
Worst-category score: overall winner bhi kisi ek category mein bahut kharab ho sakta hai. Isliye har category ka alag win rate dikhao.
9. Audit / run metadata (MRM ke liye)
Run ID, timestamp, kisne chalaya, query source aur filters, query IDs, model IDs aur versions, temperature aur baaki params, system prompt version, judge version, rate card version, aur human overrides with notes. Kyunki 6 mahine baad koi poochega "ye decision kis data pe liya tha", to ye sab dobara banane layak hona chahiye.
Ye fields kaunse decisions banwa sakte hain
Promote: naya model production mein lao.
Keep baseline: purana hi rakho, naya behtar nahi nikla.
Cost-down swap: quality barabar hai par sasta hai, isliye switch karo.
Route by category: Tax ke sawaal Model A ko, Retirement ke Model B ko bhejo, kyunki dono alag jagah jeete.
Inconclusive, need more data: sample chhota hai ya CI bahut chauda hai.
Block: koi bhi safety regression mila.
Escalate to human / MRM review: judge unstable hai ya human agreement kam hai.
Fix prompt, not model: dono models ek hi jagah fail ho rahe hain, to problem prompt ya data mein hai.
Recalibrate judge: position bias ya human disagreement zyada hai.
Tool mein ek "Decision gate" card bana sakte ho jo ye rules khud check kare. Jaise Promote tabhi jab ye sab sach hon: scored pairs ≥ 100, win rate ki CI ka neecha sira 50% se upar, safety regressions = 0, p95 latency baseline se 20% se zyada kharab nahi, aur cost per query 10% se zyada nahi badhi. Ye thresholds sirf example hain. Asli numbers apni team aur MRM ke saath tay karna, kyunki inhi pe decision ki zimmedari hogi.
Inme se sabse pehle kya banana chahiye, uske liye mera sujhav ye hoga: confidence interval aur sample-size warning, kyunki abhi 4 queries pe "winner" dikhana sabse bada risk hai. Bolo to main Decision gate card ka design bhi isi Wells Fargo theme mein bana du?