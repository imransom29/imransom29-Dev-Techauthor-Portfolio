
https://docs.google.com/presentation/d/1-Oyw0o9oj_-KDjh2GdcviKB_NprOvNfMimNqnQA7eBM/edit?usp=drivesdk

Presenter Script — Integration Strategy (v2)
16 slides · ~14 minutes
Simple English. One line at a time. Pause at line breaks.
SLIDE 1 — Title (15 sec)
Hi everyone, thanks for joining.
Today I want to walk you through
how we can bring the Supervisor Evaluation Service
and the Model Testing Framework together.
I have six integration approaches to show you.
Three are the usual ones most teams reach for.
Three are more advanced,
and honestly they solve the harder problems much better.
At the end I will show you the path I recommend
and what we need from each side.
SLIDE 2 — Two Systems (1.5 min)
First, let me set the context on both systems.
On the left is our Supervisor Evaluation Service.
It is live and deployed on OCP.
It pulls traces from Overwatch in real time using GraphQL.
It runs a tiered pipeline — response length check first,
then context selection,
and only then one LLM call for the hallucination judge.
So one LLM call per trace, not more.
It has a plugin registry so new evaluators drop in easily.
Results stream live to a React dashboard.
And verdicts go back to Overwatch as annotations.
On the right is the Model Testing Framework.
It has eleven evaluation test types, all working today.
It uses cosine similarity, BERTScore, ROUGE, and TF-IDF.
It has agreement metrics against human labels —
Cohen's kappa and Pearson correlation.
It has an SME review loop built into the process.
That evaluation depth is genuinely ahead of ours.
But it runs as local Python scripts.
Input is a file, output is a file.
There is no API to call today.
So the strengths are complementary.
We have the production platform.
They have the evaluation science.
SLIDE 3 — Why Integration is Hard (1 min)
Four real blockers stand in the way today.
First, there is no API surface.
Their framework runs as local scripts.
There is simply nothing for us to call.
Second, dependency conflicts.
They pin exact library versions.
We use ranges with upper bounds.
We cannot put both in one Python runtime without breaking something.
Third, the contract is file-only.
That works fine for batch analysis,
but it does not work for live evaluation.
Fourth, independent roadmaps.
When they add a new evaluator,
we cannot use it without manual work.
And the same the other way round.
These four points are what the six options are trying to solve.
SLIDE 4 — Six Options Overview (1 min)
Here are all six on one screen.
The top row is conventional.
Option A — Swagger API. They expose REST endpoints, we call them.
Option B — Shared library. Common code in one importable package.
Option C — File exchange. This is where we are today.
The bottom row is advanced.
Option D — Kafka event mesh. We publish traces, any evaluator subscribes.
Option E — Container plugins. Each evaluator ships as a versioned image.
Option F — OTel native. Evaluations become spans inside Overwatch itself.
Let me go through the conventional three quickly,
then spend real time on the advanced three.
SLIDE 5 — The Conventional Three (1 min)
Option A, Swagger API.
Clean contract, independent repos, standard tooling.
But the limit is — the model team has to build and host a service first.
That is real work for them, and they do not have it today.
Option B, shared library.
Less duplicate code, type-safe, fast to call.
But the limit is dependency conflicts.
Their exact pins against our ranges.
This one will bite us in production.
Option C, file exchange.
Works today, nothing new to build, easy to debug.
But it cannot do live evaluation at all.
And the format coupling is brittle —
if they change a column name, we break.
All three are workable.
But each has a limit that will slow us down.
Now let me show you the three that do not.
SLIDE 6 — Option D: Kafka Event Mesh (2 min)
Option D is a Kafka event mesh.
The idea in one line —
nobody calls anybody. Everyone subscribes to what they care about.
Here is the flow.
Our service pulls a trace from Overwatch
and publishes it to a Kafka topic.
Every evaluator that cares about that trace subscribes to the topic
and picks it up on its own.
Each one evaluates and publishes its result to a results topic.
We consume the results topic and aggregate everything.
Four reasons this is smart.
Zero coordination.
When the model team builds evaluator number twelve,
they just subscribe it to the topic.
No code change on our side. Ever.
They do not even need to tell us.
Parallel fan-out.
One trace goes to all eleven evaluators at the same time.
A slow evaluator never blocks a fast one.
Compare that to calling eleven APIs one after another.
Free replay.
Kafka keeps the messages.
So if the model team improves their judge next month,
they rewind the topic
and re-evaluate six months of traces with the new version.
No re-extraction needed from our side.
And it survives outages.
If an evaluator goes down,
its messages simply wait in the topic.
Nothing is lost. It catches up when it comes back.
SLIDE 7 — Option E: Container Plugins (2 min)
Option E is containerized evaluator plugins.
The idea in one line —
every evaluator ships as its own versioned image in Artifactory.
The flow is simple.
The model team wraps each evaluator in a Docker image.
Standard interface — data in, results out.
They push it to JFrog Artifactory,
which we already use for our own service.
Our service pulls that image and runs it
as an OCP job or a sidecar.
Four reasons this is smart.
It solves dependency hell completely.
Each evaluator carries its own Python version and its own pins.
Their exact pins live inside their container.
Our ranges live inside ours.
Nothing collides. Ever.
Versioned side by side.
Because images are tagged,
we can run evaluator version one and version two
on the exact same trace and diff the scores automatically.
That is a drift detection mechanism for free.
It reuses everything we already have.
Artifactory, Harness CD, and OCP are already wired up for our service.
We are not asking for new infrastructure.
And the model team writes plain Python.
No REST framework. No Kafka client. No service to keep alive.
Just their existing script inside a Dockerfile.
That is the lowest possible effort on their side —
and that matters, because they are not a platform team.
SLIDE 8 — Option F: OTel Native (2 min)
Option F is the most elegant one, and I want to spend a minute on it.
The idea in one line —
Overwatch becomes the integration layer. No new plumbing at all.
Here is the thinking.
Overwatch is already an OpenTelemetry system — it is Arize Phoenix underneath.
Every trace is already a set of spans with attributes.
So instead of building a queue or a shared database
to move evaluation results between teams,
both teams write their evaluation results
straight back into Overwatch as child spans.
We write our spans. They write theirs.
Same trace, same place, standard attribute names.
Four reasons this is smart.
Zero new infrastructure.
No Kafka cluster to provision. No shared database to manage.
No new service to deploy. Overwatch is already running.
Full lineage for free.
Every span carries who wrote it, when, and with which evaluator version.
So six months from now,
we can look at a verdict and know exactly which judge produced it.
Both teams see everything.
One GraphQL query returns the trace
plus every evaluation from every team.
No joining across systems.
And it is audit-ready by default.
This one matters for MRM.
Regulators read one system instead of three separate reports.
The evidence and the trace live together.
SLIDE 9 — Decision Matrix (1.5 min)
Here is how all six compare on what actually matters.
Look at the live evaluation column.
Option C is the only one that cannot do it.
That rules out staying where we are.
Look at effort on the model team.
This column is important
because they are not a platform team
and they should not have to become one.
Option A is high effort — they build and host a service.
Option E is very low — they just write a Dockerfile.
Look at dependency conflicts.
Option B is the only one that does not solve it.
That is a real production risk, so B drops off.
And look at the last column, new infrastructure.
Options E and F need nothing new from either team.
That is the key insight on this slide.
E and F work with what both teams already have.
That makes them the fastest real path forward.
SLIDE 10 — Recommended Path (1.5 min)
So my recommendation is — do not pick one.
Layer them. Each phase keeps working as the next one arrives.
Start now with Option F, OTel native.
Both teams write evaluation results into Overwatch as spans.
There is nothing new to build.
We agree the attribute names, and we both start writing.
This gives us shared visibility almost immediately.
Next, add Option E, container plugins.
The model team wraps their eleven evaluators as images.
We run them as OCP jobs.
Their results still write into Overwatch as spans —
so Option F keeps working, we just added a way to run their code.
And dependency conflicts are gone permanently.
Later, move to Option D, Kafka event mesh.
This makes sense when a third or fourth team joins.
At that point we need real fan-out and replay.
But we do not need it for two teams.
And Option A, Swagger — it stays valid throughout.
It becomes the read API on top of whichever layer we land on.
Anyone who wants evaluation results — Devin, a GitHub workflow, a dashboard —
calls that one API.
The important thing is that each phase is useful on its own.
We are not waiting six weeks for value.
SLIDE 11 — Our Extraction Layer (1 min)
One thing stays constant no matter which option we choose —
our extraction layer needs to be flexible on two axes.
On extraction level, three options.
Prompt level — one question and answer pair.
Thread level — a full conversation with many prompts.
Time range — everything inside a window, like the last one hour.
On delivery format, four options.
JSON file or a file path.
Kafka topic.
Shared MongoDB.
Or a direct HTTP call to their endpoint.
Why does this matter?
Because the model team should be able to consume our data
however suits them at that moment.
Today they may want files.
Next quarter they may want Kafka.
Our extraction layer handles both
without either team rewriting anything.
SLIDE 12 — Evaluation by Factor (1.5 min)
Now let me show how each evaluation factor works
and who is responsible.
The important principle here —
we use the cheapest method that actually works.
An LLM call only where nothing else can decide the answer.
Blue rows are our service.
Hallucination uses LLM-as-a-Judge. One call. Live today.
Retrieval relevancy uses cosine similarity and the reranker score.
No LLM call at all — it is a similarity comparison.
Generation relevancy needs an LLM, because you need semantic understanding
to know if an answer actually addresses a question.
Toxicity is keyword and regex. No LLM needed.
Tool correctness starts as a rule check — did it call the expected tool.
LLM only as a fallback when the rule cannot decide.
Purple rows are the model team, reached through the integration layer.
Sensitivity uses perturbation and cosine comparison.
Performance uses their multi-metric quantitative analysis.
Explainability uses TF-IDF, cosine, and an LLM eval.
Notice — only four of nine factors need an LLM call.
That is exactly where our cost saving comes from.
SLIDE 13 — When Judges Disagree (1 min)
Now an obvious question comes up.
What if our judge says passed and their judge says hallucinated?
We do not treat that as a problem.
We treat it as the most valuable signal in the system.
When both say passed — high confidence. Auto-push.
When both say failed — confirmed issue. Auto-push and alert.
When they disagree — flag it for SME review,
and that human decision joins the golden dataset.
The decision hierarchy is clear.
Our judge is level one — fast, first signal.
Model team evaluators are level two — deep, second signal.
SME human review is level three — always the final authority.
And importantly, both verdicts are stored.
Neither overwrites the other.
Whoever reviews sees both and makes the call.
Over time, those human decisions make both judges better.
SLIDE 14 — Clear Ownership (1 min)
This slide makes the split explicit,
because I want no ambiguity here.
We own the platform and the integration.
Trace extraction from Overwatch.
Our own evaluators — hallucination, retrieval, toxicity.
The integration layer itself.
Aggregating results from all sources.
The dashboard and live streaming.
Annotation push-back to Overwatch.
GitHub workflow integration.
And the Phase 2 items Deepak asked for —
golden dataset builder and MRM testing mode.
The model team owns the evaluation science.
All eleven test types.
The similarity metrics.
The agreement metrics against human labels.
The human eval and SME loop.
The specialized datasets and perturbation logic.
The choice of evaluation level — prompt, thread, or range.
The scoring methodology and how results aggregate.
And their own release cadence — they ship when they are ready.
There is no overlap anywhere on this slide.
Each team does what it is genuinely best at.
SLIDE 15 — Next Steps (1 min)
Six next steps.
One — demo to the model team this week.
Walk Yusuf, Lang Wang, and Kibashini through the service.
Two — agree the integration layer next sprint.
Sit together and pick the starting option. F, E, or D.
Three — deploy the UI to OCP this week.
Move the React dashboard from local into Dev.
Four — define the span schema next sprint.
Agree the OpenTelemetry attribute names for evaluation results.
This is the smallest possible first step and it unblocks Option F.
Five — build extraction flexibility in the following sprint.
Prompt, thread, and time-range extraction levels.
Six — Phase 2 scoping after that.
Golden dataset builder and MRM testing mode.
SLIDE 16 — Closing (20 sec)
To close.
Two teams. One platform. Zero duplicate work.
We own extraction, integration, and the platform.
The model team owns the evaluation science.
And whichever integration layer we pick,
both teams stay independent and both keep shipping.
Happy to take questions.
Backup — likely questions
"Why not just use Swagger, it is the standard?"
Swagger is a great read API and we should have it eventually.
But it means the model team builds and hosts a service first.
That is weeks of work for a team whose job is evaluation science, not platform engineering.
Options E and F get us value without asking them to become a platform team.
"Is Kafka overkill for two teams?"
Yes, today. That is why it is the third phase, not the first.
It becomes the right answer when a third or fourth team joins.
"Who decides the attribute names for the spans?"
That should be a joint decision in the next sprint.
It is a one-hour conversation and it unblocks the whole first phase.
"What if the model team does not want to containerize?"
Then we start with Option F only.
They write results into Overwatch from their existing scripts —
that is a few lines of OpenTelemetry SDK code, nothing more.
Containerization can come later.
"How do we avoid double-counting costs if both teams run an LLM judge?"
The span attributes carry the evaluator name and version.
So we can see exactly which judge ran and what it cost.
Where both run the same check, we keep our cheap one as the gate
and treat theirs as the deep second opinion.
~14 minutes at natural pace



