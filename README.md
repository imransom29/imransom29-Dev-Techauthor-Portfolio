Nahi — ye framing thodi galat hai. "Mongo phat jaayega" wo reason nahi hai. Chalo asli reason saaf karta hoon, kyunki Gaurav ye poochega aur galat reason diya toh phas jaoge.
Bucket ka asli reason — size, shape nahi
MongoDB variable shape se nahi phatega. MongoDB toh bana hi hai variable shape ke liye — naya field aaye toh wo happily store kar leta hai. Toh "Salesforce ka alag document aayega toh Mongo toot jaayega" — ye technically galat hai.
Asli reason ye hai:
1. Size / volume
Code
Bucket bade files ke liye bana hai. Database bade blobs ke liye nahi.
2. Handoff — sabse bada reason
Yaad karo Rohan ka point. Model team, MRM — inko us data pe apni evaluation chalani hai. Unhe raw data chahiye ek shared jagah pe.
Code
Bucket ek shared handoff point hai. Database nahi.
3. Async — Rohan ka doosra point
Partner ka job 2-3 ghante chalta hai. Result kahin girna chahiye aur baad mein uthana. Bucket exactly iske liye hai.
Toh shape wali baat kahan aati hai
Shape ka argument hai, but wo "phat jaayega" nahi hai. Wo ye hai:
Code
Farak samajh:
❌ "Mongo variable shape se toot jaayega" — galat, Mongo ye handle karta hai
✅ "Raw ko schema mat do, bucket mein as-is rakho, taaki naye fields pe migration na ho" — sahi
Toh Gaurav ko kya bolo — sahi framing
"The raw traces go into a bucket for three reasons.
One — size. Each trace carries the full retrieved context, which is large. At scale that's GBs to TBs — that belongs in object storage, not a database.
Two — it's a handoff point. The model team and MRM need to run their own evaluations against that data. A bucket they can read from directly. Giving them database access is harder.
Three — async. Their jobs run 2-3 hours, so the result has to land somewhere and be picked up. A bucket fits that.
The database stays small — just the index and the KPIs, structured fields that don't change per use case."
Toh tumhare
sawaal ka seedha jawab
Nahi, "Mongo phat jaayega" reason nahi hai.
Bucket isliye hai kyunki:
Raw data bada hai (size)
Doosri teams ko shared access chahiye (handoff)
Jobs lambe hain (async)
Aur variable shape wali baat — wo bucket mein raw JSON rakhne ka reason hai (no schema, no migration), na ki "Mongo crash ho jaayega."
Agar tum Gaurav ko "Mongo phat jaayega" bologe, wo turant bolega "nahi, Mongo JSON handle karta hai" — aur tumhara reason gir jaayega. Isliye size + handoff + async bolo. Wo teeno solid hain.



Haan, part sahi — but ye aadha reason hai. Sirf "bulk data" bologe toh Gaurav poochega "database mein bhi bulk daal sakte ho, bucket kyun?" Toh poora reason yaad rakho.
Bucket ke teen reason — teeno chahiye
1. Bulk / size ✅ (jo tumne kaha)
Bada data, GBs-TBs. Object storage iske liye bana hai.
2. Handoff — shared access
Model team, MRM ko us data pe apni evaluation chalani hai. Bucket se wo seedha padh lete hain. Database access dena mushkil.
3. Async — lambe jobs
Partner ka job 2-3 ghante chalta hai. Result kahin girna chahiye, baad mein uthana. Bucket iske liye perfect.
Kyun sirf "bulk" kaafi nahi
Socho Gaurav ka counter:
Tum: "Bucket isliye taaki bulk data push kar paayein"
Gaurav: "Bulk toh database mein bhi jaa sakta hai. Bucket kyun specifically?"
Tum: "..."
Isliye teeno reason chahiye. Bulk ek hai, but akela weak hai.
Sabse strong reason actually handoff hai — kyunki Rohan ne wahi bola tha ki bucket ek shared jagah hai jahan se saari teams padhengi. Wo bucket ka asli maksad hai, sirf storage nahi.
Ek line mein — jo Gaurav ko bolo
"The bucket is for three things: the raw traces are large, multiple teams need to read the same copy directly, and their evaluation jobs run for hours so results have to land somewhere and be collected. Object storage fits all three — a database fits none of them well."
Yaad rakhne ke liye — teen shabd
Code
Ye teen bolo, teeno saath. Tab bucket ka case poora hai aur koi tod nahi sakta.




Rohan as a user. In a 1:1, Rohan revealed he's not just the architect — he's a user. Today he runs evaluation by hand: batch queries into a UI, fire at a local supervisor on his own Phoenix project, extract traces, run everything locally, download, check reports by hand. He wants Rahul's tool to automate that — a background cron job that runs every 15-30 minutes against a tracing project and produces report files. His framing: his use case is a scheduled baseline; Rahul's is the centralised source of truth. And the real value — instead of running everything on his own machine, he could run against any environment just by changing settings in MongoDB. His line: it has to become production and integrate into people's daily work, not just be a demo.

That same call reinforced the packaging question — Kaz wants a shared library so both teams don't have to maintain and redeploy infrastructure, and the dev team can keep adding metrics. Three separate conversations now point the same way. Rahul will present the working thin-wrapper API version on Thursday as the alternative, and the decision gets made with David and the model team.

And it confirmed the storage shape one more time: the enterprise team also wants a bucket over a database — the supervisor uses a bucket as the centralised source of truth, plus one DB just for showing KPIs. That's exactly the two-tier design: bucket for raw, small store for KPIs and the index.

Chapter 7 — The near-term asks

Deepak's KPI ask. Import all LLM and human KPIs into the service and display them. The gap is persistence — a temporary MongoDB collection resolves it.

The management presentation. Deepak will present the service to management (Damien, Charles, Andy). Rahul attends to answer questions — no separate deck. Three conditions: a stable UAT link with the model removed, a golden dataset created with an update to Deepak, and the packaging decision documented.

Where this leaves us

Three threads converge on the Tuesday call. Rohan set the delivery shape — WIM scope, a storage wrapper, an async contract with one entry and one exit point, model team first. The weekend sessions mapped what integration means — 10 factors, three evaluators, a thin wrapper — and left one question open: service or package, decided by whether this stays callable by teams not yet met. And on top sits the near-term ask: a stable UAT build and a golden dataset, ready for Deepak to present.

It started as one engineer checking one team's work. It's becoming the place three risk functions meet.

The Master Task List

Status: ✅ done · 🔄 in progress · ⛔ blocked · ⬜ not started

A. Base service (built earlier)
#	Task	Status
A1	FastAPI service skeleton — routers, services, connectors, evaluators, core	✅
A2	Tachyon Overwatch connector — GraphQL, auth, pagination	✅
A3	Fetch traces by project and time range	✅
A4	Parse trace spans — question, retrieved context, output	✅
A5	Evaluator registry (plug in new evaluators without touching pipeline)	✅
A6	Hallucination evaluator — Arize Phoenix, Claude Sonnet judge	✅
A7	Response-length heuristic evaluator	✅
A8	PASSED / REVIEW / FAILED verdicts	✅
A9	Cost-optimisation suggestions — Gemini Flash	✅
A10	REST + SSE streaming endpoints	✅
A11	Results UI (static/live.html)	✅
A12	Push annotations back to Overwatch behind a feature switch	✅
A13	Local judge benchmark — 74%	✅
A14	CI/CD — GitHub Actions → JFrog → Harness	✅
A15	Deploy to OCP lower region, Garland 6	✅
A16	Vault integration for secrets	✅
A17	Demo to model team (Aug 3)	✅
A18	Demo to product owners, ~30 people (Aug 14)	✅
B. Framework integration
#	Task	Status
B1	HTTP adapter approach — no code merge, separate repos	✅
B2	FrameworkAdapter HTTP client	✅
B3	Port topology — UI 5500, Backend 8000, Framework 8001, Agent 8082	✅
B4	Surface all test types in the UI dropdown	✅
B5	Dataset upload — drag and drop	✅
B6	Run kickoff — generate model_test_run_id, receive framework_run_id	✅
B7	PRE phase — framework loops rows, calls agent	✅
B8	JobStore writing parquet + json artifacts	✅
B9	Trace pull after PRE	✅
B10	UI polls run status	✅
B11	Fix retrieval — wrong search endpoint mapping	✅
B12	Fix startup — Python interpreter / uvicorn missing	✅
B13	Roll back prompt simplification (honour no-system-prompt-change)	✅
B14	Thin wrapper — evaluator name as dynamic path parameter	✅
B15	Run factors in parallel — change management down to ~1/3 of sequential time	✅
B16	Integration code still local — move into repo after team feedback	🔄
C. Current blockers
#	Task	Status	Notes
C1	Model Armor TAC016 — rephrase injection-defence wording, keep defence intact	⛔	Agent team. Never strip the defence
C2	Identity not threaded into supervisor tool state — ppid/elid/thread_id missing, search_infomax fails, 0% success	⛔	The benchmarking-run root cause
C3	Framework crashes on zero traces — extract_traces reads a column on empty DataFrame	⬜	Defensive-coding gap — exit cleanly on 0 spans
C4	Onward call to GPT supervisor breaks though framework returns 200	⬜	Open defect from Kaz session
C5	Overwatch host configured with https:// scheme — should be without	⬜	Contributing warning
D. Auth
#	Task	Status	Notes
D1	Ping authentication in the UI	🔄	Service is currently open to anyone
D2	Token chain — access token → OPA → backend → JWT	⬜	
D3	Token refresh — JWT ~5min, access ~1hr, refresh ~8hr	⬜	
D4	Adopt AI Teammate request schema as-is	⬜	Don't invent validation
E. Stop parsing the stream (Kaz's steer)
#	Task	Status	Notes
E1	Remove stream-parsing logic — don't process AG-UI response	⬜	Parsing = re-implementing AI Teammate UI
E2	Generate prompt_id per row at submission	⬜	
E3	Fire prompt, take only the completion ack	⬜	
E4	Look up actual answer by prompt_id	⬜	From MongoDB message_records or Overwatch
E5	Confirm access to MongoDB message_records collection	⬜	Or agree Overwatch as source
F. Storage wrapper (Rohan)
#	Task	Status	Notes
F1	Storage interface — add, get, remove, list, exists	⬜	Full lifecycle, not just read/write
F2	LocalStorage backend — write to system directory / NAS	⬜	Rohan's approved starting point
F3	add() returns the location	⬜	Callers hold a pointer
F4	Backend config-driven	⬜	Swap later = config change
F5	Path convention — traces/{run_id}/{trace_id}.json	⬜	
G. Extraction
#	Task	Status	Notes
G1	Store complete raw JSON, unmodified — no mapping at write	⬜	Data shape keeps changing
G2	Write at fetch time, never lazily	⬜	Source expires
G3	One JSON file per trace_id	⬜	
G4	Manifest per run — rows + identifiers	⬜	
G5	Stamp each blob with extracted_at + schema marker	⬜	
G6	Defensive reading — .get() everywhere	⬜	Missing field degrades one row, not the run
H. Index
#	Task	Status	Notes
H1	runs collection — run IDs, status, storage location, framework version	⬜	
H2	trace_index — trace_id, conversation_id, prompt_id, run_id, timestamp, environment, location	⬜	Keys and pointers only, no content
H3	Add query_type / use_case field for segregation	⬜	Infomax / account / salesforce
H4	Indexes for the real queries — by run, trace, time, environment	⬜	
H5	Checkpoint field in runs — resume a failed long run	⬜	
I. Integration contract
#	Task	Status	Notes
I1	Entry point — where a partner triggers a run / reads data	⬜	One of Rohan's two contract halves
I2	Exit point — where partners write their results	⬜	The other half
I3	Publish run location + manifest via API	⬜	
I4	Ingestion endpoint — five-field payload (run_id, row_id, prompt_id, result_location, produced_by)	⬜	Hold this line
I5	result_index — stores the pointer, never the content	⬜	
I6	Async — trigger returns immediately, result collected later	⬜	Partner jobs run 2-3 hours
I7	Signalling — notify or poll	⬜	Build so either can wire
J. UI changes
#	Task	Status	Notes
J1	Remove arise verdict from the UI	⬜	Agreed with Rohan
J2	Confirm with Rohan — keep judge running silently as agreement benchmark	⬜	Ask openly
J3	Add "stored extraction" as an input source alongside dataset upload	⬜	Re-run without hitting agent again
J4	Read results from result_location at display time, not ingest	⬜	Format change breaks rendering, not stored data
J5	Per-row detail — query, expected, actual, score	⬜	
J6	Distinct status for upstream-blocked rows	⬜	Blocked run ≠ bad model
J7	Official section names + short greyed-out explanations	⬜	External viewers won't know "human vs agreement"
J8	Rename the "Review" section	⬜	Kaz — current name reads badly
J9	Make space ID configurable, not env-supplied	⬜	Any team uploads against their own space
J10	Bishal's review — split React components into files	⬜	
J11	Bishal's review — sidebar navigation	⬜	
J12	Bishal's review — move "Push to Overwatch" to individual rows	⬜	
J13	Bishal's review — remove Evaluator Visibility, Rollout Telemetry, duplicate health indicators, timer, latency card	⬜	
J14	Expandable trace view — query, context, output as separate panels	⬜	
K. Sampling & segregation
#	Task	Status	Notes
K1	Sampling options — full / random / stratified	⬜	Cost control (Gemini Pro $0.74/scenario)
K2	Stratified sampling — proportional per query type	⬜	So the sample represents the whole
K3	Segregate results by segment — query type, environment, time	⬜	
K4	Segment KPIs by user type	⬜	Rohan — KPIs are per-segment, not one global number
L. KPIs (Deepak's ask)
#	Task	Status	Notes
L1	Temporary MongoDB collection to persist KPIs	🔄	Service doesn't store them today
L2	Import all LLM and HH KPIs into the service and display	⬜	Deepak's ask
L3	Aggregate scores from partner outputs	⬜	
L4	kpi_snapshots with produced_by — teams' numbers side by side	⬜	
L5	Dashboard shows current scores without running anything	⬜	
L6	Trend view over time	⬜	
M. Golden dataset
#	Task	Status	Notes
M1	Store a named set of queries as a golden dataset, re-fire it	✅	Largely built
M2	Upload → fire at LLM → responses evaluated by framework	✅	
M3	Proper end-to-end testing, not just local dataset	⬜	What remains
M4	Explainability path in golden flow	⛔	Blocked on embedding endpoint
M5	"Add to Golden Dataset" action on evaluated rows	⬜	
M6	Version it, immutable once published	⬜	
M7	Export as CSV / Excel / JSON	⬜	
N. Human review
#	Task	Status	Notes
N1	Human-vs-agreement — human score column in XLS vs evaluator score	✅	Divergence surfaces in Review
N2	Divergent rows written back to MongoDB	✅	
N3	Compute judge-vs-human agreement rate	⬜	Makes the 74% defensible
O. Embedding (explainability blocker)
#	Task	Status	Notes
O1	Get the Tachyon embedding endpoint — TE5, not text-embedding-004	⛔	Wrong vector space otherwise
O2	Try the hackathon starter kit standalone embedding script	⬜	Fastest route
O3	Mail Somnath Pooja (ECM), CC Kaz — intro the requirement	⬜	Fallback route
O4	Repoint explainability at TE5	⬜	Depends on O1
P. Architecture decision (for Tuesday)
#	Task	Status	Notes
P1	Decide: separate FastAPI services vs versioned Python package	⬜	Rahul / Kaz / Rohan
P2	Document both options with the SaaS / extensibility / tracking arguments	⬜	Priority per Kaz
P3	Plugin model — abstract interface any team implements	⬜	Keeps door open for MRM / Ragas teams
Q. Presentation & docs
#	Task	Status	Notes
Q1	Stable UAT build, model removed, link shared	⬜	For Deepak's management presentation (Damien, Charles, Andy)
Q2	Golden dataset created + update to Deepak	🔄	
Q3	Flow-level Confluence diagram — UI, service, supervisor, framework	⬜	Sync the Eraser diagram
Q4	Akash sponsor walkthrough script	✅	Done earlier
R. Later — deferred
#	Task	Notes
R1	GCS bucket backend behind the wrapper	After model team integration
R2	GCS provisioning questions to Sandhya/platform — auth, bucket name, network, lifecycle, encryption	With the bucket work
R3	MRM onboarding against the same contract	After the bucket
R4	RBAC — Viewer, SME Reviewer, Operator, Admin	Hardening
R5	Structured logs, metrics, alerts, retry/circuit-breaker	Hardening
R6	Migrate to dedicated repository	Kaz
R7	Dedicated Overwatch space ID	Currently shared
R8	Runbook + deployment docs	Single-engineer risk
R9	Data classification owner	Escalate to Kaz / David
R10	Confirm non-prod Overwatch retention window	Platform
Sequence Rohan set
1. Model team integration   ← now (Tuesday bar)
2. Bucket                   ← next
3. MRM onboarding           ← after
Out of scope
Enterprise / all-LOB storage — WIM only. Other teams replicate the pattern themselves.
S. Enterprise / library collaboration (new — from the enterprise meeting)

The Risk Oversight Engine / eval-library team (Jay, Andy, Charles, Umair, Taron) is now a collaborator, not a competitor. Both sides agreed to exchange the eval library as a plug-in.

#	Task	Status	Notes
S1	Firm up the plugin-evaluator interface so their library metrics can plug into the service	🔄	Rahul already has a plugin-style evaluator; this is the bridge between the two teams
S2	Contribute Rahul's prompts/tests into the shared eval library	⬜	Deepak: move from exchanging Python files to a shared library
S3	Support consuming external library metrics (non-LLM: NLP-based, in-graph) as evaluators	⬜	Jay's ask — add metrics that aren't LLM-as-judge
S4	Align golden-dataset practice with the SALS standardization templates	⬜	Taron/Umair — ~9 JAI pattern templates, central version-controlled repo
T. Continuous production monitoring (new — distinct from offline evals)

Umair's distinction: offline evals (what the service does today) vs continuous production monitoring (what it does not). This is a separate problem, not an extension.

#	Task	Status	Notes
T1	Deploy to prod to pull prod traces directly (without Data Fabric)	⬜	Currently dev-only; can't hit prod from here
T2	Sampling for production monitoring — 1-2%, not 100%	⬜	100% coverage gets expensive fast; Fargo does 1%
T3	Ensure sample representativeness	⬜	Umair — representativeness is key, not just volume
T4	Decide direct-API vs Data Fabric path for prod trace access	⬜	Direct API = immediate; Data Fabric = every 15 min into GCP project
T5	Enrich the golden dataset from production traffic	⬜	Deepak — run evals across interactions, product owners pull good/bad scenarios in
Note on the GCP bucket

The GCS bucket Rohan referenced and the Data Fabric → Google project path from this meeting are the same thing. Data Fabric pushes traces to a GCP project every 15 minutes; getting the Google project takes ~a month (Charles's team working through it). This is the storage backend that sits behind the wrapper later — so the wrapper work (section F) is what keeps you unblocked while that provisioning runs.
