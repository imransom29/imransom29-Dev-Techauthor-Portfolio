Supervisor Evaluation Service — Progress and Change in Scope
Why the scope has changed
When we started, the plan was for our service to pull traces from Tachyon Overwatch and evaluate them. That was it — read what already happened, run a judge on it, show the verdict.
Two things changed that.
First, feedback from the model team. Kibashini raised three use cases, not one — developmental testing, change management, and ongoing monitoring. Evaluation isn't a gate you run before release; it needs to sit across the whole lifecycle. She also made clear that model-versus-model judging alone isn't enough, because MRM needs human annotation regardless. And her main ask was to start small rather than commit to the full scope up front.
Second, we found the model testing framework can run online. Their framework has eleven test types written specifically for the Supervisor Agent. It works today, but it runs on individual laptops with results passed around as Excel files. Once we saw it could be hosted and triggered remotely, the decision followed: we host it, they contribute code, we operate the service.
So the scope has moved. We're no longer just an evaluator reading traces. We're the runtime that runs WIMT's test suite, stores the results, and gives SMEs somewhere to review them.
The problem we're solving
The framework works. It just has nowhere to run.
Today, every team member runs three scripts from a terminal on their own machine. Results land as local .xlsx files. SMEs get emailed a spreadsheet and mail it back. No shared execution, no run history, no baseline to compare against, no review workflow.
We're not building an evaluation platform — Arize is that. We're building the place where WIMT's own test suite actually runs.
Scope
In scope: orchestration (submit a run, track it, walk away), persistent storage of runs and verdicts, dataset management with versioning and lineage, comparison against a baseline, and an SME review workflow.
Out of scope: anything Arize already does well. Generic trace viewing and generic dashboards stay on their platform — we're building dashboards inside Tachyon Overwatch with Karthik rather than duplicating them.
Line of defense: we are first line, checking our own work during development and change. Freddy's Risk Oversight Engine is second line, covering model validation and production monitoring. Different point in the lifecycle, and that separation is a requirement rather than duplication.
Layer 1 — UI
Leading: me. Supporting: Ananya, and Bishal Kumar Shaw, who built the AI Teammate chatbot UI and brings that experience across directly.
Screens being built:
Datasets — upload or author a golden dataset, version it, view train/test/validation splits, generate perturbations, see lineage from base to derived datasets
New Run — pick dataset, environment, test types, optional baseline, submit
Jobs — queued, running, completed, with live progress
Results — per-row: query, retrieved context, model output, verdict, score
SME Review — row-level approve/reject with comments, replacing the Excel round-trip
Compare — two runs side by side with row-level diff
Current state: a working live view is deployed. The move now is from a single view to proper navigation across these screens.
Layer 2 — Backend
Owned by me.
Where we are: the service is built, deployed, and running end to end in the lower region. It pulls traces from Overwatch, runs hallucination and response-length checks, and streams verdicts to the UI. Evaluators are plugin-based, so new checks register without touching the core.
What that architecture couldn't do: it only reads traces that already exist. A developer changing a prompt has nothing for us to evaluate. We were a camera; what's needed is a test lab.
What's being built now:
Job orchestration — submit a run, get a job ID immediately, background worker executes the phases. Runs of 200+ queries take minutes to hours, so nobody can sit and wait.
MongoDB as source of truth — five collections: datasets, jobs, evaluations, annotations, run summaries. Large payloads go to blob storage with pointers in Mongo.
Retention — retrieved context stored alongside every verdict. Overwatch clears trace data on a rolling window, so without our own store there's no baseline and change management is impossible.
Run triggering — the service fires a dataset at the Supervisor rather than waiting for traces to appear.
Layer 3 — Integration approach
Decided: we host the model testing framework. It gets deployed on our side. The model team contributes code and leverages our compute; we operate the service.
Integration point: we wrap their framework rather than rewrite it. Their three phases become callable functions behind our API — run prompts, extract traces, run analysis. Their evaluation logic stays theirs.
Changes needed on their code — three, all narrow:
File reads move from local paths to consumer-supplied URLs, so their code runs against data we hand it
The CLI dispatcher gets wrapped in an adapter exposing the three phases as functions
Post-phase returns result rows in addition to writing files, so results can be persisted
Evaluator independence: no arbitration. Their judge and ours both run and appear as independent columns alongside the SME verdict. The framework doesn't decide which judge is right. LLM-versus-human agreement then falls out automatically instead of needing a script run by hand.
Sequencing — start small, as asked. First milestone is one test type, hallucination, on their curated dataset: URL-based input, async job, results in our store, verdict in our UI, and a visible diff between two runs. Once that skeleton is proven, the remaining ten tests are configuration rather than new engineering.
Open items
Data classification of traces and stored artifacts has no owner — more pressing now that the cyber jailbreak dataset will run in our environment
Eric Andrei's POC, which wraps the framework, needs a merge-or-leave decision
Freddy requirements checklist — David is confirming scope boundaries directly