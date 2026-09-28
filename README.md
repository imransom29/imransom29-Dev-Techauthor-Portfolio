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

  html, body {
    height: 100%;
    margin: 0;
  }

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
    .login-card {
      max-width: 560px;
      min-height: 180px;
      border-radius: 12px;
    }
    .brand-panel {
      flex: 0 0 44%;
      padding: 16px 20px 16px 10px;
    }
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

  <!-- Background ka animated "wealth evaluation wall" yahan JS se banta hai -->
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
          <!-- Shield-check icon -->
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
     1) CONTINUE BUTTON
     Yahan apna existing login/session logic lagao.
     ========================================================== */
  document.getElementById("continueBtn").addEventListener("click", function () {
    // Example: apne current non-SSO session wale function ko yahan call karo
    // startLocalSession();
    console.log("Continue clicked");
  });

  /* ==========================================================
     2) BACKGROUND SETUP
     ========================================================== */
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("bg");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Chhota helper: SVG element banane ke liye
  const el = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const rnd = Math.random;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  // Background ke colors (jaan-bujh ke halke rakhe hain)
  const LINE = "#A32D2D";
  const TEXT = "#F09595";
  const GOLD = "#BA7517";
  const PASS = "#97C459";
  const FLAG = "#EF9F27";

  // Text likhne ka helper — strong = heading jaisa, italic = quote ke liye
  const tx = (g, x, y, s, strong, italic) => {
    const t = el("text", {
      x, y,
      "font-size": 11,
      "font-family": "Segoe UI, system-ui, sans-serif",
      fill: strong ? "#F7C1C1" : TEXT,
      "fill-opacity": strong ? 0.6 : 0.5,
      "font-style": italic ? "italic" : "normal"
    });
    t.textContent = s;
    g.appendChild(t);
  };

  /* ==========================================================
     3) CONTENT POOL — har box inme se random kahani uthata hai.
     Naya content daalna ho to bas in arrays mein add karo.
     ========================================================== */
  const DATA = {
    calc: [
      ["Rule of 72", "72 ÷ 8 ≈ 9 yrs"], ["FV=PV(1+r)ⁿ", "$10k → $21.6k"],
      ["Sharpe ratio", "(R − Rf) / σ"], ["Max drawdown", "−8.2% in Q2"],
      ["Expense ratio", "0.18% per yr"], ["Real return", "7% − 3% infl."],
      ["Emergency fund", "6 × expenses"], ["Withdrawal", "4% rule"]
    ],
    def: [
      ["Alpha", "Beat the benchmark"], ["Beta", "Moves vs market"],
      ["Liquidity", "Speed to cash"], ["Fiduciary", "Client comes first"],
      ["Rebalancing", "Back to target"], ["Annuity", "Income for life"],
      ["Volatility", "Size of swings"], ["Tax-loss harvest", "Offset the gains"],
      ["Index fund", "Own the market"]
    ],
    thought: [
      ["Time in market", "beats timing it"], ["Diversify,", "don't predict"],
      ["Risk is the", "price of return"], ["Compound", "quietly, steadily"],
      ["Plan first,", "then invest"], ["Fees matter", "over decades"]
    ],
    value: [
      ["Trust", "earned every day"], ["Clarity", "no hidden fees"],
      ["Client first", "always"], ["Discipline", "through the cycle"],
      ["Transparency", "show the math"]
    ],
    person: [
      ["Client goal", "Retire at 60"], ["College fund", "Target 2032"],
      ["Advisor note", "Rebalance in Q4"], ["First home", "Save $80k"],
      ["Legacy plan", "Trust for kids"], ["New parent", "Start a 529"],
      ["Small business", "Cash-flow plan"], ["Sabbatical", "Fund 12 months"]
    ]
  };

  // Har type ke box ki height
  const HEIGHT = { calc: 52, def: 52, value: 52, thought: 56, person: 56, gauge: 56, donut: 58, spark: 62, bars: 62, area: 62 };

  // Same height wale types aapas mein swap ho sakte hain (layout nahi hilta)
  const SAME_HEIGHT = { 52: ["calc", "def", "value"], 56: ["thought", "person", "gauge"], 58: ["donut"], 62: ["spark", "bars", "area"] };

  /* ==========================================================
     4) DRAW FUNCTIONS — har type ka box kaise dikhega
     ========================================================== */
  const DRAW = {
    calc: (g, x, y) => { const c = pick(DATA.calc); tx(g, x + 8, y + 21, c[0], 1); tx(g, x + 8, y + 39, c[1]); },

    def: (g, x, y) => { const c = pick(DATA.def); tx(g, x + 8, y + 21, c[0], 1); tx(g, x + 8, y + 39, c[1]); },

    thought: (g, x, y) => {
      const c = pick(DATA.thought);
      const q = el("text", { x: x + 8, y: y + 24, "font-size": 22, fill: GOLD, "fill-opacity": 0.6, "font-family": "Georgia, serif" });
      q.textContent = "“";
      g.appendChild(q);
      tx(g, x + 22, y + 22, c[0], 0, 1);
      tx(g, x + 22, y + 40, c[1], 0, 1);
    },

    value: (g, x, y) => {
      const c = pick(DATA.value), cx = x + 14, cy = y + 17;
      g.appendChild(el("path", { d: `M${cx} ${cy - 6} L${cx + 6} ${cy} L${cx} ${cy + 6} L${cx - 6} ${cy} Z`, fill: "none", stroke: GOLD, "stroke-opacity": 0.7 }));
      tx(g, x + 26, y + 21, c[0], 1);
      tx(g, x + 8, y + 40, c[1]);
    },

    person: (g, x, y) => {
      const c = pick(DATA.person), cx = x + 19, cy = y + 22;
      g.appendChild(el("circle", { cx, cy: cy + 2, r: 13, fill: "#791F1F", "fill-opacity": 0.6, stroke: LINE, "stroke-opacity": 0.6 }));
      g.appendChild(el("circle", { cx, cy: cy - 2, r: 4.5, fill: TEXT, "fill-opacity": 0.5 }));
      g.appendChild(el("path", { d: `M${cx - 8} ${cy + 11} Q${cx} ${cy + 1} ${cx + 8} ${cy + 11}`, fill: TEXT, "fill-opacity": 0.5 }));
      tx(g, x + 38, y + 21, c[0], 1);
      tx(g, x + 38, y + 39, c[1]);
    },

    spark: (g, x, y, w, h) => {
      tx(g, x + 8, y + 18, pick(["Portfolio value", "Retirement pot", "Growth fund"]), 1);
      const pts = []; let v = h - 8;
      for (let i = 0; i < 10; i++) {
        v = Math.max(26, Math.min(h - 6, v - (rnd() * 8 - 2)));
        pts.push(`${x + 8 + i * 10.5},${y + v}`);
      }
      g.appendChild(el("polyline", { points: pts.join(" "), fill: "none", stroke: LINE, "stroke-opacity": 0.8, "stroke-width": 1.2 }));
    },

    bars: (g, x, y, w, h) => {
      tx(g, x + 8, y + 18, pick(["Monthly returns", "Savings rate", "Dividends"]), 1);
      for (let i = 0; i < 8; i++) {
        const bh = 5 + rnd() * 20 + i * 1.5;
        g.appendChild(el("rect", { x: x + 8 + i * 12, y: y + h - 6 - bh, width: 8, height: bh, fill: i % 3 === 2 ? GOLD : LINE, "fill-opacity": 0.55 }));
      }
    },

    donut: (g, x, y, w, h) => {
      const cx = x + 22, cy = y + h / 2, C = 75.4; // C = circle ki circumference (r = 12)
      const equity = Math.round(40 + rnd() * 35);
      const bonds = Math.round((100 - equity) * 0.8);
      const a = equity / 100 * C, b = bonds / 100 * C;
      [[a, 0, LINE], [b, -a, GOLD], [C - a - b, -a - b, TEXT]].forEach(s => {
        g.appendChild(el("circle", {
          cx, cy, r: 12, fill: "none", stroke: s[2], "stroke-opacity": 0.6, "stroke-width": 5,
          "stroke-dasharray": `${s[0]} ${C - s[0]}`, "stroke-dashoffset": s[1],
          transform: `rotate(-90 ${cx} ${cy})`
        }));
      });
      tx(g, x + 44, cy - 4, `Equity ${equity}%`, 1);
      tx(g, x + 44, cy + 12, `Bonds ${bonds}%`);
    },

    gauge: (g, x, y, w, h) => {
      const cx = x + 26, cy = y + h - 12, r = rnd(), ang = Math.PI * (0.15 + r * 0.7);
      g.appendChild(el("path", { d: `M${cx - 17} ${cy} A17 17 0 0 1 ${cx + 17} ${cy}`, fill: "none", stroke: LINE, "stroke-opacity": 0.6, "stroke-width": 3 }));
      g.appendChild(el("line", { x1: cx, y1: cy, x2: cx - Math.cos(ang) * 14, y2: cy - Math.sin(ang) * 14, stroke: GOLD, "stroke-opacity": 0.8, "stroke-width": 1.3 }));
      tx(g, x + 50, cy - 10, "Risk", 1);
      tx(g, x + 50, cy + 4, r < 0.33 ? "Conservative" : r < 0.66 ? "Moderate" : "Growth");
    },

    area: (g, x, y, w, h) => {
      tx(g, x + 8, y + 18, pick(["Net worth", "Assets under care", "Home equity"]), 1);
      let d = `M${x + 8} ${y + h - 6}`, v = h - 8;
      for (let i = 0; i < 10; i++) { v = Math.max(26, v - rnd() * 5); d += ` L${x + 8 + i * 11.5} ${y + v}`; }
      d += ` L${x + 111.5} ${y + h - 6} Z`;
      g.appendChild(el("path", { d, fill: LINE, "fill-opacity": 0.35, stroke: LINE, "stroke-opacity": 0.7, "stroke-width": 1 }));
    }
  };

  // Shuru mein boxes is order mein lagte hain, taaki har tarah ka content bikhra rahe
  const ORDER = ["person", "spark", "def", "thought", "calc", "donut", "value", "bars", "person", "def",
                 "gauge", "calc", "thought", "area", "person", "value", "def", "spark", "calc", "thought",
                 "person", "bars", "def", "donut", "value", "calc", "person", "gauge", "thought", "area"];

  const CARD_W = 124;   // har box ki width
  const GAP = 8;        // boxes ke beech gap
  const MAX_ACTIVE = 6; // ek waqt pe kitne boxes review ho sakte hain
  let cards = [];

  /* ==========================================================
     5) WALL BANANA — screen size ke hisaab se columns bharte hain
     ========================================================== */
  function build() {
    // Purane boxes ke pending timers ko band karne ke liye
    cards.forEach(c => { c.alive = false; });
    cards = [];
    svg.innerHTML = "";

    // Badi screen pe wall thodi zoom hoti hai, taaki boxes bahut chhote na dikhein
    const scale = Math.min(1.4, Math.max(1, window.innerWidth / 1000));
    const W = window.innerWidth / scale;
    const H = window.innerHeight / scale;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");

    const colCount = Math.ceil(W / (CARD_W + GAP)) + 1;
    const offsets = [-18, 8, -6]; // columns ko upar-neeche khiskaya, taaki masonry lage
    const cols = [];
    for (let i = 0; i < colCount; i++) cols.push({ x: 6 + i * (CARD_W + GAP), y: offsets[i % 3] });

    let k = 0;
    while (cols.some(c => c.y < H)) {
      for (const col of cols) {
        if (col.y >= H) continue;
        const type = ORDER[k++ % ORDER.length];
        const h = HEIGHT[type];
        cards.push(makeCard(col.x, col.y, h, type));
        col.y += h + GAP;
      }
    }
  }

  // Ek box banata hai: frame + content + review ring + verdict badge
  function makeCard(x, y, h, type) {
    const g = el("g", {});

    const frame = el("rect", { x, y, width: CARD_W, height: h, rx: 7, fill: "#791F1F", "fill-opacity": 0.35, "stroke-width": 0.9 });
    frame.style.stroke = LINE;
    frame.style.strokeOpacity = 0.45;
    frame.style.transition = "stroke .4s, stroke-opacity .4s";
    g.appendChild(frame);

    const content = el("g", {});
    content.style.transition = "opacity .6s";
    g.appendChild(content);
    DRAW[type](content, x, y, CARD_W, h);

    const bx = x + CARD_W - 10, by = y + 10;
    const ring = el("circle", {
      cx: bx, cy: by, r: 7, fill: "none", stroke: "#FAC775", "stroke-width": 1.4,
      "stroke-dasharray": 44, "stroke-dashoffset": 44, transform: `rotate(-90 ${bx} ${by})`
    });
    ring.style.opacity = 0;
    g.appendChild(ring);

    const badge = el("g", {});
    badge.style.opacity = 0;
    badge.style.transition = "opacity .3s";
    g.appendChild(badge);

    svg.appendChild(g);
    return { x, y, h, frame, content, ring, badge, bx, by, busy: false, alive: true };
  }

  /* ==========================================================
     6) REVIEW ANIMATION — ek box ka poora cycle:
        gold highlight → ring bharta hai → ✓ / ! verdict → naya content
     ========================================================== */
  function review(cd) {
    cd.busy = true;
    const later = (fn, ms) => setTimeout(() => { if (cd.alive) fn(); }, ms);

    // Step 1: box gold hota hai aur ring bharna shuru
    cd.frame.style.stroke = "#FAC775";
    cd.frame.style.strokeOpacity = 0.8;
    cd.ring.style.transition = "none";
    cd.ring.style.strokeDashoffset = 44;
    cd.ring.style.opacity = 0.9;
    requestAnimationFrame(() => {
      cd.ring.style.transition = "stroke-dashoffset 1s linear";
      cd.ring.style.strokeDashoffset = 0;
    });

    // Step 2: verdict — zyada tar pass, kabhi-kabhi flag
    later(() => {
      const flagged = rnd() < 0.18;
      cd.ring.style.opacity = 0;
      cd.badge.innerHTML = "";
      cd.badge.appendChild(el("circle", { cx: cd.bx, cy: cd.by, r: 6, fill: "#501313", stroke: flagged ? FLAG : PASS, "stroke-width": 1 }));
      if (flagged) {
        const t = el("text", { x: cd.bx, y: cd.by + 3.5, "text-anchor": "middle", "font-size": 9, fill: FLAG });
        t.textContent = "!";
        cd.badge.appendChild(t);
      } else {
        cd.badge.appendChild(el("polyline", {
          points: `${cd.bx - 3},${cd.by} ${cd.bx - 1},${cd.by + 2.5} ${cd.bx + 3},${cd.by - 2.5}`,
          fill: "none", stroke: PASS, "stroke-width": 1.3
        }));
      }
      cd.badge.style.opacity = 1;
      cd.frame.style.stroke = flagged ? FLAG : PASS;
      cd.frame.style.strokeOpacity = 0.6;
    }, 1050);

    // Step 3: purana content fade out
    later(() => {
      cd.content.style.opacity = 0;
      cd.badge.style.opacity = 0;
      cd.frame.style.stroke = LINE;
      cd.frame.style.strokeOpacity = 0.45;
    }, 3000);

    // Step 4: same height ka naya content fade in
    later(() => {
      cd.content.innerHTML = "";
      DRAW[pick(SAME_HEIGHT[cd.h])](cd.content, cd.x, cd.y, CARD_W, cd.h);
      cd.content.style.opacity = 1;
    }, 3650);

    later(() => { cd.busy = false; }, 4400);
  }

  /* ==========================================================
     7) START
     ========================================================== */
  build();

  // Resize pe wall dobara banti hai (thoda ruk ke, taaki baar-baar na bane)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 250);
  });

  // Jinhe motion se dikkat hai (OS setting), unke liye wall static rehti hai
  if (!reduceMotion) {
    setInterval(() => {
      if (document.hidden) return; // tab chhupa ho to kaam mat karo, CPU bachao
      const free = cards.filter(c => !c.busy);
      const active = cards.length - free.length;
      if (free.length && active < MAX_ACTIVE) review(pick(free));
    }, 450);
  }
})();
</script>
</body>
</html>
