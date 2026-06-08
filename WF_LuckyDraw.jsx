import { useState, useRef, useEffect, useCallback } from "react";

const EMPLOYEES = [
  { name: "Nikhil Pillai", lob: "CCIBT", email: "nikhil.pillai@wellsfargo.com" },
  { name: "Komal Rao", lob: "WIMT", email: "komal.rao@wellsfargo.com" },
  { name: "Jyoti Patel", lob: "CCIBT", email: "jyoti.patel@wellsfargo.com" },
  { name: "Siddharth Iyer", lob: "TMS", email: "siddharth.iyer@wellsfargo.com" },
  { name: "Megha Das", lob: "CCIBT", email: "megha.das@wellsfargo.com" },
  { name: "Mohit Mehta", lob: "WIMT", email: "mohit.mehta@wellsfargo.com" },
  { name: "Rohan Kulkarni", lob: "CCIBT", email: "rohan.kulkarni@wellsfargo.com" },
  { name: "Aarav Kapoor", lob: "TMS", email: "aarav.kapoor@wellsfargo.com" },
  { name: "Sachin Pandey", lob: "CCIBT", email: "sachin.pandey@wellsfargo.com" },
  { name: "Preeti Reddy", lob: "TMS", email: "preeti.reddy@wellsfargo.com" },
  { name: "Tanvi Verma", lob: "TMS", email: "tanvi.verma@wellsfargo.com" },
  { name: "Harish Kumar", lob: "TMS", email: "harish.kumar@wellsfargo.com" },
  { name: "Rohan Banerjee", lob: "TMS", email: "rohan.banerjee@wellsfargo.com" },
  { name: "Rajesh Bhat", lob: "WIMT", email: "rajesh.bhat@wellsfargo.com" },
  { name: "Ananya Kulkarni", lob: "CCIBT", email: "ananya.kulkarni@wellsfargo.com" },
  { name: "Manish Kumar", lob: "CCIBT", email: "manish.kumar@wellsfargo.com" },
  { name: "Nikhil Shah", lob: "TMS", email: "nikhil.shah@wellsfargo.com" },
  { name: "Pooja Rao", lob: "CCIBT", email: "pooja.rao@wellsfargo.com" },
  { name: "Suresh Verma", lob: "WIMT", email: "suresh.verma@wellsfargo.com" },
  { name: "Harish Shah", lob: "TMS", email: "harish.shah@wellsfargo.com" },
  { name: "Rekha Mishra", lob: "TMS", email: "rekha.mishra@wellsfargo.com" },
  { name: "Rajesh Desai", lob: "CCIBT", email: "rajesh.desai@wellsfargo.com" },
  { name: "Suresh Agarwal", lob: "TMS", email: "suresh.agarwal@wellsfargo.com" },
  { name: "Varun Reddy", lob: "WIMT", email: "varun.reddy@wellsfargo.com" },
  { name: "Shweta Nair", lob: "TMS", email: "shweta.nair@wellsfargo.com" },
  { name: "Lakshmi Nair", lob: "WIMT", email: "lakshmi.nair@wellsfargo.com" },
  { name: "Aarav Reddy", lob: "WIMT", email: "aarav.reddy@wellsfargo.com" },
  { name: "Bhavna Banerjee", lob: "CCIBT", email: "bhavna.banerjee@wellsfargo.com" },
  { name: "Amit Saxena", lob: "CCIBT", email: "amit.saxena@wellsfargo.com" },
  { name: "Swati Gupta", lob: "TMS", email: "swati.gupta@wellsfargo.com" },
  { name: "Divya Chopra", lob: "WIMT", email: "divya.chopra@wellsfargo.com" },
  { name: "Ananya Sharma", lob: "TMS", email: "ananya.sharma@wellsfargo.com" },
  { name: "Harish Bhat", lob: "CCIBT", email: "harish.bhat@wellsfargo.com" },
  { name: "Ananya Menon", lob: "TMS", email: "ananya.menon@wellsfargo.com" },
  { name: "Meera Chatterjee", lob: "TMS", email: "meera.chatterjee@wellsfargo.com" },
  { name: "Sonal Joshi", lob: "TMS", email: "sonal.joshi@wellsfargo.com" },
  { name: "Karthik Patel", lob: "WIMT", email: "karthik.patel@wellsfargo.com" },
  { name: "Kavita Malhotra", lob: "WIMT", email: "kavita.malhotra@wellsfargo.com" },
  { name: "Megha Reddy", lob: "WIMT", email: "megha.reddy@wellsfargo.com" },
  { name: "Pranav Patel", lob: "TMS", email: "pranav.patel@wellsfargo.com" },
  { name: "Kavita Shah", lob: "CCIBT", email: "kavita.shah@wellsfargo.com" },
  { name: "Ritu Banerjee", lob: "TMS", email: "ritu.banerjee@wellsfargo.com" },
  { name: "Naveen Desai", lob: "CCIBT", email: "naveen.desai@wellsfargo.com" },
  { name: "Rahul Menon", lob: "TMS", email: "rahul.menon@wellsfargo.com" },
  { name: "Aarav Sharma", lob: "WIMT", email: "aarav.sharma@wellsfargo.com" },
  { name: "Naveen Shah", lob: "TMS", email: "naveen.shah@wellsfargo.com" },
  { name: "Suresh Mehta", lob: "WIMT", email: "suresh.mehta@wellsfargo.com" },
  { name: "Amit Desai", lob: "CCIBT", email: "amit.desai@wellsfargo.com" },
  { name: "Suresh Srinivasan", lob: "TMS", email: "suresh.srinivasan@wellsfargo.com" },
  { name: "Ritu Tiwari", lob: "TMS", email: "ritu.tiwari@wellsfargo.com" },
];

const LOB_FULL = { CCIBT: "Consumer, Commercial & Industrial Banking Tech", WIMT: "Wealth & Investment Management Tech", TMS: "Technology & Managed Services" };
const MAX_WINNERS = 3;

/* ═══════════════════════════════════════════════════════
   PARTICLE CANVAS — bright sparkles on top of CSS bg
   ═══════════════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let raf, W, H;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);

    const sparks = Array.from({ length: 80 }, () => ({
      x: Math.random() * 3000, y: Math.random() * 2000,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.8 - 0.2,
      gold: Math.random() > 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.03 + Math.random() * 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      sparks.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.phase += p.speed;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(p.phase));
        const a = twinkle;
        const col = p.gold ? `rgba(255,215,0,${a})` : `rgba(255,180,180,${a * 0.6})`;
        /* glow */
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        g.addColorStop(0, p.gold ? `rgba(255,215,0,${a * 0.4})` : `rgba(255,100,100,${a * 0.2})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2); ctx.fill();
        /* core */
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * twinkle, 0, Math.PI * 2); ctx.fill();
        /* cross flare on bright */
        if (twinkle > 0.85 && p.r > 1) {
          ctx.strokeStyle = `rgba(255,255,255,${a * 0.3})`; ctx.lineWidth = 0.6;
          const fl = p.r * 12;
          ctx.beginPath(); ctx.moveTo(p.x - fl, p.y); ctx.lineTo(p.x + fl, p.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p.x, p.y - fl * 0.6); ctx.lineTo(p.x, p.y + fl * 0.6); ctx.stroke();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }} />;
}

/* ═══════════════════════════════════════════════════════
   CONFETTI BURST
   ═══════════════════════════════════════════════════════ */
function ConfettiBurst({ trigger }) {
  const ref = useRef(null);
  useEffect(() => {
    if (trigger === 0) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = c.parentElement.offsetWidth;
    const H = c.height = c.parentElement.offsetHeight;
    const colors = ["#FFD700", "#FFC107", "#CF0A2C", "#fff", "#FFE082", "#FF6F00", "#E53935"];
    const pcs = Array.from({ length: 120 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 60, y: H * 0.35,
      vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 18 - 6,
      w: Math.random() * 8 + 3, h: Math.random() * 14 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360, rv: (Math.random() - 0.5) * 15,
      life: 1, decay: 0.008 + Math.random() * 0.006,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      pcs.forEach(p => {
        if (p.life <= 0) return; alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.vx *= 0.99;
        p.rot += p.rv; p.life -= p.decay;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [trigger]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }} />;
}

/* ═══════════════════════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════════════════════ */
const WFLogo = () => (
  <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" fill="#CF0A2C" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#FFD700" strokeWidth="2" />
    <path d="M25 35 L33 65 L42 45 L50 65 L58 45 L67 65 L75 35" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="28" y="70" width="44" height="3" rx="1.5" fill="#FFD700" opacity=".6" />
  </svg>
);

const TrophySVG = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFD700" /><stop offset="50%" stopColor="#FFC107" /><stop offset="100%" stopColor="#FF8F00" /></linearGradient></defs>
    <path d="M24 14h32v10c0 11-7.2 20-16 20S24 35 24 24V14z" fill="url(#tg)" />
    <path d="M24 20H12c0 8 5.5 13 12 13V20z" fill="#FFE082" opacity=".6" />
    <path d="M56 20h12c0 8-5.5 13-12 13V20z" fill="#FFE082" opacity=".6" />
    <rect x="35" y="44" width="10" height="12" rx="3" fill="url(#tg)" />
    <path d="M27 56h26a4 4 0 0 1 4 4v2H23v-2a4 4 0 0 1 4-4z" fill="#FFE082" />
    <path d="M40 24l2.5 5h5.5l-4 3.5 1.5 5.5-5.5-3-5.5 3 1.5-5.5-4-3.5h5.5z" fill="#CF0A2C" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [pool, setPool] = useState([...EMPLOYEES]);
  const [winners, setWinners] = useState([]);
  const [current, setCurrent] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [shuffleName, setShuffleName] = useState("");
  const [confettiKey, setConfettiKey] = useState(0);
  const intervalRef = useRef(null);
  const historyRef = useRef(null);

  const allPicked = winners.length >= MAX_WINNERS;

  const pickWinner = useCallback(() => {
    if (pool.length === 0 || phase === "shuffling" || winners.length >= MAX_WINNERS) return;
    setPhase("shuffling"); setCurrent(null);
    let tick = 0; const totalTicks = 35; const startSpeed = 50; const endSpeed = 180;
    const step = () => {
      setShuffleName(pool[Math.floor(Math.random() * pool.length)].name);
      tick++;
      if (tick >= totalTicks) {
        const idx = Math.floor(Math.random() * pool.length);
        const winner = pool[idx];
        setPool(prev => prev.filter((_, i) => i !== idx));
        setCurrent(winner); setWinners(prev => [...prev, winner]);
        setShuffleName(""); setPhase("revealed"); setConfettiKey(k => k + 1);
        return;
      }
      intervalRef.current = setTimeout(step, startSpeed + (endSpeed - startSpeed) * Math.pow(tick / totalTicks, 2.5));
    };
    step();
  }, [pool, phase, winners.length]);

  const resetDraw = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setPool([...EMPLOYEES]); setWinners([]); setCurrent(null);
    setShuffleName(""); setPhase("idle"); setConfettiKey(0);
  }, []);

  useEffect(() => {
    if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [winners]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{overflow-x:hidden;background:#0a0002}

        /* ════════════════════════════════════════════
           ANIMATED BACKGROUND — all CSS driven
           ════════════════════════════════════════════ */
        .bg-container{position:fixed;inset:0;z-index:0;overflow:hidden;background:#0a0002}

        /* Layer 1: Shifting gradient mesh */
        .bg-mesh{
          position:absolute;inset:-50%;width:200%;height:200%;
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(180,10,40,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 60%, rgba(140,5,25,0.35) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 80%, rgba(200,80,0,0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 70% 20%, rgba(255,170,0,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 90% 70% at 40% 50%, rgba(120,0,15,0.5) 0%, transparent 60%);
          animation: meshDrift 20s ease-in-out infinite;
        }
        @keyframes meshDrift{
          0%{transform:translate(0%,0%) rotate(0deg) scale(1)}
          25%{transform:translate(5%,-3%) rotate(2deg) scale(1.05)}
          50%{transform:translate(-3%,5%) rotate(-1deg) scale(1.02)}
          75%{transform:translate(4%,2%) rotate(1.5deg) scale(1.06)}
          100%{transform:translate(0%,0%) rotate(0deg) scale(1)}
        }

        /* Layer 2: Large flowing waves */
        .wave-container{position:absolute;inset:0;overflow:hidden}
        .wave{
          position:absolute;width:200%;left:-50%;
          opacity:0.12;
        }
        .wave-1{top:10%;animation:waveFlow1 12s ease-in-out infinite;opacity:0.15}
        .wave-2{top:35%;animation:waveFlow2 15s ease-in-out infinite;opacity:0.10}
        .wave-3{top:60%;animation:waveFlow3 18s ease-in-out infinite;opacity:0.13}
        .wave-4{top:80%;animation:waveFlow4 14s ease-in-out infinite;opacity:0.08}

        @keyframes waveFlow1{0%{transform:translateX(0%) scaleY(1)}50%{transform:translateX(-15%) scaleY(1.3)}100%{transform:translateX(0%) scaleY(1)}}
        @keyframes waveFlow2{0%{transform:translateX(0%) scaleY(1)}50%{transform:translateX(12%) scaleY(0.8)}100%{transform:translateX(0%) scaleY(1)}}
        @keyframes waveFlow3{0%{transform:translateX(0%) scaleY(1)}50%{transform:translateX(-10%) scaleY(1.2)}100%{transform:translateX(0%) scaleY(1)}}
        @keyframes waveFlow4{0%{transform:translateX(0%) scaleY(1)}50%{transform:translateX(8%) scaleY(1.4)}100%{transform:translateX(0%) scaleY(1)}}

        /* Layer 3: Floating orbs */
        .orb{
          position:absolute;border-radius:50%;
          filter:blur(60px);
          animation-timing-function:ease-in-out;
          animation-iteration-count:infinite;
        }
        .orb-1{width:400px;height:400px;background:radial-gradient(circle,rgba(207,10,44,0.5),transparent 70%);top:5%;left:10%;animation:orbFloat1 16s infinite}
        .orb-2{width:300px;height:300px;background:radial-gradient(circle,rgba(255,191,0,0.25),transparent 70%);top:50%;right:5%;animation:orbFloat2 20s infinite}
        .orb-3{width:500px;height:500px;background:radial-gradient(circle,rgba(160,5,30,0.4),transparent 70%);bottom:0;left:30%;animation:orbFloat3 22s infinite}
        .orb-4{width:250px;height:250px;background:radial-gradient(circle,rgba(255,160,0,0.2),transparent 70%);top:20%;right:25%;animation:orbFloat4 18s infinite}
        .orb-5{width:350px;height:350px;background:radial-gradient(circle,rgba(180,0,30,0.35),transparent 70%);top:60%;left:5%;animation:orbFloat5 24s infinite}

        @keyframes orbFloat1{0%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,60px) scale(1.2)}66%{transform:translate(-40px,30px) scale(0.9)}100%{transform:translate(0,0) scale(1)}}
        @keyframes orbFloat2{0%{transform:translate(0,0) scale(1)}33%{transform:translate(-60px,-80px) scale(1.15)}66%{transform:translate(40px,-20px) scale(0.85)}100%{transform:translate(0,0) scale(1)}}
        @keyframes orbFloat3{0%{transform:translate(0,0) scale(1)}33%{transform:translate(50px,-50px) scale(1.1)}66%{transform:translate(-80px,-30px) scale(0.95)}100%{transform:translate(0,0) scale(1)}}
        @keyframes orbFloat4{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,60px) scale(1.25)}100%{transform:translate(0,0) scale(1)}}
        @keyframes orbFloat5{0%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,-70px) scale(1.15)}100%{transform:translate(0,0) scale(1)}}

        /* Layer 4: Diagonal light streaks */
        .streak{
          position:absolute;height:2px;border-radius:2px;
          opacity:0;
          animation-timing-function:linear;
          animation-iteration-count:infinite;
        }
        .streak-1{width:60%;top:25%;left:-60%;background:linear-gradient(90deg,transparent,rgba(255,215,0,0.5),rgba(255,215,0,0.8),rgba(255,215,0,0.5),transparent);transform:rotate(-5deg);animation:streakSweep1 8s 0s infinite}
        .streak-2{width:45%;top:55%;left:-45%;background:linear-gradient(90deg,transparent,rgba(255,180,0,0.3),rgba(255,200,0,0.6),rgba(255,180,0,0.3),transparent);transform:rotate(-3deg);animation:streakSweep2 12s 3s infinite;height:1.5px}
        .streak-3{width:70%;top:75%;left:-70%;background:linear-gradient(90deg,transparent,rgba(207,10,44,0.3),rgba(207,10,44,0.5),rgba(207,10,44,0.3),transparent);transform:rotate(-2deg);animation:streakSweep3 15s 6s infinite;height:3px}
        .streak-4{width:35%;top:15%;left:-35%;background:linear-gradient(90deg,transparent,rgba(255,215,0,0.4),rgba(255,255,200,0.7),rgba(255,215,0,0.4),transparent);transform:rotate(-7deg);animation:streakSweep4 10s 1.5s infinite;height:1px}

        @keyframes streakSweep1{0%{left:-60%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:120%;opacity:0}}
        @keyframes streakSweep2{0%{left:-45%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:120%;opacity:0}}
        @keyframes streakSweep3{0%{left:-70%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:120%;opacity:0}}
        @keyframes streakSweep4{0%{left:-35%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:120%;opacity:0}}

        /* Layer 5: Pulsing center spotlight */
        .spotlight{
          position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:800px;height:800px;border-radius:50%;
          background:radial-gradient(circle,rgba(255,200,0,0.06) 0%,rgba(207,10,44,0.08) 30%,transparent 70%);
          animation:spotPulse 6s ease-in-out infinite;
        }
        @keyframes spotPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.6}50%{transform:translate(-50%,-50%) scale(1.3);opacity:1}}

        /* Layer 6: Vignette */
        .vignette{
          position:absolute;inset:0;
          background:radial-gradient(ellipse 70% 60% at 50% 50%,transparent 30%,rgba(5,0,2,0.8) 100%);
        }

        /* ════════════ UI ANIMATIONS ════════════ */
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardReveal{0%{opacity:0;transform:scale(0.85) rotateX(12deg)}60%{opacity:1;transform:scale(1.03) rotateX(-2deg)}100%{opacity:1;transform:scale(1) rotateX(0)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 40px rgba(255,215,0,0.15),0 0 80px rgba(207,10,44,0.1)}50%{box-shadow:0 0 60px rgba(255,215,0,0.35),0 0 120px rgba(207,10,44,0.25)}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes nameCycle{0%{opacity:0.4;transform:translateY(6px)}50%{opacity:1;transform:translateY(0)}100%{opacity:0.4;transform:translateY(-6px)}}
        @keyframes floatBadge{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .pick-btn{position:relative;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1)}
        .pick-btn:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 40px rgba(207,10,44,0.6),0 0 60px rgba(255,215,0,0.2)!important}
        .pick-btn:active{transform:translateY(0) scale(0.98)}
        .pick-btn::after{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(transparent,rgba(255,255,255,0.08),transparent);transform:rotate(45deg) translateY(-100%);transition:transform .6s}
        .pick-btn:hover::after{transform:rotate(45deg) translateY(0%)}
        .reset-btn{transition:all .25s}.reset-btn:hover{background:rgba(255,215,0,0.12)!important;border-color:rgba(255,215,0,0.5)!important}
        .hist-item{transition:all .3s}.hist-item:hover{background:rgba(255,215,0,0.1)!important}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,215,0,0.2);border-radius:9px}::-webkit-scrollbar-track{background:transparent}
      `}</style>

      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="bg-container">
        <div className="bg-mesh" />
        <div className="wave-container">
          {/* SVG flowing waves */}
          <svg className="wave wave-1" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,100 C240,20 480,180 720,100 C960,20 1200,180 1440,100 L1440,200 L0,200Z" fill="url(#wg1)"/>
            <defs><linearGradient id="wg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#CF0A2C" /><stop offset="50%" stopColor="#FFD700" /><stop offset="100%" stopColor="#CF0A2C" /></linearGradient></defs>
          </svg>
          <svg className="wave wave-2" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,80 C360,160 720,0 1080,120 C1260,160 1380,60 1440,80 L1440,200 L0,200Z" fill="#FFD700" />
          </svg>
          <svg className="wave wave-3" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,120 C200,40 400,180 720,90 C1040,0 1240,160 1440,120 L1440,200 L0,200Z" fill="#CF0A2C" />
          </svg>
          <svg className="wave wave-4" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,60 C300,180 600,30 900,130 C1100,190 1300,50 1440,100 L1440,200 L0,200Z" fill="url(#wg1)" />
          </svg>
        </div>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />
        <div className="streak streak-1" />
        <div className="streak streak-2" />
        <div className="streak streak-3" />
        <div className="streak streak-4" />
        <div className="spotlight" />
        <div className="vignette" />
      </div>

      {/* ═══ PARTICLE CANVAS ═══ */}
      <ParticleCanvas />

      {/* ═══ UI LAYER ═══ */}
      <div style={{
        position: "relative", zIndex: 3, minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "28px 20px 48px",
        fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff",
      }}>

        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
          <WFLogo />
          <div>
            <div style={{ fontSize: 13, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,215,0,0.5)", fontWeight: 300 }}>Wells Fargo</div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 30, fontWeight: 700, lineHeight: 1.15,
              background: "linear-gradient(135deg, #FFD700 0%, #FFF 40%, #FFD700 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Employee Appreciation Week</h1>
          </div>
        </div>
        <p style={{ fontSize: 14, letterSpacing: 8, textTransform: "uppercase", color: "rgba(255,215,0,0.35)", fontWeight: 300, marginBottom: 36 }}>Lucky Draw 2026</p>

        {/* STATUS */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {[
            { n: EMPLOYEES.length, l: "Employees" },
            { n: Math.max(0, MAX_WINNERS - winners.length), l: "Draws Left" },
            { n: winners.length, l: "Winners" },
          ].map(({ n, l }) => (
            <div key={l} style={{
              padding: "8px 22px", borderRadius: 40,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,215,0,0.1)",
              textAlign: "center", backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#FFD700", fontFamily: "'Playfair Display', serif" }}>{n}</div>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,215,0,0.4)" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* MAIN LAYOUT */}
        <div style={{ display: "flex", gap: 32, width: "100%", maxWidth: 1060, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* CENTER */}
          <div style={{ flex: "1 1 480px", maxWidth: 580, display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* SHUFFLING */}
            {phase === "shuffling" && (
              <div style={{
                width: "100%", padding: "48px 24px", borderRadius: 24, marginBottom: 28,
                background: "rgba(18,4,8,0.88)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,215,0,0.15)", textAlign: "center",
              }}>
                <div style={{ fontSize: 10, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,215,0,0.4)", marginBottom: 16 }}>
                  Selecting Winner #{winners.length + 1}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFD700", animation: `floatBadge 0.4s ${i * 0.12}s ease-in-out infinite` }} />
                  ))}
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700,
                  color: "#fff", animation: "nameCycle 0.12s ease-in-out infinite",
                  textShadow: "0 0 30px rgba(255,215,0,0.3)",
                }}>{shuffleName}</div>
              </div>
            )}

            {/* WINNER CARD */}
            {phase === "revealed" && current && (
              <div style={{ position: "relative", width: "100%", marginBottom: 28 }}>
                <ConfettiBurst trigger={confettiKey} />
                <div style={{
                  position: "relative", overflow: "hidden",
                  background: "linear-gradient(160deg, rgba(28,6,12,0.95), rgba(60,8,18,0.92))",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  borderRadius: 28, padding: "40px 36px 32px",
                  animation: "cardReveal 0.7s cubic-bezier(.16,1,.3,1), glowPulse 3s ease-in-out infinite",
                }}>
                  {/* shimmer */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #FFD700, transparent)", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", animation: "shimmer 2s infinite" }} />
                  </div>
                  {/* badge */}
                  <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "6px 20px", borderRadius: 40,
                      background: "linear-gradient(135deg, rgba(207,10,44,0.3), rgba(255,215,0,0.15))",
                      border: "1px solid rgba(255,215,0,0.2)",
                      animation: "floatBadge 2s ease-in-out infinite",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
                      <span style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#FFD700" }}>Winner #{winners.length}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", margin: "12px 0 8px" }}><TrophySVG size={72} /></div>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, textAlign: "center",
                    background: "linear-gradient(135deg, #FFD700, #FFF, #FFD700)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    marginBottom: 24, lineHeight: 1.2, filter: "drop-shadow(0 2px 10px rgba(255,215,0,0.3))",
                  }}>{current.name}</h2>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px",
                    padding: "20px 24px", borderRadius: 16,
                    background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,215,0,0.08)",
                  }}>
                    {[
                      { label: "Line of Business", value: current.lob, sub: LOB_FULL[current.lob] },
                      { label: "Email Address", value: current.email },
                    ].map(({ label, value, sub }) => (
                      <div key={label}>
                        <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,215,0,0.45)", marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 15, color: "#FFE8CC", fontWeight: 500 }}>{value}</div>
                        {sub && <div style={{ fontSize: 11, color: "rgba(255,215,0,0.35)", marginTop: 2 }}>{sub}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* IDLE */}
            {phase === "idle" && (
              <div style={{
                width: "100%", padding: "56px 24px", borderRadius: 24, marginBottom: 28,
                background: "rgba(18,4,8,0.6)", backdropFilter: "blur(12px)",
                border: "1px dashed rgba(255,215,0,0.12)", textAlign: "center",
                animation: "fadeIn .6s ease",
              }}>
                <TrophySVG size={56} />
                <p style={{ marginTop: 16, fontSize: 16, color: "rgba(255,215,0,0.4)", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                  Press the button below to pick 3 lucky winners
                </p>
              </div>
            )}

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              {!allPicked && phase !== "shuffling" && (
                <button className="pick-btn" onClick={pickWinner} style={{
                  padding: "18px 56px", borderRadius: 60, border: "none", cursor: "pointer",
                  fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: 4, textTransform: "uppercase", color: "#fff",
                  background: "linear-gradient(135deg, #CF0A2C 0%, #8B0000 100%)",
                  boxShadow: "0 6px 30px rgba(207,10,44,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}>✦  Pick Winner  ✦</button>
              )}
              {allPicked && (
                <div style={{
                  padding: "16px 36px", borderRadius: 16,
                  background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.2)",
                  color: "#FFD700", fontSize: 15, fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                }}>All 3 Winners have been selected! 🎉</div>
              )}
              {winners.length > 0 && phase !== "shuffling" && (
                <button className="reset-btn" onClick={resetDraw} style={{
                  padding: "16px 36px", borderRadius: 60, cursor: "pointer",
                  fontSize: 13, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase",
                  color: "rgba(255,215,0,0.6)", background: "transparent",
                  border: "1px solid rgba(255,215,0,0.2)", fontFamily: "'DM Sans', sans-serif",
                }}>Reset Draw</button>
              )}
            </div>
          </div>

          {/* HISTORY PANEL */}
          <div style={{ flex: "0 0 280px", maxWidth: 320 }}>
            <div style={{
              background: "rgba(18,4,8,0.82)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,215,0,0.1)", borderRadius: 20,
              padding: "20px 16px", maxHeight: "calc(100vh - 260px)", overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,215,0,0.08)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
                <span style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#FFD700", fontWeight: 600 }}>Winners</span>
                {winners.length > 0 && (
                  <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 10px", borderRadius: 20, background: "rgba(207,10,44,0.3)", color: "#FFD700" }}>{winners.length}</span>
                )}
              </div>
              <div ref={historyRef} style={{ overflowY: "auto", flex: 1 }}>
                {winners.length === 0 && (
                  <p style={{ fontSize: 13, color: "rgba(255,215,0,0.2)", textAlign: "center", padding: "32px 0", fontStyle: "italic" }}>No winners yet</p>
                )}
                {winners.map((w, i) => (
                  <div key={i} className="hist-item" style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 12, marginBottom: 6,
                    background: i === winners.length - 1 ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${i === winners.length - 1 ? "rgba(255,215,0,0.15)" : "transparent"}`,
                    animation: i === winners.length - 1 ? "fadeIn .5s ease" : "none",
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #CF0A2C, #8B0000)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#fff",
                      boxShadow: i === winners.length - 1 ? "0 0 12px rgba(207,10,44,0.4)" : "none",
                    }}>{i + 1}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#FFE8CC", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,215,0,0.4)" }}>{w.lob} · {LOB_FULL[w.lob]?.split(" ")[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
