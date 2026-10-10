idea 

Neeche ka hissa ab dikh raha hai. wimt-testing-kit-live.html mein map pehle ek fixed height mein band tha, isliye neeche ke boxes (Answers, Tachyon, Manifest) aur timeline kat jaate the. Ab map apni poori height leta hai. Maine 1440×800, 1536×730, 1920×950 aur 2560 pe check kiya, sab ek screen mein poora dikhta hai. Bahut chhoti screen (1280×610) pe card ke andar thoda scroll aayega. Kam height wali screen pe trace feed aur timeline apne aap chhup jaate hain, taaki diagram poora dikhe.

Tumhara sawaal: kya main samajh raha hoon, aur evaluation fast kaise ho

Haan, mujhe flow samajh aa raha hai:

Pre: dataset ki har query GPT Supervisor ko bhejte ho (Tachyon ke through), aur answers _pre.parquet mein save hote hain.
Extract: Overwatch se un answers ke traces nikaal ke traces.json mein rakhte ho.
Post: LLM judge aur embeddings se har answer ko score karte ho, aur result _post.xlsx aur run_manifest.json mein jaata hai.
Har stage ka output ek file (artifact) ke roop mein save hota hai, aur agla stage usi file ko padhta hai.

Speed badhane ke tarike, sabse bade fayde se shuru karke. Ye andaze tumhare UI aur pehle ki baaton pe based hain, maine tumhara backend code nahi dekha hai.

1. Pre ko har factor ke liye alag mat chalao, ek baar chalao.

Agar abhi har factor apna alag Pre chala raha hai, to 9 factors × 462 queries matlab Supervisor ko lagbhag 4,000 calls.
Jabki Hallucination, Performance, Explainability, Toxicity aur Judge, sab ek hi answer ko alag-alag nazar se jaanchte hain.
Isliye Pre ek baar chalao aur uske answers saare factors share karein. Sirf Sensitivity (reworded queries) aur Replication (wahi query dobara) ko apni extra calls chahiye.
Saath mein answers ko cache karo, hash(query + supervisor version + prompt version) ke key se, taaki agle run mein jo query nahi badli wo dobara na chale.
Sabse zyada time yahin bachne ki ummeed hai.

2. Stages ke beech ki deewar hatao (streaming pipeline).

Abhi Extract tab tak shuru nahi hota jab tak saari 462 queries ka Pre poora na ho jaaye. Yahi “WAITING” tumhe UI mein dikhta hai.
Agar har query ek queue ke through aage badhe (answer aaya → trace nikla → score hua), to teeno stages saath-saath chalenge.
Python mein ye asyncio workers aur queues se ho jaata hai. Total time lagbhag sabse dheeme stage jitna reh jaata hai, teeno ke jod jitna nahi.

3. Har API pe sahi concurrency rakho.

Tachyon aur Overwatch ki rate limit ke hisaab se har API ke liye ek Semaphore lagao (jaise 10–20 calls ek saath), saath mein retry aur backoff.
Embeddings ek-ek text ke liye mat mangvao, ek call mein kai texts bhejo (batch karo).

4. Overwatch se traces bulk mein lo.

Har query bhejte waqt uske metadata mein run_id daal do.
Phir har query ke liye alag se trace dhundhne ki jagah, run_id ya time window se ek bade call mein saare traces le lo.
Agar traces Overwatch mein thodi der se aate hain, to wait-and-poll ek baar poore run ke liye karo, har query ke liye nahi.

5. Judge ko sasta karo.

Ek judge call mein ek answer ke saare claims ek saath bhejo.
Judge results ko bhi cache karo, hash(answer + context + rubric version) se. Rubric na badla ho to dobara score karne ki zaroorat nahi.

6. Files ka tareeka: final artifact rakho, beech ke kaam ke liye nahi.

Audit aur MRM ke liye parquet/xlsx/manifest files theek hain, unhe rakho.
Par beech mein har query ka result turant ek DB table ya append-only store mein likho, aur xlsx sirf end mein ek baar banao.
Isse ek fayda aur hai: run beech mein fail ho to wahin se resume ho sakta hai, poora dobara nahi chalana padta.

7. Change Management ke liye sirf badla hua dobara chalao.
Agar sirf prompt ya model badla hai, to sirf affected factors aur queries dobara chalao. Baaki purane cached results use karo.

Shuru kahan se karein: pehle ek run ka time breakdown nikalo, yaani Pre, Extract aur Post mein alag-alag kitna time laga, aur kitna time sirf wait (rate limit ya Overwatch delay) mein gaya. Jo sabse bada hissa hoga, wahi pehle theek karna chahiye. Mujhe ye numbers, ya pre_X.py, traces_extractor.py aur post_X.py ka code bhej do, to main exact bata dunga ki kahan kitna time bachega aur code mein kya badalna hai.





HEADER 

<img width="1470" height="69" alt="Screenshot 2026-10-11 at 1 17 36 AM" src="https://github.com/user-attachments/assets/412a59b5-f29a-44df-b24b-1b93cfe078d8" />



Evaluation part
<img width="1274" height="625" alt="Screenshot 2026-10-11 at 1 17 59 AM" src="https://github.com/user-attachments/assets/633c48cc-c147-4a74-9864-6fac01223e22" />

code : <!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Model Testing Kit · WIMT Evaluation Studio</title>
<style>
/* ==================================================================
   Model Testing Kit — Progress (Overview)
   Same info as current page; classic 4K polish.
   - Run summary: progress ring + stage counts
   - Each factor row: Pre → Extract → Post as ONE connected pipeline
   - Static (no animation). Table scrolls inside the card, page doesn't.
   ================================================================== */
:root{
  --red:#C8202A; --red-2:#D71E28; --red-d:#A6141C; --soft:#FBEEEE;
  --gold:#FFCD41; --gold-d:#E8B425; --gold-ink:#8A6A0F;
  --green:#1F7A4D; --green-s:#E7F3EC; --amber:#9A6412; --amber-s:#FFF4DC;
  --ink:#1D1815; --ink-2:#4A423C; --ink-3:#857A71; --ink-4:#B3A89E;
  --line:#ECE4DB; --line-2:#F2ECE5; --bg:#F6F3EF;
  --serif: Georgia, "Times New Roman", serif;
  --sans: "Segoe UI", -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: Consolas, ui-monospace, Menlo, monospace;
  --bar:64px; --side:220px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:var(--sans);color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased}
button{font:inherit;cursor:pointer;border:0;background:none;color:inherit}
a{color:inherit;text-decoration:none}
svg{display:block}
/* ---------- App bar ---------- */
.appbar{height:var(--bar);background:linear-gradient(180deg,var(--red-2),var(--red));border-bottom:3px solid var(--gold);display:flex;align-items:center;padding:0 22px 0 18px;gap:16px;color:#fff}
.burger,.ibtn{width:38px;height:38px;display:grid;place-items:center;border-radius:8px;color:#fff}
.burger:hover,.ibtn:hover{background:rgba(255,255,255,.12)}
.ibtn svg{width:20px;height:20px}
.wf{font-family:var(--serif);font-weight:700;font-size:26px;letter-spacing:.6px;white-space:nowrap} /* brand team logo file se replace karo */
.vbar{width:1px;height:30px;background:rgba(255,255,255,.35)}
.studio{display:flex;align-items:center;gap:10px}
.studio .mk{width:34px;height:34px;flex:none}
.studio .mk svg{width:100%;height:100%}
.studio small{display:block;font-family:"Segoe UI",var(--sans);font-size:10.5px;letter-spacing:2.6px;color:#FFE08A;font-weight:600;line-height:1;margin-bottom:4px}
.studio b{display:block;font-family:"Segoe UI",var(--sans);font-size:18px;font-weight:400;letter-spacing:.2px;line-height:1}
.studio b strong{font-weight:600}
.appbar .sp{flex:1}
.user{display:flex;align-items:center;gap:10px;margin-left:8px;font-weight:600;font-size:15px}
.user i{width:34px;height:34px;border-radius:50%;background:#fff;color:var(--red);display:grid;place-items:center;font-style:normal;font-weight:700;font-size:13px}

/* ---------- Sidebar ---------- */
.shell{display:grid;grid-template-columns:var(--side) minmax(0,1fr);height:calc(100% - var(--bar))}
.side{background:linear-gradient(180deg,var(--red),var(--red-d));color:#fff;padding:18px 10px 16px;display:flex;flex-direction:column;gap:4px}
.side h6{font-size:11px;letter-spacing:1.6px;color:var(--gold);opacity:.85;margin:10px 12px 6px;font-weight:700}
.nav{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;font-size:14.5px;color:rgba(255,255,255,.9)}
.nav svg{width:19px;height:19px;flex:none;opacity:.85}
.nav:hover{background:rgba(255,255,255,.08)}
.nav.on{background:rgba(255,255,255,.9);color:var(--red-d);font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.12)}
.side .push{margin-top:auto}



/* ==================================================================
   Model Testing Kit — LIVE (animated)
   Idea: har factor ek "production line" hai. Queries chhote dots ki tarah
   Pre → Extract → Post stations se behti hain. Upar "query matrix" me
   har query ek dot hai jo process hote hi jal uthta hai.
   prefers-reduced-motion pe saari motion band.
   ================================================================== */
.main{height:100%;overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:clamp(10px,1.6vh,20px);
  padding:clamp(14px,2.2vh,30px) clamp(18px,2.2vw,44px) clamp(14px,2.4vh,30px)}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(200,32,42,.45)}70%{box-shadow:0 0 0 10px rgba(200,32,42,0)}100%{box-shadow:0 0 0 0 rgba(200,32,42,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{from{background-position:-200px 0}to{background-position:200px 0}}
@keyframes flow{0%{left:0;opacity:0}12%{opacity:1}88%{opacity:1}100%{left:var(--to);opacity:0}}
@keyframes pop{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
.ph,.setup,.card{animation:rise .6s cubic-bezier(.2,.7,.2,1) both}
.setup{animation-delay:.08s}.card{animation-delay:.16s}

.ph{display:flex;align-items:center;gap:16px;min-width:0}
.back{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:#fff;color:var(--ink-2);flex:none;transition:all .2s}
.back:hover{border-color:var(--red);color:var(--red);transform:translateX(-2px)}
.back svg{width:18px;height:18px}
.ph .tt{min-width:0;flex:1}
.ph h1{font-family:var(--serif);font-weight:400;font-size:clamp(24px,min(2.1vw,4.2vh),44px);line-height:1.05;letter-spacing:-.01em}
.ph p{font-size:clamp(12.5px,min(.85vw,1.75vh),15px);color:var(--ink-3);margin-top:4px}
.live{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:600;color:var(--red-d);flex:none}
.live i{width:8px;height:8px;border-radius:50%;background:var(--red);animation:pulse 1.6s infinite}
.live span{color:var(--ink-3);font-weight:500;font-family:var(--mono);font-size:12px;min-width:56px}
.live.done{color:var(--green)} .live.done i{background:var(--green);animation:none}

.setup{display:grid;grid-template-columns:auto repeat(3,minmax(0,1fr));background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.setup .lab{display:flex;align-items:center;gap:8px;padding:0 18px;font-size:10.5px;font-weight:700;letter-spacing:.18em;color:var(--red-d);background:linear-gradient(180deg,#FFF8F6,#fff);border-right:1px solid var(--line-2)}
.setup .lab::before{content:"";width:3px;height:16px;border-radius:2px;background:var(--red)}
.sel{display:flex;align-items:center;gap:12px;padding:clamp(8px,1.3vh,14px) 18px;border-left:1px solid var(--line-2);min-width:0;text-align:left;transition:background .2s}
.sel:first-of-type{border-left:0}
.sel:hover{background:#FFFBF7}
.sel .si{width:32px;height:32px;border-radius:9px;background:var(--soft);color:var(--red);display:grid;place-items:center;flex:none}
.sel .si svg{width:16px;height:16px}
.sel .sx{min-width:0;flex:1}
.sel small{display:block;font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-4)}
.sel b{display:block;font-size:clamp(12.5px,min(.88vw,1.8vh),15px);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.sel .cv{width:16px;height:16px;color:var(--ink-4);flex:none}

.card{position:relative;min-height:0;display:grid;grid-template-rows:auto auto auto minmax(0,1fr);background:#FFFEFC;border:1px solid #E6DDD3;border-radius:18px;overflow:hidden;
  box-shadow:inset 0 0 0 5px #FFFEFC,inset 0 0 0 6px #F1EAE1,0 24px 48px -32px rgba(60,20,10,.30)}
.card::before{content:"";position:absolute;left:0;right:0;top:0;height:5px;z-index:3;background:linear-gradient(90deg,var(--red-d),var(--red),#E06A70,var(--red),var(--red-d));background-size:200% 100%;animation:shimmer 6s linear infinite}
.card::after{content:"";position:absolute;left:0;right:0;top:6px;height:1px;z-index:3;background:linear-gradient(90deg,transparent,#E8B425 20%,#E8B425 80%,transparent);opacity:.7}

.tabs{display:flex;align-items:flex-end;gap:6px;padding:14px clamp(16px,1.6vw,30px) 0;border-bottom:1px solid var(--line-2)}
.tab{display:inline-flex;align-items:center;gap:9px;padding:12px 14px 13px;font-size:clamp(13px,min(.92vw,1.85vh),16px);font-weight:600;color:var(--ink-3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s}
.tab:hover{color:var(--ink)}
.tab svg{width:16px;height:16px}
.tab.on{color:var(--red-d);border-bottom-color:var(--red)}
.tab .ld{width:7px;height:7px;border-radius:50%;background:var(--red);animation:pulse 1.6s infinite}
.tabs .sp{flex:1}
.tabs .hint{font-size:12px;color:var(--ink-3);padding-bottom:14px}
.tabs .hint b{font-family:var(--mono);color:var(--ink-2)}

.fchips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:clamp(10px,1.6vh,16px) clamp(16px,1.6vw,30px)}
.fchips::-webkit-scrollbar{display:none}
.fc{flex:none;display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:13px;font-weight:500;color:var(--ink-2);white-space:nowrap;transition:all .25s}
.fc:hover{border-color:var(--red);transform:translateY(-1px)}
.fc .d{width:10px;height:10px;border-radius:50%;background:var(--ink-4);display:grid;place-items:center}
.fc.run .d{background:transparent;border:2px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.fc.done .d{background:var(--green);animation:pop .4s ease}
.fc.done .d::after{content:"";width:4px;height:2px;border-left:1.5px solid #fff;border-bottom:1.5px solid #fff;transform:rotate(-45deg) translate(0,-1px)}
.fc.on{background:var(--ink);border-color:var(--ink);color:#fff}
.fc svg{width:14px;height:14px} .fc.on svg{color:var(--gold)}

/* ---------- hero: ring + matrix + KPIs ---------- */
.hero{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto auto;align-items:center;gap:clamp(14px,1.6vw,30px);
  margin:0 clamp(16px,1.6vw,30px) clamp(8px,1.4vh,14px);padding:clamp(10px,1.6vh,18px) clamp(14px,1.4vw,24px);border-radius:14px;
  background:linear-gradient(90deg,#FFF5F3,#FFFDFB 55%,#FFFBF2);border:1px solid #F3E2DD;position:relative;overflow:hidden}
.ring{position:relative;width:clamp(58px,8.4vh,88px);height:clamp(58px,8.4vh,88px);border-radius:50%;
  background:conic-gradient(var(--red) calc(var(--p) * 1%),#F3E3DF 0);transition:--p 1s;display:grid;place-items:center}
.ring::before{content:"";position:absolute;inset:7px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 1px #F3E3DF}
.ring::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px dashed rgba(200,32,42,.25);animation:spin 18s linear infinite}
.ring b{position:relative;font-family:var(--serif);font-size:clamp(16px,2.5vh,24px);color:var(--red-d)}
@property --p{syntax:"<number>";inherits:false;initial-value:0}
.who b{display:block;font-size:clamp(14px,min(1vw,2vh),18px);font-weight:600;white-space:nowrap}
.who b em{font-style:normal;color:var(--red)}
.who span{display:block;font-size:clamp(12px,min(.8vw,1.6vh),14px);color:var(--ink-3);margin-top:3px;white-space:nowrap}
.who .eta{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;color:var(--gold-ink);background:#FFF4D6;padding:3px 9px;border-radius:999px}
.mx{position:relative;min-width:0;height:clamp(46px,7.4vh,78px)}
.mx canvas{width:100%;height:100%;display:block}
.mx small{position:absolute;right:0;bottom:-2px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-4);background:linear-gradient(90deg,transparent,#FFFBF5 20%);padding-left:16px}
.kpis{display:flex;gap:clamp(14px,1.4vw,28px)}
.kpi strong{display:block;font-family:var(--serif);font-weight:400;font-size:clamp(18px,min(1.5vw,3vh),28px);line-height:1;transition:transform .3s}
.kpi strong.bump{animation:pop .4s ease}
.kpi small{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);margin-top:5px}
.kpi small i{width:7px;height:7px;border-radius:50%}
.kpi.r small i{background:var(--red)} .kpi.q small i{background:var(--ink-4)} .kpi.d small i{background:var(--green)}
.cancel{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:9px;border:1px solid #E9CFCF;background:#fff;color:var(--red-d);font-weight:600;font-size:13.5px;transition:all .2s}
.cancel:hover{background:var(--red);color:#fff;border-color:var(--red)}
.cancel svg{width:14px;height:14px}

/* ---------- lanes ---------- */
.lw{min-height:0;overflow:auto;margin:0 clamp(16px,1.6vw,30px) clamp(10px,1.6vh,18px);border:1px solid var(--line);border-radius:12px;background:#fff;scrollbar-width:thin}
.lg{--cols:minmax(230px,26%) minmax(0,1fr) 128px 92px 36px}
.lh{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:var(--cols);align-items:center;background:#FBF8F4;border-bottom:1px solid var(--line);
  font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
.lh > *{padding:11px 16px}
.lh .st3{display:grid;grid-template-columns:repeat(3,1fr) 22px;padding-left:16px}
.lr{display:grid;grid-template-columns:var(--cols);align-items:center;border-bottom:1px solid var(--line-2);cursor:pointer;position:relative;
  animation:rise .5s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(.25s + var(--i) * .06s);transition:background .2s}
.lr:last-child{border-bottom:0}
.lr > *{padding:clamp(9px,1.5vh,16px) 16px;min-width:0}
.lr:hover{background:#FFFBF8}
.lr::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;transition:background .3s}
.lr.running::before{background:var(--red)} .lr.done::before{background:var(--green)}
.fn{display:flex;align-items:center;gap:12px}
.fn .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none;background:#F4F0EB;color:var(--ink-3);transition:all .3s}
.running .fn .ic{background:var(--soft);color:var(--red)}
.done .fn .ic{background:var(--green-s);color:var(--green)}
.fn .ic svg{width:16px;height:16px}
.fn div{min-width:0}
.fn b{display:block;font-size:clamp(13px,min(.92vw,1.85vh),16px);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fn span{display:block;font-size:clamp(11.5px,min(.78vw,1.55vh),13.5px);color:var(--ink-3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.lane{display:grid;grid-template-columns:repeat(3,1fr) 22px;align-items:center}
.sg{position:relative;display:flex;align-items:center;gap:8px;padding-right:10px}
.nd{position:relative;width:14px;height:14px;border-radius:50%;flex:none;background:#fff;border:2px solid #DCD3C9;z-index:1;transition:all .4s}
.sg.done .nd{background:var(--red);border-color:var(--red);animation:pop .4s ease}
.sg.act .nd{border-color:var(--red);animation:pulse 1.4s infinite}
.tr{position:relative;flex:1;height:8px;border-radius:4px;background:#F0EAE3;overflow:hidden}
.tr i{position:absolute;left:0;top:0;bottom:0;width:calc(var(--v) * 1%);border-radius:4px;background:linear-gradient(90deg,var(--red-d),var(--red));transition:width 1s cubic-bezier(.2,.7,.2,1)}
.sg.act .tr i{background:linear-gradient(90deg,var(--red-d),var(--red) 50%,#F08A8F 60%,var(--red) 70%),var(--red);background-size:200px 100%;animation:shimmer 1.4s linear infinite}
.tr u{position:absolute;top:1px;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 6px 1px rgba(255,255,255,.9);--to:calc(var(--v) * 1% - 6px);animation:flow 1.8s linear infinite;opacity:0}
.tr u:nth-child(3){animation-delay:.6s}.tr u:nth-child(4){animation-delay:1.2s}
.sg:not(.act) .tr u{display:none}
.pc{width:40px;text-align:right;font-family:var(--mono);font-size:12px;color:var(--ink-4);flex:none;transition:color .3s}
.sg.done .pc{color:var(--ink-2)} .sg.act .pc{color:var(--red-d);font-weight:700}
.fin{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;border:2px dashed #DCD3C9;color:transparent;transition:all .4s}
.fin svg{width:12px;height:12px}
.done .fin{border:0;background:var(--green);color:#fff;animation:pop .5s ease}

.st{display:inline-flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:all .3s}
.st i{width:9px;height:9px;border-radius:50%}
.st.running{background:var(--soft);color:var(--red-d)} .st.running i{border:2px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.st.queued{background:#F3EFEA;color:var(--ink-3)} .st.queued i{background:var(--ink-4)}
.st.done{background:var(--green-s);color:var(--green)} .st.done i{background:var(--green)}
.tm{font-family:var(--mono);font-size:12.5px;color:var(--ink-2)} .tm.na{color:var(--ink-4)}
.go{color:var(--ink-4);transition:all .2s} .go svg{width:16px;height:16px}
.lr:hover .go{color:var(--red);transform:translateX(3px)}

/* toast when a factor finishes */
.toast{position:fixed;right:28px;bottom:28px;z-index:20;display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;background:var(--ink);color:#fff;font-size:13.5px;
  box-shadow:0 18px 40px -16px rgba(0,0,0,.45);transform:translateY(20px);opacity:0;transition:all .35s cubic-bezier(.2,.7,.2,1);pointer-events:none}
.toast.show{transform:none;opacity:1}
.toast i{width:22px;height:22px;border-radius:50%;background:var(--green);display:grid;place-items:center}
.toast i svg{width:12px;height:12px}

@media (max-height:700px){ .fn span{display:none} .fn .ic{width:28px;height:28px} .who span{display:none} }
@media (max-width:1500px){ .kpi.d{display:none} }
@media (max-width:1280px){ .mx{display:none} .hero{grid-template-columns:auto minmax(0,1fr) auto auto} }
@media (max-width:1180px){ :root{--side:72px} .side h6,.nav span{display:none} .nav{justify-content:center} .wf{font-size:20px} .kpis{display:none} .pc{display:none} }
@media (prefers-reduced-motion: reduce){ *,*::before,*::after{animation:none !important;transition:none !important} }
</style>
</head>
<body>
<header class="appbar">
  <button class="burger" aria-label="Menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  <span class="wf">WELLS FARGO</span>
  <span class="vbar"></span>
  <div class="studio">
    <span class="mk"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 33L33 27" stroke="#FFCD41" stroke-width="3.2" stroke-linecap="round"/><path d="M7 33L24 9" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M17.3 30.6A11 11 0 0 0 13.2 24" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/><circle cx="33" cy="27" r="3.8" fill="#FFCD41"/><circle cx="24" cy="9" r="3.8" fill="#fff"/><circle cx="7" cy="33" r="3.2" fill="#fff"/></svg></span>
    <div><small>WIMT</small><b>Evaluation <strong>Studio</strong></b></div>
  </div>
  <div class="sp"></div>
  <button class="ibtn" aria-label="Flows"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a3 3 0 0 1 3 3V14"/></svg></button>
  <button class="ibtn" aria-label="Data"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg></button>
  <button class="ibtn" aria-label="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg></button>
  <div class="user">Rahul <i>R</i></div>
</header>

<div class="shell">
  <aside class="side">
    <h6>WORKSPACE</h6>
    <a class="nav" href="#/home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg><span>Home</span></a>
    <a class="nav on" href="#/evaluate" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a3 3 0 0 1 3 3v6.5"/></svg><span>Evaluation</span></a>
    <a class="nav" href="#/playground"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="5" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M6 7.2v4.3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v-.5"/></svg><span>Model Playground</span></a>
    <h6>LIBRARY</h6>
    <a class="nav" href="#/prompts"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg><span>Prompt Hub</span></a>
    <a class="nav" href="#/golden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg><span>Golden Dataset</span></a>
    <a class="nav" href="#/traces"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg><span>Data &amp; Traces</span></a>
    <a class="nav push" href="#/settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg><span>Settings</span></a>
  </aside>

      <main class="main">
    <section class="ph">
      <button class="back" aria-label="Back to Evaluation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
      <div class="tt"><h1>Model Testing Kit</h1><p>WIMT Model Testing Framework over an uploaded query set</p></div>
      <span class="live" id="live"><i></i><em id="liveTxt" style="font-style:normal">Running</em> <span id="elapsed">20m 05s</span></span>
    </section>

    <section class="setup" aria-label="Run setup">
      <div class="lab">RUN SETUP</div>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg></span><span class="sx"><small>Dataset</small><b id="sDataset"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg></span><span class="sx"><small>Supervisor</small><b id="sEnv"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><span class="sx"><small>Factors</small><b id="sFactors"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
    </section>

    <section class="card">
      <div class="tabs" role="tablist">
        <button class="tab on" role="tab" aria-selected="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>Progress <span class="ld" id="tabDot"></span></button>
        <button class="tab" role="tab" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></svg>Analytics</button>
        <span class="sp"></span><span class="hint">Run <b id="runId"></b></span>
      </div>
      <div class="fchips" id="chips"></div>

      <div class="hero">
        <div class="ring" id="ring" style="--p:0"><b id="pct">0%</b></div>
        <div class="who"><b>Run · <em id="runState">running</em></b><span id="runMeta"></span><span class="eta" id="eta">≈ estimating…</span></div>
        <div class="mx"><canvas id="mx"></canvas><small id="mxLab">queries</small></div>
        <div class="kpis">
          <div class="kpi r"><strong id="kRun">0</strong><small><i></i>Running</small></div>
          <div class="kpi q"><strong id="kQ">0</strong><small><i></i>Queued</small></div>
          <div class="kpi d"><strong id="kD">0</strong><small><i></i>Done</small></div>
        </div>
        <button class="cancel" id="cancel"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>Cancel run</button>
      </div>

      <div class="lw lg">
        <div class="lh"><div>Factor</div><div class="st3"><span>Pre</span><span>Extract</span><span>Post</span><span></span></div><div>Status</div><div>Time</div><div></div></div>
        <div id="lanes"></div>
      </div>
    </section>
  </main>
</div>
<div class="toast" id="toast"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></i><span id="toastTxt"></span></div>

<script>
/* ------------------------------------------------------------------
   USE_MOCK = true → demo simulation chalti hai (animation dekhne ke liye).
   Real app me USE_MOCK = false karo aur SSE se TestingKit.update(snapshot) call karo.
   Snapshot shape = RUN object. null = unknown → "—" (kabhi 0 nahi).
   ------------------------------------------------------------------ */
const USE_MOCK = true;
const RUN = {
  id:"mtk-0462", state:"running", startedAt: Date.now() - (20*60+5)*1000,
  file:"Copy_of_CM_Golden_Dataset.xlsx", rows:462, env:"DEV",
  factors:[
    {id:"cm",name:"Change Management",desc:"Toxicity, performance & sensitivity bundle",pre:66,extract:0,post:0,status:"running",start:Date.now()-1205000},
    {id:"perf",name:"Performance",desc:"Response quality and speed",pre:100,extract:100,post:0,status:"running",start:Date.now()-1205000},
    {id:"hal",name:"Hallucination",desc:"Answers grounded in sources",pre:100,extract:12,post:0,status:"running",start:Date.now()-1205000},
    {id:"exp",name:"Explainability",desc:"Clear reasons behind answers",pre:0,extract:0,post:0,status:"queued"},
    {id:"rep",name:"Replication",desc:"Same question, same answer",pre:0,extract:0,post:0,status:"queued"},
    {id:"cal",name:"Parameter Calibration",desc:"Tune parameters on the dataset",pre:0,extract:0,post:0,status:"queued"},
    {id:"bm",name:"Benchmarking",desc:"Compare against a baseline",pre:0,extract:0,post:0,status:"queued"},
    {id:"sen",name:"Sensitivity",desc:"Stable when wording changes",pre:0,extract:0,post:0,status:"queued"},
    {id:"judge",name:"Judge Evaluation",desc:"Judge agreement with SMEs",pre:0,extract:0,post:0,status:"queued"}
  ]
};
const ICON={cm:'<path d="M3 7h18M3 12h18M3 17h12"/>',perf:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',hal:'<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
 exp:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/>',
 rep:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
 cal:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
 bm:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',sen:'<path d="M2 12h3l3-7 4 14 3-7h7"/>',
 judge:'<path d="M12 3v18M7 21h10M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>'};
const svg=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const $=id=>document.getElementById(id);
const fmt=ms=>{if(ms==null||ms<0)return"—";const s=Math.floor(ms/1000);return `${Math.floor(s/60)}m ${String(s%60).padStart(2,"0")}s`;};
const overall=r=>Math.round(r.factors.reduce((a,f)=>a+((f.pre||0)+(f.extract||0)+(f.post||0))/3,0)/r.factors.length);

/* ---- build lanes once, then only update values (so CSS transitions animate) ---- */
function build(r){
  $("sDataset").textContent=r.file; $("sEnv").textContent=r.env+" supervisor"; $("sFactors").textContent=r.factors.length+" selected"; $("runId").textContent="#"+r.id;
  $("runMeta").textContent=`${r.file} · ${r.rows} rows · ${r.env} · ${r.factors.length} factors`;
  $("chips").innerHTML=`<button class="fc on">${svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>')}Overview</button>`+
    r.factors.map(f=>`<button class="fc" data-f="${f.id}"><span class="d"></span>${f.name}</button>`).join("");
  const seg=k=>`<div class="sg" data-k="${k}"><span class="nd"></span><span class="tr" style="--v:0"><i></i><u></u><u></u><u></u></span><span class="pc">—</span></div>`;
  $("lanes").innerHTML=r.factors.map((f,i)=>`<div class="lr" data-f="${f.id}" style="--i:${i}">
    <div class="fn"><span class="ic">${svg(ICON[f.id]||ICON.cm)}</span><div><b>${f.name}</b><span>${f.desc}</span></div></div>
    <div class="lane">${seg("pre")}${seg("extract")}${seg("post")}<span class="fin">${svg('<path d="M5 12l5 5 9-10"/>')}</span></div>
    <div><span class="st"><i></i><em style="font-style:normal"></em></span></div>
    <div><span class="tm"></span></div>
    <div class="go">${svg('<path d="M9 6l6 6-6 6"/>')}</div></div>`).join("");
}
let prevStatus={};
function update(r){
  const p=overall(r); $("ring").style.setProperty("--p",p); $("pct").textContent=p+"%";
  const cnt=s=>r.factors.filter(f=>f.status===s).length;
  [["kRun","running"],["kQ","queued"],["kD","done"]].forEach(([id,s])=>{const el=$(id),v=String(cnt(s));if(el.textContent!==v){el.textContent=v;el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump");}});
  const el=Date.now()-r.startedAt; $("elapsed").textContent=fmt(el);
  const allDone=r.factors.every(f=>f.status==="done");
  $("runState").textContent=allDone?"complete":r.state; $("live").classList.toggle("done",allDone); $("liveTxt").textContent=allDone?"Complete":"Running";
  $("eta").textContent= p>2 && !allDone ? `≈ ${fmt(el*(100-p)/p)} left` : allDone ? "All factors finished" : "≈ estimating…";
  r.factors.forEach(f=>{
    const row=document.querySelector(`.lr[data-f="${f.id}"]`), chip=document.querySelector(`.fc[data-f="${f.id}"]`);
    row.className="lr "+f.status; chip.className="fc "+(f.status==="running"?"run":f.status==="done"?"done":"");
    let prevDone=true;
    ["pre","extract","post"].forEach(k=>{
      const v=f[k], sg=row.querySelector(`.sg[data-k="${k}"]`);
      const st= f.status==="queued" ? "idle" : v>=100 ? "done" : (v>0||prevDone) ? "act" : "idle";
      sg.className="sg "+st; sg.querySelector(".tr").style.setProperty("--v",v||0);
      sg.querySelector(".pc").textContent= st==="idle" && !v ? "—" : (v==null?"—":v+"%");
      prevDone = v>=100;
    });
    const s=row.querySelector(".st"); s.className="st "+f.status; s.querySelector("em").textContent=f.status;
    const tm=row.querySelector(".tm"); const t=f.start? (f.end||Date.now())-f.start : null; tm.textContent=fmt(t); tm.className="tm"+(t==null?" na":"");
    if(prevStatus[f.id]==="running" && f.status==="done") toast(`${f.name} finished · all stages complete`);
    prevStatus[f.id]=f.status;
  });
  matrix.target=Math.round(r.rows*p/100);
}
let tt; function toast(msg){$("toastTxt").textContent=msg;$("toast").classList.add("show");clearTimeout(tt);tt=setTimeout(()=>$("toast").classList.remove("show"),2600);}

/* ---- query matrix: one dot per query; lights up as processed ---- */
const matrix={target:0,shown:0,born:[]};
(function(){
  const cv=$("mx"),ctx=cv.getContext("2d");
  function frame(t){
    const w=cv.clientWidth,h=cv.clientHeight; if(!w){requestAnimationFrame(frame);return;}
    const dpr=window.devicePixelRatio||1; if(cv.width!==w*dpr){cv.width=w*dpr;cv.height=h*dpr;}
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    const n=RUN.rows, rowsN=Math.max(4,Math.floor(h/9)), cols=Math.ceil(n/rowsN), gap=Math.min(9,(w-12)/cols), rad=Math.max(1.4,gap*.28);
    if(matrix.shown<matrix.target){const add=Math.max(1,Math.ceil((matrix.target-matrix.shown)/18));for(let k=0;k<add;k++){matrix.born[matrix.shown]=t;matrix.shown++;}}
    if(matrix.shown>matrix.target){matrix.shown=matrix.target;}
    for(let i=0;i<n;i++){
      const c=Math.floor(i/rowsN), r=i%rowsN, x=6+c*gap, y=h/2-(rowsN-1)*4.5+r*9;
      if(i<matrix.shown){
        const age=(t-(matrix.born[i]||0))/600, s=age<1?1+ (1-age)*.9:1;
        ctx.fillStyle=age<1?`rgba(232,180,37,${1-age*.5})`:"#C8202A";
        ctx.beginPath();ctx.arc(x,y,rad*s,0,7);ctx.fill();
      }else{
        const scan=(Math.sin(t/700 - c*.18)+1)/2;
        ctx.fillStyle=i===matrix.shown?"rgba(200,32,42,.55)":`rgba(160,140,125,${.16+scan*.12})`;
        ctx.beginPath();ctx.arc(x,y,rad*.85,0,7);ctx.fill();
      }
    }
    $("mxLab").textContent=`${matrix.shown} / ${n} queries`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ---- demo simulation ---- */
function step(){
  const run=RUN.factors.filter(f=>f.status==="running");
  run.forEach(f=>{
    const k=f.pre<100?"pre":f.extract<100?"extract":"post";
    f[k]=Math.min(100,f[k]+Math.ceil(Math.random()*7));
    if(f.post>=100){f.status="done";f.end=Date.now();}
  });
  const q=RUN.factors.filter(f=>f.status==="queued");
  while(RUN.factors.filter(f=>f.status==="running").length<3 && q.length){const f=q.shift();f.status="running";f.start=Date.now();}
  update(RUN);
}
build(RUN); update(RUN);
setInterval(()=>{ if(USE_MOCK) step(); else update(RUN); },1000);

window.TestingKit={ update:s=>{Object.assign(RUN,s);update(RUN);} };
document.addEventListener("click",e=>{const t=e.target.closest("[data-f]");if(t)window.dispatchEvent(new CustomEvent("testingkit:factor",{detail:{id:t.dataset.f}}));});
$("cancel").addEventListener("click",()=>window.dispatchEvent(new CustomEvent("testingkit:action",{detail:{type:"cancel",runId:RUN.id}})));
</script>
</body>
</html>







inside part 


<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Model Testing Kit · WIMT Evaluation Studio</title>
<style>
/* ==================================================================
   Model Testing Kit — Progress (Overview)
   Same info as current page; classic 4K polish.
   - Run summary: progress ring + stage counts
   - Each factor row: Pre → Extract → Post as ONE connected pipeline
   - Static (no animation). Table scrolls inside the card, page doesn't.
   ================================================================== */
:root{
  --red:#C8202A; --red-2:#D71E28; --red-d:#A6141C; --soft:#FBEEEE;
  --gold:#FFCD41; --gold-d:#E8B425; --gold-ink:#8A6A0F;
  --green:#1F7A4D; --green-s:#E7F3EC; --amber:#9A6412; --amber-s:#FFF4DC;
  --ink:#1D1815; --ink-2:#4A423C; --ink-3:#857A71; --ink-4:#B3A89E;
  --line:#ECE4DB; --line-2:#F2ECE5; --bg:#F6F3EF;
  --serif: Georgia, "Times New Roman", serif;
  --sans: "Segoe UI", -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: Consolas, ui-monospace, Menlo, monospace;
  --bar:64px; --side:220px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:var(--sans);color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased}
button{font:inherit;cursor:pointer;border:0;background:none;color:inherit}
a{color:inherit;text-decoration:none}
svg{display:block}
/* ---------- App bar ---------- */
.appbar{height:var(--bar);background:linear-gradient(180deg,var(--red-2),var(--red));border-bottom:3px solid var(--gold);display:flex;align-items:center;padding:0 22px 0 18px;gap:16px;color:#fff}
.burger,.ibtn{width:38px;height:38px;display:grid;place-items:center;border-radius:8px;color:#fff}
.burger:hover,.ibtn:hover{background:rgba(255,255,255,.12)}
.ibtn svg{width:20px;height:20px}
.wf{font-family:var(--serif);font-weight:700;font-size:26px;letter-spacing:.6px;white-space:nowrap} /* brand team logo file se replace karo */
.vbar{width:1px;height:30px;background:rgba(255,255,255,.35)}
.studio{display:flex;align-items:center;gap:10px}
.studio .mk{width:34px;height:34px;flex:none}
.studio .mk svg{width:100%;height:100%}
.studio small{display:block;font-family:"Segoe UI",var(--sans);font-size:10.5px;letter-spacing:2.6px;color:#FFE08A;font-weight:600;line-height:1;margin-bottom:4px}
.studio b{display:block;font-family:"Segoe UI",var(--sans);font-size:18px;font-weight:400;letter-spacing:.2px;line-height:1}
.studio b strong{font-weight:600}
.appbar .sp{flex:1}
.user{display:flex;align-items:center;gap:10px;margin-left:8px;font-weight:600;font-size:15px}
.user i{width:34px;height:34px;border-radius:50%;background:#fff;color:var(--red);display:grid;place-items:center;font-style:normal;font-weight:700;font-size:13px}

/* ---------- Sidebar ---------- */
.shell{display:grid;grid-template-columns:var(--side) minmax(0,1fr);height:calc(100% - var(--bar))}
.side{background:linear-gradient(180deg,var(--red),var(--red-d));color:#fff;padding:18px 10px 16px;display:flex;flex-direction:column;gap:4px}
.side h6{font-size:11px;letter-spacing:1.6px;color:var(--gold);opacity:.85;margin:10px 12px 6px;font-weight:700}
.nav{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;font-size:14.5px;color:rgba(255,255,255,.9)}
.nav svg{width:19px;height:19px;flex:none;opacity:.85}
.nav:hover{background:rgba(255,255,255,.08)}
.nav.on{background:rgba(255,255,255,.9);color:var(--red-d);font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.12)}
.side .push{margin-top:auto}



/* ==================================================================
   Model Testing Kit — LIVE (animated)
   Idea: har factor ek "production line" hai. Queries chhote dots ki tarah
   Pre → Extract → Post stations se behti hain. Upar "query matrix" me
   har query ek dot hai jo process hote hi jal uthta hai.
   prefers-reduced-motion pe saari motion band.
   ================================================================== */
.main{height:100%;overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:clamp(10px,1.6vh,20px);
  padding:clamp(14px,2.2vh,30px) clamp(18px,2.2vw,44px) clamp(14px,2.4vh,30px)}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(200,32,42,.45)}70%{box-shadow:0 0 0 10px rgba(200,32,42,0)}100%{box-shadow:0 0 0 0 rgba(200,32,42,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{from{background-position:-200px 0}to{background-position:200px 0}}
@keyframes flow{0%{left:0;opacity:0}12%{opacity:1}88%{opacity:1}100%{left:var(--to);opacity:0}}
@keyframes pop{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
.ph,.setup,.card{animation:rise .6s cubic-bezier(.2,.7,.2,1) both}
.setup{animation-delay:.08s}.card{animation-delay:.16s}

.ph{display:flex;align-items:center;gap:16px;min-width:0}
.back{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:#fff;color:var(--ink-2);flex:none;transition:all .2s}
.back:hover{border-color:var(--red);color:var(--red);transform:translateX(-2px)}
.back svg{width:18px;height:18px}
.ph .tt{min-width:0;flex:1}
.ph h1{font-family:var(--serif);font-weight:400;font-size:clamp(24px,min(2.1vw,4.2vh),44px);line-height:1.05;letter-spacing:-.01em}
.ph p{font-size:clamp(12.5px,min(.85vw,1.75vh),15px);color:var(--ink-3);margin-top:4px}
.live{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:600;color:var(--red-d);flex:none}
.live i{width:8px;height:8px;border-radius:50%;background:var(--red);animation:pulse 1.6s infinite}
.live span{color:var(--ink-3);font-weight:500;font-family:var(--mono);font-size:12px;min-width:56px}
.live.done{color:var(--green)} .live.done i{background:var(--green);animation:none}

.setup{display:grid;grid-template-columns:auto repeat(3,minmax(0,1fr));background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.setup .lab{display:flex;align-items:center;gap:8px;padding:0 18px;font-size:10.5px;font-weight:700;letter-spacing:.18em;color:var(--red-d);background:linear-gradient(180deg,#FFF8F6,#fff);border-right:1px solid var(--line-2)}
.setup .lab::before{content:"";width:3px;height:16px;border-radius:2px;background:var(--red)}
.sel{display:flex;align-items:center;gap:12px;padding:clamp(8px,1.3vh,14px) 18px;border-left:1px solid var(--line-2);min-width:0;text-align:left;transition:background .2s}
.sel:first-of-type{border-left:0}
.sel:hover{background:#FFFBF7}
.sel .si{width:32px;height:32px;border-radius:9px;background:var(--soft);color:var(--red);display:grid;place-items:center;flex:none}
.sel .si svg{width:16px;height:16px}
.sel .sx{min-width:0;flex:1}
.sel small{display:block;font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-4)}
.sel b{display:block;font-size:clamp(12.5px,min(.88vw,1.8vh),15px);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.sel .cv{width:16px;height:16px;color:var(--ink-4);flex:none}

.card{position:relative;min-height:0;display:grid;grid-template-rows:auto auto minmax(0,1fr);background:#FFFEFC;border:1px solid #E6DDD3;border-radius:18px;overflow:hidden;
  box-shadow:inset 0 0 0 5px #FFFEFC,inset 0 0 0 6px #F1EAE1,0 24px 48px -32px rgba(60,20,10,.30)}
.card::before{content:"";position:absolute;left:0;right:0;top:0;height:5px;z-index:3;background:linear-gradient(90deg,var(--red-d),var(--red),#E06A70,var(--red),var(--red-d));background-size:200% 100%;animation:shimmer 6s linear infinite}
.card::after{content:"";position:absolute;left:0;right:0;top:6px;height:1px;z-index:3;background:linear-gradient(90deg,transparent,#E8B425 20%,#E8B425 80%,transparent);opacity:.7}

.tabs{display:flex;align-items:flex-end;gap:6px;padding:14px clamp(16px,1.6vw,30px) 0;border-bottom:1px solid var(--line-2)}
.tab{display:inline-flex;align-items:center;gap:9px;padding:12px 14px 13px;font-size:clamp(13px,min(.92vw,1.85vh),16px);font-weight:600;color:var(--ink-3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s}
.tab:hover{color:var(--ink)}
.tab svg{width:16px;height:16px}
.tab.on{color:var(--red-d);border-bottom-color:var(--red)}
.tab .ld{width:7px;height:7px;border-radius:50%;background:var(--red);animation:pulse 1.6s infinite}
.tabs .sp{flex:1}
.tabs .hint{font-size:12px;color:var(--ink-3);padding-bottom:14px}
.tabs .hint b{font-family:var(--mono);color:var(--ink-2)}

.fchips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:clamp(10px,1.6vh,16px) clamp(16px,1.6vw,30px)}
.fchips::-webkit-scrollbar{display:none}
.fc{flex:none;display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:13px;font-weight:500;color:var(--ink-2);white-space:nowrap;transition:all .25s}
.fc:hover{border-color:var(--red);transform:translateY(-1px)}
.fc .d{width:10px;height:10px;border-radius:50%;background:var(--ink-4);display:grid;place-items:center}
.fc.run .d{background:transparent;border:2px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.fc.done .d{background:var(--green);animation:pop .4s ease}
.fc.done .d::after{content:"";width:4px;height:2px;border-left:1.5px solid #fff;border-bottom:1.5px solid #fff;transform:rotate(-45deg) translate(0,-1px)}
.fc.on{background:var(--ink);border-color:var(--ink);color:#fff}
.fc svg{width:14px;height:14px} .fc.on svg{color:var(--gold)}

/* ---------- hero: ring + matrix + KPIs ---------- */
.hero{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto auto;align-items:center;gap:clamp(14px,1.6vw,30px);
  margin:0 clamp(16px,1.6vw,30px) clamp(8px,1.4vh,14px);padding:clamp(10px,1.6vh,18px) clamp(14px,1.4vw,24px);border-radius:14px;
  background:linear-gradient(90deg,#FFF5F3,#FFFDFB 55%,#FFFBF2);border:1px solid #F3E2DD;position:relative;overflow:hidden}
.ring{position:relative;width:clamp(58px,8.4vh,88px);height:clamp(58px,8.4vh,88px);border-radius:50%;
  background:conic-gradient(var(--red) calc(var(--p) * 1%),#F3E3DF 0);transition:--p 1s;display:grid;place-items:center}
.ring::before{content:"";position:absolute;inset:7px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 1px #F3E3DF}
.ring::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px dashed rgba(200,32,42,.25);animation:spin 18s linear infinite}
.ring b{position:relative;font-family:var(--serif);font-size:clamp(16px,2.5vh,24px);color:var(--red-d)}
@property --p{syntax:"<number>";inherits:false;initial-value:0}
.who b{display:block;font-size:clamp(14px,min(1vw,2vh),18px);font-weight:600;white-space:nowrap}
.who b em{font-style:normal;color:var(--red)}
.who span{display:block;font-size:clamp(12px,min(.8vw,1.6vh),14px);color:var(--ink-3);margin-top:3px;white-space:nowrap}
.who .eta{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;color:var(--gold-ink);background:#FFF4D6;padding:3px 9px;border-radius:999px}
.mx{position:relative;min-width:0;height:clamp(46px,7.4vh,78px)}
.mx canvas{width:100%;height:100%;display:block}
.mx small{position:absolute;right:0;bottom:-2px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-4);background:linear-gradient(90deg,transparent,#FFFBF5 20%);padding-left:16px}
.kpis{display:flex;gap:clamp(14px,1.4vw,28px)}
.kpi strong{display:block;font-family:var(--serif);font-weight:400;font-size:clamp(18px,min(1.5vw,3vh),28px);line-height:1;transition:transform .3s}
.kpi strong.bump{animation:pop .4s ease}
.kpi small{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);margin-top:5px}
.kpi small i{width:7px;height:7px;border-radius:50%}
.kpi.r small i{background:var(--red)} .kpi.q small i{background:var(--ink-4)} .kpi.d small i{background:var(--green)}
.cancel{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:9px;border:1px solid #E9CFCF;background:#fff;color:var(--red-d);font-weight:600;font-size:13.5px;transition:all .2s}
.cancel:hover{background:var(--red);color:#fff;border-color:var(--red)}
.cancel svg{width:14px;height:14px}

/* ---------- lanes ---------- */
.lw{min-height:0;overflow:auto;margin:0 clamp(16px,1.6vw,30px) clamp(10px,1.6vh,18px);border:1px solid var(--line);border-radius:12px;background:#fff;scrollbar-width:thin}
.lg{--cols:minmax(230px,26%) minmax(0,1fr) 128px 92px 36px}
.lh{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:var(--cols);align-items:center;background:#FBF8F4;border-bottom:1px solid var(--line);
  font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
.lh > *{padding:11px 16px}
.lh .st3{display:grid;grid-template-columns:repeat(3,1fr) 22px;padding-left:16px}
.lr{display:grid;grid-template-columns:var(--cols);align-items:center;border-bottom:1px solid var(--line-2);cursor:pointer;position:relative;
  animation:rise .5s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(.25s + var(--i) * .06s);transition:background .2s}
.lr:last-child{border-bottom:0}
.lr > *{padding:clamp(9px,1.5vh,16px) 16px;min-width:0}
.lr:hover{background:#FFFBF8}
.lr::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;transition:background .3s}
.lr.running::before{background:var(--red)} .lr.done::before{background:var(--green)}
.fn{display:flex;align-items:center;gap:12px}
.fn .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none;background:#F4F0EB;color:var(--ink-3);transition:all .3s}
.running .fn .ic{background:var(--soft);color:var(--red)}
.done .fn .ic{background:var(--green-s);color:var(--green)}
.fn .ic svg{width:16px;height:16px}
.fn div{min-width:0}
.fn b{display:block;font-size:clamp(13px,min(.92vw,1.85vh),16px);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fn span{display:block;font-size:clamp(11.5px,min(.78vw,1.55vh),13.5px);color:var(--ink-3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.lane{display:grid;grid-template-columns:repeat(3,1fr) 22px;align-items:center}
.sg{position:relative;display:flex;align-items:center;gap:8px;padding-right:10px}
.nd{position:relative;width:14px;height:14px;border-radius:50%;flex:none;background:#fff;border:2px solid #DCD3C9;z-index:1;transition:all .4s}
.sg.done .nd{background:var(--red);border-color:var(--red);animation:pop .4s ease}
.sg.act .nd{border-color:var(--red);animation:pulse 1.4s infinite}
.tr{position:relative;flex:1;height:8px;border-radius:4px;background:#F0EAE3;overflow:hidden}
.tr i{position:absolute;left:0;top:0;bottom:0;width:calc(var(--v) * 1%);border-radius:4px;background:linear-gradient(90deg,var(--red-d),var(--red));transition:width 1s cubic-bezier(.2,.7,.2,1)}
.sg.act .tr i{background:linear-gradient(90deg,var(--red-d),var(--red) 50%,#F08A8F 60%,var(--red) 70%),var(--red);background-size:200px 100%;animation:shimmer 1.4s linear infinite}
.tr u{position:absolute;top:1px;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 6px 1px rgba(255,255,255,.9);--to:calc(var(--v) * 1% - 6px);animation:flow 1.8s linear infinite;opacity:0}
.tr u:nth-child(3){animation-delay:.6s}.tr u:nth-child(4){animation-delay:1.2s}
.sg:not(.act) .tr u{display:none}
.pc{width:40px;text-align:right;font-family:var(--mono);font-size:12px;color:var(--ink-4);flex:none;transition:color .3s}
.sg.done .pc{color:var(--ink-2)} .sg.act .pc{color:var(--red-d);font-weight:700}
.fin{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;border:2px dashed #DCD3C9;color:transparent;transition:all .4s}
.fin svg{width:12px;height:12px}
.done .fin{border:0;background:var(--green);color:#fff;animation:pop .5s ease}

.st{display:inline-flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:all .3s}
.st i{width:9px;height:9px;border-radius:50%}
.st.running{background:var(--soft);color:var(--red-d)} .st.running i{border:2px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.st.queued{background:#F3EFEA;color:var(--ink-3)} .st.queued i{background:var(--ink-4)}
.st.done{background:var(--green-s);color:var(--green)} .st.done i{background:var(--green)}
.tm{font-family:var(--mono);font-size:12.5px;color:var(--ink-2)} .tm.na{color:var(--ink-4)}
.go{color:var(--ink-4);transition:all .2s} .go svg{width:16px;height:16px}
.lr:hover .go{color:var(--red);transform:translateX(3px)}

/* toast when a factor finishes */
.toast{position:fixed;right:28px;bottom:28px;z-index:20;display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;background:var(--ink);color:#fff;font-size:13.5px;
  box-shadow:0 18px 40px -16px rgba(0,0,0,.45);transform:translateY(20px);opacity:0;transition:all .35s cubic-bezier(.2,.7,.2,1);pointer-events:none}
.toast.show{transform:none;opacity:1}
.toast i{width:22px;height:22px;border-radius:50%;background:var(--green);display:grid;place-items:center}
.toast i svg{width:12px;height:12px}

@media (max-height:700px){ .fn span{display:none} .fn .ic{width:28px;height:28px} .who span{display:none} }
@media (max-width:1500px){ .kpi.d{display:none} }
@media (max-width:1280px){ .mx{display:none} .hero{grid-template-columns:auto minmax(0,1fr) auto auto} }
@media (max-width:1180px){ :root{--side:72px} .side h6,.nav span{display:none} .nav{justify-content:center} .wf{font-size:20px} .kpis{display:none} .pc{display:none} }

/* ==================== FACTOR VIEW: live system map ==================== */
.ov{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0}
.fv{min-height:0;overflow-y:auto;overflow-x:hidden;padding:0 clamp(16px,1.6vw,30px) clamp(12px,1.8vh,20px);display:flex;flex-direction:column;gap:clamp(10px,1.6vh,18px);scrollbar-width:thin}
.fv[hidden]{display:none}
.fv > *{flex:none;animation:rise .5s cubic-bezier(.2,.7,.2,1) both}
.fv > *:nth-child(2){animation-delay:.08s}

/* banner with phase stepper */
.fb{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:clamp(16px,2vw,40px);padding:clamp(12px,1.8vh,20px) clamp(16px,1.6vw,28px);border-radius:14px;
  background:linear-gradient(90deg,#FFF5F3,#FFFDFB 60%,#FFFBF2);border:1px solid #F3E2DD}
.fb .ttl{display:flex;align-items:center;gap:14px;min-width:0}
.fb .big{width:clamp(44px,6.4vh,58px);height:clamp(44px,6.4vh,58px);border-radius:50%;flex:none;display:grid;place-items:center;color:#fff;
  background:radial-gradient(circle at 35% 30%,#E5545B,var(--red) 55%,var(--red-d));box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(200,32,42,.3)}
.fb .big svg{width:44%;height:44%}
.fb.done .big{background:radial-gradient(circle at 35% 30%,#3FA571,var(--green) 60%,#155C39);box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(31,122,77,.3)}
.fb h3{font-family:var(--serif);font-weight:400;font-size:clamp(19px,min(1.6vw,3.2vh),30px);line-height:1.1}
.fb h3 em{font-style:normal;color:var(--red)}
.fb.done h3 em{color:var(--green)}
.fb p{font-size:clamp(12px,min(.82vw,1.65vh),14.5px);color:var(--ink-3);margin-top:4px}
.fb p b{font-family:var(--mono);color:var(--ink-2);font-weight:600}
.stp{display:flex;align-items:center}
.stp .s{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:86px}
.stp .c{position:relative;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;border:2px solid #E3D9CF;background:#fff;color:var(--ink-4);font-family:var(--serif);font-size:15px;transition:all .4s}
.stp .s small{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
.stp .s span{font-family:var(--mono);font-size:12px;color:var(--ink-4)}
.stp .s.done .c{background:var(--red);border-color:var(--red);color:#fff}
.stp .s.act .c{border-color:var(--red);color:var(--red-d);animation:pulse 1.4s infinite}
.stp .s.act span{color:var(--red-d);font-weight:700}
.stp .s.done span{color:var(--ink-2)}
.stp .c svg{width:16px;height:16px}
.stp .l{width:clamp(30px,3vw,60px);height:2px;margin:0 -14px 26px;background:#E8DFD5;position:relative;overflow:hidden}
.stp .l i{position:absolute;inset:0;background:var(--red);transform-origin:left;transform:scaleX(var(--f,0));transition:transform .8s}

/* map */
.map{position:relative;flex:none;min-height:max-content;display:grid;grid-template-columns:3fr 3fr 2fr;gap:0;border:1px solid var(--line);border-radius:16px;background:#fff;overflow:hidden;
  background-image:radial-gradient(rgba(31,26,23,.06) 1px,transparent 1.2px);background-size:20px 20px}
.map > svg.wires{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4;overflow:visible}
.pn{position:relative;padding:clamp(12px,1.8vh,20px) clamp(14px,1.2vw,22px);display:grid;grid-template-rows:auto 1fr;gap:clamp(8px,1.2vh,14px);transition:background .5s}
.pn + .pn{border-left:1px dashed #E3D9CF}
  transition:all .4s;min-height:0}
.pn.act{background:linear-gradient(180deg,rgba(255,240,238,.85),rgba(255,250,248,.55) 55%,rgba(255,255,255,0))}
.pn.idle{background:rgba(250,247,243,.6)}
.pn.done{background:linear-gradient(180deg,rgba(234,245,238,.7),rgba(255,255,255,0) 60%)}
.pn .h{display:flex;align-items:center;gap:10px;min-width:0}
.pn .h .no{font-family:var(--serif);font-size:13px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;border:1px solid currentColor;color:var(--ink-4);flex:none}
.pn.act .h .no{color:var(--red);} .pn.done .h .no{color:var(--green)}
.pn .h b{font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pn .h .sp{flex:1}
.pn .h .pill{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:#F3EFEA;color:var(--ink-3);display:inline-flex;gap:6px;align-items:center}
.pn.act .h .pill{background:var(--soft);color:var(--red-d)} .pn.act .h .pill i{width:8px;height:8px;border-radius:50%;border:1.5px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.pn.done .h .pill{background:var(--green-s);color:var(--green)}
.pn .h .bar{position:absolute;left:0;right:0;top:0;height:3px;overflow:hidden;background:rgba(0,0,0,.03)}
.pn .h .bar i{display:block;height:100%;width:calc(var(--v,0) * 1%);background:var(--red);transition:width .8s}
.pn.done .h .bar i{background:var(--green)}
.grid{display:grid;grid-auto-rows:auto;align-content:start;gap:clamp(24px,4vh,52px) clamp(14px,1.2vw,26px);padding-top:clamp(44px,6vh,64px)}
.pre .grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.ext .grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.post .grid{grid-template-columns:repeat(2,minmax(0,1fr))}

.node{position:relative;z-index:3;min-width:0;border-radius:12px;border:1px solid #E9E1D7;background:#fff;padding:clamp(8px,1.2vh,12px) clamp(9px,.7vw,12px) clamp(10px,1.4vh,14px);transition:all .4s;
  box-shadow:0 8px 18px -14px rgba(60,20,10,.3)}
.node .nh{display:flex;align-items:center;gap:8px;min-width:0}
.node .ni{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex:none;background:#F4F0EB;color:var(--ink-3);transition:all .4s}
.node .ni svg{width:13px;height:13px}
.node b{font-size:clamp(12px,min(.8vw,1.7vh),15px);font-weight:600;line-height:1.2;flex:1;min-width:0}
.node .ok{position:absolute;top:-7px;right:-7px;width:18px;height:18px;border-radius:50%;background:var(--green);color:#fff;display:none;place-items:center;animation:pop .4s ease;box-shadow:0 0 0 2px #fff}
.node .ok svg{width:9px;height:9px}
.node small{display:block;font-family:var(--mono);font-size:10.5px;color:var(--ink-4);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.node strong{display:block;font-family:var(--mono);font-size:clamp(11px,min(.74vw,1.6vh),13.5px);font-weight:600;color:var(--ink-3);margin-top:4px;line-height:1.3}
.node .nb{position:absolute;left:12px;right:12px;bottom:5px;height:3px;border-radius:2px;background:#F1EBE4;overflow:hidden;display:none}
.node .nb i{display:block;height:100%;width:calc(var(--v,0) * 1%);background:linear-gradient(90deg,var(--red-d),var(--red));transition:width .8s}
.node.has-bar .nb{display:block}
.node.idle{opacity:.55;box-shadow:none;background:#FDFCFA}
.node.act{border-color:#E7A9AD;box-shadow:0 0 0 3px rgba(200,32,42,.08),0 12px 24px -14px rgba(200,32,42,.45)}
.node.act .ni{background:var(--soft);color:var(--red)}
.node.act .ni::after{content:"";position:absolute}
.node.act strong{color:var(--red-d)}
.node.act::before{content:"";position:absolute;inset:-1px;border-radius:12px;padding:1px;background:linear-gradient(90deg,transparent,var(--red),transparent);background-size:200% 100%;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:shimmer 2.2s linear infinite}
.node.done .ni{background:var(--green-s);color:var(--green)}
.node.done .ok{display:grid}
.node.done strong{color:var(--ink-2)}

/* trace feed (Extract panel, second row) */
.feed{grid-column:1 / -1;border-radius:10px;border:1px dashed #E3D9CF;background:#FCFAF8;padding:8px 12px;min-height:0;overflow:hidden;position:relative;z-index:3}
.feed h6{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-4);margin-bottom:4px;display:flex;align-items:center;gap:6px}
.feed h6 i{width:6px;height:6px;border-radius:50%;background:var(--ink-4)}
.act .feed h6 i{background:var(--red);animation:pulse 1.4s infinite}
.feed ul{list-style:none;font-family:var(--mono);font-size:11px;color:var(--ink-3);display:grid;gap:2px}
.feed li{display:flex;gap:10px;animation:rise .35s ease both;white-space:nowrap;overflow:hidden}
.feed li b{color:var(--ink-2);font-weight:600}
.feed li em{font-style:normal;color:var(--green)}
.feed li em.w{color:var(--amber)}
.feed li span{margin-left:auto;color:var(--ink-4)}


/* live callout over the active node */
.callout{position:absolute;z-index:6;transform:translate(-50%,calc(-100% - 12px));background:var(--ink);color:#fff;border-radius:10px;padding:8px 12px;font-size:12px;white-space:nowrap;
  box-shadow:0 12px 26px -12px rgba(0,0,0,.5);pointer-events:none;transition:left .5s,top .5s,opacity .3s;display:flex;align-items:center;gap:12px}
.callout[hidden]{display:none}
.callout::after{content:"";position:absolute;left:50%;bottom:-6px;width:12px;height:12px;background:var(--ink);transform:translateX(-50%) rotate(45deg);border-radius:2px}
.callout b{font-weight:600}
.callout .k{display:flex;flex-direction:column;line-height:1.15}
.callout .k small{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#B7ACA3}
.callout .k strong{font-family:var(--mono);font-size:12.5px;color:#fff;font-weight:600}
.callout .k strong.g{color:var(--gold)}
.callout .dv{width:1px;align-self:stretch;background:rgba(255,255,255,.15)}
.callout .lv{width:8px;height:8px;border-radius:50%;background:#FF5A61;animation:pulse 1.4s infinite}
/* event timeline */
.log{display:flex;align-items:center;gap:0;min-width:0;overflow:hidden;padding:10px 16px;border:1px solid var(--line);border-radius:12px;background:#fff}
.log h6{flex:none;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);margin-right:16px}
.log ol{list-style:none;display:flex;align-items:center;min-width:0;flex:1}
.log li{position:relative;display:flex;align-items:center;gap:8px;flex:none;font-size:12.5px;color:var(--ink-2);padding-right:34px;animation:rise .4s ease both;white-space:nowrap}
.log li:not(:last-child)::after{content:"";position:absolute;right:8px;top:50%;width:18px;height:1px;background:#DDD3C8}
.log li i{width:8px;height:8px;border-radius:50%;background:var(--red);flex:none}
.log li.e-ok i{background:var(--green)} .log li.e-st i{background:#fff;border:2px solid var(--red)}
.log li span{font-family:var(--mono);font-size:11px;color:var(--ink-4)}
@media (max-height:760px){ .log{display:none} }
@media (max-height:900px){ .fb{padding:10px 16px} .fb .big{width:44px;height:44px} .feed{display:none} .node small{display:none} .grid{row-gap:28px} .stp .c{width:32px;height:32px} }
@media (max-height:700px){  .fb{padding:8px 14px} .fb p{display:none} .fb .big{width:38px;height:38px} .stp .c{width:30px;height:30px} .log{display:none} .grid{padding-top:36px;row-gap:14px} .pn{padding-top:10px;padding-bottom:10px} .node{padding-top:6px;padding-bottom:8px} }

/* wires */
.wires > path{fill:none;stroke-linecap:round}
.wires .w-idle{stroke:#E2D8CD;stroke-width:1.5;stroke-dasharray:3 5}
.wires .w-done{stroke:#C8202A;stroke-opacity:.75;stroke-width:2}
.wires .w-act{stroke:#C8202A;stroke-width:2;stroke-dasharray:6 6;animation:dash .6s linear infinite}
@keyframes dash{to{stroke-dashoffset:-12}}
.wires circle.pk{fill:#C8202A;filter:drop-shadow(0 0 3px rgba(200,32,42,.8))}

@media (max-height:700px){ .node small{display:none} .grid{gap:22px 14px} .feed{display:none} .stp .s{min-width:70px} }
@media (max-width:1400px){ .node small{display:none} .stp .s{min-width:70px} .stp .l{width:24px} .node .ni{display:none} }


/* ===== spacious, horizontally scrollable map ===== */
.mapwrap{position:relative;overflow-x:auto;overflow-y:hidden;border:1px solid var(--line);border-radius:16px;background:#fff;scrollbar-width:thin;scrollbar-color:#E3B8BB transparent;scroll-behavior:smooth}
.mapwrap::-webkit-scrollbar{height:8px}.mapwrap::-webkit-scrollbar-thumb{background:#E3B8BB;border-radius:4px}
.mapwrap .map{border:0 !important;border-radius:0;min-width:2050px;grid-template-columns:780px 760px 510px !important;
  background-image:radial-gradient(rgba(31,26,23,.05) 1px,transparent 1.2px) !important;background-size:22px 22px}
.mapwrap .pn{padding:18px 34px 20px}
.mapwrap .grid{gap:44px 56px !important;padding-top:58px !important;align-content:start}
.mapwrap .node{padding:14px 16px 16px}
.mapwrap .node small{display:block !important;margin-left:0;font-size:11px}
.mapwrap .node strong{margin-left:0;font-size:13.5px}
.mapwrap .node b{white-space:nowrap}
.mapwrap .feed{display:block !important;margin-top:4px}
.mapwrap .feed ul{font-size:12px}
.scrollhint{display:flex;margin-bottom:-4px;align-items:center;justify-content:center;gap:8px;font-size:11.5px;color:var(--ink-4);letter-spacing:.04em;margin-top:-6px}
.scrollhint span{color:var(--ink-3)}
.log{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
.log li{flex:none}
.fv .log{display:flex !important}

@media (prefers-reduced-motion: reduce){ *,*::before,*::after{animation:none !important;transition:none !important} }
</style>
</head>
<body>
<header class="appbar">
  <button class="burger" aria-label="Menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  <span class="wf">WELLS FARGO</span>
  <span class="vbar"></span>
  <div class="studio">
    <span class="mk"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 33L33 27" stroke="#FFCD41" stroke-width="3.2" stroke-linecap="round"/><path d="M7 33L24 9" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M17.3 30.6A11 11 0 0 0 13.2 24" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/><circle cx="33" cy="27" r="3.8" fill="#FFCD41"/><circle cx="24" cy="9" r="3.8" fill="#fff"/><circle cx="7" cy="33" r="3.2" fill="#fff"/></svg></span>
    <div><small>WIMT</small><b>Evaluation <strong>Studio</strong></b></div>
  </div>
  <div class="sp"></div>
  <button class="ibtn" aria-label="Flows"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a3 3 0 0 1 3 3V14"/></svg></button>
  <button class="ibtn" aria-label="Data"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg></button>
  <button class="ibtn" aria-label="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg></button>
  <div class="user">Rahul <i>R</i></div>
</header>

<div class="shell">
  <aside class="side">
    <h6>WORKSPACE</h6>
    <a class="nav" href="#/home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg><span>Home</span></a>
    <a class="nav on" href="#/evaluate" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a3 3 0 0 1 3 3v6.5"/></svg><span>Evaluation</span></a>
    <a class="nav" href="#/playground"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="5" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M6 7.2v4.3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v-.5"/></svg><span>Model Playground</span></a>
    <h6>LIBRARY</h6>
    <a class="nav" href="#/prompts"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg><span>Prompt Hub</span></a>
    <a class="nav" href="#/golden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg><span>Golden Dataset</span></a>
    <a class="nav" href="#/traces"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg><span>Data &amp; Traces</span></a>
    <a class="nav push" href="#/settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg><span>Settings</span></a>
  </aside>

      <main class="main">
    <section class="ph">
      <button class="back" aria-label="Back to Evaluation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
      <div class="tt"><h1>Model Testing Kit</h1><p>WIMT Model Testing Framework over an uploaded query set</p></div>
      <span class="live" id="live"><i></i><em id="liveTxt" style="font-style:normal">Running</em> <span id="elapsed">20m 05s</span></span>
    </section>

    <section class="setup" aria-label="Run setup">
      <div class="lab">RUN SETUP</div>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg></span><span class="sx"><small>Dataset</small><b id="sDataset"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg></span><span class="sx"><small>Supervisor</small><b id="sEnv"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><span class="sx"><small>Factors</small><b id="sFactors"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
    </section>

    <section class="card">
      <div class="tabs" role="tablist">
        <button class="tab on" role="tab" aria-selected="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>Progress <span class="ld" id="tabDot"></span></button>
        <button class="tab" role="tab" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></svg>Analytics</button>
        <span class="sp"></span><span class="hint">Run <b id="runId"></b></span>
      </div>
      <div class="fchips" id="chips"></div>

      <div class="ov" id="ovView">
      <div class="hero">
        <div class="ring" id="ring" style="--p:0"><b id="pct">0%</b></div>
        <div class="who"><b>Run · <em id="runState">running</em></b><span id="runMeta"></span><span class="eta" id="eta">≈ estimating…</span></div>
        <div class="mx"><canvas id="mx"></canvas><small id="mxLab">queries</small></div>
        <div class="kpis">
          <div class="kpi r"><strong id="kRun">0</strong><small><i></i>Running</small></div>
          <div class="kpi q"><strong id="kQ">0</strong><small><i></i>Queued</small></div>
          <div class="kpi d"><strong id="kD">0</strong><small><i></i>Done</small></div>
        </div>
        <button class="cancel" id="cancel"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>Cancel run</button>
      </div>

      <div class="lw lg">
        <div class="lh"><div>Factor</div><div class="st3"><span>Pre</span><span>Extract</span><span>Post</span><span></span></div><div>Status</div><div>Time</div><div></div></div>
        <div id="lanes"></div>
      </div>
      </div>
      <div class="fv" id="fView" hidden></div>
    </section>
  </main>
</div>
<div class="toast" id="toast"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></i><span id="toastTxt"></span></div>

<script>
/* ------------------------------------------------------------------
   USE_MOCK = true → demo simulation chalti hai (animation dekhne ke liye).
   Real app me USE_MOCK = false karo aur SSE se TestingKit.update(snapshot) call karo.
   Snapshot shape = RUN object. null = unknown → "—" (kabhi 0 nahi).
   ------------------------------------------------------------------ */
const USE_MOCK = true;
const RUN = {
  id:"mtk-0462", state:"running", startedAt: Date.now() - (20*60+5)*1000,
  file:"Copy_of_CM_Golden_Dataset.xlsx", rows:462, env:"DEV",
  factors:[
    {id:"cm",name:"Change Management",desc:"Toxicity, performance & sensitivity bundle",pre:66,extract:0,post:0,status:"running",start:Date.now()-1205000},
    {id:"perf",name:"Performance",desc:"Response quality and speed",pre:100,extract:100,post:0,status:"running",start:Date.now()-1205000},
    {id:"hal",name:"Hallucination",desc:"Answers grounded in sources",pre:100,extract:12,post:0,status:"running",start:Date.now()-1205000},
    {id:"exp",name:"Explainability",desc:"Clear reasons behind answers",pre:0,extract:0,post:0,status:"queued"},
    {id:"rep",name:"Replication",desc:"Same question, same answer",pre:0,extract:0,post:0,status:"queued"},
    {id:"cal",name:"Parameter Calibration",desc:"Tune parameters on the dataset",pre:0,extract:0,post:0,status:"queued"},
    {id:"bm",name:"Benchmarking",desc:"Compare against a baseline",pre:0,extract:0,post:0,status:"queued"},
    {id:"sen",name:"Sensitivity",desc:"Stable when wording changes",pre:0,extract:0,post:0,status:"queued"},
    {id:"judge",name:"Judge Evaluation",desc:"Judge agreement with SMEs",pre:0,extract:0,post:0,status:"queued"}
  ]
};
const ICON={cm:'<path d="M3 7h18M3 12h18M3 17h12"/>',perf:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',hal:'<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
 exp:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/>',
 rep:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
 cal:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
 bm:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',sen:'<path d="M2 12h3l3-7 4 14 3-7h7"/>',
 judge:'<path d="M12 3v18M7 21h10M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>'};
const svg=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const $=id=>document.getElementById(id);
const fmt=ms=>{if(ms==null||ms<0)return"—";const s=Math.floor(ms/1000);return `${Math.floor(s/60)}m ${String(s%60).padStart(2,"0")}s`;};
const overall=r=>Math.round(r.factors.reduce((a,f)=>a+((f.pre||0)+(f.extract||0)+(f.post||0))/3,0)/r.factors.length);

/* ---- build lanes once, then only update values (so CSS transitions animate) ---- */
function build(r){
  $("sDataset").textContent=r.file; $("sEnv").textContent=r.env+" supervisor"; $("sFactors").textContent=r.factors.length+" selected"; $("runId").textContent="#"+r.id;
  $("runMeta").textContent=`${r.file} · ${r.rows} rows · ${r.env} · ${r.factors.length} factors`;
  $("chips").innerHTML=`<button class="fc on">${svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>')}Overview</button>`+
    r.factors.map(f=>`<button class="fc" data-f="${f.id}"><span class="d"></span>${f.name}</button>`).join("");
  const seg=k=>`<div class="sg" data-k="${k}"><span class="nd"></span><span class="tr" style="--v:0"><i></i><u></u><u></u><u></u></span><span class="pc">—</span></div>`;
  $("lanes").innerHTML=r.factors.map((f,i)=>`<div class="lr" data-f="${f.id}" style="--i:${i}">
    <div class="fn"><span class="ic">${svg(ICON[f.id]||ICON.cm)}</span><div><b>${f.name}</b><span>${f.desc}</span></div></div>
    <div class="lane">${seg("pre")}${seg("extract")}${seg("post")}<span class="fin">${svg('<path d="M5 12l5 5 9-10"/>')}</span></div>
    <div><span class="st"><i></i><em style="font-style:normal"></em></span></div>
    <div><span class="tm"></span></div>
    <div class="go">${svg('<path d="M9 6l6 6-6 6"/>')}</div></div>`).join("");
}
let prevStatus={};
function update(r){
  const p=overall(r); $("ring").style.setProperty("--p",p); $("pct").textContent=p+"%";
  const cnt=s=>r.factors.filter(f=>f.status===s).length;
  [["kRun","running"],["kQ","queued"],["kD","done"]].forEach(([id,s])=>{const el=$(id),v=String(cnt(s));if(el.textContent!==v){el.textContent=v;el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump");}});
  const el=Date.now()-r.startedAt; $("elapsed").textContent=fmt(el);
  const allDone=r.factors.every(f=>f.status==="done");
  $("runState").textContent=allDone?"complete":r.state; $("live").classList.toggle("done",allDone); $("liveTxt").textContent=allDone?"Complete":"Running";
  $("eta").textContent= p>2 && !allDone ? `≈ ${fmt(el*(100-p)/p)} left` : allDone ? "All factors finished" : "≈ estimating…";
  r.factors.forEach(f=>{
    const row=document.querySelector(`.lr[data-f="${f.id}"]`), chip=document.querySelector(`.fc[data-f="${f.id}"]`);
    row.className="lr "+f.status; chip.className="fc "+(f.status==="running"?"run":f.status==="done"?"done":"")+(current&&current.id===f.id?" on":"");
    let prevDone=true;
    ["pre","extract","post"].forEach(k=>{
      const v=f[k], sg=row.querySelector(`.sg[data-k="${k}"]`);
      const st= f.status==="queued" ? "idle" : v>=100 ? "done" : (v>0||prevDone) ? "act" : "idle";
      sg.className="sg "+st; sg.querySelector(".tr").style.setProperty("--v",v||0);
      sg.querySelector(".pc").textContent= st==="idle" && !v ? "—" : (v==null?"—":v+"%");
      prevDone = v>=100;
    });
    const s=row.querySelector(".st"); s.className="st "+f.status; s.querySelector("em").textContent=f.status;
    const tm=row.querySelector(".tm"); const t=f.start? (f.end||Date.now())-f.start : null; tm.textContent=fmt(t); tm.className="tm"+(t==null?" na":"");
    if(prevStatus[f.id]==="running" && f.status==="done") toast(`${f.name} finished · all stages complete`);
    prevStatus[f.id]=f.status;
  });
  matrix.target=Math.round(r.rows*p/100);
  r.factors.forEach(track);
  if(current) updateFactor(current);
  const ovc=document.querySelector(".fc:not([data-f])"); if(ovc) ovc.classList.toggle("on",!current);
}
let tt; function toast(msg){$("toastTxt").textContent=msg;$("toast").classList.add("show");clearTimeout(tt);tt=setTimeout(()=>$("toast").classList.remove("show"),2600);}

/* ---- query matrix: one dot per query; lights up as processed ---- */
const matrix={target:0,shown:0,born:[]};
(function(){
  const cv=$("mx"),ctx=cv.getContext("2d");
  function frame(t){
    const w=cv.clientWidth,h=cv.clientHeight; if(!w){requestAnimationFrame(frame);return;}
    const dpr=window.devicePixelRatio||1; if(cv.width!==w*dpr){cv.width=w*dpr;cv.height=h*dpr;}
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    const n=RUN.rows, rowsN=Math.max(4,Math.floor(h/9)), cols=Math.ceil(n/rowsN), gap=Math.min(9,(w-12)/cols), rad=Math.max(1.4,gap*.28);
    if(matrix.shown<matrix.target){const add=Math.max(1,Math.ceil((matrix.target-matrix.shown)/18));for(let k=0;k<add;k++){matrix.born[matrix.shown]=t;matrix.shown++;}}
    if(matrix.shown>matrix.target){matrix.shown=matrix.target;}
    for(let i=0;i<n;i++){
      const c=Math.floor(i/rowsN), r=i%rowsN, x=6+c*gap, y=h/2-(rowsN-1)*4.5+r*9;
      if(i<matrix.shown){
        const age=(t-(matrix.born[i]||0))/600, s=age<1?1+ (1-age)*.9:1;
        ctx.fillStyle=age<1?`rgba(232,180,37,${1-age*.5})`:"#C8202A";
        ctx.beginPath();ctx.arc(x,y,rad*s,0,7);ctx.fill();
      }else{
        const scan=(Math.sin(t/700 - c*.18)+1)/2;
        ctx.fillStyle=i===matrix.shown?"rgba(200,32,42,.55)":`rgba(160,140,125,${.16+scan*.12})`;
        ctx.beginPath();ctx.arc(x,y,rad*.85,0,7);ctx.fill();
      }
    }
    $("mxLab").textContent=`${matrix.shown} / ${n} queries`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();



/* ---- per-factor history: rate, ETA, timeline ---- */
function track(f){
  const now=Date.now(); f._h=f._h||{}; f.log=f.log||[];
  const st=f.status==="queued"?null:f.pre<100?"pre":f.extract<100?"extract":f.post<100?"post":"done";
  if(!f._seeded && f.status!=="queued"){ f._seeded=true; const t0=f.start||now;
    f.log.push({t:t0,txt:"Run started",k:"st"});
    if(f.pre>=100) f.log.push({t:t0+60000*8,txt:`Pre complete · ${RUN.rows} answered`,k:"ok"});
    if(f.extract>=100) f.log.push({t:t0+60000*14,txt:"Extract complete · traces.json",k:"ok"});
    if(st&&st!=="done"&&st!=="pre") f.log.push({t:t0+60000*(st==="extract"?9:15),txt:`${st==="extract"?"Extract":"Post"} started`,k:"st"});
  }
  if(f._stage && st && f._stage!==st){
    const name={pre:"Pre",extract:"Extract",post:"Post"};
    if(f._stage!=="done") f.log.push({t:now,txt:`${name[f._stage]} complete${f._stage==="pre"?` · ${RUN.rows} answered`:f._stage==="extract"?" · traces.json":""}`,k:"ok"});
    if(st==="done") f.log.push({t:now,txt:"Results written · _post.xlsx",k:"ok"});
    else f.log.push({t:now,txt:`${name[st]} started`,k:"st"});
  }
  if(st && (!f._stage||f._stage!==st)) f._h[st]={t:now,v:f[st]||0};
  f._stage=st;
  return st;
}
function ago(t){const m=Math.max(0,Math.round((Date.now()-t)/60000));return m<1?"just now":m+"m ago";}
function callout(f,st){
  const c=$("callout"); if(!c) return;
  if(!st||st==="done"){c.hidden=true;return;}
  const id={pre:"rp",extract:"ex",post:"sc"}[st], el=$("n-"+id), map=$("map"); if(!el) return;
  const N=RUN.rows, v=f[st]||0, h=f._h[st]||{t:Date.now(),v:v};
  const mins=Math.max((Date.now()-h.t)/60000,1/60), done=Math.round(N*(v-h.v)/100), rate=Math.max(0,Math.round(done/mins));
  const left=rate>0?fmt(((N-Math.round(N*v/100))/rate)*60000):"—";
  const verb={pre:"Sending queries",extract:"Pulling traces",post:"Scoring answers"}[st];
  c.innerHTML=`<span class="lv"></span><b>${verb}</b><span class="dv"></span><span class="k"><small>done</small><strong>${Math.round(N*v/100)}/${N}</strong></span><span class="k"><small>rate</small><strong>${rate ? rate+"/min" : "—"}</strong></span><span class="k"><small>stage left</small><strong class="g">${left}</strong></span>`;
  const R=map.getBoundingClientRect(), B=el.getBoundingClientRect();
  let x=(B.left+B.right)/2-R.left; const w=c.offsetWidth||260; x=Math.max(w/2+8,Math.min(R.width-w/2-8,x));
  c.style.left=x+"px"; c.style.top=(B.top-R.top)+"px"; c.hidden=false;
}
function renderLog(f){
  const ol=$("log"); if(!ol) return;
  const items=(f.log||[]).slice(-5);
  const html=items.map(e=>`<li class="e-${e.k}"><i></i>${e.txt}<span>${ago(e.t)}</span></li>`).join("") || `<li class="e-st"><i></i>Waiting in queue</li>`;
  if(ol.dataset.h!==html){ol.innerHTML=html;ol.dataset.h=html;}
}

/* ==================== FACTOR VIEW logic ==================== */
const I2={file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',play:'<path d="M7 4l13 8-13 8z"/>',bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',cloud:'<path d="M17.5 19a4.5 4.5 0 0 0 .4-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 7 19z"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',json:'<path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"/>',
 scale:'<path d="M12 3v18M7 21h10M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>',sheet:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
 check:'<path d="M5 12l5 5 9-10"/>'};
let current=null;
function node(id,ic,title,sub,grid){return `<div class="node idle" id="n-${id}" style="${grid||""}"><div class="nh"><span class="ni">${svg(I2[ic])}</span><b>${title}</b><span class="ok">${svg(I2.check)}</span></div><small>${sub}</small><strong>—</strong><span class="nb"><i></i></span></div>`;}
function buildFactor(f){
  $("fView").innerHTML=`
  <div class="fb" id="fb"><div class="ttl"><span class="big">${svg(ICON[f.id]||ICON.cm)}</span><div><h3>${f.name} · <em id="fbPhase">Pre phase</em></h3><p id="fbDesc"></p></div></div>
    <div class="stp" id="stp">
      <div class="s" data-k="pre"><span class="c">1</span><small>Pre</small><span>—</span></div><div class="l"><i></i></div>
      <div class="s" data-k="extract"><span class="c">2</span><small>Extract</small><span>—</span></div><div class="l"><i></i></div>
      <div class="s" data-k="post"><span class="c">3</span><small>Post</small><span>—</span></div></div></div>
  <div class="mapwrap" id="mapwrap"><div class="map" id="map"><svg class="wires" id="wires"></svg><div class="callout" id="callout" hidden></div>
    <section class="pn pre" data-k="pre"><div class="h"><span class="bar"><i></i></span><span class="no">1</span><b>Pre · Run prompts</b><span class="sp"></span><span class="pill"><i></i><em style="font-style:normal">waiting</em></span></div>
      <div class="grid">${node("ds","file","Dataset",f.id==="cm"?"golden dataset":"query set")}${node("rp","play","Run prompts","query supervisor")}${node("sv","bot","Supervisor","agent · "+RUN.env)}
        <span></span>${node("ans","copy","Answers","_pre.parquet")}${node("tq","cloud","Tachyon","search + completions")}</div></section>
    <section class="pn ext" data-k="extract"><div class="h"><span class="bar"><i></i></span><span class="no">2</span><b>Extract · Pull traces</b><span class="sp"></span><span class="pill"><i></i><em style="font-style:normal">waiting</em></span></div>
      <div class="grid">${node("ow","eye","Overwatch","trace store")}${node("ex","dl","Extract","pull traces")}${node("tf","json","Traces file","traces.json")}
        <div class="feed"><h6><i></i>Trace feed</h6><ul id="feed"><li>waiting for traces…</li></ul></div></div></section>
    <section class="pn post" data-k="post"><div class="h"><span class="bar"><i></i></span><span class="no">3</span><b>Post · Score</b><span class="sp"></span><span class="pill"><i></i><em style="font-style:normal">waiting</em></span></div>
      <div class="grid">${node("sc","scale","Score","LLM judge")}${node("rs","sheet","Results","_post.xlsx")}${node("tj","cloud","Tachyon","judge + embeddings")}${node("mf","list","Manifest","run_manifest.json")}</div></section>
  </div></div>
  <div class="scrollhint" id="scrollhint"><span>Scroll</span> ← → <span>to follow the flow</span></div>
  <div class="log"><h6>Timeline</h6><ol id="log"></ol></div>`;
  feedN=0;
}
const EDGES=[["ds","rp","h"],["rp","sv","h"],["rp","ans","v"],["sv","tq","v"],["sv","ow","x"],["ow","ex","h"],["ex","tf","h"],["tf","sc","x"],["sc","rs","h"],["sc","tj","v"],["rs","mf","v"]];
function wires(states){
  const map=$("map"), w=$("wires"); if(!map||!w) return;
  const R=map.getBoundingClientRect(); w.setAttribute("viewBox",`0 0 ${R.width} ${R.height}`);
  const box=id=>{const b=$("n-"+id).getBoundingClientRect();return {l:b.left-R.left,r:b.right-R.left,t:b.top-R.top,b:b.bottom-R.top,cx:(b.left+b.right)/2-R.left,cy:(b.top+b.bottom)/2-R.top};};
  let out=`<defs>
    <marker id="ah-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#C8202A"/></marker>
    <marker id="ah-done" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#C8202A"/></marker>
    <marker id="ah-idle" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#D5CABE"/></marker></defs>`;
  EDGES.forEach(([a,b,k],i)=>{
    const A=box(a),B=box(b); let d;
    if(k==="v") d=`M ${A.cx} ${A.b+2} L ${B.cx} ${B.t-3}`;
    else if(k==="h") d=`M ${A.r+2} ${A.cy} L ${B.l-3} ${B.cy}`;
    else { const mx=(A.r+B.l)/2; d=`M ${A.r+2} ${A.cy} C ${mx} ${A.cy}, ${mx} ${B.cy}, ${B.l-3} ${B.cy}`; }
    const sa=states[a], sb=states[b];
    const cls= sb==="act" ? "w-act" : (sa==="done"&&sb==="done") ? "w-done" : "w-idle";
    const mk=cls==="w-act"?"ah-red":cls==="w-done"?"ah-done":"ah-idle";
    out+=`<path id="wp${i}" class="${cls}" d="${d}" marker-end="url(#${mk})"/>`;
    if(cls==="w-act") out+=`<circle class="pk" r="3.2"><animateMotion dur="1.4s" repeatCount="indefinite"><mpath href="#wp${i}"/></animateMotion></circle><circle class="pk" r="2.4" opacity=".6"><animateMotion dur="1.4s" begin=".7s" repeatCount="indefinite"><mpath href="#wp${i}"/></animateMotion></circle>`;
  });
  w.innerHTML=out;
}
let feedN=0, lastStates="";
function updateFactor(f){
  const N=RUN.rows, pre=f.pre||0, ex=f.extract||0, po=f.post||0, q=f.status==="queued";
  const st=v=>q?"idle":v>=100?"done":v>0?"act":"idle";
  const sP=q?"idle":st(pre)==="idle"?"act":st(pre), sE=q?"idle":(pre>=100? (ex>=100?"done":"act"):"idle"), sO=q?"idle":(ex>=100?(po>=100?"done":"act"):"idle");
  const S={pre:sP,extract:sE,post:sO};
  const phase=q?"Queued":sO==="done"?"Complete":sO==="act"?"Post phase":sE==="act"?"Extract phase":"Pre phase";
  $("fbPhase").textContent=phase; $("fb").classList.toggle("done",sO==="done");
  const t=f.start?fmt((f.end||Date.now())-f.start):"—";
  const desc={ "Queued":"Waiting for a free slot · starts when a running factor finishes",
    "Pre phase":"Query Supervisor · sending every query in the dataset to the GPT Supervisor",
    "Extract phase":"Pulling traces from Overwatch for every answered query",
    "Post phase":"LLM judge and embeddings score every answer",
    "Complete":"All stages done · results and manifest written" }[phase];
  $("fbDesc").innerHTML=`${desc} · <b>${t}</b>`;
  const stps=$("stp").querySelectorAll(".s"), ls=$("stp").querySelectorAll(".l i");
  [["pre",pre],["extract",ex],["post",po]].forEach(([k,v],i)=>{const el=stps[i]; el.className="s "+(S[k]==="act"?"act":S[k]); el.querySelector(".c").innerHTML=S[k]==="done"?svg(I2.check):i+1; el.lastElementChild.textContent=S[k]==="idle"&&!v?"—":v+"%";});
  ls[0].parentElement.style.setProperty("--f",pre>=100?1:0); ls[1].parentElement.style.setProperty("--f",ex>=100?1:0);
  // panels
  document.querySelectorAll("#map .pn").forEach(pn=>{const k=pn.dataset.k,v=f[k]||0;pn.className="pn "+pn.classList[1]+" "+S[k];
    pn.querySelector(".pill em").textContent=S[k]==="act"?"running":S[k]==="done"?"done":"waiting"; pn.querySelector(".bar").style.setProperty("--v",v);});
  // nodes
  const sent=Math.round(N*pre/100), ans=Math.max(0,sent-Math.round(Math.random()*3+ (pre<100?6:0))), tr=Math.round(N*ex/100), sc=Math.round(N*po/100);
  const n={}, set=(id,state,val,bar)=>{n[id]=state;const el=$("n-"+id);el.className="node "+state+(bar!=null&&state==="act"?" has-bar":"");el.querySelector("strong").textContent=val;if(bar!=null)el.querySelector(".nb").style.setProperty("--v",bar);};
  set("ds", q?"idle":"done", N+" rows");
  set("rp", sP, sP==="idle"?"—":`${sent}/${N} sent`, pre);
  set("sv", sP, sP==="idle"?"—":`${pre>=100?N:ans} answered`, pre);
  set("ans",sP, sP==="done"?"saved":sP==="act"?"writing":"not yet");
  set("tq", sP, sP==="done"?"released":sP==="act"?"in use":"—");
  set("ow", sE==="idle"?"idle":sE, sE==="idle"?"—":sE==="act"?"receiving":"synced");
  set("ex", sE, sE==="idle"?"—":`${tr}/${N} traces`, ex);
  set("tf", sE==="done"?"done":sE==="act"&&ex>60?"act":"idle", sE==="done"?"written":sE==="act"?"buffering":"not yet");
  set("sc", sO, sO==="idle"?"—":`${sc}/${N} scored`, po);
  set("tj", sO, sO==="done"?"released":sO==="act"?"in use":"—");
  set("rs", sO==="done"?"done":sO==="act"&&po>50?"act":"idle", sO==="done"?"written":sO==="act"?"filling":"not yet");
  set("mf", sO==="done"?"done":"idle", sO==="done"?"written":"not yet");
  // feed
  if(sE==="act" && tr>feedN){const ul=$("feed"); if(feedN===0) ul.innerHTML="";
    for(let i=Math.max(feedN,tr-2);i<tr;i++){const li=document.createElement("li");const ok=Math.random()>.12;li.innerHTML=`<b>q-${String(i+1).padStart(4,"0")}</b><em class="${ok?"":"w"}">${ok?"matched":"retrying"}</em><span>${(Math.random()*1.8+.3).toFixed(1)}s</span>`;ul.prepend(li);}
    while(ul.children.length>4) ul.lastChild.remove(); feedN=tr;}
  if(sE==="done" && feedN<N){$("feed").innerHTML=`<li><b>${N} / ${N}</b><em>all traces matched</em></li>`;feedN=N;}
  const key=JSON.stringify(n); if(key!==lastStates){lastStates=key;wires(n);} 
  current._n=n;
  const stg=track(f); callout(f,stg); renderLog(f);
  if(stg && f._scrolled!==stg){f._scrolled=stg;const pn=document.querySelector(`#map .pn[data-k="${stg}"]`),w=$("mapwrap");if(pn&&w)w.scrollLeft=Math.max(0,pn.offsetLeft-60);}
}
function openFactor(id){
  const f=RUN.factors.find(x=>x.id===id);
  document.querySelectorAll(".fc").forEach(c=>c.classList.toggle("on",c.dataset.f===id||(!id&&!c.dataset.f)));
  if(!f){current=null;$("fView").hidden=true;$("ovView").hidden=false;$("ovView").style.display="";return;}
  current=f; f._scrolled=null; $("ovView").style.display="none"; $("fView").hidden=false; lastStates=""; buildFactor(f); updateFactor(f);
}
new ResizeObserver(()=>{if(current&&current._n)wires(current._n);}).observe(document.querySelector(".card"));

/* ---- demo simulation ---- */
function step(){
  const run=RUN.factors.filter(f=>f.status==="running");
  run.forEach(f=>{
    const k=f.pre<100?"pre":f.extract<100?"extract":"post";
    f[k]=Math.min(100,f[k]+Math.ceil(Math.random()*7));
    if(f.post>=100){f.status="done";f.end=Date.now();}
  });
  const q=RUN.factors.filter(f=>f.status==="queued");
  while(RUN.factors.filter(f=>f.status==="running").length<3 && q.length){const f=q.shift();f.status="running";f.start=Date.now();}
  update(RUN);
}
build(RUN); update(RUN);
const _f=new URLSearchParams(location.search).get("factor"); if(_f) openFactor(_f);
setInterval(()=>{ if(USE_MOCK) step(); else update(RUN); },1000);

window.TestingKit={ update:s=>{Object.assign(RUN,s);update(RUN);} };
document.addEventListener("click",e=>{const ov=e.target.closest(".fc:not([data-f])");if(ov){openFactor(null);return;}const t=e.target.closest("[data-f]");if(t){openFactor(t.dataset.f);window.dispatchEvent(new CustomEvent("testingkit:factor",{detail:{id:t.dataset.f}}));}});
$("cancel").addEventListener("click",()=>window.dispatchEvent(new CustomEvent("testingkit:action",{detail:{type:"cancel",runId:RUN.id}})));
</script>
</body>
</html>


only progress part..

<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Model Testing Kit · WIMT Evaluation Studio</title>
<style>
/* ==================================================================
   Model Testing Kit — Progress (Overview)
   Same info as current page; classic 4K polish.
   - Run summary: progress ring + stage counts
   - Each factor row: Pre → Extract → Post as ONE connected pipeline
   - Static (no animation). Table scrolls inside the card, page doesn't.
   ================================================================== */
:root{
  --red:#C8202A; --red-2:#D71E28; --red-d:#A6141C; --soft:#FBEEEE;
  --gold:#FFCD41; --gold-d:#E8B425; --gold-ink:#8A6A0F;
  --green:#1F7A4D; --green-s:#E7F3EC; --amber:#9A6412; --amber-s:#FFF4DC;
  --ink:#1D1815; --ink-2:#4A423C; --ink-3:#857A71; --ink-4:#B3A89E;
  --line:#ECE4DB; --line-2:#F2ECE5; --bg:#F6F3EF;
  --serif: Georgia, "Times New Roman", serif;
  --sans: "Segoe UI", -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: Consolas, ui-monospace, Menlo, monospace;
  --bar:64px; --side:220px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:var(--sans);color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased}
button{font:inherit;cursor:pointer;border:0;background:none;color:inherit}
a{color:inherit;text-decoration:none}
svg{display:block}
/* ---------- App bar ---------- */
.appbar{height:var(--bar);background:linear-gradient(180deg,var(--red-2),var(--red));border-bottom:3px solid var(--gold);display:flex;align-items:center;padding:0 22px 0 18px;gap:16px;color:#fff}
.burger,.ibtn{width:38px;height:38px;display:grid;place-items:center;border-radius:8px;color:#fff}
.burger:hover,.ibtn:hover{background:rgba(255,255,255,.12)}
.ibtn svg{width:20px;height:20px}
.wf{font-family:var(--serif);font-weight:700;font-size:26px;letter-spacing:.6px;white-space:nowrap} /* brand team logo file se replace karo */
.vbar{width:1px;height:30px;background:rgba(255,255,255,.35)}
.studio{display:flex;align-items:center;gap:10px}
.studio .mk{width:34px;height:34px;flex:none}
.studio .mk svg{width:100%;height:100%}
.studio small{display:block;font-family:"Segoe UI",var(--sans);font-size:10.5px;letter-spacing:2.6px;color:#FFE08A;font-weight:600;line-height:1;margin-bottom:4px}
.studio b{display:block;font-family:"Segoe UI",var(--sans);font-size:18px;font-weight:400;letter-spacing:.2px;line-height:1}
.studio b strong{font-weight:600}
.appbar .sp{flex:1}
.user{display:flex;align-items:center;gap:10px;margin-left:8px;font-weight:600;font-size:15px}
.user i{width:34px;height:34px;border-radius:50%;background:#fff;color:var(--red);display:grid;place-items:center;font-style:normal;font-weight:700;font-size:13px}

/* ---------- Sidebar ---------- */
.shell{display:grid;grid-template-columns:var(--side) minmax(0,1fr);height:calc(100% - var(--bar))}
.side{background:linear-gradient(180deg,var(--red),var(--red-d));color:#fff;padding:18px 10px 16px;display:flex;flex-direction:column;gap:4px}
.side h6{font-size:11px;letter-spacing:1.6px;color:var(--gold);opacity:.85;margin:10px 12px 6px;font-weight:700}
.nav{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;font-size:14.5px;color:rgba(255,255,255,.9)}
.nav svg{width:19px;height:19px;flex:none;opacity:.85}
.nav:hover{background:rgba(255,255,255,.08)}
.nav.on{background:rgba(255,255,255,.9);color:var(--red-d);font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.12)}
.side .push{margin-top:auto}



/* ==================================================================
   Model Testing Kit — LIVE (animated)
   Idea: har factor ek "production line" hai. Queries chhote dots ki tarah
   Pre → Extract → Post stations se behti hain. Upar "query matrix" me
   har query ek dot hai jo process hote hi jal uthta hai.
   prefers-reduced-motion pe saari motion band.
   ================================================================== */
.main{height:100%;overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:clamp(10px,1.6vh,20px);
  padding:clamp(14px,2.2vh,30px) clamp(18px,2.2vw,44px) clamp(14px,2.4vh,30px)}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(200,32,42,.45)}70%{box-shadow:0 0 0 10px rgba(200,32,42,0)}100%{box-shadow:0 0 0 0 rgba(200,32,42,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{from{background-position:-200px 0}to{background-position:200px 0}}
@keyframes flow{0%{left:0;opacity:0}12%{opacity:1}88%{opacity:1}100%{left:var(--to);opacity:0}}
@keyframes pop{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
.ph,.setup,.card{animation:rise .6s cubic-bezier(.2,.7,.2,1) both}
.setup{animation-delay:.08s}.card{animation-delay:.16s}

.ph{display:flex;align-items:center;gap:16px;min-width:0}
.back{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:#fff;color:var(--ink-2);flex:none;transition:all .2s}
.back:hover{border-color:var(--red);color:var(--red);transform:translateX(-2px)}
.back svg{width:18px;height:18px}
.ph .tt{min-width:0;flex:1}
.ph h1{font-family:var(--serif);font-weight:400;font-size:clamp(24px,min(2.1vw,4.2vh),44px);line-height:1.05;letter-spacing:-.01em}
.ph p{font-size:clamp(12.5px,min(.85vw,1.75vh),15px);color:var(--ink-3);margin-top:4px}
.live{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:600;color:var(--red-d);flex:none}
.live i{width:8px;height:8px;border-radius:50%;background:var(--red);animation:pulse 1.6s infinite}
.live span{color:var(--ink-3);font-weight:500;font-family:var(--mono);font-size:12px;min-width:56px}
.live.done{color:var(--green)} .live.done i{background:var(--green);animation:none}

.setup{display:grid;grid-template-columns:auto repeat(3,minmax(0,1fr));background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.setup .lab{display:flex;align-items:center;gap:8px;padding:0 18px;font-size:10.5px;font-weight:700;letter-spacing:.18em;color:var(--red-d);background:linear-gradient(180deg,#FFF8F6,#fff);border-right:1px solid var(--line-2)}
.setup .lab::before{content:"";width:3px;height:16px;border-radius:2px;background:var(--red)}
.sel{display:flex;align-items:center;gap:12px;padding:clamp(8px,1.3vh,14px) 18px;border-left:1px solid var(--line-2);min-width:0;text-align:left;transition:background .2s}
.sel:first-of-type{border-left:0}
.sel:hover{background:#FFFBF7}
.sel .si{width:32px;height:32px;border-radius:9px;background:var(--soft);color:var(--red);display:grid;place-items:center;flex:none}
.sel .si svg{width:16px;height:16px}
.sel .sx{min-width:0;flex:1}
.sel small{display:block;font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-4)}
.sel b{display:block;font-size:clamp(12.5px,min(.88vw,1.8vh),15px);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.sel .cv{width:16px;height:16px;color:var(--ink-4);flex:none}

.card{position:relative;min-height:0;display:grid;grid-template-rows:auto auto minmax(0,1fr);background:#FFFEFC;border:1px solid #E6DDD3;border-radius:18px;overflow:hidden;
  box-shadow:inset 0 0 0 5px #FFFEFC,inset 0 0 0 6px #F1EAE1,0 24px 48px -32px rgba(60,20,10,.30)}
.card::before{content:"";position:absolute;left:0;right:0;top:0;height:5px;z-index:3;background:linear-gradient(90deg,var(--red-d),var(--red),#E06A70,var(--red),var(--red-d));background-size:200% 100%;animation:shimmer 6s linear infinite}
.card::after{content:"";position:absolute;left:0;right:0;top:6px;height:1px;z-index:3;background:linear-gradient(90deg,transparent,#E8B425 20%,#E8B425 80%,transparent);opacity:.7}

.tabs{display:flex;align-items:flex-end;gap:6px;padding:14px clamp(16px,1.6vw,30px) 0;border-bottom:1px solid var(--line-2)}
.tab{display:inline-flex;align-items:center;gap:9px;padding:12px 14px 13px;font-size:clamp(13px,min(.92vw,1.85vh),16px);font-weight:600;color:var(--ink-3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s}
.tab:hover{color:var(--ink)}
.tab svg{width:16px;height:16px}
.tab.on{color:var(--red-d);border-bottom-color:var(--red)}
.tab .ld{width:7px;height:7px;border-radius:50%;background:var(--red);animation:pulse 1.6s infinite}
.tabs .sp{flex:1}
.tabs .hint{font-size:12px;color:var(--ink-3);padding-bottom:14px}
.tabs .hint b{font-family:var(--mono);color:var(--ink-2)}

.fchips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:clamp(10px,1.6vh,16px) clamp(16px,1.6vw,30px)}
.fchips::-webkit-scrollbar{display:none}
.fc{flex:none;display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:13px;font-weight:500;color:var(--ink-2);white-space:nowrap;transition:all .25s}
.fc:hover{border-color:var(--red);transform:translateY(-1px)}
.fc .d{width:10px;height:10px;border-radius:50%;background:var(--ink-4);display:grid;place-items:center}
.fc.run .d{background:transparent;border:2px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.fc.done .d{background:var(--green);animation:pop .4s ease}
.fc.done .d::after{content:"";width:4px;height:2px;border-left:1.5px solid #fff;border-bottom:1.5px solid #fff;transform:rotate(-45deg) translate(0,-1px)}
.fc.on{background:var(--ink);border-color:var(--ink);color:#fff}
.fc svg{width:14px;height:14px} .fc.on svg{color:var(--gold)}

/* ---------- hero: ring + matrix + KPIs ---------- */
.hero{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto auto;align-items:center;gap:clamp(14px,1.6vw,30px);
  margin:0 clamp(16px,1.6vw,30px) clamp(8px,1.4vh,14px);padding:clamp(10px,1.6vh,18px) clamp(14px,1.4vw,24px);border-radius:14px;
  background:linear-gradient(90deg,#FFF5F3,#FFFDFB 55%,#FFFBF2);border:1px solid #F3E2DD;position:relative;overflow:hidden}
.ring{position:relative;width:clamp(58px,8.4vh,88px);height:clamp(58px,8.4vh,88px);border-radius:50%;
  background:conic-gradient(var(--red) calc(var(--p) * 1%),#F3E3DF 0);transition:--p 1s;display:grid;place-items:center}
.ring::before{content:"";position:absolute;inset:7px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 1px #F3E3DF}
.ring::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px dashed rgba(200,32,42,.25);animation:spin 18s linear infinite}
.ring b{position:relative;font-family:var(--serif);font-size:clamp(16px,2.5vh,24px);color:var(--red-d)}
@property --p{syntax:"<number>";inherits:false;initial-value:0}
.who b{display:block;font-size:clamp(14px,min(1vw,2vh),18px);font-weight:600;white-space:nowrap}
.who b em{font-style:normal;color:var(--red)}
.who span{display:block;font-size:clamp(12px,min(.8vw,1.6vh),14px);color:var(--ink-3);margin-top:3px;white-space:nowrap}
.who .eta{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;color:var(--gold-ink);background:#FFF4D6;padding:3px 9px;border-radius:999px}
.mx{position:relative;min-width:0;height:clamp(46px,7.4vh,78px)}
.mx canvas{width:100%;height:100%;display:block}
.mx small{position:absolute;right:0;bottom:-2px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-4);background:linear-gradient(90deg,transparent,#FFFBF5 20%);padding-left:16px}
.kpis{display:flex;gap:clamp(14px,1.4vw,28px)}
.kpi strong{display:block;font-family:var(--serif);font-weight:400;font-size:clamp(18px,min(1.5vw,3vh),28px);line-height:1;transition:transform .3s}
.kpi strong.bump{animation:pop .4s ease}
.kpi small{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);margin-top:5px}
.kpi small i{width:7px;height:7px;border-radius:50%}
.kpi.r small i{background:var(--red)} .kpi.q small i{background:var(--ink-4)} .kpi.d small i{background:var(--green)}
.cancel{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:9px;border:1px solid #E9CFCF;background:#fff;color:var(--red-d);font-weight:600;font-size:13.5px;transition:all .2s}
.cancel:hover{background:var(--red);color:#fff;border-color:var(--red)}
.cancel svg{width:14px;height:14px}

/* ---------- lanes ---------- */
.lw{min-height:0;overflow:auto;margin:0 clamp(16px,1.6vw,30px) clamp(10px,1.6vh,18px);border:1px solid var(--line);border-radius:12px;background:#fff;scrollbar-width:thin}
.lg{--cols:minmax(230px,26%) minmax(0,1fr) 128px 92px 36px}
.lh{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:var(--cols);align-items:center;background:#FBF8F4;border-bottom:1px solid var(--line);
  font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
.lh > *{padding:11px 16px}
.lh .st3{display:grid;grid-template-columns:repeat(3,1fr) 22px;padding-left:16px}
.lr{display:grid;grid-template-columns:var(--cols);align-items:center;border-bottom:1px solid var(--line-2);cursor:pointer;position:relative;
  animation:rise .5s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(.25s + var(--i) * .06s);transition:background .2s}
.lr:last-child{border-bottom:0}
.lr > *{padding:clamp(9px,1.5vh,16px) 16px;min-width:0}
.lr:hover{background:#FFFBF8}
.lr::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;transition:background .3s}
.lr.running::before{background:var(--red)} .lr.done::before{background:var(--green)}
.fn{display:flex;align-items:center;gap:12px}
.fn .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none;background:#F4F0EB;color:var(--ink-3);transition:all .3s}
.running .fn .ic{background:var(--soft);color:var(--red)}
.done .fn .ic{background:var(--green-s);color:var(--green)}
.fn .ic svg{width:16px;height:16px}
.fn div{min-width:0}
.fn b{display:block;font-size:clamp(13px,min(.92vw,1.85vh),16px);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fn span{display:block;font-size:clamp(11.5px,min(.78vw,1.55vh),13.5px);color:var(--ink-3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.lane{display:grid;grid-template-columns:repeat(3,1fr) 22px;align-items:center}
.sg{position:relative;display:flex;align-items:center;gap:8px;padding-right:10px}
.nd{position:relative;width:14px;height:14px;border-radius:50%;flex:none;background:#fff;border:2px solid #DCD3C9;z-index:1;transition:all .4s}
.sg.done .nd{background:var(--red);border-color:var(--red);animation:pop .4s ease}
.sg.act .nd{border-color:var(--red);animation:pulse 1.4s infinite}
.tr{position:relative;flex:1;height:8px;border-radius:4px;background:#F0EAE3;overflow:hidden}
.tr i{position:absolute;left:0;top:0;bottom:0;width:calc(var(--v) * 1%);border-radius:4px;background:linear-gradient(90deg,var(--red-d),var(--red));transition:width 1s cubic-bezier(.2,.7,.2,1)}
.sg.act .tr i{background:linear-gradient(90deg,var(--red-d),var(--red) 50%,#F08A8F 60%,var(--red) 70%),var(--red);background-size:200px 100%;animation:shimmer 1.4s linear infinite}
.tr u{position:absolute;top:1px;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 6px 1px rgba(255,255,255,.9);--to:calc(var(--v) * 1% - 6px);animation:flow 1.8s linear infinite;opacity:0}
.tr u:nth-child(3){animation-delay:.6s}.tr u:nth-child(4){animation-delay:1.2s}
.sg:not(.act) .tr u{display:none}
.pc{width:40px;text-align:right;font-family:var(--mono);font-size:12px;color:var(--ink-4);flex:none;transition:color .3s}
.sg.done .pc{color:var(--ink-2)} .sg.act .pc{color:var(--red-d);font-weight:700}
.fin{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;border:2px dashed #DCD3C9;color:transparent;transition:all .4s}
.fin svg{width:12px;height:12px}
.done .fin{border:0;background:var(--green);color:#fff;animation:pop .5s ease}

.st{display:inline-flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:all .3s}
.st i{width:9px;height:9px;border-radius:50%}
.st.running{background:var(--soft);color:var(--red-d)} .st.running i{border:2px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.st.queued{background:#F3EFEA;color:var(--ink-3)} .st.queued i{background:var(--ink-4)}
.st.done{background:var(--green-s);color:var(--green)} .st.done i{background:var(--green)}
.tm{font-family:var(--mono);font-size:12.5px;color:var(--ink-2)} .tm.na{color:var(--ink-4)}
.go{color:var(--ink-4);transition:all .2s} .go svg{width:16px;height:16px}
.lr:hover .go{color:var(--red);transform:translateX(3px)}

/* toast when a factor finishes */
.toast{position:fixed;right:28px;bottom:28px;z-index:20;display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;background:var(--ink);color:#fff;font-size:13.5px;
  box-shadow:0 18px 40px -16px rgba(0,0,0,.45);transform:translateY(20px);opacity:0;transition:all .35s cubic-bezier(.2,.7,.2,1);pointer-events:none}
.toast.show{transform:none;opacity:1}
.toast i{width:22px;height:22px;border-radius:50%;background:var(--green);display:grid;place-items:center}
.toast i svg{width:12px;height:12px}

@media (max-height:700px){ .fn span{display:none} .fn .ic{width:28px;height:28px} .who span{display:none} }
@media (max-width:1500px){ .kpi.d{display:none} }
@media (max-width:1280px){ .mx{display:none} .hero{grid-template-columns:auto minmax(0,1fr) auto auto} }
@media (max-width:1180px){ :root{--side:72px} .side h6,.nav span{display:none} .nav{justify-content:center} .wf{font-size:20px} .kpis{display:none} .pc{display:none} }

/* ==================== FACTOR VIEW: live system map ==================== */
.ov{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0}
.fv{min-height:0;overflow-y:auto;overflow-x:hidden;padding:0 clamp(16px,1.6vw,30px) clamp(12px,1.8vh,20px);display:flex;flex-direction:column;gap:clamp(10px,1.6vh,18px);scrollbar-width:thin}
.fv[hidden]{display:none}
.fv > *{flex:none;animation:rise .5s cubic-bezier(.2,.7,.2,1) both}
.fv > *:nth-child(2){animation-delay:.08s}

/* banner with phase stepper */
.fb{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:clamp(16px,2vw,40px);padding:clamp(12px,1.8vh,20px) clamp(16px,1.6vw,28px);border-radius:14px;
  background:linear-gradient(90deg,#FFF5F3,#FFFDFB 60%,#FFFBF2);border:1px solid #F3E2DD}
.fb .ttl{display:flex;align-items:center;gap:14px;min-width:0}
.fb .big{width:clamp(44px,6.4vh,58px);height:clamp(44px,6.4vh,58px);border-radius:50%;flex:none;display:grid;place-items:center;color:#fff;
  background:radial-gradient(circle at 35% 30%,#E5545B,var(--red) 55%,var(--red-d));box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(200,32,42,.3)}
.fb .big svg{width:44%;height:44%}
.fb.done .big{background:radial-gradient(circle at 35% 30%,#3FA571,var(--green) 60%,#155C39);box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(31,122,77,.3)}
.fb h3{font-family:var(--serif);font-weight:400;font-size:clamp(19px,min(1.6vw,3.2vh),30px);line-height:1.1}
.fb h3 em{font-style:normal;color:var(--red)}
.fb.done h3 em{color:var(--green)}
.fb p{font-size:clamp(12px,min(.82vw,1.65vh),14.5px);color:var(--ink-3);margin-top:4px}
.fb p b{font-family:var(--mono);color:var(--ink-2);font-weight:600}
.stp{display:flex;align-items:center}
.stp .s{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:86px}
.stp .c{position:relative;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;border:2px solid #E3D9CF;background:#fff;color:var(--ink-4);font-family:var(--serif);font-size:15px;transition:all .4s}
.stp .s small{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
.stp .s span{font-family:var(--mono);font-size:12px;color:var(--ink-4)}
.stp .s.done .c{background:var(--red);border-color:var(--red);color:#fff}
.stp .s.act .c{border-color:var(--red);color:var(--red-d);animation:pulse 1.4s infinite}
.stp .s.act span{color:var(--red-d);font-weight:700}
.stp .s.done span{color:var(--ink-2)}
.stp .c svg{width:16px;height:16px}
.stp .l{width:clamp(30px,3vw,60px);height:2px;margin:0 -14px 26px;background:#E8DFD5;position:relative;overflow:hidden}
.stp .l i{position:absolute;inset:0;background:var(--red);transform-origin:left;transform:scaleX(var(--f,0));transition:transform .8s}

/* map */
.map{position:relative;flex:none;min-height:max-content;display:grid;grid-template-columns:3fr 3fr 2fr;gap:0;border:1px solid var(--line);border-radius:16px;background:#fff;overflow:hidden;
  background-image:radial-gradient(rgba(31,26,23,.06) 1px,transparent 1.2px);background-size:20px 20px}
.map > svg.wires{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4;overflow:visible}
.pn{position:relative;padding:clamp(12px,1.8vh,20px) clamp(14px,1.2vw,22px);display:grid;grid-template-rows:auto 1fr;gap:clamp(8px,1.2vh,14px);transition:background .5s}
.pn + .pn{border-left:1px dashed #E3D9CF}
  transition:all .4s;min-height:0}
.pn.act{background:linear-gradient(180deg,rgba(255,240,238,.85),rgba(255,250,248,.55) 55%,rgba(255,255,255,0))}
.pn.idle{background:rgba(250,247,243,.6)}
.pn.done{background:linear-gradient(180deg,rgba(234,245,238,.7),rgba(255,255,255,0) 60%)}
.pn .h{display:flex;align-items:center;gap:10px;min-width:0}
.pn .h .no{font-family:var(--serif);font-size:13px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;border:1px solid currentColor;color:var(--ink-4);flex:none}
.pn.act .h .no{color:var(--red);} .pn.done .h .no{color:var(--green)}
.pn .h b{font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pn .h .sp{flex:1}
.pn .h .pill{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:#F3EFEA;color:var(--ink-3);display:inline-flex;gap:6px;align-items:center}
.pn.act .h .pill{background:var(--soft);color:var(--red-d)} .pn.act .h .pill i{width:8px;height:8px;border-radius:50%;border:1.5px solid #F1C9CB;border-top-color:var(--red);animation:spin .9s linear infinite}
.pn.done .h .pill{background:var(--green-s);color:var(--green)}
.pn .h .bar{position:absolute;left:0;right:0;top:0;height:3px;overflow:hidden;background:rgba(0,0,0,.03)}
.pn .h .bar i{display:block;height:100%;width:calc(var(--v,0) * 1%);background:var(--red);transition:width .8s}
.pn.done .h .bar i{background:var(--green)}
.grid{display:grid;grid-auto-rows:auto;align-content:start;gap:clamp(24px,4vh,52px) clamp(14px,1.2vw,26px);padding-top:clamp(44px,6vh,64px)}
.pre .grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.ext .grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.post .grid{grid-template-columns:repeat(2,minmax(0,1fr))}

.node{position:relative;z-index:3;min-width:0;border-radius:12px;border:1px solid #E9E1D7;background:#fff;padding:clamp(8px,1.2vh,12px) clamp(9px,.7vw,12px) clamp(10px,1.4vh,14px);transition:all .4s;
  box-shadow:0 8px 18px -14px rgba(60,20,10,.3)}
.node .nh{display:flex;align-items:center;gap:8px;min-width:0}
.node .ni{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex:none;background:#F4F0EB;color:var(--ink-3);transition:all .4s}
.node .ni svg{width:13px;height:13px}
.node b{font-size:clamp(12px,min(.8vw,1.7vh),15px);font-weight:600;line-height:1.2;flex:1;min-width:0}
.node .ok{position:absolute;top:-7px;right:-7px;width:18px;height:18px;border-radius:50%;background:var(--green);color:#fff;display:none;place-items:center;animation:pop .4s ease;box-shadow:0 0 0 2px #fff}
.node .ok svg{width:9px;height:9px}
.node small{display:block;font-family:var(--mono);font-size:10.5px;color:var(--ink-4);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.node strong{display:block;font-family:var(--mono);font-size:clamp(11px,min(.74vw,1.6vh),13.5px);font-weight:600;color:var(--ink-3);margin-top:4px;line-height:1.3}
.node .nb{position:absolute;left:12px;right:12px;bottom:5px;height:3px;border-radius:2px;background:#F1EBE4;overflow:hidden;display:none}
.node .nb i{display:block;height:100%;width:calc(var(--v,0) * 1%);background:linear-gradient(90deg,var(--red-d),var(--red));transition:width .8s}
.node.has-bar .nb{display:block}
.node.idle{opacity:.55;box-shadow:none;background:#FDFCFA}
.node.act{border-color:#E7A9AD;box-shadow:0 0 0 3px rgba(200,32,42,.08),0 12px 24px -14px rgba(200,32,42,.45)}
.node.act .ni{background:var(--soft);color:var(--red)}
.node.act .ni::after{content:"";position:absolute}
.node.act strong{color:var(--red-d)}
.node.act::before{content:"";position:absolute;inset:-1px;border-radius:12px;padding:1px;background:linear-gradient(90deg,transparent,var(--red),transparent);background-size:200% 100%;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:shimmer 2.2s linear infinite}
.node.done .ni{background:var(--green-s);color:var(--green)}
.node.done .ok{display:grid}
.node.done strong{color:var(--ink-2)}

/* trace feed (Extract panel, second row) */
.feed{grid-column:1 / -1;border-radius:10px;border:1px dashed #E3D9CF;background:#FCFAF8;padding:8px 12px;min-height:0;overflow:hidden;position:relative;z-index:3}
.feed h6{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-4);margin-bottom:4px;display:flex;align-items:center;gap:6px}
.feed h6 i{width:6px;height:6px;border-radius:50%;background:var(--ink-4)}
.act .feed h6 i{background:var(--red);animation:pulse 1.4s infinite}
.feed ul{list-style:none;font-family:var(--mono);font-size:11px;color:var(--ink-3);display:grid;gap:2px}
.feed li{display:flex;gap:10px;animation:rise .35s ease both;white-space:nowrap;overflow:hidden}
.feed li b{color:var(--ink-2);font-weight:600}
.feed li em{font-style:normal;color:var(--green)}
.feed li em.w{color:var(--amber)}
.feed li span{margin-left:auto;color:var(--ink-4)}


/* live callout over the active node */
.callout{position:absolute;z-index:6;transform:translate(-50%,calc(-100% - 12px));background:var(--ink);color:#fff;border-radius:10px;padding:8px 12px;font-size:12px;white-space:nowrap;
  box-shadow:0 12px 26px -12px rgba(0,0,0,.5);pointer-events:none;transition:left .5s,top .5s,opacity .3s;display:flex;align-items:center;gap:12px}
.callout[hidden]{display:none}
.callout::after{content:"";position:absolute;left:50%;bottom:-6px;width:12px;height:12px;background:var(--ink);transform:translateX(-50%) rotate(45deg);border-radius:2px}
.callout b{font-weight:600}
.callout .k{display:flex;flex-direction:column;line-height:1.15}
.callout .k small{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#B7ACA3}
.callout .k strong{font-family:var(--mono);font-size:12.5px;color:#fff;font-weight:600}
.callout .k strong.g{color:var(--gold)}
.callout .dv{width:1px;align-self:stretch;background:rgba(255,255,255,.15)}
.callout .lv{width:8px;height:8px;border-radius:50%;background:#FF5A61;animation:pulse 1.4s infinite}
/* event timeline */
.log{display:flex;align-items:center;gap:0;min-width:0;overflow:hidden;padding:10px 16px;border:1px solid var(--line);border-radius:12px;background:#fff}
.log h6{flex:none;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);margin-right:16px}
.log ol{list-style:none;display:flex;align-items:center;min-width:0;flex:1}
.log li{position:relative;display:flex;align-items:center;gap:8px;flex:none;font-size:12.5px;color:var(--ink-2);padding-right:34px;animation:rise .4s ease both;white-space:nowrap}
.log li:not(:last-child)::after{content:"";position:absolute;right:8px;top:50%;width:18px;height:1px;background:#DDD3C8}
.log li i{width:8px;height:8px;border-radius:50%;background:var(--red);flex:none}
.log li.e-ok i{background:var(--green)} .log li.e-st i{background:#fff;border:2px solid var(--red)}
.log li span{font-family:var(--mono);font-size:11px;color:var(--ink-4)}
@media (max-height:760px){ .log{display:none} }
@media (max-height:900px){ .fb{padding:10px 16px} .fb .big{width:44px;height:44px} .feed{display:none} .node small{display:none} .grid{row-gap:28px} .stp .c{width:32px;height:32px} }
@media (max-height:700px){  .fb{padding:8px 14px} .fb p{display:none} .fb .big{width:38px;height:38px} .stp .c{width:30px;height:30px} .log{display:none} .grid{padding-top:36px;row-gap:14px} .pn{padding-top:10px;padding-bottom:10px} .node{padding-top:6px;padding-bottom:8px} }

/* wires */
.wires > path{fill:none;stroke-linecap:round}
.wires .w-idle{stroke:#E2D8CD;stroke-width:1.5;stroke-dasharray:3 5}
.wires .w-done{stroke:#C8202A;stroke-opacity:.75;stroke-width:2}
.wires .w-act{stroke:#C8202A;stroke-width:2;stroke-dasharray:6 6;animation:dash .6s linear infinite}
@keyframes dash{to{stroke-dashoffset:-12}}
.wires circle.pk{fill:#C8202A;filter:drop-shadow(0 0 3px rgba(200,32,42,.8))}

@media (max-height:700px){ .node small{display:none} .grid{gap:22px 14px} .feed{display:none} .stp .s{min-width:70px} }
@media (max-width:1400px){ .node small{display:none} .stp .s{min-width:70px} .stp .l{width:24px} .node .ni{display:none} }


/* ===== spacious, horizontally scrollable map ===== */
.mapwrap{position:relative;overflow-x:auto;overflow-y:hidden;border:1px solid var(--line);border-radius:16px;background:#fff;scrollbar-width:thin;scrollbar-color:#E3B8BB transparent;scroll-behavior:smooth}
.mapwrap::-webkit-scrollbar{height:8px}.mapwrap::-webkit-scrollbar-thumb{background:#E3B8BB;border-radius:4px}
.mapwrap .map{border:0 !important;border-radius:0;min-width:2050px;grid-template-columns:780px 760px 510px !important;
  background-image:radial-gradient(rgba(31,26,23,.05) 1px,transparent 1.2px) !important;background-size:22px 22px}
.mapwrap .pn{padding:18px 34px 20px}
.mapwrap .grid{gap:44px 56px !important;padding-top:58px !important;align-content:start}
.mapwrap .node{padding:14px 16px 16px}
.mapwrap .node small{display:block !important;margin-left:0;font-size:11px}
.mapwrap .node strong{margin-left:0;font-size:13.5px}
.mapwrap .node b{white-space:nowrap}
.mapwrap .feed{display:block !important;margin-top:4px}
.mapwrap .feed ul{font-size:12px}
.scrollhint{display:flex;margin-bottom:-4px;align-items:center;justify-content:center;gap:8px;font-size:11.5px;color:var(--ink-4);letter-spacing:.04em;margin-top:-6px}
.scrollhint span{color:var(--ink-3)}
.log{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
.log li{flex:none}
.fv .log{display:flex !important}

@media (prefers-reduced-motion: reduce){ *,*::before,*::after{animation:none !important;transition:none !important} }
</style>
</head>
<body>
<header class="appbar">
  <button class="burger" aria-label="Menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  <span class="wf">WELLS FARGO</span>
  <span class="vbar"></span>
  <div class="studio">
    <span class="mk"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 33L33 27" stroke="#FFCD41" stroke-width="3.2" stroke-linecap="round"/><path d="M7 33L24 9" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M17.3 30.6A11 11 0 0 0 13.2 24" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/><circle cx="33" cy="27" r="3.8" fill="#FFCD41"/><circle cx="24" cy="9" r="3.8" fill="#fff"/><circle cx="7" cy="33" r="3.2" fill="#fff"/></svg></span>
    <div><small>WIMT</small><b>Evaluation <strong>Studio</strong></b></div>
  </div>
  <div class="sp"></div>
  <button class="ibtn" aria-label="Flows"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a3 3 0 0 1 3 3V14"/></svg></button>
  <button class="ibtn" aria-label="Data"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg></button>
  <button class="ibtn" aria-label="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg></button>
  <div class="user">Rahul <i>R</i></div>
</header>

<div class="shell">
  <aside class="side">
    <h6>WORKSPACE</h6>
    <a class="nav" href="#/home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg><span>Home</span></a>
    <a class="nav on" href="#/evaluate" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a3 3 0 0 1 3 3v6.5"/></svg><span>Evaluation</span></a>
    <a class="nav" href="#/playground"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="5" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M6 7.2v4.3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v-.5"/></svg><span>Model Playground</span></a>
    <h6>LIBRARY</h6>
    <a class="nav" href="#/prompts"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg><span>Prompt Hub</span></a>
    <a class="nav" href="#/golden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg><span>Golden Dataset</span></a>
    <a class="nav" href="#/traces"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg><span>Data &amp; Traces</span></a>
    <a class="nav push" href="#/settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg><span>Settings</span></a>
  </aside>

      <main class="main">
    <section class="ph">
      <button class="back" aria-label="Back to Evaluation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
      <div class="tt"><h1>Model Testing Kit</h1><p>WIMT Model Testing Framework over an uploaded query set</p></div>
      <span class="live" id="live"><i></i><em id="liveTxt" style="font-style:normal">Running</em> <span id="elapsed">20m 05s</span></span>
    </section>

    <section class="setup" aria-label="Run setup">
      <div class="lab">RUN SETUP</div>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg></span><span class="sx"><small>Dataset</small><b id="sDataset"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg></span><span class="sx"><small>Supervisor</small><b id="sEnv"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
      <button class="sel"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><span class="sx"><small>Factors</small><b id="sFactors"></b></span><svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>
    </section>

    <section class="card">
      <div class="tabs" role="tablist">
        <button class="tab on" role="tab" aria-selected="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>Progress <span class="ld" id="tabDot"></span></button>
        <button class="tab" role="tab" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></svg>Analytics</button>
        <span class="sp"></span><span class="hint">Run <b id="runId"></b></span>
      </div>
      <div class="fchips" id="chips"></div>

      <div class="ov" id="ovView">
      <div class="hero">
        <div class="ring" id="ring" style="--p:0"><b id="pct">0%</b></div>
        <div class="who"><b>Run · <em id="runState">running</em></b><span id="runMeta"></span><span class="eta" id="eta">≈ estimating…</span></div>
        <div class="mx"><canvas id="mx"></canvas><small id="mxLab">queries</small></div>
        <div class="kpis">
          <div class="kpi r"><strong id="kRun">0</strong><small><i></i>Running</small></div>
          <div class="kpi q"><strong id="kQ">0</strong><small><i></i>Queued</small></div>
          <div class="kpi d"><strong id="kD">0</strong><small><i></i>Done</small></div>
        </div>
        <button class="cancel" id="cancel"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>Cancel run</button>
      </div>

      <div class="lw lg">
        <div class="lh"><div>Factor</div><div class="st3"><span>Pre</span><span>Extract</span><span>Post</span><span></span></div><div>Status</div><div>Time</div><div></div></div>
        <div id="lanes"></div>
      </div>
      </div>
      <div class="fv" id="fView" hidden></div>
    </section>
  </main>
</div>
<div class="toast" id="toast"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></i><span id="toastTxt"></span></div>

<script>
/* ------------------------------------------------------------------
   USE_MOCK = true → demo simulation chalti hai (animation dekhne ke liye).
   Real app me USE_MOCK = false karo aur SSE se TestingKit.update(snapshot) call karo.
   Snapshot shape = RUN object. null = unknown → "—" (kabhi 0 nahi).
   ------------------------------------------------------------------ */
const USE_MOCK = true;
const RUN = {
  id:"mtk-0462", state:"running", startedAt: Date.now() - (20*60+5)*1000,
  file:"Copy_of_CM_Golden_Dataset.xlsx", rows:462, env:"DEV",
  factors:[
    {id:"cm",name:"Change Management",desc:"Toxicity, performance & sensitivity bundle",pre:66,extract:0,post:0,status:"running",start:Date.now()-1205000},
    {id:"perf",name:"Performance",desc:"Response quality and speed",pre:100,extract:100,post:0,status:"running",start:Date.now()-1205000},
    {id:"hal",name:"Hallucination",desc:"Answers grounded in sources",pre:100,extract:12,post:0,status:"running",start:Date.now()-1205000},
    {id:"exp",name:"Explainability",desc:"Clear reasons behind answers",pre:0,extract:0,post:0,status:"queued"},
    {id:"rep",name:"Replication",desc:"Same question, same answer",pre:0,extract:0,post:0,status:"queued"},
    {id:"cal",name:"Parameter Calibration",desc:"Tune parameters on the dataset",pre:0,extract:0,post:0,status:"queued"},
    {id:"bm",name:"Benchmarking",desc:"Compare against a baseline",pre:0,extract:0,post:0,status:"queued"},
    {id:"sen",name:"Sensitivity",desc:"Stable when wording changes",pre:0,extract:0,post:0,status:"queued"},
    {id:"judge",name:"Judge Evaluation",desc:"Judge agreement with SMEs",pre:0,extract:0,post:0,status:"queued"}
  ]
};
const ICON={cm:'<path d="M3 7h18M3 12h18M3 17h12"/>',perf:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',hal:'<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
 exp:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/>',
 rep:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
 cal:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
 bm:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',sen:'<path d="M2 12h3l3-7 4 14 3-7h7"/>',
 judge:'<path d="M12 3v18M7 21h10M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>'};
const svg=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const $=id=>document.getElementById(id);
const fmt=ms=>{if(ms==null||ms<0)return"—";const s=Math.floor(ms/1000);return `${Math.floor(s/60)}m ${String(s%60).padStart(2,"0")}s`;};
const overall=r=>Math.round(r.factors.reduce((a,f)=>a+((f.pre||0)+(f.extract||0)+(f.post||0))/3,0)/r.factors.length);

/* ---- build lanes once, then only update values (so CSS transitions animate) ---- */
function build(r){
  $("sDataset").textContent=r.file; $("sEnv").textContent=r.env+" supervisor"; $("sFactors").textContent=r.factors.length+" selected"; $("runId").textContent="#"+r.id;
  $("runMeta").textContent=`${r.file} · ${r.rows} rows · ${r.env} · ${r.factors.length} factors`;
  $("chips").innerHTML=`<button class="fc on">${svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>')}Overview</button>`+
    r.factors.map(f=>`<button class="fc" data-f="${f.id}"><span class="d"></span>${f.name}</button>`).join("");
  const seg=k=>`<div class="sg" data-k="${k}"><span class="nd"></span><span class="tr" style="--v:0"><i></i><u></u><u></u><u></u></span><span class="pc">—</span></div>`;
  $("lanes").innerHTML=r.factors.map((f,i)=>`<div class="lr" data-f="${f.id}" style="--i:${i}">
    <div class="fn"><span class="ic">${svg(ICON[f.id]||ICON.cm)}</span><div><b>${f.name}</b><span>${f.desc}</span></div></div>
    <div class="lane">${seg("pre")}${seg("extract")}${seg("post")}<span class="fin">${svg('<path d="M5 12l5 5 9-10"/>')}</span></div>
    <div><span class="st"><i></i><em style="font-style:normal"></em></span></div>
    <div><span class="tm"></span></div>
    <div class="go">${svg('<path d="M9 6l6 6-6 6"/>')}</div></div>`).join("");
}
let prevStatus={};
function update(r){
  const p=overall(r); $("ring").style.setProperty("--p",p); $("pct").textContent=p+"%";
  const cnt=s=>r.factors.filter(f=>f.status===s).length;
  [["kRun","running"],["kQ","queued"],["kD","done"]].forEach(([id,s])=>{const el=$(id),v=String(cnt(s));if(el.textContent!==v){el.textContent=v;el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump");}});
  const el=Date.now()-r.startedAt; $("elapsed").textContent=fmt(el);
  const allDone=r.factors.every(f=>f.status==="done");
  $("runState").textContent=allDone?"complete":r.state; $("live").classList.toggle("done",allDone); $("liveTxt").textContent=allDone?"Complete":"Running";
  $("eta").textContent= p>2 && !allDone ? `≈ ${fmt(el*(100-p)/p)} left` : allDone ? "All factors finished" : "≈ estimating…";
  r.factors.forEach(f=>{
    const row=document.querySelector(`.lr[data-f="${f.id}"]`), chip=document.querySelector(`.fc[data-f="${f.id}"]`);
    row.className="lr "+f.status; chip.className="fc "+(f.status==="running"?"run":f.status==="done"?"done":"")+(current&&current.id===f.id?" on":"");
    let prevDone=true;
    ["pre","extract","post"].forEach(k=>{
      const v=f[k], sg=row.querySelector(`.sg[data-k="${k}"]`);
      const st= f.status==="queued" ? "idle" : v>=100 ? "done" : (v>0||prevDone) ? "act" : "idle";
      sg.className="sg "+st; sg.querySelector(".tr").style.setProperty("--v",v||0);
      sg.querySelector(".pc").textContent= st==="idle" && !v ? "—" : (v==null?"—":v+"%");
      prevDone = v>=100;
    });
    const s=row.querySelector(".st"); s.className="st "+f.status; s.querySelector("em").textContent=f.status;
    const tm=row.querySelector(".tm"); const t=f.start? (f.end||Date.now())-f.start : null; tm.textContent=fmt(t); tm.className="tm"+(t==null?" na":"");
    if(prevStatus[f.id]==="running" && f.status==="done") toast(`${f.name} finished · all stages complete`);
    prevStatus[f.id]=f.status;
  });
  matrix.target=Math.round(r.rows*p/100);
  r.factors.forEach(track);
  if(current) updateFactor(current);
  const ovc=document.querySelector(".fc:not([data-f])"); if(ovc) ovc.classList.toggle("on",!current);
}
let tt; function toast(msg){$("toastTxt").textContent=msg;$("toast").classList.add("show");clearTimeout(tt);tt=setTimeout(()=>$("toast").classList.remove("show"),2600);}

/* ---- query matrix: one dot per query; lights up as processed ---- */
const matrix={target:0,shown:0,born:[]};
(function(){
  const cv=$("mx"),ctx=cv.getContext("2d");
  function frame(t){
    const w=cv.clientWidth,h=cv.clientHeight; if(!w){requestAnimationFrame(frame);return;}
    const dpr=window.devicePixelRatio||1; if(cv.width!==w*dpr){cv.width=w*dpr;cv.height=h*dpr;}
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    const n=RUN.rows, rowsN=Math.max(4,Math.floor(h/9)), cols=Math.ceil(n/rowsN), gap=Math.min(9,(w-12)/cols), rad=Math.max(1.4,gap*.28);
    if(matrix.shown<matrix.target){const add=Math.max(1,Math.ceil((matrix.target-matrix.shown)/18));for(let k=0;k<add;k++){matrix.born[matrix.shown]=t;matrix.shown++;}}
    if(matrix.shown>matrix.target){matrix.shown=matrix.target;}
    for(let i=0;i<n;i++){
      const c=Math.floor(i/rowsN), r=i%rowsN, x=6+c*gap, y=h/2-(rowsN-1)*4.5+r*9;
      if(i<matrix.shown){
        const age=(t-(matrix.born[i]||0))/600, s=age<1?1+ (1-age)*.9:1;
        ctx.fillStyle=age<1?`rgba(232,180,37,${1-age*.5})`:"#C8202A";
        ctx.beginPath();ctx.arc(x,y,rad*s,0,7);ctx.fill();
      }else{
        const scan=(Math.sin(t/700 - c*.18)+1)/2;
        ctx.fillStyle=i===matrix.shown?"rgba(200,32,42,.55)":`rgba(160,140,125,${.16+scan*.12})`;
        ctx.beginPath();ctx.arc(x,y,rad*.85,0,7);ctx.fill();
      }
    }
    $("mxLab").textContent=`${matrix.shown} / ${n} queries`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();



/* ---- per-factor history: rate, ETA, timeline ---- */
function track(f){
  const now=Date.now(); f._h=f._h||{}; f.log=f.log||[];
  const st=f.status==="queued"?null:f.pre<100?"pre":f.extract<100?"extract":f.post<100?"post":"done";
  if(!f._seeded && f.status!=="queued"){ f._seeded=true; const t0=f.start||now;
    f.log.push({t:t0,txt:"Run started",k:"st"});
    if(f.pre>=100) f.log.push({t:t0+60000*8,txt:`Pre complete · ${RUN.rows} answered`,k:"ok"});
    if(f.extract>=100) f.log.push({t:t0+60000*14,txt:"Extract complete · traces.json",k:"ok"});
    if(st&&st!=="done"&&st!=="pre") f.log.push({t:t0+60000*(st==="extract"?9:15),txt:`${st==="extract"?"Extract":"Post"} started`,k:"st"});
  }
  if(f._stage && st && f._stage!==st){
    const name={pre:"Pre",extract:"Extract",post:"Post"};
    if(f._stage!=="done") f.log.push({t:now,txt:`${name[f._stage]} complete${f._stage==="pre"?` · ${RUN.rows} answered`:f._stage==="extract"?" · traces.json":""}`,k:"ok"});
    if(st==="done") f.log.push({t:now,txt:"Results written · _post.xlsx",k:"ok"});
    else f.log.push({t:now,txt:`${name[st]} started`,k:"st"});
  }
  if(st && (!f._stage||f._stage!==st)) f._h[st]={t:now,v:f[st]||0};
  f._stage=st;
  return st;
}
function ago(t){const m=Math.max(0,Math.round((Date.now()-t)/60000));return m<1?"just now":m+"m ago";}
function callout(f,st){
  const c=$("callout"); if(!c) return;
  if(!st||st==="done"){c.hidden=true;return;}
  const id={pre:"rp",extract:"ex",post:"sc"}[st], el=$("n-"+id), map=$("map"); if(!el) return;
  const N=RUN.rows, v=f[st]||0, h=f._h[st]||{t:Date.now(),v:v};
  const mins=Math.max((Date.now()-h.t)/60000,1/60), done=Math.round(N*(v-h.v)/100), rate=Math.max(0,Math.round(done/mins));
  const left=rate>0?fmt(((N-Math.round(N*v/100))/rate)*60000):"—";
  const verb={pre:"Sending queries",extract:"Pulling traces",post:"Scoring answers"}[st];
  c.innerHTML=`<span class="lv"></span><b>${verb}</b><span class="dv"></span><span class="k"><small>done</small><strong>${Math.round(N*v/100)}/${N}</strong></span><span class="k"><small>rate</small><strong>${rate ? rate+"/min" : "—"}</strong></span><span class="k"><small>stage left</small><strong class="g">${left}</strong></span>`;
  const R=map.getBoundingClientRect(), B=el.getBoundingClientRect();
  let x=(B.left+B.right)/2-R.left; const w=c.offsetWidth||260; x=Math.max(w/2+8,Math.min(R.width-w/2-8,x));
  c.style.left=x+"px"; c.style.top=(B.top-R.top)+"px"; c.hidden=false;
}
function renderLog(f){
  const ol=$("log"); if(!ol) return;
  const items=(f.log||[]).slice(-5);
  const html=items.map(e=>`<li class="e-${e.k}"><i></i>${e.txt}<span>${ago(e.t)}</span></li>`).join("") || `<li class="e-st"><i></i>Waiting in queue</li>`;
  if(ol.dataset.h!==html){ol.innerHTML=html;ol.dataset.h=html;}
}

/* ==================== FACTOR VIEW logic ==================== */
const I2={file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',play:'<path d="M7 4l13 8-13 8z"/>',bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',cloud:'<path d="M17.5 19a4.5 4.5 0 0 0 .4-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 7 19z"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',json:'<path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"/>',
 scale:'<path d="M12 3v18M7 21h10M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>',sheet:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
 check:'<path d="M5 12l5 5 9-10"/>'};
let current=null;
function node(id,ic,title,sub,grid){return `<div class="node idle" id="n-${id}" style="${grid||""}"><div class="nh"><span class="ni">${svg(I2[ic])}</span><b>${title}</b><span class="ok">${svg(I2.check)}</span></div><small>${sub}</small><strong>—</strong><span class="nb"><i></i></span></div>`;}
function buildFactor(f){
  $("fView").innerHTML=`
  <div class="fb" id="fb"><div class="ttl"><span class="big">${svg(ICON[f.id]||ICON.cm)}</span><div><h3>${f.name} · <em id="fbPhase">Pre phase</em></h3><p id="fbDesc"></p></div></div>
    <div class="stp" id="stp">
      <div class="s" data-k="pre"><span class="c">1</span><small>Pre</small><span>—</span></div><div class="l"><i></i></div>
      <div class="s" data-k="extract"><span class="c">2</span><small>Extract</small><span>—</span></div><div class="l"><i></i></div>
      <div class="s" data-k="post"><span class="c">3</span><small>Post</small><span>—</span></div></div></div>
  <div class="mapwrap" id="mapwrap"><div class="map" id="map"><svg class="wires" id="wires"></svg><div class="callout" id="callout" hidden></div>
    <section class="pn pre" data-k="pre"><div class="h"><span class="bar"><i></i></span><span class="no">1</span><b>Pre · Run prompts</b><span class="sp"></span><span class="pill"><i></i><em style="font-style:normal">waiting</em></span></div>
      <div class="grid">${node("ds","file","Dataset",f.id==="cm"?"golden dataset":"query set")}${node("rp","play","Run prompts","query supervisor")}${node("sv","bot","Supervisor","agent · "+RUN.env)}
        <span></span>${node("ans","copy","Answers","_pre.parquet")}${node("tq","cloud","Tachyon","search + completions")}</div></section>
    <section class="pn ext" data-k="extract"><div class="h"><span class="bar"><i></i></span><span class="no">2</span><b>Extract · Pull traces</b><span class="sp"></span><span class="pill"><i></i><em style="font-style:normal">waiting</em></span></div>
      <div class="grid">${node("ow","eye","Overwatch","trace store")}${node("ex","dl","Extract","pull traces")}${node("tf","json","Traces file","traces.json")}
        <div class="feed"><h6><i></i>Trace feed</h6><ul id="feed"><li>waiting for traces…</li></ul></div></div></section>
    <section class="pn post" data-k="post"><div class="h"><span class="bar"><i></i></span><span class="no">3</span><b>Post · Score</b><span class="sp"></span><span class="pill"><i></i><em style="font-style:normal">waiting</em></span></div>
      <div class="grid">${node("sc","scale","Score","LLM judge")}${node("rs","sheet","Results","_post.xlsx")}${node("tj","cloud","Tachyon","judge + embeddings")}${node("mf","list","Manifest","run_manifest.json")}</div></section>
  </div></div>
  <div class="scrollhint" id="scrollhint"><span>Scroll</span> ← → <span>to follow the flow</span></div>
  <div class="log"><h6>Timeline</h6><ol id="log"></ol></div>`;
  feedN=0;
}
const EDGES=[["ds","rp","h"],["rp","sv","h"],["rp","ans","v"],["sv","tq","v"],["sv","ow","x"],["ow","ex","h"],["ex","tf","h"],["tf","sc","x"],["sc","rs","h"],["sc","tj","v"],["rs","mf","v"]];
function wires(states){
  const map=$("map"), w=$("wires"); if(!map||!w) return;
  const R=map.getBoundingClientRect(); w.setAttribute("viewBox",`0 0 ${R.width} ${R.height}`);
  const box=id=>{const b=$("n-"+id).getBoundingClientRect();return {l:b.left-R.left,r:b.right-R.left,t:b.top-R.top,b:b.bottom-R.top,cx:(b.left+b.right)/2-R.left,cy:(b.top+b.bottom)/2-R.top};};
  let out=`<defs>
    <marker id="ah-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#C8202A"/></marker>
    <marker id="ah-done" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#C8202A"/></marker>
    <marker id="ah-idle" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#D5CABE"/></marker></defs>`;
  EDGES.forEach(([a,b,k],i)=>{
    const A=box(a),B=box(b); let d;
    if(k==="v") d=`M ${A.cx} ${A.b+2} L ${B.cx} ${B.t-3}`;
    else if(k==="h") d=`M ${A.r+2} ${A.cy} L ${B.l-3} ${B.cy}`;
    else { const mx=(A.r+B.l)/2; d=`M ${A.r+2} ${A.cy} C ${mx} ${A.cy}, ${mx} ${B.cy}, ${B.l-3} ${B.cy}`; }
    const sa=states[a], sb=states[b];
    const cls= sb==="act" ? "w-act" : (sa==="done"&&sb==="done") ? "w-done" : "w-idle";
    const mk=cls==="w-act"?"ah-red":cls==="w-done"?"ah-done":"ah-idle";
    out+=`<path id="wp${i}" class="${cls}" d="${d}" marker-end="url(#${mk})"/>`;
    if(cls==="w-act") out+=`<circle class="pk" r="3.2"><animateMotion dur="1.4s" repeatCount="indefinite"><mpath href="#wp${i}"/></animateMotion></circle><circle class="pk" r="2.4" opacity=".6"><animateMotion dur="1.4s" begin=".7s" repeatCount="indefinite"><mpath href="#wp${i}"/></animateMotion></circle>`;
  });
  w.innerHTML=out;
}
let feedN=0, lastStates="";
function updateFactor(f){
  const N=RUN.rows, pre=f.pre||0, ex=f.extract||0, po=f.post||0, q=f.status==="queued";
  const st=v=>q?"idle":v>=100?"done":v>0?"act":"idle";
  const sP=q?"idle":st(pre)==="idle"?"act":st(pre), sE=q?"idle":(pre>=100? (ex>=100?"done":"act"):"idle"), sO=q?"idle":(ex>=100?(po>=100?"done":"act"):"idle");
  const S={pre:sP,extract:sE,post:sO};
  const phase=q?"Queued":sO==="done"?"Complete":sO==="act"?"Post phase":sE==="act"?"Extract phase":"Pre phase";
  $("fbPhase").textContent=phase; $("fb").classList.toggle("done",sO==="done");
  const t=f.start?fmt((f.end||Date.now())-f.start):"—";
  const desc={ "Queued":"Waiting for a free slot · starts when a running factor finishes",
    "Pre phase":"Query Supervisor · sending every query in the dataset to the GPT Supervisor",
    "Extract phase":"Pulling traces from Overwatch for every answered query",
    "Post phase":"LLM judge and embeddings score every answer",
    "Complete":"All stages done · results and manifest written" }[phase];
  $("fbDesc").innerHTML=`${desc} · <b>${t}</b>`;
  const stps=$("stp").querySelectorAll(".s"), ls=$("stp").querySelectorAll(".l i");
  [["pre",pre],["extract",ex],["post",po]].forEach(([k,v],i)=>{const el=stps[i]; el.className="s "+(S[k]==="act"?"act":S[k]); el.querySelector(".c").innerHTML=S[k]==="done"?svg(I2.check):i+1; el.lastElementChild.textContent=S[k]==="idle"&&!v?"—":v+"%";});
  ls[0].parentElement.style.setProperty("--f",pre>=100?1:0); ls[1].parentElement.style.setProperty("--f",ex>=100?1:0);
  // panels
  document.querySelectorAll("#map .pn").forEach(pn=>{const k=pn.dataset.k,v=f[k]||0;pn.className="pn "+pn.classList[1]+" "+S[k];
    pn.querySelector(".pill em").textContent=S[k]==="act"?"running":S[k]==="done"?"done":"waiting"; pn.querySelector(".bar").style.setProperty("--v",v);});
  // nodes
  const sent=Math.round(N*pre/100), ans=Math.max(0,sent-Math.round(Math.random()*3+ (pre<100?6:0))), tr=Math.round(N*ex/100), sc=Math.round(N*po/100);
  const n={}, set=(id,state,val,bar)=>{n[id]=state;const el=$("n-"+id);el.className="node "+state+(bar!=null&&state==="act"?" has-bar":"");el.querySelector("strong").textContent=val;if(bar!=null)el.querySelector(".nb").style.setProperty("--v",bar);};
  set("ds", q?"idle":"done", N+" rows");
  set("rp", sP, sP==="idle"?"—":`${sent}/${N} sent`, pre);
  set("sv", sP, sP==="idle"?"—":`${pre>=100?N:ans} answered`, pre);
  set("ans",sP, sP==="done"?"saved":sP==="act"?"writing":"not yet");
  set("tq", sP, sP==="done"?"released":sP==="act"?"in use":"—");
  set("ow", sE==="idle"?"idle":sE, sE==="idle"?"—":sE==="act"?"receiving":"synced");
  set("ex", sE, sE==="idle"?"—":`${tr}/${N} traces`, ex);
  set("tf", sE==="done"?"done":sE==="act"&&ex>60?"act":"idle", sE==="done"?"written":sE==="act"?"buffering":"not yet");
  set("sc", sO, sO==="idle"?"—":`${sc}/${N} scored`, po);
  set("tj", sO, sO==="done"?"released":sO==="act"?"in use":"—");
  set("rs", sO==="done"?"done":sO==="act"&&po>50?"act":"idle", sO==="done"?"written":sO==="act"?"filling":"not yet");
  set("mf", sO==="done"?"done":"idle", sO==="done"?"written":"not yet");
  // feed
  if(sE==="act" && tr>feedN){const ul=$("feed"); if(feedN===0) ul.innerHTML="";
    for(let i=Math.max(feedN,tr-2);i<tr;i++){const li=document.createElement("li");const ok=Math.random()>.12;li.innerHTML=`<b>q-${String(i+1).padStart(4,"0")}</b><em class="${ok?"":"w"}">${ok?"matched":"retrying"}</em><span>${(Math.random()*1.8+.3).toFixed(1)}s</span>`;ul.prepend(li);}
    while(ul.children.length>4) ul.lastChild.remove(); feedN=tr;}
  if(sE==="done" && feedN<N){$("feed").innerHTML=`<li><b>${N} / ${N}</b><em>all traces matched</em></li>`;feedN=N;}
  const key=JSON.stringify(n); if(key!==lastStates){lastStates=key;wires(n);} 
  current._n=n;
  const stg=track(f); callout(f,stg); renderLog(f);
  if(stg && f._scrolled!==stg){f._scrolled=stg;const pn=document.querySelector(`#map .pn[data-k="${stg}"]`),w=$("mapwrap");if(pn&&w)w.scrollLeft=Math.max(0,pn.offsetLeft-60);}
}
function openFactor(id){
  const f=RUN.factors.find(x=>x.id===id);
  document.querySelectorAll(".fc").forEach(c=>c.classList.toggle("on",c.dataset.f===id||(!id&&!c.dataset.f)));
  if(!f){current=null;$("fView").hidden=true;$("ovView").hidden=false;$("ovView").style.display="";return;}
  current=f; f._scrolled=null; $("ovView").style.display="none"; $("fView").hidden=false; lastStates=""; buildFactor(f); updateFactor(f);
}
new ResizeObserver(()=>{if(current&&current._n)wires(current._n);}).observe(document.querySelector(".card"));

/* ---- demo simulation ---- */
function step(){
  const run=RUN.factors.filter(f=>f.status==="running");
  run.forEach(f=>{
    const k=f.pre<100?"pre":f.extract<100?"extract":"post";
    f[k]=Math.min(100,f[k]+Math.ceil(Math.random()*7));
    if(f.post>=100){f.status="done";f.end=Date.now();}
  });
  const q=RUN.factors.filter(f=>f.status==="queued");
  while(RUN.factors.filter(f=>f.status==="running").length<3 && q.length){const f=q.shift();f.status="running";f.start=Date.now();}
  update(RUN);
}
build(RUN); update(RUN);
const _f=new URLSearchParams(location.search).get("factor"); if(_f) openFactor(_f);
setInterval(()=>{ if(USE_MOCK) step(); else update(RUN); },1000);

window.TestingKit={ update:s=>{Object.assign(RUN,s);update(RUN);} };
document.addEventListener("click",e=>{const ov=e.target.closest(".fc:not([data-f])");if(ov){openFactor(null);return;}const t=e.target.closest("[data-f]");if(t){openFactor(t.dataset.f);window.dispatchEvent(new CustomEvent("testingkit:factor",{detail:{id:t.dataset.f}}));}});
$("cancel").addEventListener("click",()=>window.dispatchEvent(new CustomEvent("testingkit:action",{detail:{type:"cancel",runId:RUN.id}})));
</script>
</body>
</html>
