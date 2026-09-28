<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WIMT Evaluation Studio · Sign in</title>
<style>
  /* ==========================================================
     Colors ek jagah rakhe hain, taaki baad mein badalna aasan ho
     ========================================================== */
  :root {
    --bg-red: #501313;        /* poore page ka fixed dark red background */
    --red-900: #791F1F;
    --red-700: #A32D2D;       /* button aur accents */
    --red-100: #FCEBEB;
    --gold: #FAC775;          /* card ka curved panel */
    --gold-soft: #FAEEDA;
    --gold-deep: #854F0B;
    --ink: #2C2C2A;
    --card-bg: #FFFFFF;
  }

  html, body { height: 100%; margin: 0; }

  body {
    background: var(--bg-red);
    font-family: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
    overflow: hidden; /* background fixed hai, isliye page scroll nahi hona chahiye */
  }

  /* Animated background: poori screen cover karta hai, clicks card tak jaate hain */
  #bg {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  /* Naya box girte waqt ka animation */
  #bg .drop {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform .7s cubic-bezier(.2, .8, .2, 1), opacity .6s;
  }

  /* Card ko screen ke beech mein rakhne ke liye */
  .stage {
    position: relative;
    z-index: 1;
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
    max-width: 760px;
    min-height: 320px;
    background: var(--card-bg);
    border-radius: 16px;
    overflow: hidden;
  }

  /* Left side ka gold panel — right side gol (D-shape) */
  .brand-panel {
    flex: 0 0 46%;
    background: var(--gold);
    border-radius: 0 999px 999px 0;
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
    letter-spacing: 2px;
    color: var(--red-900);
  }

  .brand-title {
    margin: 12px 0 0;
    font-size: 30px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--bg-red);
  }

  .brand-rule {
    width: 44px;
    height: 4px;
    margin-top: 16px;
    border-radius: 2px;
    background: var(--red-700);
  }

  /* Right side ka sign-in hissa */
  .signin {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
  }

  .shield {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--gold-soft);
    color: var(--gold-deep);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .signin h1 {
    margin: 16px 0 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--ink);
  }

  .btn-continue {
    margin-top: 24px;
    width: 100%;
    height: 48px;
    border: none;
    border-radius: 10px;
    background: var(--red-700);
    color: var(--red-100);
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s ease;
  }

  .btn-continue:hover { background: var(--red-900); }

  /* Keyboard users ke liye focus saaf dikhna chahiye */
  .btn-continue:focus-visible {
    outline: 3px solid var(--gold);
    outline-offset: 3px;
  }

  /* Phone / chhoti screen: layout wahi side-by-side, bas sab thoda chhota */
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
  }
</style>
</head>
<body>

  <!-- Background ki overlapping "wealth evaluation wall" yahan JS se banti hai -->
  <svg id="bg" aria-hidden="true"></svg>

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
  /* ==========================================================
     1) CONTINUE BUTTON — yahan apna existing session logic lagao
     ========================================================== */
  document.getElementById("continueBtn").addEventListener("click", function () {
    // startLocalSession();
    console.log("Continue clicked");
  });

  /* ==========================================================
     2) BASIC SETUP
     ========================================================== */
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("bg");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const el = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const rnd = Math.random;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  // Background ke colors
  const LINE = "#A32D2D", TEXT = "#F09595", GOLD = "#BA7517";
  const PASS = "#97C459", FLAG = "#EF9F27", RING = "#FAC775";
  const CARD_FILL = "#6A1B1B", SHADOW = "#2E0A0A", PANEL = "#501313";

  const CARD_W = 140;       // har box ki width
  const OVERLAP = 7;        // boxes kitna ek doosre pe chadhe hue hain
  const MAX_ACTIVE = 5;     // ek waqt pe kitne boxes review ho sakte hain

  // Text helper — level 1 = heading, 0 = normal, 2 = halka detail line
  const tx = (g, x, y, s, level, italic) => {
    const t = el("text", {
      x, y,
      "font-size": 11,
      "font-family": "Segoe UI, system-ui, sans-serif",
      fill: level === 1 ? "#F7C1C1" : TEXT,
      "fill-opacity": level === 1 ? 0.75 : level === 2 ? 0.45 : 0.6,
      "font-style": italic ? "italic" : "normal"
    });
    t.textContent = s;
    g.appendChild(t);
  };

  /* ==========================================================
     3) PEOPLE — drawn illustration, har baar random look
     ========================================================== */
  const SKIN = ["#E8C4A6", "#C99A76", "#9C6B4A", "#6E4630"];
  const HAIR = ["#2C1A12", "#4A2C1C", "#8A6A4A", "#D3D1C7"];
  const SHIRT = ["#BA7517", "#A32D2D", "#5F5E5A", "#854F0B", "#888780", "#993556"];

  function person(g, cx, cy, s, shirt) {
    const p = el("g", { opacity: 0.8 });
    const hair = pick(HAIR);
    const style = Math.floor(rnd() * 4); // 0 short, 1 long, 2 bun, 3 short

    // Kandhe / shirt
    p.appendChild(el("path", {
      d: `M${cx - 10 * s} ${cy + 20 * s} Q${cx - 10 * s} ${cy + 8 * s} ${cx} ${cy + 8 * s} Q${cx + 10 * s} ${cy + 8 * s} ${cx + 10 * s} ${cy + 20 * s} Z`,
      fill: shirt || pick(SHIRT)
    }));
    // Lambe baal (chehre ke peeche)
    if (style === 1) {
      p.appendChild(el("rect", { x: cx - 6.8 * s, y: cy - s, width: 2.6 * s, height: 8 * s, rx: s, fill: hair }));
      p.appendChild(el("rect", { x: cx + 4.2 * s, y: cy - s, width: 2.6 * s, height: 8 * s, rx: s, fill: hair }));
    }
    // Chehra
    p.appendChild(el("circle", { cx, cy, r: 6 * s, fill: pick(SKIN) }));
    // Baal ka upar wala hissa
    p.appendChild(el("path", {
      d: `M${cx - 6.3 * s} ${cy - 0.5 * s} A${6.3 * s} ${6.3 * s} 0 0 1 ${cx + 6.3 * s} ${cy - 0.5 * s} Z`,
      fill: hair
    }));
    // Joda (bun)
    if (style === 2) p.appendChild(el("circle", { cx, cy: cy - 7 * s, r: 2.6 * s, fill: hair }));
    g.appendChild(p);
  }

  /* ==========================================================
     4) CONTENT POOL — har box 3 lines: heading, main, detail.
     Naya content daalna ho to bas in arrays mein add karo.
     (Lines chhoti rakhna, warna box ke bahar nikal jayengi)
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
      ["Debt-to-income", "Keep it under 36%", "for healthy credit"],
      ["Max drawdown", "−8.2% in Q2", "recovered by Q3"]
    ],
    def: [
      ["Alpha", "Return above", "the benchmark"],
      ["Beta", "How much it moves", "vs the market"],
      ["Fiduciary", "Must put the", "client first"],
      ["Rebalancing", "Resetting the mix", "back to target"],
      ["Annuity", "Pays a steady", "income for life"],
      ["Liquidity", "How fast an asset", "turns into cash"],
      ["Volatility", "How big the", "price swings are"],
      ["Diversification", "Don't put all eggs", "in one basket"],
      ["Asset allocation", "Split across stocks,", "bonds and cash"],
      ["Tax-loss harvest", "Sell losers to", "offset the gains"],
      ["Index fund", "Owns the whole", "market, low cost"]
    ],
    thought: [
      ["Time in market", "beats timing", "the market"],
      ["Plan first,", "then invest,", "then review"],
      ["Risk is the", "price you pay", "for return"],
      ["Fees look small", "but compound", "over decades"],
      ["Diversify,", "don't try to", "predict"],
      ["Stay invested", "through the", "downturns"],
      ["Every client", "has a different", "finish line"]
    ],
    value: [
      ["Trust", "Earned in every", "conversation"],
      ["Client first", "Their goals", "before ours"],
      ["Clarity", "No hidden fees,", "no jargon"],
      ["Discipline", "Stick to the plan", "in any market"],
      ["Transparency", "Always show", "the math"],
      ["Accountability", "Every answer", "can be checked"]
    ],
    client: [
      ["Client goal", "Retire at 60", "Needs $1.2M"],
      ["Sabbatical", "Fund 12 months", "No selling"],
      ["Small business", "Cash-flow plan", "Next 2 years"],
      ["Career switch", "6-month buffer", "Before moving"],
      ["Retired couple", "Income for life", "Bond ladder"],
      ["Young saver", "First $10k", "At age 25"],
      ["Doctor, 42", "Paying loans", "And investing"]
    ],
    family: [
      ["Family plan", "College fund by 2032", "$400 every month"],
      ["New parent", "Starting a 529 plan", "$250 every month"],
      ["Legacy plan", "Trust for the kids", "Reviewed yearly"],
      ["First home", "Saving $80k down", "Target: 2028"],
      ["Blended family", "Updated beneficiaries", "After the wedding"]
    ],
    advisor: [
      ["Advisor meeting", "Rebalance in Q4", "Equity back to 60%"],
      ["Review call", "Risk check done", "Profile: moderate"],
      ["Onboarding", "Knowing the goals", "Before any product"],
      ["Annual review", "Right on track", "For retirement"],
      ["Tax season", "Harvest losses", "Before Dec 31"]
    ],
    spark: [
      ["Portfolio value", "$2.4M · +8.2% YTD"],
      ["Retirement pot", "$640k · on track"],
      ["Growth fund", "+12.1% in 1 year"]
    ],
    bars: [
      ["Monthly returns", "Best month +3.4%"],
      ["Savings rate", "Up from 12% to 20%"],
      ["Dividends", "$3,210 this year"]
    ]
  };

  // Har type ki height. Same height wale types aapas mein swap hote hain, isliye grid nahi hilti.
  const HEIGHT = { calc: 74, def: 74, value: 74, thought: 74, client: 80, spark: 80, bars: 80, donut: 80, family: 104, advisor: 104 };
  const SAME_HEIGHT = {
    74: ["calc", "def", "value", "thought"],
    80: ["client", "client", "spark", "bars", "donut"],
    104: ["family", "advisor"]
  };

  /* ==========================================================
     5) DRAW FUNCTIONS — box ke andar kya dikhega (local coords)
     ========================================================== */
  const three = (g, c, x) => { tx(g, x, 23, c[0], 1); tx(g, x, 41, c[1], 0); tx(g, x, 58, c[2], 2); };

  const DRAW = {
    calc: (g) => three(g, pick(DATA.calc), 10),
    def: (g) => three(g, pick(DATA.def), 10),

    thought: (g) => {
      const c = pick(DATA.thought);
      const q = el("text", { x: 10, y: 26, "font-size": 22, fill: GOLD, "fill-opacity": 0.7, "font-family": "Georgia, serif" });
      q.textContent = "“";
      g.appendChild(q);
      tx(g, 24, 24, c[0], 0, true);
      tx(g, 24, 41, c[1], 0, true);
      tx(g, 24, 58, c[2], 0, true);
    },

    value: (g) => {
      const c = pick(DATA.value);
      g.appendChild(el("path", { d: "M16 13 L22 19 L16 25 L10 19 Z", fill: "none", stroke: GOLD, "stroke-opacity": 0.8 }));
      tx(g, 28, 23, c[0], 1);
      tx(g, 10, 42, c[1], 0);
      tx(g, 10, 58, c[2], 2);
    },

    spark: (g, w, h) => {
      const c = pick(DATA.spark);
      tx(g, 10, 20, c[0], 1);
      tx(g, 10, 36, c[1], 2);
      const pts = []; let v = h - 8;
      for (let i = 0; i < 11; i++) {
        v = Math.max(46, Math.min(h - 8, v - (rnd() * 6 - 1.5)));
        pts.push(`${10 + i * 11.5},${v}`);
      }
      g.appendChild(el("polyline", { points: pts.join(" "), fill: "none", stroke: LINE, "stroke-width": 1.3, "stroke-opacity": 0.9 }));
    },

    bars: (g, w, h) => {
      const c = pick(DATA.bars);
      tx(g, 10, 20, c[0], 1);
      tx(g, 10, 36, c[1], 2);
      for (let i = 0; i < 9; i++) {
        const bh = 4 + rnd() * 16 + i * 1.2;
        g.appendChild(el("rect", { x: 10 + i * 13, y: h - 8 - bh, width: 8, height: bh, fill: i % 3 === 2 ? GOLD : LINE, "fill-opacity": 0.7 }));
      }
    },

    donut: (g, w, h) => {
      const cx = 26, cy = h / 2, C = 81.7; // circumference, r = 13
      const equity = Math.round(40 + rnd() * 35);
      const bonds = Math.round((100 - equity) * 0.8);
      const cash = 100 - equity - bonds;
      const a = equity / 100 * C, b = bonds / 100 * C;
      [[a, 0, LINE], [b, -a, GOLD], [C - a - b, -a - b, TEXT]].forEach(s => {
        g.appendChild(el("circle", {
          cx, cy, r: 13, fill: "none", stroke: s[2], "stroke-opacity": 0.75, "stroke-width": 5,
          "stroke-dasharray": `${s[0]} ${C - s[0]}`, "stroke-dashoffset": s[1],
          transform: `rotate(-90 ${cx} ${cy})`
        }));
      });
      tx(g, 52, cy - 10, `Equity ${equity}%`, 1);
      tx(g, 52, cy + 6, `Bonds ${bonds}%`, 0);
      tx(g, 52, cy + 21, `Cash ${cash}%`, 2);
    },

    client: (g, w, h) => {
      const c = pick(DATA.client);
      g.appendChild(el("rect", { x: 6, y: 6, width: 42, height: h - 12, rx: 6, fill: PANEL }));
      person(g, 27, 30, 1.45);
      tx(g, 56, 25, c[0], 1);
      tx(g, 56, 43, c[1], 0);
      tx(g, 56, 60, c[2], 2);
    },

    family: (g, w, h) => {
      const c = pick(DATA.family);
      g.appendChild(el("rect", { x: 6, y: 6, width: w - 12, height: 46, rx: 6, fill: PANEL }));
      person(g, 48, 22, 1.2);
      person(g, 76, 21, 1.25);
      person(g, 62, 35, 0.8);   // bachcha, aage
      person(g, 98, 24, 1.1);
      tx(g, 10, 68, c[0], 1);
      tx(g, 10, 84, c[1], 0);
      tx(g, 10, 98, c[2], 2);
    },

    advisor: (g, w, h) => {
      const c = pick(DATA.advisor);
      g.appendChild(el("rect", { x: 6, y: 6, width: w - 12, height: 46, rx: 6, fill: PANEL }));
      person(g, 48, 24, 1.2, "#5F5E5A");   // client
      person(g, 92, 24, 1.2, "#BA7517");   // advisor
      g.appendChild(el("rect", { x: 60, y: 12, width: 20, height: 9, rx: 4.5, fill: RING, "fill-opacity": 0.6 })); // baatcheet
      tx(g, 10, 68, c[0], 1);
      tx(g, 10, 84, c[1], 0);
      tx(g, 10, 98, c[2], 2);
    }
  };

  // Shuru mein boxes is order mein lagte hain, taaki log aur data mix rahein
  const ORDER = ["client", "calc", "family", "thought", "spark", "def", "advisor", "value", "client", "bars",
                 "family", "calc", "donut", "thought", "advisor", "def", "client", "value", "spark", "family"];

  /* ==========================================================
     6) EK BOX BANANA — shadow + frame + content
     ========================================================== */
  function makeCard(slot, type, animate) {
    const tilt = (rnd() * 4 - 2).toFixed(1); // halka sa tircha
    const h = slot.h;
    const outer = el("g", { transform: `translate(${slot.x} ${slot.y}) rotate(${tilt} ${CARD_W / 2} ${h / 2})` });
    const g = el("g", { class: "drop" });

    g.appendChild(el("rect", { x: 3, y: 4, width: CARD_W, height: h, rx: 8, fill: SHADOW, "fill-opacity": 0.55 }));
    const frame = el("rect", { width: CARD_W, height: h, rx: 8, fill: CARD_FILL, "stroke-width": 1 });
    frame.style.stroke = LINE;
    frame.style.strokeOpacity = 0.6;
    frame.style.transition = "stroke .4s";
    g.appendChild(frame);

    DRAW[type](g, CARD_W, h);
    outer.appendChild(g);
    svg.appendChild(outer); // sabse last wala sabse upar dikhta hai

    if (animate) {
      g.style.transform = "scale(1.3) translateY(-10px)";
      g.style.opacity = 0;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        g.style.transform = "scale(1)";
        g.style.opacity = 1;
      }));
    }
    return { outer, g, frame };
  }

  /* ==========================================================
     7) GRID BANANA — screen size ke hisaab se columns
     ========================================================== */
  let slots = [];

  function build() {
    slots.forEach(s => { s.alive = false; }); // purane timers band
    slots = [];
    svg.innerHTML = "";

    // Badi screen pe wall thodi zoom hoti hai
    const scale = Math.min(1.4, Math.max(1, window.innerWidth / 1000));
    const W = window.innerWidth / scale;
    const H = window.innerHeight / scale;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");

    const step = CARD_W - OVERLAP;
    const colCount = Math.ceil(W / step) + 1;
    const offsets = [-24, -2, -14]; // columns upar-neeche khiske hue, taaki masonry lage
    const cols = [];
    for (let i = 0; i < colCount; i++) cols.push({ x: -6 + i * step, y: offsets[i % 3] });

    let k = 0;
    while (cols.some(c => c.y < H)) {
      for (const col of cols) {
        if (col.y >= H) continue;
        const type = ORDER[k++ % ORDER.length];
        const slot = { x: col.x, y: col.y, h: HEIGHT[type], busy: false, alive: true };
        slot.card = makeCard(slot, type, false);
        slots.push(slot);
        col.y += slot.h - OVERLAP;
      }
    }
  }

  /* ==========================================================
     8) CYCLE — gold ring → ✓ / ! verdict → naya box upar girta hai
     ========================================================== */
  function cycle(slot) {
    slot.busy = true;
    const later = (fn, ms) => setTimeout(() => { if (slot.alive) fn(); }, ms);
    const card = slot.card;
    const bx = CARD_W - 12, by = 12;

    // Step 1: review shuru — gold border + bharta hua ring
    const ring = el("circle", {
      cx: bx, cy: by, r: 7, fill: PANEL, stroke: RING, "stroke-width": 1.5,
      "stroke-dasharray": 44, "stroke-dashoffset": 44, transform: `rotate(-90 ${bx} ${by})`
    });
    card.g.appendChild(ring);
    card.frame.style.stroke = RING;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ring.style.transition = "stroke-dashoffset 1s linear";
      ring.style.strokeDashoffset = 0;
    }));

    // Step 2: verdict — zyada tar pass, kabhi-kabhi flag
    later(() => {
      ring.remove();
      const flagged = rnd() < 0.18;
      const color = flagged ? FLAG : PASS;
      card.frame.style.stroke = color;
      card.g.appendChild(el("circle", { cx: bx, cy: by, r: 7, fill: PANEL, stroke: color, "stroke-width": 1.2 }));
      if (flagged) {
        const t = el("text", { x: bx, y: by + 4, "text-anchor": "middle", "font-size": 10, fill: color });
        t.textContent = "!";
        card.g.appendChild(t);
      } else {
        card.g.appendChild(el("polyline", {
          points: `${bx - 3.5},${by} ${bx - 1},${by + 3} ${bx + 3.5},${by - 3}`,
          fill: "none", stroke: color, "stroke-width": 1.5
        }));
      }
    }, 1050);

    // Step 3: naya box purane ke upar girta hai, purana hat jaata hai
    later(() => {
      slot.card = makeCard(slot, pick(SAME_HEIGHT[slot.h]), true);
      setTimeout(() => card.outer.remove(), 750);
    }, 2800);

    later(() => { slot.busy = false; }, 3800);
  }

  /* ==========================================================
     9) START
     ========================================================== */
  build();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 250);
  });

  // Reduced motion wale users ke liye wall static rehti hai
  if (!reduceMotion) {
    setInterval(() => {
      if (document.hidden) return; // tab chhupa ho to CPU bachao
      const free = slots.filter(s => !s.busy);
      if (free.length && slots.length - free.length < MAX_ACTIVE) cycle(pick(free));
    }, 600);
  }
})();
</script>
</body>
</html>
