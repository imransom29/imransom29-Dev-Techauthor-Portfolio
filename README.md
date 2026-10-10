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
