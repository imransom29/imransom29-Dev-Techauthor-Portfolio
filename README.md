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