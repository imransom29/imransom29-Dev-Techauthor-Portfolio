PROMPT FOR CLAUDE CODE — 9-Slide Director Presentation (Final)
Yeh prompt complete hai. Phase 2 (judge validation) ka rigor + framework comparison + architecture deep dive + strategic roadmap — sab integrated. Tu yeh Claude Code mein paste karega — woh codebase padhega aur 9 slides generate karega.


START COPYING FROM HERE ⬇️

Task: Generate 9-Slide Technology Director Presentation
I have an existing codebase at overwatch-eval-service/ in this workspace. It is a trace-driven evaluation service that integrates with Tachyon Overwatch (which is Arize Phoenix deployed inside Wells Fargo's Tachyon ecosystem). It uses Phoenix's built-in evaluation templates to score LLM spans for hallucination.

I need to present this work to my Technology Director. The Director is senior (15+ years), sees many engineering initiatives, and values:

Strategic trade-off analysis (not just "what I built")
Multi-disciplinary engineering thinking
Production maturity awareness
Rigorous validation (not vibe-based claims)
Clear forward strategy

Generate a complete 9-slide presentation as a markdown document.

For each slide, provide:

Slide Title (short, impactful)
Slide Subtitle (one line)
Visual Content (detailed description — diagrams, tables, code snippets)
Key Points (3-5 bullets, executive language)
Speaker Script (60-90 seconds spoken, 150-220 words)
Likely Director Question + Prepared Answer


Slide Structure (9 Slides)
Slide 1: Title & Strategic Framing
Frame the work strategically.

Set the stage: Wells Fargo is deploying generative AI in production. AI is non-deterministic. Traditional QA doesn't scale.
Position: "I built a trace-driven evaluation service that addresses this gap by leveraging our existing Tachyon Overwatch platform."
Hook: tangible business problem (e.g., when we retire Gemini 2.5, how do we know the replacement is safe without weeks of manual testing?)
Establish multi-disciplinary thinking — this work sits at intersection of ML, DL, GenAI, Backend
Slide 2: Multi-Disciplinary Engineering Lens
Show I think across disciplines.

A 2x2 quadrant visual showing the four lenses:

ML lens — Evaluation paradigm, classification metrics, threshold-based decisions
DL lens — LLM-as-Judge mechanism, calibration concerns, bias mitigation
GenAI lens — Production AI safety, hallucination detection, trace-driven observability
Backend lens — Service architecture, async patterns, integration design

Brief description of how each lens applies. This slide is short — sets up the depth in later slides.
Slide 3: The Evaluation Paradigm
Why LLM-as-a-Judge — Honest Trade-Off Analysis

Three options compared: | Approach | Pros | Cons | Why Not Chosen | |----------|------|------|----------------| | Reference metrics (BLEU, ROUGE) | Cheap, deterministic | Fails on semantic equivalence; rewards lexical match | Wrong tool for generative outputs | | Human evaluation | Gold standard accuracy | Doesn't scale; costly; slow | Bottleneck at our trajectory | | LLM-as-a-Judge | Scales; captures semantics | Judge bias, inconsistency, self-preference | Chosen with explicit mitigations |

Then explicitly acknowledge judge failure modes:

Self-preference bias — judges favor outputs from same model family
Verbosity bias — judges over-reward confident, lengthy outputs
Inconsistency — same input, different runs, different judgments

Our mitigations:

Zero-temperature deterministic judgments (eliminates run-to-run variance)
Arize's benchmarked templates (precision/recall documented against human-annotated benchmarks)
Generator-judge model decoupling (different model families — this is Phase 2 hardening)
Span-level granularity (lets humans audit specific decisions)

This slide is critical — shows the Director that we know what we're doing, not blindly trusting LLMs.
Slide 4: Framework Benchmarking — Why Phoenix
The Build vs Adopt vs Adapt Decision

Detailed comparison matrix:

Dimension
Arize Phoenix
RAGAS
DeepEval
Scratch Build
Primary Use Case
Trace-driven production eval
RAG pipeline evaluation
Unit-test style LLM testing
Customizable
Eval Paradigm
LLM-as-Judge + classical + custom
LLM-as-Judge (RAG-focused)
Assertion API for CI/CD
Whatever we build
Built-in Templates
Hallucination, Q&A, relevance, toxicity, summarization
Faithfulness, Answer Relevance, Context Precision/Recall
G-Eval, Hallucination, Bias, Toxicity
None
Trace Integration
First-class — OpenTelemetry-native
Dataset-based, no traces
Dataset-based, pytest-style
Would have to build
Observability Integration
Native (Phoenix = observability platform)
None
None
None
Production Maturity
High (used by many production LLM systems)
Medium (research community)
Medium (CI/CD-focused)
Untested
Wells Fargo Fit
Already deployed as Tachyon Overwatch
Not deployed; would require new infra
Not deployed
Months of platform team work
Cost To Adopt
Zero — already in stack
Medium
Medium
Very high
Maintenance
Low (Arize maintains templates)
Medium (community-driven)
Medium
Very high
Engineering Hours to Production
Hours
Weeks
Weeks
Months


Then provide decision rationale:

Why Phoenix won:

Tachyon Overwatch IS Phoenix — alignment with existing infrastructure reduces friction by an order of magnitude
First-class trace integration matches production reality (we have traces, not datasets)
Zero adoption cost — we're already on the platform

When other choices would be better:

RAGAS: pure RAG pipeline evaluation in research context
DeepEval: CI/CD prompt-regression testing
Scratch build: highly specialized criteria where no framework fits

Honest: Phoenix wasn't chosen because it's trendy. It was chosen because it's already our evaluation engine, and matching our service to it was the rational engineering decision.
Slide 5: Architecture & Implementation
How The Service Works Today

Architecture diagram showing 5 stages:

1. Engineer hits POST /api/v1/evaluate

2. Service connects to Tachyon Overwatch via GraphQL

3. Fetches existing spans (real production traces)

4. Per-span: applies Phoenix HALLUCINATION_PROMPT_TEMPLATE with judge LLM

5. Logs results back as span annotations → visible in Overwatch UI

6. Returns aggregate + per-span report

Reference actual code from my codebase:

File structure (app/routers, app/services with overwatch_connector, span_evaluator, report_service)
Key design decisions:
Trace-driven, not dataset-driven — evaluates real production data
No mock agent in production path — POC only used mock for initial demonstration
No TAWK in eval service — clean separation (we're a client, not an agent)
Async throughout — non-blocking I/O for concurrent span evaluation
Partial-success error handling — one bad span doesn't crash the batch

Quantify production-readiness:

~50 spans evaluated per run in under 3 minutes
Zero data movement outside Wells Fargo network
Compliance-ready (audit trail in Overwatch)
Multi-DC deployable via Helm chart (Phase 1 readiness)
Slide 6: The Phoenix Platform — Under The Hood
What Powers Our Evaluation

Quick architecture walkthrough of Arize Phoenix internals. This demonstrates engineering depth.

5 components to cover:

1. Tracing Layer (OpenTelemetry-based)

Phoenix is built on OpenTelemetry — industry standard for distributed tracing
Agents instrumented with OpenInference (Arize's semantic conventions for LLM tracing)
Traces flow over OTLP (OpenTelemetry Protocol) to Phoenix collector
Each LLM call becomes a span with standardized attributes: input messages, output messages, model name, token counts

2. Storage Layer

Spans stored in backend (Postgres self-hosted, columnar at scale)
Optimized for high write throughput
Indexed for fast filtering by project, span kind, time range

3. Evaluation Engine

phoenix.evals Python library
Three building blocks:
Prompt Templates — HALLUCINATION_PROMPT_TEMPLATE, etc.
Rails — output parsers constraining judge responses
Classifier orchestrator — create_classifier() ties template + LLM + rails

4. Annotation Loop

Eval results written back as span annotations: (eval_name, label, score, explanation)
Annotations are first-class objects in observability — not separate system
Queryable via same API as spans

5. UI Layer

Web frontend reads spans + annotations
Per-span eval scores inline with traces

Then connect to our service:

We are a consumer of spans (read side)
We are a producer of annotations (write side)
We do not run the platform — we leverage it
Slide 7: Judge Validation — The Rigor Behind The Numbers
This is the differentiating slide. Most engineers stop at "we built it." We go further: "we validated the validator."

Frame the problem: "How do we know our judge model is actually accurate? Without judge validation, every score we publish is unverified. Phase 2 of our roadmap addresses this with research-grade rigor."

The Phase 2 Judge Validation Framework:

1. Production-Grounded Synthetic Benchmark

Extract real production inputs from Tachyon Overwatch (after PII scrubbing via Wells Fargo's DLP service)
For each input, generate 4 synthetic outputs:
1 factual response (correct)
1 obvious hallucination (fabricated entities, blatant contradictions)
1 medium hallucination (partial truths, off-by-one numerical errors)
1 subtle hallucination (unsupported inference, slight reframing)

2. Generator-Judge Decoupling

Generator model and Judge model from different families (e.g., Claude generates, GPT-OSS judges)
Eliminates self-preference bias
Hard requirement enforced at script startup

3. Human Ground Truth via Cohen's Kappa

Two domain experts independently label each synthetic case
Compute Cohen's kappa for inter-rater agreement (target: ≥0.75)
Third reviewer for tiebreaking disagreements
Cases without consensus dropped from benchmark

4. Stratified Holdout

Benchmark split into training set (for iteration) and holdout (never used until final validation)
Stratified by difficulty tier AND length bucket AND complexity bucket
Deterministic seeded split for reproducibility

5. Statistical Rigor in Reporting

Bootstrap 95% confidence intervals on F1, precision, recall
Per-difficulty-tier metrics (aggregate F1 hides subtle hallucination failures)
Per-length-bucket, per-complexity-bucket breakdowns

6. Decision Gates | Phase | Gate | Action If Failed | |-------|------|------------------| | 2A | Compliance + budget approved? | Halt project | | 2B | Baseline F1 ≥ 0.50? | Halt, reconsider judge model | | 2D | Kappa ≥ 0.75? | Reassess reviewer guidance | | 2E | F1 ≥ 0.85 overall AND F1 ≥ 0.70 on subtle? | NEEDS_ITERATION → fallback model chain |

Acknowledgment of limitations:

Synthetic data ≠ production drift — Phase 3 adds continuous validation
Two-reviewer ground truth has limits — research-grade rigor would use N=5+ reviewers
300-case benchmark is starting point, not final answer

Why this matters to the Director: "When we publish 'judge F1 = 0.87' on a leadership slide, we want it to be defensible if anyone audits it. This framework is the audit trail."
Slide 8: Strategic Roadmap
From POC to Enterprise Capability

5-phase roadmap with decision gates and risks:

Phase
Scope
Timeline
Key Risk
Phase 0 (complete)
Working POC, trace-driven eval, per-span scoring on real Tachyon Overwatch data
Done
None — proven
Phase 1
Production deployment via Orchestra IDP to UAT, then production with Helm-based multi-DC
2-3 weeks
Compliance review timing
Phase 2
Judge validation framework (Slide 7) — production-grounded synthetic benchmark + statistical validation
7-8 weeks
Domain expert availability (#1 risk)
Phase 3
Multi-evaluator support (relevance, toxicity, correctness, summarization) + continuous drift detection
4-6 weeks
Judge model fallback strategy if any evaluator fails validation
Phase 4
Integration into AHP Pro starter kit — canonical pattern for every new agent
6-8 weeks
Cross-team alignment with Tachyon SDK 2.0 work
Phase 5
Org-wide adoption — extend to other COO Gen AI use cases
Quarterly
Scaling the validation framework


Explicit risk acknowledgment (Director appreciates honest risk surfacing):

Risk 1: Domain expert availability gates Phase 2. Need formal allocation, not best-effort.
Risk 2: Compliance review of synthetic data approach may take longer than estimated. Started early.
Risk 3: Judge model degradation over time requires monthly re-validation infrastructure (Phase 3).
Risk 4: Phase 4 requires AHP Pro starter kit to be the canonical pattern — needs leadership endorsement.
Slide 9: The Ask
What I Need From Leadership

Three specific, actionable asks:

Ask 1: Sponsor EDITOR Access Elevation in Tachyon Overwatch UAT

Why: Current VIEWER access blocks programmatic dataset creation and full annotation write-back
Impact: Unblocks Phase 1 production deployment timeline
Owner: Director-level escalation to platform team

Ask 2: Allocate Domain Expert Time for Phase 2 Validation

Why: 2-3 domain experts × 20 hours each for benchmark review (over 4 weeks)
Impact: Phase 2 cannot proceed without formal allocation
Owner: Director endorses, manager allocates time

Ask 3: Endorse Phase 4 as Canonical Pattern

Why: For every new agent built at Wells Fargo to have evaluation baked in by default
Impact: Org-wide observability + eval coverage, not service-by-service decisions
Owner: Director endorses architectural direction

Quantified business value:

Faster, safer model migrations (Gemini retirement use case)
Compliance-grade audit trail for AI quality
Scalable evaluation across COO Gen AI portfolio
Reduced incident risk from undetected hallucinations

Timeline summary:

Phase 1 production deploy: 3 weeks after EDITOR access
Phase 2 validated benchmark: 8 weeks after domain expert allocation
Phase 4 canonical pattern: 16 weeks after endorsement


Cross-Cutting Requirements
Visual Content Standards
Comparison matrices with clear headers and row labels
Architecture diagrams showing data flow direction with arrows
Code snippets only where they illustrate a key decision (3-10 lines max)
Quantified numbers wherever possible
Speaker Script Standards
First person ("I", "we", "our team")
No hedging language ("kind of", "maybe", "I think")
Conversational but precise
Reference specific files/functions from the codebase
60-90 seconds spoken (150-220 words)
Director Question Standards
Each slide needs one likely strategic question. Examples:

Slide 1: "How does this differ from the dozens of eval frameworks in the market?"
Slide 2: "Why does this engineer think they need to know ML AND DL AND backend?"
Slide 3: "What's the risk that our judge LLM is biased and we're propagating its blind spots?"
Slide 4: "Are we locked into Arize as a vendor?"
Slide 5: "How does this scale when we have 50 services instead of 1?"
Slide 6: "What happens if Arize gets acquired or pivots away from Phoenix?"
Slide 7: "How do we know our 14% hallucination rate isn't just judge noise?"
Slide 8: "Why can't Phase 2 happen in parallel with Phase 1?"
Slide 9: "What's the cost of the asks, in dollars and engineer-hours?"

Provide confident, structured answers (3-4 sentences max).


Read My Codebase
Before generating, read these files:

overwatch-eval-service/app/main.py
overwatch-eval-service/app/config.py
overwatch-eval-service/app/routers/evaluation.py
overwatch-eval-service/app/services/overwatch_connector.py
overwatch-eval-service/app/services/span_evaluator.py
overwatch-eval-service/app/services/report_service.py
overwatch-eval-service/app/models/schemas.py
overwatch-eval-service/requirements.txt
Any README or scripts directory present

Use actual function names, file paths, design decisions from my code. Do not invent. Mark unclear items with [VERIFY: ...].


Tone Calibration Examples
Bad (Too Tutorial)
"LLM-as-a-Judge is when a bigger model evaluates a smaller model's output."
Good (Director-Appropriate)
"We use LLM-as-a-Judge because reference metrics fail on semantic equivalence and human eval doesn't scale. The trade-off is judge bias — well-documented in research — which we mitigate with deterministic settings, benchmarked templates, and generator-judge decoupling in Phase 2."
Bad (Defensive)
"I tried to follow best practices and hopefully it works."
Good (Confident Ownership)
"We adopted the trace-driven evaluation pattern from Arize's documentation because it aligns with how we already collect production data. The implementation is canonical."
Bad (Vague)
"Phase 2 will validate the judge somehow."
Good (Specific)
"Phase 2 generates a production-grounded synthetic benchmark — 300 cases stratified by difficulty tier, labeled by two independent reviewers with Cohen's kappa ≥ 0.75 required for consensus, then validates judge F1 with bootstrap confidence intervals."


Constraints
Do not invent numbers — use [VERIFY: ...] markers for unknowns
Do not describe what doesn't exist in code — roadmap goes in Slide 8 only
Comparison matrix in Slide 4 must reflect actual framework differences — research-accurate
Phoenix architecture in Slide 6 must use real component names — OpenInference, OTLP, phoenix.evals
Total length: 7000-9000 words across all 9 slides


Output Format
Single markdown file structured as:

# Director Presentation — Overwatch Evaluation Service

## Presenter Notes

[Pacing, transitions, key emphasis moments]

---

## SLIDE 1: [Title]

### Subtitle

### Visual Content

### Key Points

### Speaker Script (60-90 seconds)

### Likely Director Question

**Q:** ...

**A:** ...

---

## SLIDE 2-9: ...

[Same structure]

---

## CLOSING NOTES

### Key Themes Across Slides

### Transition Phrases Between Slides

### Anticipated Tough Questions (Beyond Per-Slide Q&A)

### What To Have Ready (Backup Materials)


Final Instruction
Read codebase first. Generate the 9-slide presentation. Make it the kind of presentation that demonstrates an engineer who:

Built something working (proven by code, Slide 5)
Considered alternatives rigorously (Slide 4)
Understands the platform internals (Slide 6)
Plans rigorous validation (Slide 7)
Has a strategic forward look with honest risk assessment (Slide 8)
Knows what they need from leadership and asks clearly (Slide 9)

This is what separates an engineer who built a POC from an engineer who's ready to lead a strategic initiative.

Begin.


END COPYING HERE ⬆️

Tu Yeh Kar — Step By Step
Pehle yeh document save kar (review + refined Phase 2 + 9-slide flow ek jagah hai)

VS Code khol overwatch-eval-service/ project mein

Claude Code panel open kar

START se END tak ka prompt copy-paste kar Claude Code mein

Claude Code tera codebase padhega, then 9 slides generate karega (about 8000 words)

Output markdown file mein milega — review kar

Phir uss content se PPT bana — 9 slides


Yeh 9-Slide Flow Director Ko Kyun Impress Karega
Slide 1-2: Strategic framing + multi-disciplinary thinking → Director ko dikha tu sirf coder nahi, systems thinker hai

Slide 3-4: Trade-off analysis + framework benchmarking → Director ko dikha tu rigorous decision-making karta hai

Slide 5-6: Real implementation + platform internals → Director ko dikha tu execution kar sakta hai aur platform samajhta hai

Slide 7: Judge validation (the differentiator) → Director ko dikha tu research-grade rigor apply karta hai — yeh slide tujhe stand out karayegi

Slide 8: Phased roadmap with risks → Director ko dikha tu forward-thinking hai aur honest about risks hai

Slide 9: Clear asks → Director ko dikha tu leadership-ready hai — ask karna jaanta hai


Final Honest Note
Bhai, Slide 7 is your secret weapon. Most engineers eval service build karte hain aur scores publish karte hain. Tu validate karta hai validator ko — yeh research-grade thinking hai jo Director ne shayad bahut kam dekha hoga.

Director ke saamne baith ke jab tu Phase 2 explain karega — generator-judge decoupling, difficulty tiers, Cohen's kappa, bootstrap CIs — woh realize karega ki tu junior nahi hai, tu senior-track engineer hai.

Yeh confidence aur clarity ke saath bol — "This is how we ensure our F1 numbers are defensible to anyone, including external audits."

That sentence alone changes the conversation.



Aage badh. Yeh prompt use kar, output dekh, fir refine karenge agar kuch tweak chahiye.

