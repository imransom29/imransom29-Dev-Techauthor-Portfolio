# WIMT Evaluation Studio — Consolidated Status

Sab recent meetings aur unse nikli requirements ek jagah. 6 October 2026 tak.

---

# PART 1 — Meetings ka timeline

| Kab | Kiske saath | Kya nikla |
|---|---|---|
| 21 Aug | Rohan Sharma | Arize verdict hataya, raw JSON storage, contract = run_id + row_id + pointer |
| 23 Aug | Kaz | JWT chain samjhayi, stream parse mat karo, message_records se answer lo |
| ~25 Aug | Rohan | Scope = WIM only, storage wrapper (bucket nahi), 2-3 ghante wali async justification |
| Rohan 1:1 | Rohan | Rohan khud user hai — cron/scheduled runs chahiye |
| 5-6 Sep | Kaz (weekend) | 10 factors / 3 evaluators, TE5 embedding, package vs API debate |
| Early Sep | Enterprise/MRM (Jay, Umair, Taron, Karuna) | Plug-in exchange pe sehmati, offline vs continuous monitoring ka distinction |
| ~10 Sep | Gaurav Ghosal (MRM/TSAI) | MRM structure clear, prompt optimisation ka ask, Eval Kit October |
| 11 Sep | Kibashini + Gaurav + Kaz | Duplication ka sawaal utha, escalation to Damien-Deepak |
| ~15 Sep | Kaz + Gaurav (Tuesday) | Common Python package pe sehmati, 4 tests listed |
| 15 Sep | Deepak (email) | "RIFAM evaluations already use ho rahi hain?" — jawab: abhi nahi |
| 18 Sep | David Mosciatti (Teams) | Ping script, Apigee callback, Orchestra library |

---

# PART 2 — Teen teams ka structure (ab final)

```
MRM (second line)
├── TSAI — Gaurav Ghosal → actual validation karti hai
└── MMR — Freddy Lecue  → research aur methodology

MDCs (frontline) — nau hain poore bank mein
└── RIFAM — Kibashini, Damien → AI Teammate (model #20207) inka hai

Tech — hum (AHP Pro)
└── Platform banate hain
```

| | UI banate hain | Testing karte hain |
|---|---|---|
| MRM | Haan | Haan |
| Tech (hum) | Haan | Haan |
| RIFAM | **Nahi** | Haan |

**Yahi hamari jagah hai** — RIFAM ke paas UI nahi hai, isliye hum duplicate nahi hain.

---

# PART 3 — Kisne kya requirement maangi

## 3.1 — Rohan Sharma (architecture)

| # | Requirement | Status |
|---|---|---|
| R1 | Arize verdict UI se hatao | Pending |
| R2 | Complete raw JSON store karo, rigid schema mat banao | Pending |
| R3 | Storage wrapper — add/get/remove/list/exists | Pending |
| R4 | Contract: run_id + row_id + pointer | Pending |
| R5 | Entry point aur exit point define karo | Pending |
| R6 | KPIs partner outputs se derive ho, khud compute mat karo | Pending |
| R7 | Cron/scheduled runs har 15-30 min, report files bane | Story 2 |
| R8 | Environment MongoDB settings se switch ho | Pending |

## 3.2 — Kaz (mentor / tech direction)

| # | Requirement | Status |
|---|---|---|
| K1 | Ping auth chain — UI abhi unauthenticated hai | Pending, David se raasta mila |
| K2 | AG-UI stream parse mat karo, prompt_id se answer lo | Pending |
| K3 | AI Teammate ka existing request schema follow karo | Pending |
| K4 | Framework ko shared library/artifact banao | Repo banna hai |
| K5 | TE5 embedding endpoint se jodo | **Blocked** |
| K6 | UI sections ko official naam + greyed-out explanation do | Pending |
| K7 | "Review" section ka naam badlo | Pending |
| K8 | Space ID configurable banao | Pending |
| K9 | Confluence pe flow-level diagram | Pending |
| K10 | Prompt Studio — product team system prompt load karke test kare | Story 11 |

## 3.3 — Gaurav Ghosal (MRM)

| # | Requirement | Status |
|---|---|---|
| G1 | Judge prompt ka exact form dikhe — context kaise treat hota hai, metric kaise calculate hota hai | Pending |
| G2 | **Prompt chaining** — intermediate prompt + final prompt jud sakein | **Committed, UAT ke liye** |
| G3 | **Multiple LLM support** | **Committed, UAT ke liye** |
| G4 | Multi-turn aggregation — per-turn score phir rollup | **Defer hua** |
| G5 | Tool-use eval (ab multiple tools hain, sirf Infomax nahi) | Kibashini ke saath |
| G6 | Intermediate retrieval state ka eval | Hum internally karenge |
| G7 | Unki Eval Kit library integrate ho | October mein aayegi |

**Gaurav ka clarification:** judge replace nahi karna — sirf **prompt aur uska tareeka** theek karna hai.

**Gaurav ki library ke details:** Python project, **wheel file** se milegi (Artifactory nahi), October target, multi-turn **shaamil nahi** hoga. Scope: PII detection, data leakage, NLI, embedding, clustering.

**Gaurav ka prompt chaining method:**
```
Step 1 → response se atomic claims nikalo (LLM)
Step 2 → har claim source document mein grounded hai? (doosra LLM)
```

## 3.4 — Kibashini / RIFAM

| # | Requirement | Status |
|---|---|---|
| KB1 | Kaam ka bantwara Damien-Deepak decide karein | **Escalated** |
| KB2 | Agar unki team hamara framework use kare, toh hum MRM ke saamne **defend** karein | Open risk |
| KB3 | Common Python package banao (Eval Service + MRM + RIFAM) | Repo banna hai |
| KB4 | Shared repo jahan teeno contribute karein | Proposed |

**RIFAM ka apna monitoring scope:** Success rate (human), Generation faithfulness (badal rahe hain), Multi-turn (active), Retrieval relevancy (sirf InfoMax), Tool selection/invocation. **Tool hallucination skip kar rahe hain.**

## 3.5 — RIFAM ka MMP (slides se) — ye asli spec hai

Saat KPIs, model #20207:

| # | KPI | Output | Judge | Rubric | Sample | Kaise |
|---|---|---|---|---|---|---|
| 1 | Acceptance | Final | Human | 0/0.5/1 | 200 | **Excel** |
| 2 | Retrieval Relevancy | Intermediate | LLM | 0/1 | Full population | Approved LLM judges |
| 3 | Generation Relevancy | Final | LLM | 0/1 | Full population | Approved LLM judges |
| 4 | Generation Faithfulness | Final | LLM | 0/1 | Full population | Approved LLM judges |
| 5 | Reliability – retrieval | Intermediate | Human | 0/1 | 75 | **Excel** |
| 6,7 | Reliability – generation | Final | Human | 0/1 | 75 | **Excel** |

**Teen baatein yahan se:**

**Ek** — "Excel spreadsheet" teen jagah likha hai. Yahi wo manual kaam hai jo hamara platform khatam karta hai. **Ye hamara business case unke apne document mein likha hai.**

**Do** — KPI 5/6/7 = LLM judge aur human ke beech agreement. **Ye hamare paas already hai** (wo 63% wala number). Direct match.

**Teen** — LLM wali KPIs **full population** pe chalti hain, sampling nahi. Sampling sirf human annotation pe hai (200/75).

**Monthly annotation volume:** ~475 human annotations chahiye. AI Teammate ke paas **sirf 1 SME** hai — baaki models ke paas 4-8 hain.

## 3.6 — Deepak Elias

| # | Requirement | Status |
|---|---|---|
| D1 | KPIs (LLM + human) import karke dikhao | Persistence pending |
| D2 | Stable UAT link, model hataya hua | Pending |
| D3 | Golden dataset banao + update do | Largely built |
| D4 | Packaging decision document karo | Resolved — package |
| D5 | **Monthly usage classification** — prompts summarize karke 5 groups mein classify | **Naya** |
| D6 | Production traffic se golden dataset enrich ho (41,000 users, 7 POs) | Pending |

## 3.7 — David Mosciatti

| # | Requirement | Status |
|---|---|---|
| DM1 | Local script se Ping token milta hai | Script mil gaya |
| DM2 | UI login ke liye **Orchestra library** use karo (jo Teammate UI use karti hai) | Explore karna hai |
| DM3 | Apigee callback — David khud update kar sakta hai | Deployed URL dena hai |

---

# PART 4 — Technical gaps jo slides se nikle

| # | Gap | Kyun matter karta hai |
|---|---|---|
| T1 | **Evaluator types sirf LLM hain** | MMP mein Human, Deterministic, Filtration bhi hain. Tool execution reliability ke liye LLM chahiye hi nahi — bas schema check |
| T2 | **Attribution / slicing nahi hai** | Aggregate 0.77 theek dikh raha tha, par WBS_BROKER_DEALER 0.47 tha. Slice kiye bina problem chhup jaati hai |
| T3 | **NDCG@k nahi hai** | KPI 2 ranking-aware hai. Chunk position aur re-ranker score chahiye |
| T4 | **Rubric sirf binary** | 0/0.5/1 bhi chahiye |
| T5 | **Aggregate KPI nahi hai** | Saat KPIs milke ek overall score banta hai |
| T6 | **Status taxonomy nahi hai** | Continue / Watch / Action Required chahiye, pass-fail nahi |
| T7 | **Month-over-month trend nahi hai** | "June/July mein decline" dikhana padta hai |
| T8 | **Business inputs ki jagah nahi hai** | Success criteria, tool definitions, model ka key task — business deta hai |

---

# PART 5 — Blockers

| # | Blocker | Kiska | Kya ruka hai |
|---|---|---|---|
| B1 | **TAC016 / Model Armor** | Agent team | Saara real evaluation data |
| B2 | **Identity fields wiring** (ppid, elid, thread_id) | Model team | Benchmarking 0% pe hai |
| B3 | **TE5 embedding endpoint** | ECM / Somnath | Explainability, cosine factors |
| B4 | **Scope decision** | Damien + Deepak | Kya banana hai |
| B5 | **GPT supervisor onward call** | Debug karna hai | Framework 200 deta hai, aage toot-ta hai |

---

# PART 6 — Provisioning (lamba lead time, abhi shuru karo)

| # | Item | Status |
|---|---|---|
| P1 | PostgreSQL — approval, sizing, backup | Shuru nahi |
| P2 | GCP bucket — **ab Data Fabric ke through ho sakta hai** | Decision confirm karna hai |
| P3 | Apigee callback (localhost + OCP URL) | David ready hai, URL dena hai |
| P4 | Orchestra library access | David se poochna hai |
| P5 | session.id instrumentation | Multi-turn ke saath defer |
| P6 | Data classification owner | **Abhi tak koi nahi** |

---

# PART 7 — Roadmap mein kya badla

## Upar aaya

| Story | Kyun |
|---|---|
| Prompt chaining (Story 11 ka hissa) | Committed, UAT ke liye |
| Multi-LLM support (Story 4) | Committed, UAT ke liye |
| Auth / Login | David se raasta mil gaya, ab unblocked |
| Evaluator types (Story 1 mein) | MMP ko support karne ke liye zaroori |

## Neeche gaya

| Story | Kyun |
|---|---|
| Story 3 — Multi-turn | Explicitly defer hua, Gaurav ki library mein bhi nahi |
| Session-level scope | Multi-turn ke saath |

## Badla

| Story | Kaise |
|---|---|
| Story 7 — Storage | Data Fabric bucket source of truth ban sakta hai |
| Story 9 — Tool eval | Tool hallucination optional, Kibashini skip kar rahi hai |
| Story 10 — RAG chunk | Sirf InfoMax, aur NDCG@k chahiye |

## Naya

| Item | Kahan se |
|---|---|
| Attribution / slicing | RIFAM ki analysis se |
| Status taxonomy (Continue/Watch/Action) | MMP se |
| Monthly usage classification | Deepak |
| Framework defensibility documentation | Kibashini ki warning |

---

# PART 8 — Hamara unique kya hai

Ye list Damien-Deepak wali meeting ke liye taiyaar rakho:

| Cheez | Kiske paas aur hai |
|---|---|
| User-facing UI | Koi nahi (RIFAM ke paas nahi) |
| On-demand execution | Koi nahi |
| **Shift left** — UAT mein, ship hone se pehle | Koi nahi (MRM sirf production) |
| Prompt Studio | Koi nahi |
| Multi-LLM comparison | Koi nahi |
| Tool hallucination | Kibashini skip kar rahi hai |
| Usage classification | Koi nahi |
| Parallel factor execution (3-4 ghante → 1/3) | Koi nahi |

**Positioning line:**
> MRM requirement deti hai. RIFAM method likhti hai. Hum wo jagah banate hain jahan method chalta hai — scale pe, on demand, evidence ke saath.

---

# PART 9 — Agle kadam

## Turant

1. David ko deployed UI URL bhejo, Apigee callback ke liye
2. Orchestra library ke details maango
3. Prompt chaining aur multi-LLM support pe kaam shuru karo (ye committed hai)
4. Common package ka repo structure banao

## Kaz se poochho

1. Damien-Deepak meeting kab, aur kya position le rahe hain?
2. Framework defend karna pada toh kiska kaam?
3. Data Fabric bucket final hai?
4. Usage classification alag story ya evaluation ke andar?
5. Wheel file import ka approved raasta?

## Kibashini se poochho

1. Chunk position aur re-ranker score traces mein aate hain? (NDCG ke liye)
2. Attribution analysis abhi kaise chalti hai — script ya manual?
3. Sub-channel, intent, session ID trace metadata mein hain?
4. 475 annotations ek SME kaise karta hai?
5. Full population matlab monthly kitna volume?

## Gaurav se poochho

1. Eval Kit ka interface shape — sample signature mil sakta hai?
2. Judge prompt pe read / propose / approve — kaunsa access chahiye?
3. Agreement ka acceptable threshold kya hai? (63% dikha tha)
4. MRM policy document — abhi bhi pending hai
