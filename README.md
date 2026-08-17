# Software Requirements Specification
## Supervisor Evaluation Service

| Field | Value |
|---|---|
| **Document Version** | 1.0 |
| **Author** | Rahul Vinayak, AVP Software Engineer |
| **Team** | AHP Pro — WIMT (Wealth & Investment Management Technology) |
| **Date** | August 17, 2026 |
| **Status** | Draft — Pending Review |
| **Reviewers** | Kazhian Muthusami (Principal Engineer), David Mosciatti (US Tech Lead) |
| **Distribution** | AHP Pro Engineering, Model Team (Damian's org), Product Team |

---

## Document Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | Aug 14, 2026 | R. Vinayak | Initial requirements captured from Product Owner demo |
| 1.0 | Aug 17, 2026 | R. Vinayak | Full SRS — integration approach, infrastructure ownership, functional and non-functional requirements |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Integration Approach & Service Boundaries](#2-integration-approach--service-boundaries)
3. [Infrastructure Ownership Model](#3-infrastructure-ownership-model)
4. [Data Persistence Architecture](#4-data-persistence-architecture)
5. [Functional Requirements](#5-functional-requirements)
6. [Integration Requirements](#6-integration-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Security & Compliance Requirements](#8-security--compliance-requirements)
9. [Observability & Operations](#9-observability--operations)
10. [Constraints & Dependencies](#10-constraints--dependencies)
11. [Open Items & Risks](#11-open-items--risks)
12. [Delivery Roadmap](#12-delivery-roadmap)
13. [Appendix](#13-appendix)

---

# 1. Introduction

## 1.1 Purpose

This document specifies the requirements for the Supervisor Evaluation Service — a platform that provides shift-left evaluation capability for GenAI applications within WIMT, beginning with the AI Advisor Teammate.

Requirements in this document were captured from the following sources:

| Meeting | Date | Key Participants |
|---|---|---|
| Product Owner Demo | Aug 14, 2026 | Tom, Deepak, Eric, Akiva, David, Kaz (~30 attendees) |
| Model Team Demo | Aug 3, 2026 | Kibashini Periasamy, Rohan Sharma, Rahul Vinayak |
| Post-Demo Architecture Debrief | Aug 3, 2026 | David Mosciatti, Rohan Sharma, Rahul Vinayak |
| Enterprise Platform 1:1 | Aug 2026 | Freddy Lecue, Rahul Vinayak |
| Technical Direction Call | Aug 11, 2026 | Kazhian Muthusami, Rahul Vinayak |
| Email Exchange — Scope Clarification | Aug 10, 2026 | David Mosciatti, Freddy Lecue |

## 1.2 Scope

**In scope:**
- Evaluation of LLM traces during development, change management, and ongoing monitoring
- Hosting and orchestration of the Model Team's testing framework
- Persistent storage of evaluation results, trace snapshots, and curated golden datasets
- API surface for programmatic consumption by the Model Team and other WIMT teams

**Out of scope:**
- Production model monitoring at firm level — owned by the Enterprise Risk Oversight Engine (Freddy Lecue's team)
- Model Risk Management (MRM) formal validation sign-off — owned by second line
- Modification of the Advisor Teammate runtime itself

## 1.3 Definitions

| Term | Definition |
|---|---|
| **Trace** | A recorded execution of an LLM request, including spans for retrieval, generation, and tool calls |
| **Span** | An individual operation within a trace (e.g., a single retrieval call) |
| **LLM-as-Judge** | An evaluation technique where a separate LLM assesses the quality of another model's output |
| **Golden Dataset** | A curated set of question/context/answer examples validated by SMEs, used as ground truth |
| **Shift-Left** | Moving quality evaluation earlier in the development lifecycle, before production |
| **Overwatch** | Tachyon Overwatch — Wells Fargo's internally deployed Arize Phoenix instance |
| **Model Team** | Damian's organisation — builds MRM testing and validation frameworks |
| **First Line / Second Line** | Business/technology teams (1L) versus independent risk oversight (2L) |

---

# 2. Integration Approach & Service Boundaries

## 2.1 Context

Three separate initiatives within Wells Fargo address GenAI evaluation:

| Initiative | Owner | Mandate | Lifecycle Stage |
|---|---|---|---|
| **Supervisor Evaluation Service** | AHP Pro / WIMT (this service) | Application-specific evaluation for AI Teammate | Development, change management, pre-production |
| **Model Testing Framework** | Model Team (Damian's org) | MRM test suite — 11 test types, statistical evaluation | Validation, MRM sign-off |
| **Enterprise Risk Oversight Engine** | Enterprise / Second Line (Freddy Lecue) | Firm-wide production monitoring of every GenAI model | Production monitoring |

## 2.2 Decision: Keep Services Independent

**REQ-INT-01 — The Model Testing Framework and the Supervisor Evaluation Service shall remain independent codebases with independent repositories.**

### Rationale

**a) Different ownership and change velocity.**
The Model Testing Framework is authored by the Model Team to satisfy MRM requirements. Its test definitions change when regulatory or risk requirements change. The Supervisor Evaluation Service changes when application features change. Merging them into one codebase would couple two release cycles that have no reason to move together, and would require Model Team code review on every application-side change.

**b) Regulatory separation of concerns.**
The Model Team's framework produces artefacts used in Model Risk Management validation. Keeping the test definitions in the Model Team's own repository preserves a clear audit trail of who authored and approved each test — a property that would be weakened if application engineers could modify test logic directly.

**c) Confirmed architectural ruling on judge independence.**
Rohan Sharma's design constraint (Aug 3): the integration framework must not decide which judge is correct. Judges remain separate evaluators, and results are aggregated into one comprehensive report rather than reconciled into a single verdict. If Corporate Risk introduces additional evaluators later, they become additional integration points rather than competing verdicts. Independent codebases enforce this at the architectural level.

**d) Reuse beyond a single application.**
The Model Team's framework is intended to be used against multiple applications, not only AI Teammate. Embedding it inside an AI-Teammate-specific service would prevent that reuse.

**e) Confirmed consumption direction.**
Agreed in the Aug 3 Model Team meeting: *"You will give us an interface and we'll use that interface flexibly."* The Model Team calls the Supervisor Evaluation Service API. This is a consumer/provider relationship, which does not require a merged codebase.

### What "independent" does NOT mean

Independence applies to the **codebase**, not to the **runtime**. The two services will be deployed and operated together on WIMT infrastructure (see Section 3).

---

## 2.3 Integration Pattern

**REQ-INT-02 — The Supervisor Evaluation Service shall expose the Model Testing Framework's three-phase pipeline as API endpoints, orchestrated by this service.**

The Model Team's framework operates in three phases today:

| Phase | Current Implementation | Exposed As |
|---|---|---|
| **Phase 1 — Run Prompts** | `pre_X.py` reads `dataset.xlsx`, fires queries at the Supervisor Agent | `POST /api/v1/jobs/run-prompts` |
| **Phase 2 — Extract Traces** | `traces_extractor.py` pulls from Overwatch into `traces.json` | `POST /api/v1/jobs/extract-traces` |
| **Phase 3 — Run Analysis** | `post_X.py` evaluates, produces `post_results.xlsx` | `POST /api/v1/jobs/run-analysis` |

**Orchestrated flow:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SUPERVISOR EVALUATION SERVICE                      │
│                         (WIMT — owned & operated)                     │
│                                                                       │
│  ┌────────────┐   ┌─────────────┐   ┌──────────────┐                │
│  │    UI      │──▶│  Job        │──▶│  Framework   │                │
│  │  (React)   │   │  Orchestr-  │   │  Wrapper     │                │
│  └────────────┘   │  ator       │   │  (adapter)   │                │
│                    └──────┬──────┘   └──────┬───────┘                │
│                           │                  │                        │
│                           ▼                  ▼                        │
│                    ┌─────────────┐   ┌──────────────────┐            │
│                    │  Own        │   │  MODEL TEAM      │            │
│                    │  Evaluators │   │  FRAMEWORK       │            │
│                    │  (halluc.,  │   │  (independent    │            │
│                    │   heuristic)│   │   repo, hosted   │            │
│                    └──────┬──────┘   │   here)          │            │
│                           │           └────────┬─────────┘            │
│                           ▼                    ▼                      │
│                    ┌────────────────────────────────┐                │
│                    │   COMPREHENSIVE REPORT          │                │
│                    │   (both judges side by side —   │                │
│                    │    no arbitration)              │                │
│                    └───────────────┬────────────────┘                │
│                                    ▼                                  │
│                    ┌────────────────────────────────┐                │
│                    │   MONGODB (persistent store)    │                │
│                    └────────────────────────────────┘                │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
          ┌──────────────────┐          ┌──────────────────────┐
          │ TACHYON OVERWATCH │          │  ENTERPRISE RISK     │
          │ (trace source)    │          │  OVERSIGHT ENGINE    │
          │ 2-week retention  │          │  (Freddy — consumes  │
          └──────────────────┘          │   our artefacts)     │
                                         └──────────────────────┘
```

**REQ-INT-03 — The Model Testing Framework shall be integrated via an adapter layer, not by modifying its source.**

The adapter translates between the service's API contract and the framework's file-based interface. Rohan Sharma confirmed (Aug 3) that the framework reads input files into a pandas DataFrame before applying operations, and that this read step can be modified to accept an external URL supplied by the consumer rather than a local filesystem path. This is the single integration point required — no other changes to their code.

**REQ-INT-04 — Both services shall maintain independent version numbers and release cycles.**

The service shall record which version of the Model Testing Framework produced each evaluation result, so results remain reproducible and auditable after framework upgrades.

---

# 3. Infrastructure Ownership Model

## 3.1 The Problem

**Stated by David Mosciatti (internal architecture meeting):** The Model Team consists of developers, but is not a development team. They have no capability to deploy or operate a running application.

**Current pain point:** Every Model Team member runs the testing framework locally on their own machine and passes component files between one another. There is no shared environment, no scheduled execution, and no shared result store.

**What they need:** The ability to kick off an evaluation run, leave for the day, and review results the following morning.

## 3.2 Decision: WIMT Hosts and Operates

**REQ-INF-01 — WIMT (AHP Pro) shall host and operate the Model Testing Framework on WIMT infrastructure. The Model Team shall contribute code; WIMT shall own deployment and operations.**

This was agreed with the Model Team — they accepted deployment on the WIMT side, and WIMT retains the right to make whatever changes are needed to operate it.

## 3.3 Responsibility Matrix (RACI)

| Activity | WIMT / AHP Pro | Model Team | Enterprise (2L) |
|---|---|---|---|
| Test definitions & evaluation logic | Consulted | **Accountable** | Informed |
| Framework source code | Consulted | **Accountable** | — |
| Adapter / wrapper layer | **Accountable** | Consulted | — |
| API contract design | **Accountable** | Consulted | Informed |
| Deployment (OCP, Harness) | **Accountable** | Informed | — |
| Compute & runtime capacity | **Accountable** | Informed | — |
| Secrets management (Vault) | **Accountable** | Informed | — |
| Database operation & backup | **Accountable** | Informed | — |
| Monitoring & alerting | **Accountable** | Informed | Consulted |
| Incident response | **Accountable** | Consulted | Informed |
| Data classification approval | Consulted | Consulted | **Accountable** |
| MRM validation sign-off | Informed | Consulted | **Accountable** |

## 3.4 Infrastructure Specification

**REQ-INF-02 — The service shall be deployed on OpenShift (OCP) in the Garland 6 datacenter, consistent with existing AHP Pro deployments.**

| Component | Technology | Owner |
|---|---|---|
| Container platform | OpenShift (OCP) | WIMT |
| CI | GitHub Actions (Snapshot workflow) | WIMT |
| CD | Harness | WIMT |
| Artefact repository | JFrog Artifactory | WIMT |
| Secrets | HashiCorp Vault | WIMT |
| Datastore | MongoDB (see Section 4) | WIMT |
| Trace source | Tachyon Overwatch (Arize Phoenix) | Platform team |
| Judge model | Claude Sonnet 4.5 via Tachyon | Tachyon team |
| Suggestion model | Gemini 2.5 Flash via Tachyon | Tachyon team |

**REQ-INF-03 — The service shall support promotion across environments: Lower Region → UAT → Production.**

Per Kaz's direction (Aug 11): the service is not entering a release train and has no sandbox. The lower region is the mainline for experimentation; UAT is where the Product Team receives access.

**REQ-INF-04 — The service shall be deployable by other WIMT teams as a self-contained instance.**

David's stated ambition: bundle the Supervisor Evaluation Service and the Model Testing Framework into a deployable kit that any WIM team can use during model development, comparable to the starter kit distributed at the hackathon. Kaz added that onboarding could run through the Orchestra IDP so teams provision their own instance.

This requires all environment-specific values (Overwatch space ID, model endpoints, evaluation thresholds) to be externalised as configuration.

**REQ-INF-05 — A dedicated Overwatch space ID shall be provisioned for the Supervisor Evaluation Service.**

The space ID is currently shared across multiple projects, which prevents clean isolation of traces and complicates access control.

---

# 4. Data Persistence Architecture

## 4.1 The Driver — Retention Failure

**REQ-DATA-01 — The service shall maintain its own persistent datastore. Tachyon Overwatch shall not be relied upon as the system of record.**

**Confirmed constraint:** Overwatch retention is currently two weeks. Data is purged after that window.

**Consequences identified in review:**

| Raised by | Concern |
|---|---|
| David Mosciatti | The team had hoped Overwatch could serve as the repository, but annotations pushed to Arize cannot be relied upon in production because of the retention window. Evaluation results must be kept within our own ecosystem. |
| Kibashini Periasamy | Tests may need re-running for change management, and the underlying trace data may no longer exist. |
| Rohan Sharma | Phoenix data is lost after the retention window. Other teams keep extractions in separate persistent storage so analysis can run across them. |
| Tom (Product Owner) | Continuous KPI scoring requires historical results to be queryable at any time. |

## 4.2 Datastore Selection — MongoDB

**REQ-DATA-02 — MongoDB shall be the primary datastore for evaluation results, trace snapshots, golden datasets, and job history.**

### Rationale

**a) Schema flexibility for heterogeneous evaluation output.**
Rohan Sharma's design constraint: evaluation results are probabilistic rather than deterministic, and beyond LLM-as-Judge there are statistical evaluations measuring behaviour across jobs and distribution spread. The response may be a series of files or extractions rather than a simple payload — the contract must not assume a fixed response shape. Each of the eleven test types produces a different result structure. A document store accommodates this without schema migration per test type.

**b) Natural fit for nested trace structure.**
A trace contains spans; a span contains retrieved chunks, tool calls, and generated output. This nests naturally as a document. Relational normalisation would require multiple joins to reconstruct a single trace for display.

**c) Variable payload volume.**
Rohan's sizing analysis at 20,000-user load: time-based extraction can return approximately 200,000 rows, thread-based approximately 400 rows, and prompt-based a single row. Payload size is driven by extraction level rather than a fixed bound. Document storage with GridFS handles large extractions without imposing row-level constraints.

**d) Alignment with existing extraction handling.**
Rohan noted that other teams already keep Phoenix extractions in separate persistent storage for cross-job analysis, and identified MongoDB as one of the output formats under consideration for the integration contract.

**e) Time-series and aggregation support.**
Continuous KPI scoring requires aggregation across time windows. MongoDB's aggregation pipeline and time-series collections support this natively.

### Considered alternatives

| Option | Assessment |
|---|---|
| PostgreSQL with JSONB | Viable. Rejected because the majority of stored content is semi-structured, so most schema benefit would be unused while paying migration cost per new test type. |
| Object storage (S3-compatible) only | Rejected — no query capability. Retrieval by verdict, date range, or evaluator would require full scans. |
| Continue relying on Overwatch | Rejected — retention window makes this unviable, as confirmed by four separate stakeholders. |

## 4.3 Collection Design

**REQ-DATA-03 — The datastore shall implement the following collections.**

| Collection | Contents | Retention |
|---|---|---|
| `traces` | Local snapshot of each fetched trace — question, retrieved context, model output, spans, metadata | Indefinite (survives Overwatch purge) |
| `evaluations` | Evaluation results — evaluator name, verdict, score, explanation, judge model, framework version, timestamp | Indefinite |
| `golden_dataset` | SME-curated examples — question, context, expected answer, curator, curation timestamp, dataset version | Indefinite |
| `jobs` | Job execution records — job ID, type, status, parameters, start/end time, error detail | 12 months, then archived |
| `kpi_snapshots` | Aggregated KPI scores per time window, per evaluator, per environment | Indefinite |
| `user_feedback` | Feedback received from the Advisor Teammate chat, linked to trace ID | Indefinite |
| `sme_reviews` | Human annotation — SME verdict, agreement/override of the LLM judge verdict, reviewer identity, timestamp | Indefinite |
| `audit_log` | Every state-changing action — actor, action, target, timestamp | Per Wells Fargo retention policy |

**REQ-DATA-04 — Every stored evaluation result shall be immutable once written.**

Corrections shall be recorded as new documents referencing the original, never as in-place modification. This preserves the audit trail required for MRM.

**REQ-DATA-05 — Trace snapshots shall be captured at fetch time, not lazily.**

Because Overwatch purges data on a two-week cycle, any trace that the service touches must be copied locally at the point of first fetch.

## 4.4 Point-in-Time Semantics

**REQ-DATA-06 — Evaluation verdicts shall be point-in-time. Cumulative comparison across evaluation runs is prohibited.**

**Rationale (raised in the Aug 14 demo):** Account balances and portfolio values change over time. An answer that was factually correct when generated may appear incorrect when re-evaluated against current data. Every evaluation must therefore be assessed against the context that existed at generation time.

Implementation requirements:
- Every evaluation document carries the timestamp of the original trace and the timestamp of the evaluation
- The stored context snapshot is the evaluation input — the service never re-fetches live data to re-evaluate a historical trace
- Where exact matching is inappropriate (paraphrased answers, formatted numbers), cosine similarity shall be used as the closeness measure

---

# 5. Functional Requirements

## 5.1 Continuous KPI Scoring

**REQ-F-01 — The service shall run evaluation jobs on a configurable schedule without manual intervention.**

*Source: Tom, Product Owner Demo, Aug 14 — MRM KPIs should run continuously against test and production data so current scores can be stated at any point.*

| ID | Requirement |
|---|---|
| REQ-F-01.1 | Scheduled jobs shall be configurable per environment, per evaluator, and per cadence (hourly, daily, weekly) |
| REQ-F-01.2 | Job results shall be persisted with the timestamp of execution |
| REQ-F-01.3 | A dashboard shall display current KPI scores for each configured evaluator without requiring a manual run |
| REQ-F-01.4 | Historical trend view shall show score movement across time windows |
| REQ-F-01.5 | Failed scheduled jobs shall be retried with exponential backoff and alert on exhaustion |
| REQ-F-01.6 | KPI set shall align with the Model Team's test types: Hallucination, Sensitivity, Generation, Retrieval, Prompt, Performance, Explainability, Key Parameters, Tool Correctness, Replication, Cyber Guardrail |

## 5.2 Golden Dataset Builder

**REQ-F-02 — The service shall allow authorised users to curate evaluated traces into a versioned golden dataset.**

*Source: Tom, Product Owner Demo, Aug 14 — the product team should be able to pick good examples from evaluated runs and add them to the golden dataset. Aligns with Deepak's Phase 2 objective.*

| ID | Requirement |
|---|---|
| REQ-F-02.1 | Each evaluated trace in the results view shall offer an "Add to Golden Dataset" action |
| REQ-F-02.2 | Curated entries shall capture question, retrieved context, model output, verdict, curator identity, and curation timestamp |
| REQ-F-02.3 | Golden datasets shall be versioned; each version shall be immutable once published |
| REQ-F-02.4 | Golden datasets shall be exportable in CSV, Excel, and JSON formats for Model Team consumption |
| REQ-F-02.5 | Entries shall be removable from the working set, with removal recorded in the audit log |
| REQ-F-02.6 | The UI shall support SME upload of an externally prepared golden dataset, execution of that dataset against a Supervisor environment, and review of results in place |

## 5.3 Human Annotation Workflow

**REQ-F-03 — The service shall support SME review and override of LLM-as-Judge verdicts.**

*Source: Kibashini Periasamy, Model Team Demo, Aug 3 — using one model to benchmark another will not satisfy the Model Team; human annotation remains required regardless of model-versus-model results.*

| ID | Requirement |
|---|---|
| REQ-F-03.1 | Every LLM judge verdict shall be presented as a first-pass assessment, clearly distinguished from a final verdict |
| REQ-F-03.2 | An authorised SME shall be able to confirm or override any verdict, with a mandatory justification on override |
| REQ-F-03.3 | Override records shall be retained and shall not modify the original judge verdict |
| REQ-F-03.4 | Judge-versus-SME agreement rate shall be computed and reported as a quality metric for the judge itself |

## 5.4 Evaluation Execution Modes

**REQ-F-04 — The service shall support three execution modes corresponding to the three confirmed use cases.**

*Source: Kibashini Periasamy named three use cases in the Aug 3 demo; Rohan Sharma confirmed all three are in scope.*

| Mode | Use Case | Trigger |
|---|---|---|
| **Developmental testing** | Evaluating a new feature before release | On demand, via UI or API |
| **Change management** | Verifying an existing feature has not regressed | On demand, targeted to the change |
| **Ongoing monitoring** | Continuous quality measurement | Scheduled |

| ID | Requirement |
|---|---|
| REQ-F-04.1 | The service shall support targeted test selection — running only the tests relevant to a specific change, rather than the full suite |
| REQ-F-04.2 | The service shall support evaluation against in-progress development work (prompts and code not yet deployed), not solely against production traces |
| REQ-F-04.3 | Targeted tests shall support assertion thresholds — e.g. citation count shall not fall below a defined baseline after a change affecting citation rendering |

*Note on REQ-F-04.3: this example was given by Kibashini as the pattern the Model Team needs for change management.*

## 5.5 Multi-Evaluator Reporting

**REQ-F-05 — The service shall present results from multiple evaluators side by side without arbitration.**

*Source: Rohan Sharma's architectural ruling, Aug 3 — the integration framework must not decide which judge is right; judges remain separate evaluators feeding one comprehensive report. Additional evaluators introduced later become further integration points, not competing verdicts.*

| ID | Requirement |
|---|---|
| REQ-F-05.1 | The report shall render one column per evaluator, with no computed consensus verdict |
| REQ-F-05.2 | Disagreement between evaluators shall be surfaced as information, not resolved automatically |
| REQ-F-05.3 | New evaluators shall be registrable via the existing plugin registry without modification to existing evaluators |
| REQ-F-05.4 | Each result shall record which evaluator, which model, and which framework version produced it |

## 5.6 Prompt Studio

**REQ-F-06 — The service shall provide an interactive environment for prompt experimentation.**

*Source: Kazhian Muthusami, Product Owner Demo, Aug 14 — a "studio" concept on top of the service for the product team to explore prompts.*

| ID | Requirement |
|---|---|
| REQ-F-06.1 | Users shall be able to author or paste a prompt and execute it against a non-production Supervisor environment |
| REQ-F-06.2 | Output shall be automatically evaluated on submission |
| REQ-F-06.3 | Users shall be able to iterate on a prompt and compare results across iterations side by side |
| REQ-F-06.4 | Prompt experiments shall be savable and shareable within the team |

*Priority: deferred. Dependent on core platform stability.*

## 5.7 User Feedback Ingestion

**REQ-F-07 — The service shall accept end-user feedback from the Advisor Teammate chat interface and correlate it with judge verdicts.**

*Source: Product Owner Demo, Aug 14. Ian proposed enforcing feedback in the chat. Tom objected on the grounds that model governance cannot be imposed on end users and that mandatory prompts would reduce adoption. The discussion landed on occasional or random solicitation.*

| ID | Requirement |
|---|---|
| REQ-F-07.1 | Feedback collection shall be optional and solicited on a sampled basis, never mandatory |
| REQ-F-07.2 | The service shall expose an ingestion endpoint for feedback events keyed by trace ID |
| REQ-F-07.3 | Feedback shall be stored alongside the judge verdict for the same trace |
| REQ-F-07.4 | Judge-versus-user agreement rate shall be computed as a judge quality metric |

*Dependency: the Advisor Teammate UI team must implement the sampled feedback prompt. Sampling rate and trigger logic remain undecided.*

## 5.8 User Interface

**REQ-F-08 — The evaluation dashboard shall present traces in an inspectable, reviewable form.**

| ID | Requirement | Source |
|---|---|---|
| REQ-F-08.1 | Each trace shall be expandable to show Query, Retrieved Context, and Model Output as distinct panels | Design spec; current UI is a flat table |
| REQ-F-08.2 | Sidebar navigation shall be added | Bishal, UI review |
| REQ-F-08.3 | "Push to Overwatch" shall move from the header to individual trace rows | Bishal, UI review |
| REQ-F-08.4 | Evaluator Visibility, Rollout Telemetry, Judge/Suggestion labels, duplicate health indicators, timer, and latency card shall be removed | Bishal, UI review |
| REQ-F-08.5 | React components shall be split into separate files | Bishal, UI review |
| REQ-F-08.6 | A perturbation review section shall allow SMEs to inspect perturbed query variants and the resulting output changes | Model Team `perturbation.py` alignment |

## 5.9 Environment-Aware Redaction Handling

**REQ-F-09 — The service shall operate correctly against both redacted and unredacted trace data.**

*Source: Akiva, Product Owner Demo, Aug 14 — account numbers are currently redacted, which prevents comparison of account-level answers. A ticket is in progress to disable redaction in non-production while retaining it permanently in production. Akiva is submitting a written requirement to Tom for escalation.*

| ID | Requirement |
|---|---|
| REQ-F-09.1 | The service shall detect redacted fields and shall not produce a FAILED verdict solely because a value is redacted |
| REQ-F-09.2 | Where redaction prevents a meaningful assessment, the verdict shall be NOT_EVALUABLE rather than PASSED or FAILED |
| REQ-F-09.3 | Non-production evaluation shall support account-level comparison once the redaction change is delivered |
| REQ-F-09.4 | Production monitoring shall retain a viable evaluation path under permanent redaction |

---

# 6. Integration Requirements

## 6.1 API Contract

**REQ-API-01 — The service shall expose a versioned REST API consumed by the Model Team and other WIMT teams.**

*Confirmed direction of consumption (Aug 3): the Model Team calls this service's interface.*

**REQ-API-02 — The API shall support three trace extraction levels.**

*Source: Rohan Sharma's volume analysis at 20,000-user load.*

| Level | Typical Volume | Delivery Mode |
|---|---|---|
| Prompt-level | ~1 row | Synchronous JSON response |
| Thread-level | ~400 rows | Synchronous JSON response |
| Time-range | ~200,000 rows | Asynchronous job; result delivered by reference |

**REQ-API-03 — The API response contract shall not assume a fixed payload shape.**

*Source: Rohan Sharma — evaluation results are probabilistic rather than deterministic, and statistical evaluations measure behaviour across jobs and distribution spread. Responses may be a series of files or extractions.*

Requirements:
- Small results are returned inline
- Large results are returned as a reference (signed URL or object key) that the consumer fetches
- The consumer's file-reading step accepts a URL in place of a local path — the single agreed change on the Model Team side

**REQ-API-04 — Long-running evaluations shall use asynchronous job tracking.**

*Source: Rohan Sharma's technical recommendation.*

| ID | Requirement |
|---|---|
| REQ-API-04.1 | Job submission shall return a job identifier immediately |
| REQ-API-04.2 | Job status shall be pollable, exposing state, progress, and partial results where available |
| REQ-API-04.3 | Completed jobs shall expose result location and expiry |
| REQ-API-04.4 | Jobs shall be cancellable |

**REQ-API-05 — The service shall support service discovery.**

*Source: Rohan Sharma's technical recommendation.* Consumers shall be able to discover available evaluators, supported test types, and API capabilities at runtime rather than through out-of-band documentation.

**REQ-API-06 — The API shall be documented via OpenAPI/Swagger, published and versioned.**

## 6.2 Enterprise Platform Interoperability

**REQ-API-07 — The service shall expose artefacts consumable by the Enterprise Risk Oversight Engine.**

*Source: David Mosciatti's positioning. Freddy Lecue confirmed (Aug 10) that the enterprise platform covers production model monitoring and model validation, with users in first and second line, and that UAT data is being connected for limited pre-production visibility.*

**Boundary:**

| Concern | Owner |
|---|---|
| Shift-left development evaluation | Supervisor Evaluation Service (this service) |
| Production model monitoring | Enterprise Risk Oversight Engine |
| MRM formal validation | Second line, using Model Team framework outputs |

**Approach:** Rather than integrating with the enterprise platform's UI, this service shall expose artefacts — prompts, judge configurations, evaluation results, golden datasets — that the enterprise platform can pull, feeding their process rather than duplicating it.

*Action pending: David is taking a requirements list to Freddy to establish which items fall within enterprise scope. Anything out of scope defines what WIMT builds on this service.*

## 6.3 Overwatch Integration

**REQ-API-08 — The service shall continue to fetch traces from Tachyon Overwatch via GraphQL and shall push annotations back where the feature switch permits.**

**REQ-API-09 — The service shall degrade gracefully when Overwatch is unavailable, serving previously snapshotted traces from local storage.**

---

# 7. Non-Functional Requirements

## 7.1 Performance

| ID | Requirement | Target |
|---|---|---|
| REQ-NFR-01 | Prompt-level evaluation latency (p95) | < 15 seconds |
| REQ-NFR-02 | Thread-level evaluation latency (p95) | < 3 minutes |
| REQ-NFR-03 | UI dashboard initial load (p95) | < 2 seconds |
| REQ-NFR-04 | API response time for cached KPI scores (p95) | < 500 ms |
| REQ-NFR-05 | Time-range extraction job completion (200k rows) | < 4 hours |

## 7.2 Scalability

| ID | Requirement |
|---|---|
| REQ-NFR-06 | The service shall scale horizontally on OCP; evaluation workers shall be independently scalable from the API tier |
| REQ-NFR-07 | The service shall handle concurrent evaluation jobs from multiple teams without cross-tenant interference |
| REQ-NFR-08 | Storage design shall accommodate growth to 200,000 traces per extraction at 20,000-user load |

## 7.3 Reliability

| ID | Requirement |
|---|---|
| REQ-NFR-09 | Service availability target: 99.5% during business hours (UAT and production) |
| REQ-NFR-10 | Evaluation jobs shall be idempotent — re-running a job with identical inputs shall not duplicate stored results |
| REQ-NFR-11 | Jobs shall checkpoint progress so that a failure mid-run resumes rather than restarts |
| REQ-NFR-12 | LLM judge calls shall implement retry with exponential backoff and a circuit breaker on sustained failure |
| REQ-NFR-13 | Database backups shall run daily with a recovery point objective of 24 hours |

## 7.4 Cost Efficiency

| ID | Requirement |
|---|---|
| REQ-NFR-14 | Cheap heuristic pre-filters shall run before LLM judge calls, avoiding LLM spend where a deterministic check suffices |
| REQ-NFR-15 | The service shall record per-evaluation token consumption and cost, aggregated per job and per team |
| REQ-NFR-16 | Configurable spend limits shall halt scheduled jobs on breach and alert the owning team |

*Context: cost sensitivity is established — Advisor Teammate figures show Gemini Pro at $0.74 per scenario against Flash at $0.07, translating to $11,100 versus $1,750 per month at 50 users and 10 scenarios per day.*

## 7.5 Maintainability

| ID | Requirement |
|---|---|
| REQ-NFR-17 | Evaluators shall be added via the plugin registry without modification to the core evaluation pipeline |
| REQ-NFR-18 | All environment-specific values shall be externalised as configuration, never hardcoded |
| REQ-NFR-19 | Unit test coverage shall meet or exceed 80% on core evaluation and persistence paths |
| REQ-NFR-20 | The codebase shall reside in a dedicated repository, separate from the shared dev repository |

*REQ-NFR-20 source: Kaz's direction, Aug 11.*

## 7.6 Portability

| ID | Requirement |
|---|---|
| REQ-NFR-21 | The service shall be deployable by another WIMT team against their own Overwatch space, model endpoints, and evaluation thresholds, with configuration change only |
| REQ-NFR-22 | Deployment documentation shall be sufficient for a team to provision an instance without support from the authoring team |
| REQ-NFR-23 | The service shall be onboardable through the Orchestra IDP |

---

# 8. Security & Compliance Requirements

## 8.1 Access Control

| ID | Requirement |
|---|---|
| REQ-SEC-01 | Access shall be governed by role-based access control integrated with Wells Fargo enterprise identity |
| REQ-SEC-02 | Roles shall distinguish at minimum: Viewer (read results), SME Reviewer (annotate and curate), Operator (trigger jobs), Administrator (configure evaluators and schedules) |
| REQ-SEC-03 | Golden dataset publication shall require SME Reviewer privilege or above |
| REQ-SEC-04 | Production environment access shall be restricted separately from non-production |

## 8.2 Data Protection

| ID | Requirement |
|---|---|
| REQ-SEC-05 | Data shall be encrypted in transit (TLS 1.2 or above) and at rest |
| REQ-SEC-06 | All secrets shall be managed through Vault; no credential shall appear in source, configuration files, or container images |
| REQ-SEC-07 | Production redaction shall be preserved; the service shall not attempt to reverse or reconstruct redacted values |
| REQ-SEC-08 | Trace snapshots containing client data shall be subject to the same handling controls as the source system |

## 8.3 Auditability

| ID | Requirement |
|---|---|
| REQ-SEC-09 | Every state-changing action shall be recorded in an immutable audit log with actor, action, target, and timestamp |
| REQ-SEC-10 | Evaluation results shall be immutable; corrections shall be recorded as new records referencing the original |
| REQ-SEC-11 | Each evaluation record shall identify the evaluator, judge model, model version, and framework version used, so that any historical result is reproducible |
| REQ-SEC-12 | SME overrides shall record reviewer identity and justification |

## 8.4 Data Classification

**REQ-SEC-13 — Traces and derived artefacts shall be data-classified before production use.**

*Status: OPEN. Raised by the Model Team in the Aug 3 meeting. No owner assigned. Requires escalation — this is a gating item for production deployment.*

---

# 9. Observability & Operations

| ID | Requirement |
|---|---|
| REQ-OPS-01 | The service shall expose health and readiness endpoints consumable by OCP probes |
| REQ-OPS-02 | Structured logs shall be emitted with correlation IDs traceable across API, worker, and framework layers |
| REQ-OPS-03 | The service shall emit metrics for job throughput, evaluation latency, judge error rate, queue depth, and cost per job |
| REQ-OPS-04 | Alerts shall fire on: scheduled job failure after retry exhaustion, judge error rate above threshold, database connectivity loss, and spend limit breach |
| REQ-OPS-05 | The service shall instrument itself with OpenTelemetry, consistent with the OpenInference conventions already used for trace ingestion |
| REQ-OPS-06 | A runbook shall document failure modes, diagnostic steps, and escalation contacts |

---

# 10. Constraints & Dependencies

## 10.1 Hard Constraints

| ID | Constraint | Impact |
|---|---|---|
| C-01 | Overwatch retention is two weeks | Local snapshotting is mandatory (REQ-DATA-01, REQ-DATA-05) |
| C-02 | Production redaction is permanent | Account-level comparison unavailable in production (REQ-F-09) |
| C-03 | Model Team cannot deploy or operate services | WIMT owns all infrastructure (REQ-INF-01) |
| C-04 | Account balances change over time | Point-in-time evaluation only (REQ-DATA-06) |
| C-05 | LLM-as-Judge alone does not satisfy MRM | Human annotation workflow required (REQ-F-03) |
| C-06 | No release train, no sandbox | Lower region is mainline; promotion to UAT for product access |

## 10.2 External Dependencies

| ID | Dependency | Owner | Status |
|---|---|---|---|
| D-01 | Redaction change for non-production | Akiva | In progress; written requirement to Tom pending |
| D-02 | Sampled feedback prompt in Advisor Teammate chat | Advisor Teammate UI team | Not started; design undecided |
| D-03 | Enterprise platform scope confirmation | David / Freddy Lecue | David has written to Freddy; gap analysis pending |
| D-04 | Data classification decision | Unassigned | Open — requires escalation |
| D-05 | Dedicated Overwatch space ID | Platform team | Not requested |
| D-06 | Model Team framework adapter change (URL-based file read) | Model Team | Agreed in principle |
| D-07 | Model Team curated dataset for initial integration | Model Team | Available — identified as practical starting point |

---

# 11. Open Items & Risks

## 11.1 Open Items

| # | Item | Owner | Raised |
|---|---|---|---|
| O-01 | Feedback sampling rate, trigger logic, and UI treatment | Tom / Product Team | Aug 14 |
| O-02 | Data classification of traces and stored artefacts | Unassigned | Aug 3 |
| O-03 | Which artefacts the enterprise platform will consume | David / Freddy | Aug 10 |
| O-04 | Whether Eric Andrei's framework POC merges into this service | David / Eric | Aug 3 |
| O-05 | Production account-level comparison approach under permanent redaction | Akiva / Tom | Aug 14 |
| O-06 | Scope of the first incremental integration slice with the Model Team | Rahul / Kibashini | Aug 3 |

## 11.2 Risks

| # | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-01 | Data classification remains unowned and blocks production deployment | High | Medium | Escalate to Kaz and David for owner assignment |
| R-02 | Overlap with the enterprise platform leads to duplicated investment | High | Medium | David's requirements-led conversation with Freddy establishes the boundary before further build |
| R-03 | Model Team framework changes break the adapter | Medium | Medium | Version pinning; framework version recorded per result; contract tests in CI |
| R-04 | Scheduled evaluation cost grows unbounded at scale | Medium | Medium | Heuristic pre-filters, per-team spend limits, cost telemetry (REQ-NFR-14 to 16) |
| R-05 | Scope expansion beyond the agreed incremental slice | Medium | High | Kibashini's stated preference for a small first implementation is honoured; roadmap phased |
| R-06 | Single-engineer key person dependency | High | High | Documentation, dedicated repository, IDP onboarding path, knowledge transfer to team |

---

# 12. Delivery Roadmap

## Phase 0 — Foundation (Weeks 1–2)

| Item | Requirement |
|---|---|
| Migrate to dedicated repository | REQ-NFR-20 |
| Close open JIRA subtasks with OCP evidence attached | Kaz's direction, Aug 11 |
| Promote to UAT and grant Product Team access | REQ-INF-03, Tom's ask |
| Request dedicated Overwatch space ID | REQ-INF-05 |

## Phase 1 — Persistence (Weeks 3–8)

| Item | Requirement |
|---|---|
| MongoDB provisioning and collection design | REQ-DATA-02, REQ-DATA-03 |
| Trace snapshotting at fetch time | REQ-DATA-05 |
| Immutable evaluation record storage | REQ-DATA-04 |
| Audit log foundation | REQ-SEC-09 |

*Phase 1 is the critical path — REQ-F-01, REQ-F-02, REQ-F-03, REQ-F-07, and REQ-DATA-06 all depend on it.*

## Phase 2 — Confirmed Product Targets (Weeks 6–14)

| Item | Requirement |
|---|---|
| Scheduled evaluation jobs and KPI dashboard | REQ-F-01 |
| Golden dataset builder with export | REQ-F-02 |
| Point-in-time evaluation semantics | REQ-DATA-06 |
| UI cleanup and richer trace inspection view | REQ-F-08 |

## Phase 3 — Model Team Integration (Weeks 12–22)

| Item | Requirement |
|---|---|
| Framework hosting and adapter layer | REQ-INT-02, REQ-INT-03, REQ-INF-01 |
| Asynchronous job API with three extraction levels | REQ-API-02, REQ-API-04 |
| Multi-evaluator comprehensive report | REQ-F-05 |
| Human annotation workflow | REQ-F-03 |
| Targeted change-management tests | REQ-F-04 |

*Scope of the first slice to be agreed with Kibashini, honouring her preference for a small initial implementation.*

## Phase 4 — Extension (Weeks 20+)

| Item | Requirement |
|---|---|
| Prompt Studio | REQ-F-06 |
| Enterprise platform artefact exposure | REQ-API-07 |
| WIM-wide deployable kit and IDP onboarding | REQ-INF-04, REQ-NFR-21 to 23 |
| Perturbation review | REQ-F-08.6 |
| User feedback ingestion | REQ-F-07 (dependent on D-02) |

---

# 13. Appendix

## 13.1 Requirement Index

| Category | Range | Count |
|---|---|---|
| Integration approach | REQ-INT-01 to 04 | 4 |
| Infrastructure | REQ-INF-01 to 05 | 5 |
| Data persistence | REQ-DATA-01 to 06 | 6 |
| Functional | REQ-F-01 to 09 | 9 (43 sub-requirements) |
| API & integration | REQ-API-01 to 09 | 9 |
| Non-functional | REQ-NFR-01 to 23 | 23 |
| Security & compliance | REQ-SEC-01 to 13 | 13 |
| Operations | REQ-OPS-01 to 06 | 6 |
| **Total** | | **75 requirements** |

## 13.2 Current System Baseline

| Attribute | Current State |
|---|---|
| Architecture | `routers/` → `services/` → `connectors/` → `evaluators/` → `core/` |
| Stack | FastAPI, uvicorn, pydantic-settings, arize-phoenix[evals] |
| Interfaces | REST plus SSE streaming |
| Judge model | claude-4-5-sonnet |
| Suggestion model | gemini-2.5-flash |
| Registered evaluators | Hallucination (LLM-as-Judge), Response Length (heuristic) |
| Persistence | None — stateless |
| Deployment | OCP, Garland 6, lower region |
| UI | Flat results table (`static/live.html`) |
| Local benchmark accuracy | 74% |

## 13.3 Model Team Framework Reference

**Repository:** NONAPP-RIFAMCOE-AI-TEAMMATE-MAIN

**Architecture:** CLI batch framework with argparse dispatcher; three-phase pipeline (pre → traces → post); parquet checkpointing; websocket-based Supervisor calls.

**Test types (11):** Hallucination, Sensitivity, Generation, Retrieval, Prompt, Performance, Explainability, Key Parameters, Tool Correctness, Replication, Cyber Guardrail.

**Datasets:** cyber_jailbreak_dataset, hallucinated_dataset, perturbated_dataset, plus train/test/validation splits from user_queries_samples.

**Evaluation methods per test:** each result file combines LLM evaluation, cosine similarity, and human evaluation. Explainability additionally uses TF-IDF cosine similarity; key parameter tests additionally use ROUGE.

## 13.4 Stakeholder Positions

| Stakeholder | Role | Position |
|---|---|---|
| Tom | Product Owner | Endorsed the service; wants continuous KPI scoring and product-team golden dataset curation; opposes mandatory user feedback |
| Kazhian Muthusami | Principal Engineer | Confirmed production use and golden dataset role; directed new repository, UAT promotion, JIRA closure; proposed Prompt Studio |
| David Mosciatti | US Tech Lead | Confirmed own-ecosystem persistence as a hard requirement; positions this service as shift-left against enterprise production monitoring; wants a WIM-wide deployable |
| Kibashini Periasamy | Model Team | Confirmed three use cases; requires human annotation regardless of model-versus-model results; asked for a small first implementation |
| Rohan Sharma | Solution Engineering | Ruled out judge arbitration; specified extraction levels and payload variability; recommended async job tracking and service discovery |
| Akiva | Product | Raised redaction as a blocker for account-level comparison; escalating a written requirement to Tom |
| Freddy Lecue | Enterprise / Second Line | Confirmed enterprise platform covers production monitoring and model validation; open to collaboration; cautions against duplicated investment |
| Deepak Elias | Solution Engineering Lead | Phase 2 golden dataset builder objective aligns with REQ-F-02 |

---

*End of document. Review by Kazhian Muthusami and David Mosciatti requested before wider distribution. Approved requirements to be converted into JIRA stories under BZSD-333.*
