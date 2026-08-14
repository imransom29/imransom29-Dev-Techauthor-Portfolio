The problem we're solving

WIMT has a GenAI testing framework built by the model team. It has eleven test types — hallucination, sensitivity, generation, retrieval, prompt, performance, explainability, key parameters, tool correctness, replication, cyber guardrail. The tests are written specifically for the Wells Fargo Supervisor Agent, firing over websocket at the agent and calling Tachyon APIs.

The framework works. It just has nowhere to run.

Today every team member runs it on their own laptop. Three scripts in sequence, from a terminal. Results land as .xlsx files locally. SMEs get emailed a spreadsheet and mail it back. There's no shared execution, no run history, no baseline to compare against, and no review workflow.

That's the gap. We're not building an evaluation platform — Arize is that. We're building the runtime where WIMT's own test suite actually runs, gets stored, and gets reviewed.

Scope

In scope: orchestration (submit a run, track it, walk away), persistent storage of runs and verdicts, dataset management with versioning and lineage, run comparison against a baseline, and an SME review workflow.

Out of scope: anything Arize already does well. Generic trace viewing, generic dashboards, and general-purpose evaluation tooling stay on their platform. We're building dashboards inside Tachyon Overwatch with Karthik rather than duplicating them in our UI.

Line of defense: we are first line — the builders checking our own work during development and change. Freddy's Risk Oversight Engine is second line, covering model validation and production monitoring. Different point in the lifecycle, and the separation is a requirement rather than duplication.

Layer 1 — UI

Leading: me. Supporting: Ananya, and Bishal Kumar Shaw, who built the AI Teammate chatbot UI and brings that pattern experience directly across.

Screens being built:

Datasets — upload or author a golden dataset, version it, view train/test/validation splits, generate perturbations, and see lineage from base to derived datasets
New Run — pick dataset, environment, test types, optional baseline, submit
Jobs — queued, running, completed, with live progress
Results — per-row view: query, retrieved context, model output, verdict, score
SME Review — row-level approve/reject with comments, replacing the Excel round-trip
Compare — two runs side by side with row-level diff

Current state: a working live view exists and is deployed. The move now is from a single view to proper navigation across these screens.

Layer 2 — Backend

Owned by me.

Where we are: the service is built, deployed, and running end to end in the lower region. It pulls traces from Tachyon Overwatch, runs hallucination and response-length evaluation, and surfaces verdicts through the UI with live streaming. Evaluators are plugin-based, so new checks register without touching the core.

What that architecture can't do: it only reads traces that already exist. A developer changing a prompt has nothing for us to evaluate. We're a camera, and what's needed is a test lab.

What's being built now:

Job orchestration — submit a run, get a job ID immediately, background worker executes the phases. Runs of 200+ queries take minutes to hours, so nobody can sit and wait.
MongoDB as source of truth — five collections: datasets, jobs, evaluations, annotations, run summaries. Large payloads go to blob storage with pointers held in Mongo.
Retention — retrieved context is stored alongside every verdict. Overwatch clears trace data on a rolling window, so without our own store there's no baseline and change management is impossible.
Run triggering — the service fires the dataset at the Supervisor rather than waiting for traces to appear.
Layer 3 — Integration with the model testing framework

Decided: we host it. The framework will be deployed on our side. The model team contributes code and leverages our compute; we operate the service.

Integration point: we wrap their framework rather than rewrite it. Their three phases become callable functions behind our API — run prompts, extract traces, run analysis. Their evaluation logic stays theirs.

Changes required on their code: three, and all narrow.

File reads move from local paths to consumer-supplied URLs, so their code can run against data we hand it
The CLI dispatcher gets wrapped in an adapter exposing the three phases as functions
Post-phase output returns result rows in addition to writing files, so results can be persisted

Evaluator independence: no arbitration. Their judge and ours both run and both appear in the report as independent columns, alongside the SME verdict. The framework does not decide which judge is right — that was the ruling and the design holds to it. LLM-versus-human agreement then falls out automatically instead of needing a script run by hand.

Sequencing — start small, as asked. First milestone is one test type, hallucination, on their curated dataset: URL-based input, async job, results in our store, verdict in our UI, and a visible diff between two runs. Once that skeleton is proven, the remaining ten tests follow the same path as configuration rather than new engineering.

Open items
Data classification of traces and stored artifacts has no owner. Now more pressing since the cyber jailbreak dataset will run in our environment.
Eric Andrei's POC, which wraps the framework, needs a merge-or-leave decision.
Freddy requirements checklist — David is confirming scope boundaries directly.
