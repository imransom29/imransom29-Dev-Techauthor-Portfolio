<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WIMT Evaluation Studio · Sign in</title>
<style>
  :root {
    --bg-red: #501313;
    --red-900: #791F1F;
    --red-700: #A32D2D;
    --red-100: #FCEBEB;
    --gold: #FAC775;
    --gold-soft: #FAEEDA;
    --gold-deep: #854F0B;
    --ink: #2C2C2A;
  }

  html, body { height: 100%; margin: 0; }

  body {
    /* Beech mein halki roshni, kinaron pe andhera — asli kamre jaisi lighting */
    background: radial-gradient(ellipse at 50% 42%, #7A1D1D 0%, #501313 55%, #2A0808 100%);
    font-family: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
    overflow: hidden;
    /* 4K / high-DPI screens pe text crisp rahe */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: geometricPrecision;
  }

  /* ==========================================================
     LAYER 1: Wall — 3D perspective mein tilted, jaise asli deewar
     ========================================================== */
  .wall {
    position: fixed;
    inset: -8%;                 /* thoda bada, taaki tilt pe kinare khaali na dikhein */
    z-index: 0;
    pointer-events: none;
    transform: perspective(1600px) rotateX(6deg) scale(1.04);
    transition: transform 1.2s cubic-bezier(.2, .8, .2, 1);
    will-change: transform;
  }

  #bg {
    width: 100%;
    height: 100%;
    display: block;
    shape-rendering: geometricPrecision;
    text-rendering: geometricPrecision;
    animation: drift 40s ease-in-out infinite alternate; /* bahut dheemi hawa jaisi movement */
  }

  @keyframes drift {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-1.2%, -2%, 0); }
  }

  #bg .drop {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform .8s cubic-bezier(.2, .8, .2, 1), opacity .6s;
  }

  /* ==========================================================
     LAYER 2: Camera effects — depth of field, vignette, grain
     ========================================================== */

  /* Kinaron pe halka blur — camera jaisa focus, beech sharp */
  .dof {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    mask-image: radial-gradient(ellipse at 50% 50%, transparent 38%, #000 88%);
    -webkit-mask-image: radial-gradient(ellipse at 50% 50%, transparent 38%, #000 88%);
  }

  /* Kinaron pe andhera — dhyan beech mein */
  .vignette {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    background: radial-gradient(ellipse at 50% 48%, transparent 35%, rgba(18, 3, 3, .62) 100%);
  }

  /* Film grain — flat digital look hatata hai, photo jaisa texture deta hai */
  .grain {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    opacity: .09;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }

  /* ==========================================================
     LAYER 3: Login card
     ========================================================== */
  .stage {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
  }

  .login-card {
    display: flex;
    width: 100%;
    max-width: 780px;
    min-height: 330px;
    background: #FFFFFF;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .7);
    /* Do shadows: ek door wali soft, ek paas wali tight — card hawa mein uthta dikhta hai */
    box-shadow:
      0 40px 90px rgba(0, 0, 0, .50),
      0 12px 24px rgba(0, 0, 0, .28),
      inset 0 1px 0 rgba(255, 255, 255, .9);
  }

  .brand-panel {
    flex: 0 0 46%;
    /* Gold pe halki roshni ka gradient, flat paint nahi */
    background: linear-gradient(140deg, #FDDC9A 0%, #F8C565 55%, #EDAA3F 100%);
    border-radius: 0 999px 999px 0;
    box-shadow: inset -14px 0 36px rgba(120, 60, 0, .14), 8px 0 24px rgba(120, 60, 0, .10);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 32px 56px 32px 28px;
    box-sizing: border-box;
  }

  .brand-mark {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 14px;
    letter-spacing: 3px;
    color: var(--red-900);
  }

  .brand-title {
    margin: 12px 0 0;
    font-size: 31px;
    font-weight: 600;
    line-height: 1.2;
    color: #4A1010;
    text-shadow: 0 1px 0 rgba(255, 255, 255, .35);
  }

  .brand-rule {
    width: 46px;
    height: 4px;
    margin-top: 16px;
    border-radius: 2px;
    background: var(--red-700);
  }

  .signin {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
  }

  .shield {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(180deg, #FFF4E0, #FAE6C4);
    box-shadow: 0 2px 6px rgba(133, 79, 11, .18), inset 0 1px 0 #fff;
    color: var(--gold-deep);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .signin h1 {
    margin: 16px 0 0;
    font-size: 25px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: -.2px;
  }

  .btn-continue {
    margin-top: 24px;
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 11px;
    background: linear-gradient(180deg, #BC3A41 0%, #9C252C 100%);
    color: #FFF3F3;
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 8px 18px rgba(163, 45, 45, .35), inset 0 1px 0 rgba(255, 255, 255, .22);
    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
  }

  .btn-continue:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow: 0 12px 24px rgba(163, 45, 45, .42), inset 0 1px 0 rgba(255, 255, 255, .22);
  }

  .btn-continue:active { transform: translateY(1px); box-shadow: 0 4px 10px rgba(163, 45, 45, .3); }

  .btn-continue:focus-visible { outline: 3px solid var(--gold); outline-offset: 3px; }

  @media (max-width: 640px) {
    .login-card { max-width: 560px; min-height: 180px; border-radius: 12px; }
    .brand-panel { flex: 0 0 44%; padding: 16px 20px 16px 10px; }
    .brand-mark { font-size: 11px; letter-spacing: 1px; }
    .brand-title { font-size: 16px; margin-top: 8px; }
    .brand-rule { width: 28px; height: 3px; margin-top: 10px; }
    .signin { padding: 16px 14px; }
    .shield { width: 30px; height: 30px; }
    .shield svg { width: 16px; height: 16px; }
    .signin h1 { font-size: 15px; margin-top: 10px; }
    .btn-continue { height: 38px; margin-top: 12px; font-size: 13px; border-radius: 8px; }
    .dof { display: none; } /* phone pe blur mehenga padta hai */
  }

  @media (prefers-reduced-motion: reduce) {
    #bg { animation: none; }
    .wall { transition: none; }
  }
</style>
</head>
<body>

  <div class="wall"><svg id="bg" aria-hidden="true"></svg></div>
  <div class="dof"></div>
  <div class="vignette"></div>
  <div class="grain"></div>

  <main class="stage">
    <section class="login-card" aria-labelledby="signin-title">
      <div class="brand-panel">
        <p class="brand-mark">WELLS FARGO</p>
        <p class="brand-title">WIMT Evaluation Studio</p>
        <div class="brand-rule"></div>
      </div>
      <div class="signin">
        <div class="shield" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
        </div>
        <h1 id="signin-title">Sign in to continue</h1>
        <button type="button" class="btn-continue" id="continueBtn">
          Continue
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" />
          </svg>
        </button>
      </div>
    </section>
  </main>

<script>
(function () {
  document.getElementById("continueBtn").addEventListener("click", function () {
    // startLocalSession();  ← apna existing login logic yahan
    console.log("Continue clicked");
  });

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("bg");
  const wall = document.querySelector(".wall");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const el = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const rnd = Math.random;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  let uid = 0;

  const LINE = "#B83A3A", TEXT = "#F4A5A5", GOLD = "#D08A2A";
  const PASS = "#A5D46A", FLAG = "#F5A834", RING = "#FAC775";
  const PANEL = "#3E0E0E";

  const CARD_W = 140, OVERLAP = 7, MAX_ACTIVE = 5;

  /* ==========================================================
     OPTIONAL: asli photos
     Brand team se approved photos mile to yahan paths daal do,
     jaise ["assets/people/1.jpg", "assets/people/2.jpg"].
     Khaali rahega to drawn illustrations dikhenge.
     ========================================================== */
  const PHOTOS = [];

  const tx = (g, x, y, s, level, italic) => {
    const t = el("text", {
      x, y,
      "font-size": 11,
      "font-weight": level === 1 ? 600 : 400,
      "font-family": "Segoe UI, system-ui, sans-serif",
      fill: level === 1 ? "#FFD9D9" : TEXT,
      "fill-opacity": level === 1 ? 0.85 : level === 2 ? 0.5 : 0.68,
      "font-style": italic ? "italic" : "normal"
    });
    t.textContent = s;
    g.appendChild(t);
  };

  /* ---------- Shared SVG defs: gradients + soft shadow ---------- */
  function addDefs() {
    const defs = el("defs", {});
    defs.innerHTML = `
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#8A2A2A"/>
        <stop offset="1" stop-color="#5E1818"/>
      </linearGradient>
      <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4A1212"/>
        <stop offset="1" stop-color="#330A0A"/>
      </linearGradient>
      <radialGradient id="faceShade" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
        <stop offset="1" stop-color="#000" stop-opacity=".18"/>
      </radialGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="160%">
        <feGaussianBlur stdDeviation="6"/>
      </filter>`;
    svg.appendChild(defs);
  }

  /* ---------- People: shading ke saath, zyada real ---------- */
  const SKIN = ["#F0CDB0", "#D6A884", "#A87252", "#744A33"];
  const HAIR = ["#231510", "#4A2C1C", "#8A6A4A", "#D8D4CC"];
  const SHIRT = ["#C98A2A", "#B83A3A", "#6B6A66", "#8A5410", "#9A9892", "#A33D62"];

  function person(g, cx, cy, s, shirt) {
    const p = el("g", { opacity: 0.92 });
    const hair = pick(HAIR), style = Math.floor(rnd() * 4), skin = pick(SKIN);
    const body = `M${cx - 10 * s} ${cy + 20 * s} Q${cx - 10 * s} ${cy + 8 * s} ${cx} ${cy + 8 * s} Q${cx + 10 * s} ${cy + 8 * s} ${cx + 10 * s} ${cy + 20 * s} Z`;
    p.appendChild(el("path", { d: body, fill: shirt || pick(SHIRT) }));
    p.appendChild(el("path", { d: body, fill: "url(#faceShade)" }));               // kapdon pe roshni
    p.appendChild(el("rect", { x: cx - 2 * s, y: cy + 4 * s, width: 4 * s, height: 5 * s, fill: skin })); // gardan
    if (style === 1) {
      p.appendChild(el("rect", { x: cx - 6.8 * s, y: cy - s, width: 2.6 * s, height: 9 * s, rx: s, fill: hair }));
      p.appendChild(el("rect", { x: cx + 4.2 * s, y: cy - s, width: 2.6 * s, height: 9 * s, rx: s, fill: hair }));
    }
    p.appendChild(el("circle", { cx, cy, r: 6 * s, fill: skin }));
    p.appendChild(el("circle", { cx, cy, r: 6 * s, fill: "url(#faceShade)" }));   // chehre pe roshni
    p.appendChild(el("path", {
      d: `M${cx - 6.3 * s} ${cy - 0.5 * s} A${6.3 * s} ${6.3 * s} 0 0 1 ${cx + 6.3 * s} ${cy - 0.5 * s} Z`,
      fill: hair
    }));
    if (style === 2) p.appendChild(el("circle", { cx, cy: cy - 7 * s, r: 2.6 * s, fill: hair }));
    g.appendChild(p);
  }

  // Asli photo ko rounded box mein clip karke lagata hai
  function photo(g, x, y, w, h) {
    const id = "clip" + (uid++);
    const cp = el("clipPath", { id });
    cp.appendChild(el("rect", { x, y, width: w, height: h, rx: 6 }));
    g.appendChild(cp);
    const img = el("image", { x, y, width: w, height: h, preserveAspectRatio: "xMidYMid slice", "clip-path": `url(#${id})`, opacity: 0.85 });
    img.setAttribute("href", pick(PHOTOS));
    g.appendChild(img);
  }

  /* ==========================================================
     CONTENT — apne version ka DATA (S&P 500 wagairah) yahan merge karo
     ========================================================== */
  const DATA = {
    calc: [
      ["Rule of 72", "72 ÷ 8% ≈ 9 years", "to double money"],
      ["FV = PV(1+r)ⁿ", "$10k at 8%, 10 yrs", "grows to $21.6k"],
      ["Sharpe ratio", "(R − Rf) / σ", "return per unit risk"],
      ["4% rule", "Withdraw 4% a year", "for a 30-year plan"],
      ["Emergency fund", "6 × monthly costs", "kept in cash"],
      ["Real return", "7% − 3% inflation", "= 4% real growth"],
      ["Expense ratio", "0.18% per year", "small fee, big impact"],
      ["Savings rate", "Save 20% of pay", "pay yourself first"],
      ["Debt-to-income", "Keep it under 36%", "for healthy credit"]
    ],
    def: [
      ["Alpha", "Return above", "the benchmark"],
      ["Beta", "How much it moves", "vs the market"],
      ["Fiduciary", "Must put the", "client first"],
      ["Rebalancing", "Resetting the mix", "back to target"],
      ["Annuity", "Pays a steady", "income for life"],
      ["Liquidity", "How fast an asset", "turns into cash"],
      ["Volatility", "How big the", "price swings are"],
      ["Index fund", "Owns the whole", "market, low cost"]
    ],
    thought: [
      ["Time in market", "beats timing", "the market"],
      ["Plan first,", "then invest,", "then review"],
      ["Risk is the", "price you pay", "for return"],
      ["Diversify,", "don't try to", "predict"],
      ["Stay invested", "through the", "downturns"]
    ],
    value: [
      ["Trust", "Earned in every", "conversation"],
      ["Client first", "Their goals", "before ours"],
      ["Clarity", "No hidden fees,", "no jargon"],
      ["Accountability", "Every answer", "can be checked"]
    ],
    client: [
      ["Client goal", "Retire at 60", "Needs $1.2M"],
      ["Sabbatical", "Fund 12 months", "No selling"],
      ["Small business", "Cash-flow plan", "Next 2 years"],
      ["Retired couple", "Income for life", "Bond ladder"],
      ["Young saver", "First $10k", "At age 25"]
    ],
    family: [
      ["Family plan", "College fund by 2032", "$400 every month"],
      ["New parent", "Starting a 529 plan", "$250 every month"],
      ["Legacy plan", "Trust for the kids", "Reviewed yearly"],
      ["Blended family", "Updated beneficiaries", "After the wedding"]
    ],
    advisor: [
      ["Advisor meeting", "Rebalance in Q4", "Equity back to 60%"],
      ["Review call", "Risk check done", "Profile: moderate"],
      ["Onboarding", "Knowing the goals", "Before any product"],
      ["Annual review", "Right on track", "For retirement"]
    ],
    spark: [["Portfolio value", "$2.4M · +8.2% YTD"], ["Retirement pot", "$640k · on track"], ["S&P 500", "+1.2% today"]],
    bars: [["Monthly returns", "Best month +3.4%"], ["Savings rate", "Up from 12% to 20%"], ["Dividends", "$3,210 this year"]]
  };

  const HEIGHT = { calc: 74, def: 74, value: 74, thought: 74, client: 80, spark: 80, bars: 80, donut: 80, family: 104, advisor: 104 };
  const SAME_HEIGHT = { 74: ["calc", "def", "value", "thought"], 80: ["client", "client", "spark", "bars", "donut"], 104: ["family", "advisor"] };

  const three = (g, c, x) => { tx(g, x, 23, c[0], 1); tx(g, x, 41, c[1], 0); tx(g, x, 58, c[2], 2); };

  const DRAW = {
    calc: (g) => three(g, pick(DATA.calc), 10),
    def: (g) => three(g, pick(DATA.def), 10),
    thought: (g) => {
      const c = pick(DATA.thought);
      const q = el("text", { x: 10, y: 26, "font-size": 22, fill: GOLD, "fill-opacity": 0.8, "font-family": "Georgia, serif" });
      q.textContent = "“"; g.appendChild(q);
      tx(g, 24, 24, c[0], 0, true); tx(g, 24, 41, c[1], 0, true); tx(g, 24, 58, c[2], 0, true);
    },
    value: (g) => {
      const c = pick(DATA.value);
      g.appendChild(el("path", { d: "M16 13 L22 19 L16 25 L10 19 Z", fill: "none", stroke: GOLD, "stroke-width": 1.2 }));
      tx(g, 28, 23, c[0], 1); tx(g, 10, 42, c[1], 0); tx(g, 10, 58, c[2], 2);
    },
    spark: (g, w, h) => {
      const c = pick(DATA.spark);
      tx(g, 10, 20, c[0], 1); tx(g, 10, 36, c[1], 2);
      const pts = []; let v = h - 8;
      for (let i = 0; i < 11; i++) { v = Math.max(46, Math.min(h - 8, v - (rnd() * 6 - 1.5))); pts.push([10 + i * 11.5, v]); }
      // Line ke neeche halka area — chart zyada real lagta hai
      const area = "M" + pts.map(p => p.join(" ")).join(" L") + ` L${pts[pts.length - 1][0]} ${h - 6} L10 ${h - 6} Z`;
      g.appendChild(el("path", { d: area, fill: LINE, "fill-opacity": 0.22 }));
      g.appendChild(el("polyline", { points: pts.map(p => p.join(",")).join(" "), fill: "none", stroke: "#E8A05A", "stroke-width": 1.5, "stroke-linejoin": "round", "stroke-opacity": 0.9 }));
    },
    bars: (g, w, h) => {
      const c = pick(DATA.bars);
      tx(g, 10, 20, c[0], 1); tx(g, 10, 36, c[1], 2);
      for (let i = 0; i < 9; i++) {
        const bh = 4 + rnd() * 16 + i * 1.2;
        g.appendChild(el("rect", { x: 10 + i * 13, y: h - 8 - bh, width: 8, height: bh, rx: 1.5, fill: i % 3 === 2 ? GOLD : LINE, "fill-opacity": 0.85 }));
      }
    },
    donut: (g, w, h) => {
      const cx = 26, cy = h / 2, C = 81.7;
      const equity = Math.round(40 + rnd() * 35), bonds = Math.round((100 - equity) * 0.8), cash = 100 - equity - bonds;
      const a = equity / 100 * C, b = bonds / 100 * C;
      [[a, 0, LINE], [b, -a, GOLD], [C - a - b, -a - b, TEXT]].forEach(s => {
        g.appendChild(el("circle", { cx, cy, r: 13, fill: "none", stroke: s[2], "stroke-opacity": 0.9, "stroke-width": 5,
          "stroke-dasharray": `${s[0]} ${C - s[0]}`, "stroke-dashoffset": s[1], transform: `rotate(-90 ${cx} ${cy})` }));
      });
      tx(g, 52, cy - 10, `Equity ${equity}%`, 1); tx(g, 52, cy + 6, `Bonds ${bonds}%`, 0); tx(g, 52, cy + 21, `Cash ${cash}%`, 2);
    },
    client: (g, w, h) => {
      const c = pick(DATA.client);
      if (PHOTOS.length) photo(g, 6, 6, 42, h - 12);
      else { g.appendChild(el("rect", { x: 6, y: 6, width: 42, height: h - 12, rx: 6, fill: "url(#panelGrad)" })); person(g, 27, 30, 1.45); }
      tx(g, 56, 25, c[0], 1); tx(g, 56, 43, c[1], 0); tx(g, 56, 60, c[2], 2);
    },
    family: (g, w, h) => {
      const c = pick(DATA.family);
      if (PHOTOS.length) photo(g, 6, 6, w - 12, 46);
      else {
        g.appendChild(el("rect", { x: 6, y: 6, width: w - 12, height: 46, rx: 6, fill: "url(#panelGrad)" }));
        person(g, 48, 22, 1.2); person(g, 76, 21, 1.25); person(g, 62, 35, 0.8); person(g, 98, 24, 1.1);
      }
      tx(g, 10, 68, c[0], 1); tx(g, 10, 84, c[1], 0); tx(g, 10, 98, c[2], 2);
    },
