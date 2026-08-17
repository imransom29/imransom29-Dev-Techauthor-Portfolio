# Supervisor Evaluation Service — Requirements Document

**Author:** Rahul Vinayak  
**Date:** August 17, 2026  
**Status:** Draft — For Review  
**Source Meetings:**  
- Product Owner Demo (Aug 14) — Tom, Deepak, Eric, Akiva, David, Kaz (~30 attendees)  
- Model Team Demo (Aug 3) — Kibashini, Rohan, Rahul  
- Post-Demo Debrief (Aug 3) — David, Rohan, Rahul  
- Kaz Direction Call (Aug 11)  
- Freddy Lecue 1:1 + David's Email Exchange (Aug 10)  
- Internal Architecture Discussions — David, Rohan, Kaz  

---

## 1. BACKGROUND & CURRENT STATE

The Supervisor Evaluation Service is a FastAPI microservice that fetches LLM traces from Tachyon Overwatch (Arize Phoenix) via GraphQL, evaluates them for hallucinations using an LLM-as-Judge approach (Claude Sonnet), and produces PASSED / REVIEW / FAILED verdicts.

**Currently deployed:** Lower region (OCP/OpenShift, Garland 6 datacenter)  
**Current evaluators registered:** Hallucination (LLM-as-Judge) + Response Length (heuristic)  
**Current UI:** Flat results table (static/live.html)  
**Current state:** Stateless — evaluation results are not persisted  

---

## 2. CONFIRMED TARGETS (Tom — Product Owner Demo, Aug 14)

### REQ-01: Continuous KPI Scoring

**What was said:**  
Tom confirmed that MRM's KPIs should be continuously run against test and production data, so that at any point in time, current scores can be stated immediately — no manual run required.

**What this means for the service:**

- Scheduled evaluation jobs that automatically fetch traces and run evaluations at a configurable interval (e.g., every 4 hours, daily)
- Persistent storage (database) to store evaluation results historically
- A dashboard view showing latest KPI scores at a glance — always up to date
- Historical trend — "accuracy was 91% last week, 88% this week" type view
- KPIs to track: Hallucination rate, RAG accuracy, Tool correctness, Retrieval relevancy, Faithfulness, Generation relevancy (aligned with model team's 11 test types)

**Gap from current state:**  
Service is stateless today. No database. No scheduler. Results disappear after the session ends.

---

### REQ-02: Golden Dataset Builder

**What was said:**  
Tom confirmed that the product team should be able to pick good examples from evaluated runs and add them to the golden dataset.

**What this means for the service:**

- In the evaluation results UI, each evaluated trace should have an "Add to Golden Dataset" action
- SME / product team member reviews a PASSED trace, clicks "Add to Golden Dataset"
- The selected trace (question + retrieved context + model output + verdict) gets saved to a curated golden dataset store
- Golden dataset should be exportable (CSV/Excel/JSON) for the model team to reuse in their testing framework
- Golden dataset should be versioned — "v1 had 200 examples, v2 has 250"
- Ability to remove entries from the golden dataset if they become stale

**Rahul's existing idea (pre-meeting):**  
Add a section in the UI where an SME inputs/uploads a golden dataset, runs it through any Supervisor environment, stores results, and evaluates them there. This aligns with and extends Tom's requirement.

**Deepak's Phase 2 connection:**  
This directly delivers Deepak's Phase 2 golden dataset builder vision.

---

## 3. REQUIREMENTS FROM STAKEHOLDER DISCUSSIONS (Aug 14 Demo)

### REQ-03: Point-in-Time Evaluation Snapshots

**What was said:**  
Account balances change over time, so evaluation checks must be point-in-time pass/fail rather than cumulative comparisons. Cosine similarity is used for closeness on certain data types.

**What this means for the service:**

- Every evaluation result must be stored with a timestamp and the context snapshot at that moment
- Comparisons should only happen within the same evaluation run / time window
- No cumulative scoring across runs — each run is independent
- For data that changes (account balances, portfolio values), the evaluation is "was the answer correct AT THAT POINT IN TIME?" — not "is the answer still correct today?"
- Cosine similarity can be used where exact match is not appropriate (e.g., paraphrased answers)

---

### REQ-04: Redaction Handling Across Environments

**What was said (Akiva):**  
Account numbers are currently redacted, which blocks comparing account-level answers. A ticket is in progress to redact only in production and not in non-production. Production redaction stays permanently. Akiva will send a written requirement to Tom to push up the stack.

**What this means for the service:**

- Service must be environment-aware — know whether it is running in non-production or production
- Non-production: full data access, account numbers visible, account-level comparison possible
- Production: redacted data, evaluation must work with redacted content — account-level comparison will be limited
- Service should not break or produce misleading verdicts when encountering redacted fields (e.g., "[REDACTED]" in place of account numbers)
- This is a DEPENDENCY — not directly in Rahul's control. Track Akiva's ticket status.

**Status:** Akiva to send written requirement to Tom. Ticket in progress.

---

### REQ-05: User Feedback Collection (Optional / Random)

**What was said (Ian vs Tom debate):**  
Ian suggested enforcing user feedback in the Advisor Teammate chat. Tom pushed back strongly — model governance cannot be put on users, and they would stop using the tool if forced. Landed on possibly asking randomly or occasionally rather than making it mandatory.

**What this means for the service:**

- A feedback ingestion endpoint — receives thumbs up/down (or similar) from the Advisor Teammate chat UI
- Feedback is NOT mandatory — triggered randomly or occasionally on a subset of conversations
- Feedback stored alongside the LLM-as-Judge verdict for that trace — enabling agreement analysis ("did the user agree with the judge's verdict?")
- Agreement rate metric: "Judge said PASS, user said 👍" = agreement; "Judge said PASS, user said 👎" = disagreement
- This is a DEPENDENCY — the Advisor Teammate UI team must implement the prompt-for-feedback UI. Rahul's service is the consumer of that feedback data.

**Status:** OPEN — frequency, trigger logic, and UI design undecided.

---

### REQ-06: Prompt Studio / Playground (Kaz's Idea)

**What was said (Kaz):**  
Build a "studio" concept on top of the service for the product team to explore prompts — experiment with prompt changes and see how they affect output quality.

**What this means for the service:**

- A new UI section: "Prompt Studio"
- Product team member writes or pastes a prompt
- Runs it against a Supervisor environment (non-production)
- Gets the output immediately
- Output is auto-evaluated (hallucination check, relevancy check)
- Can tweak the prompt, re-run, compare results side by side
- Enables rapid prompt iteration without going through full deployment

**Priority:** Future scope — not immediate. Roadmap item.

---

### REQ-07: Share URL with Product Team (Tom's Direct Ask)

**What was said (Tom):**  
Tom asked for the URL to be shared with the product team to use in non-production and give feedback.

**What this means for the service:**

- Deploy the UI to UAT environment (Kaz already directed: promote from lower region to UAT)
- Give the product team access to the UAT instance
- Product team uses it, provides feedback on usability, features, and evaluation accuracy
- Feedback collection mechanism (even informal — Slack channel, email, JIRA tickets)

**Status:** Kaz confirmed — deploy to UAT, give product team access. No sandbox, no release — this is the mainline.

---

## 4. REQUIREMENTS FROM MODEL TEAM INTEGRATION (Aug 3 Demo + Follow-ups)

### REQ-08: Host Model Team's Testing Framework

**What was said (David, internal meeting):**  
The model team are developers but not a development team — they cannot deploy or operate a running application. Each team member currently runs the framework locally and pushes component files around. Rahul's team will host the framework, they will leverage the compute and contribute code, and Rahul's team will operate the service.

**What this means for the service:**

- Wrap the model team's 3-phase pipeline (pre → traces → post) as API endpoints hosted within or alongside Rahul's service
- Model team contributes code (test types, evaluation logic), Rahul's team deploys and operates
- Model team can kick off a test run via the UI or API, go home, and check results the next day
- All 11 test types should be invokable: Hallucination, Sensitivity, Generation, Retrieval, Prompt, Performance, Explainability, Key Parameters, Tool Correctness, Replication, Cyber Guardrail

**Hosting decision confirmed:** Model team agreed to their framework being deployed on Rahul's side.

---

### REQ-09: Three Use Cases in Scope (Kibashini)

**What was said (Kibashini, Aug 3):**  
Kibashini named three distinct use cases and asked which are in scope. Rohan confirmed all three.

**Use Case 1 — Developmental Testing for New Features:**  
When building a new capability, run the evaluation suite to check quality before release.

**Use Case 2 — Change Management for Existing Features:**  
When modifying an existing feature (e.g., changing citation rendering), run targeted tests to ensure the change doesn't regress quality. Kibashini's example: "if a change affects citations rendering, the number of citations should not drop drastically."

**Use Case 3 — Ongoing Monitoring:**  
Continuous monitoring of production or near-production traces. (Overlaps with REQ-01.)

**What this means for the service:**

- Must support ad-hoc runs (Use Case 1 & 2) AND scheduled runs (Use Case 3)
- Must support targeted tests — not just "run everything" but "run only citation-related tests"
- Must support running against development-stage prompts and code, not just production traces (model team's ask)

---

### REQ-10: Start Small, Incremental Integration (Kibashini)

**What was said:**  
Start with a small piece of work or a small implementation first rather than committing to full scope. Break it into smaller pieces.

**What this means:**

- Phase 1: Shared trace fetching + one evaluation type (hallucination) working end-to-end
- Phase 2: Add more evaluation types one by one
- Phase 3: Full pipeline integration (all 3 phases, all 11 test types)
- Practical starting point (Rohan's suggestion): Leverage the model team's existing curated dataset for initial integration testing

---

### REQ-11: API Contract — Model Team Calls Rahul's API

**What was said:**  
Confirmed in the model team meeting: "You will give us an interface and we'll use that interface flexibly."

**What this means for the service:**

- Rahul's service exposes evaluation endpoints
- Model team is the consumer — they call the API
- Contract must handle three extraction levels (Rohan's constraint):
  - Prompt-level: ~1 row
  - Thread-level: ~400 rows
  - Time-based: ~200,000 rows (at 20K user load)
- Response payload is NOT always a simple JSON — for statistical evaluations, it may be a series of files or extractions (Rohan's design constraint)
- Evaluation results are probabilistic, not deterministic — contract must not assume a simple pass/fail response shape
- Support for asynchronous job tracking (Rohan's suggestion) — long-running evaluations return a job ID, consumer polls for status

---

### REQ-12: Multiple Judges, No Arbiter (Rohan's Architectural Ruling)

**What was said (Rohan):**  
The integration framework must NOT decide which judge is right. Judges stay as separate evaluators, results go into one comprehensive report. If corporate risk brings other evaluators later, they become additional integration points, not competing verdicts.

**What this means for the service:**

- Rahul's hallucination judge and the model team's evaluators run independently
- Results are presented side by side in a comprehensive report — NOT merged into a single verdict
- No "Rahul's judge says PASS but model team's judge says FAIL — so the answer is X" logic
- Plugin architecture supports adding new evaluators without changing existing ones
- Future evaluators (from Freddy's enterprise platform or others) can be added as additional columns, not replacements

---

### REQ-13: Data Retention — Own Persistent Storage

**What was said (David, post-demo debrief):**  
Overwatch retention window is ~2 weeks — data gets blown away. Annotations pushed to Arize cannot be relied on in production. Evaluation results must be kept within our own ecosystem.

**What this means for the service:**

- Database is MANDATORY — cannot rely on Overwatch for historical data
- All evaluation results, verdicts, trace snapshots, and golden dataset entries must be stored persistently
- Must support re-running evaluations even after the original trace has expired in Overwatch
- This means: when fetching traces, also store a local copy/snapshot of the trace data

**This reinforces REQ-01 (continuous KPIs), REQ-02 (golden dataset), and REQ-03 (point-in-time snapshots).**

---

### REQ-14: Human Annotation Remains Required (Kibashini)

**What was said (Kibashini):**  
Using one model to benchmark another "won't cut it" for the model team. They still require human annotation at the end regardless of model-vs-model results.

**What this means for the service:**

- LLM-as-Judge verdicts are a FIRST PASS, not the final word
- UI must support human review workflow: LLM judge produces a verdict → SME reviews → SME confirms or overrides
- Override data is valuable — feeds back into judge accuracy benchmarking
- Rahul can keep his own benchmarking process (auto-review vs manual-review) on his side, but model team's final evaluation always includes human annotation

---

## 5. REQUIREMENTS FROM ORGANIZATIONAL POSITIONING

### REQ-15: Differentiation from Freddy's Enterprise Platform

**What was said (David's positioning + Freddy's reply):**  
Freddy's Risk Oversight Engine covers production model monitoring and model validation. Users are first-line and second-line. Currently connecting UAT data for some pre-prod visibility. WIMT wants shift-left — evaluation during development, not just in production.

**What this means for the service:**

- Rahul's service covers the DEVELOPMENT side — shift-left evaluation
- Freddy's platform covers the PRODUCTION side — model monitoring and MRM validation
- Rahul's service should expose artifacts that Freddy's platform can consume (prompts, judge configurations, evaluation results) — feed their process rather than duplicating it
- David's next step: take Freddy a LIST OF REQUIREMENTS and ask which are in scope for the enterprise platform. Whatever is NOT in scope = WIMT builds on top of Rahul's service.

**Status:** David emailed Freddy (Aug 10). Freddy confirmed prod monitoring + model validation scope. Gap analysis pending.

---

### REQ-16: Deployable Kit for All of WIM (David's Larger Vision)

**What was said (David):**  
Bundle Rahul's service plus the model team's testing framework into a deployable that all of WIM can use during model development — similar to the starter kit distributed during the hackathon. Kaz added it could be onboarded via IDP so teams take the code and run their own instance.

**What this means for the service:**

- Service must be self-contained and deployable by other teams
- Configuration-driven — different teams can point it at their own models, their own Overwatch spaces, their own evaluation criteria
- IDP (Orchestra) onboarding — teams can spin up their own instance
- Documentation must be comprehensive enough for another team to deploy without Rahul's help

**Priority:** Future scope — after core requirements are stable.

---

## 6. DATA & GOVERNANCE REQUIREMENTS

### REQ-17: Data Classification of Traces and Artifacts

**What was raised (Model team, Aug 3):**  
How traces and stored artifacts will be data-classified is an open governance question.

**Status:** Unanswered. No owner assigned. Needs escalation.

---

## 7. UI REQUIREMENTS (From Bishal's Review + Meeting Feedback)

### REQ-18: UI Cleanup (Bishal's Feedback)

- Remove: Evaluator Visibility section, Rollout Telemetry, Judge/Suggestion labels, duplicate health indicators, timer, latency card
- Move: "Push to Overwatch" button from header to individual trace rows
- Add: Sidebar navigation
- Refactor: Split React components into separate files

### REQ-19: Richer Evaluation View

- Current UI is a flat results table
- Needed: QUERY → RETRIEVED CONTEXT → MODEL OUTPUT view per trace (the richer dashboard from earlier design specs)
- Each trace expandable to show full evaluation details

### REQ-20: Perturbation Review Section

- SME can review perturbed variants of queries
- See how model output changes when query is slightly modified
- Linked to model team's perturbation.py datasets

---

## 8. TECHNICAL REQUIREMENTS (Cross-cutting)

### REQ-21: Database / Persistent Storage

Required by: REQ-01, REQ-02, REQ-03, REQ-05, REQ-13

Must store:
- Evaluation results with timestamps
- Trace snapshots (local copy — survives Overwatch retention expiry)
- Golden dataset entries
- User feedback data
- Historical KPI scores
- Job execution history (for scheduled + async runs)

---

### REQ-22: Dedicated Space ID

Currently the Overwatch space ID is shared across multiple projects. A dedicated space ID for the Supervisor Evaluation Service was discussed but not yet created.

---

### REQ-23: New Repository

Kaz directed (Aug 11): move the code to a new repo. Currently in the dev repo alongside other project code.

---

### REQ-24: JIRA Hygiene

Kaz directed (Aug 11): close the completed subtasks, attach OCP screenshots as evidence before closing, and let the parent story move to Done once all subtasks are closed.

---

## 9. OPEN QUESTIONS

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | User feedback — frequency, trigger logic, UI design? | Tom / Product Team | OPEN |
| 2 | Data classification of traces and stored artifacts? | Unassigned | OPEN |
| 3 | Which artifacts to expose for Freddy's enterprise platform? | David / Freddy | PENDING (David emailed Freddy) |
| 4 | Redaction ticket resolution timeline? | Akiva | IN PROGRESS |
| 5 | Eric's POC of model team's framework — mergeable into this service? | David / Eric | OPEN |
| 6 | Account-level comparison approach for production (with permanent redaction)? | Akiva / Tom | Akiva sending written requirement |

---

## 10. PRIORITY MATRIX

| Priority | Requirement | Dependency | Target |
|----------|-------------|------------|--------|
| 🔴 P0 | REQ-21: Database / Persistent Storage | None | Month 1 |
| 🔴 P0 | REQ-23: New Repository | None | Week 1 |
| 🔴 P0 | REQ-24: JIRA Hygiene | None | Week 1 |
| 🔴 P0 | REQ-07: Deploy to UAT + Share URL | None | Week 1–2 |
| 🔴 P1 | REQ-01: Continuous KPI Scoring | REQ-21 | Month 1–2 |
| 🔴 P1 | REQ-02: Golden Dataset Builder | REQ-21 | Month 1–2 |
| 🔴 P1 | REQ-13: Data Retention (local trace snapshots) | REQ-21 | Month 1–2 |
| 🟡 P2 | REQ-03: Point-in-Time Snapshots | REQ-21 | Month 2–3 |
| 🟡 P2 | REQ-08: Host Model Team's Framework | REQ-10 | Month 2–3 |
| 🟡 P2 | REQ-11: API Contract for Model Team | REQ-08 | Month 2–3 |
| 🟡 P2 | REQ-12: Multi-Judge Comprehensive Report | REQ-08 | Month 2–3 |
| 🟡 P2 | REQ-18: UI Cleanup | None | Month 2 |
| 🟡 P2 | REQ-19: Richer Evaluation View | REQ-18 | Month 2–3 |
| 🟡 P3 | REQ-04: Redaction Handling | Akiva's ticket | Month 3+ |
| 🟡 P3 | REQ-05: User Feedback Endpoint | Advisor Teammate UI team | Month 3+ |
| 🟡 P3 | REQ-09: Three Use Cases (full scope) | REQ-08, REQ-11 | Month 3–4 |
| 🟡 P3 | REQ-14: Human Annotation Workflow | REQ-02, REQ-19 | Month 3–4 |
| 🟡 P3 | REQ-20: Perturbation Review | REQ-08 | Month 3–4 |
| 🟢 P4 | REQ-06: Prompt Studio | All core done | Month 4+ |
| 🟢 P4 | REQ-15: Freddy Integration Points | David's gap analysis | Month 4+ |
| 🟢 P4 | REQ-16: WIM-wide Deployable Kit | All core stable | Month 5+ |
| 🟢 P4 | REQ-22: Dedicated Space ID | None | When needed |

---

## 11. KEY STAKEHOLDER QUOTES (For Reference)

**Tom (Product Owner):**  
"Excellent" — endorsed the first-line/second-line culture point strongly. Asked for URL to be shared with product team.

**Kaz (Principal Engineer / Mentor):**  
"This will definitely be used in production and will be used for creating the golden dataset." Directed: deploy to UAT, move to new repo, close JIRA subtasks with evidence.

**David (US Tech Lead):**  
"Evaluation results must be kept within our own ecosystem — needs a database and repository." Sees the larger opportunity as a WIM-wide deployable.

**Kibashini (Model Team):**  
"Start with a small piece of work first." Three use cases confirmed in scope. Human annotation remains required — LLM-as-Judge alone "won't cut it."

**Rohan (Solution Engineering):**  
"The framework must not decide which judge is right." Contract must handle all three extraction levels. Evaluation results are probabilistic, not deterministic.

**Akiva:**  
Redaction blocks account-level comparison. Ticket in progress for non-production. Will send written requirement to Tom.

**Freddy (Enterprise Platform):**  
Covers production monitoring + model validation. "We're wasting Wells Fargo money if everybody's doing their own thing." Open to collaboration.

---

*This document should be reviewed by Kaz and David before sharing with the broader team. Requirements should be converted to JIRA stories after review.*
