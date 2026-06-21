![Uploading image.png…]()


in this workspace. It is a trace-driven evaluation service that integrates with Tachyon Overwatch (Arize Phoenix deployed at Wells Fargo).

I need to present this work to my Technology Director. The Director is senior and sees many engineering initiatives. To stand out, I want to explain my work from four engineering lenses simultaneously:


Machine Learning (ML) perspective — what evaluation paradigm, metrics, validation philosophy
Deep Learning (DL) perspective — how LLM judges work, why LLM-as-a-Judge, reliability concerns
Generative AI (GenAI) perspective — production AI safety, hallucination detection, observability for non-deterministic systems
Backend Engineering perspective — service architecture, API design, async patterns, integration choices


PLUS — I want to demonstrate landscape awareness by including:


Arize AI backend deep-dive — how Arize/Phoenix actually works under the hood
Framework comparison — Arize Phoenix vs RAGAS vs DeepEval vs scratch-built evaluation
Scratch-built alternative architecture — what we would build if we started from zero, and why we didn't


Generate a complete 9-slide presentation as a markdown document.

For each slide, provide:


Slide Title (short, impactful)
Slide Subtitle (one line, descriptive)
Visual Content (described in detail — diagrams, tables, code snippets if relevant)
Key Points (3-5 bullets, executive language)
Speaker Script (verbal walkthrough, 60-90 seconds per slide, conversational but professional)
Likely Director Question + Prepared Answer (one strategic question per slide)



Audience Profile (Important — Tailor Tone To This)

The Technology Director:


Has 15+ years of engineering experience
Cares about: business outcomes, risk management, scalability, engineering rigor, team leverage
Does NOT want: tutorial-level code details, framework-internals deep dives, defensive language
Wants to see: strategic thinking, multi-disciplinary understanding, production maturity awareness, landscape awareness
Has limited time — every slide must earn its place



Slide Structure Required (9 Slides Total)

Slide 1: Title & Framing


Set the stage — what is being built and why it matters strategically
Position the speaker as someone thinking across multiple disciplines AND aware of the broader ecosystem
Hook with a tangible business problem the service solves


Slide 2: The ML Lens — What Evaluation Paradigm Did We Choose


Explain the evaluation approach from classical ML perspective
Compare evaluation paradigms: human evaluation, reference-based metrics (BLEU, ROUGE, BERTScore), LLM-as-a-Judge
Why we chose what we chose, with trade-off analysis
Metric definitions and threshold rationale (PASS < 5%, REVIEW 5-10%, FAIL > 10%)
Show maturity: discuss precision/recall implications of evaluator choice
Mention concept of "evaluator drift" and how we account for it


Slide 3: The DL Lens — Why LLM-as-a-Judge Works (and Where It Doesn't)


Explain LLM-as-a-Judge mechanism from deep learning standpoint
Why a transformer-based judge can evaluate another transformer's output
Calibration concerns, judge bias, judge consistency
Why we chose gpt-oss-20b as judge model — context window, reasoning capability, cost
Mitigations we implemented for known LLM-judge failure modes:

Temperature = 0 for determinism
Rails (constrained output via HALLUCINATION_PROMPT_RAILS_MAP)
Benchmarked template (Arize publishes precision/F1 on standard datasets)



Reference: Arize's benchmark on built-in template precision and F1
Discuss: when LLM-as-a-Judge fails (subjective tasks, judge weaker than evaluated model, multi-turn context)


Slide 4: The GenAI Lens — Production AI Safety & Hallucination Detection


Why hallucination is the #1 risk in production LLM systems for financial services
Traditional QA doesn't scale for non-deterministic AI
Trace-driven evaluation as the modern paradigm (vs synthetic dataset evaluation)
Per-span scoring vs aggregate scoring — why granularity matters operationally
Connection to Wells Fargo's broader observability strategy (Tachyon Overwatch + Power BI executive reporting)
Brief mention of related concerns: prompt injection, data leakage, output toxicity — and how this framework extends to those


Slide 5: Arize AI Backend Deep Dive — How Phoenix Actually Works

This slide is purely educational for the director — shows speaker's depth.


Origin: Arize AI is a commercial observability company; Phoenix is their open-source observability toolkit
Architecture: Phoenix backend is built on OpenTelemetry standards
Storage: Spans stored in columnar databases optimized for high-cardinality trace data
Query layer: GraphQL API for structured trace retrieval
Evaluation: Built-in templates are Python prompt strings + structured output parsing via Pydantic-style schemas
LLM provider abstraction: Phoenix's LLM class wraps OpenAI-compatible APIs (Azure, Anthropic, custom gateways like ours)
Tachyon Overwatch = Phoenix deployed inside Wells Fargo infrastructure (confirmed by Kaz)
Why this matters: We can use Phoenix's public docs/tutorials as authoritative reference for our internal platform


Slide 6: Framework Comparison — Arize Phoenix vs RAGAS vs DeepEval vs Custom

Use a comparison matrix. Show that we evaluated alternatives.

DimensionArize PhoenixRAGASDeepEvalScratch BuildPrimary focusTrace observability + evalRAG-specific evalUnit-test style evalAnything we wantTrace integrationNative (it IS the trace store)NoneNoneManual integrationBuilt-in evaluatorsHallucination, Relevance, Toxicity, User Frustration, RAG, QA CorrectnessFaithfulness, Context Recall, Context Precision, Answer RelevancyG-Eval, GEval, Custom Metrics, Bias, ToxicityWhatever we writeProduction deploymentDesigned for productionMore research/lab useCI/CD test integrationDepends on engineeringWells Fargo deployment✅ Already deployed as Tachyon Overwatch❌ Would need new platform❌ Would need new platform❌ Major buildLLM-as-Judge benchmarkingPublished precision/F1 on standard datasetsLimited published benchmarksSome published benchmarksWe'd need to do this ourselvesSpan-level integrationNativeBolt-onBolt-onWe build itTime to first evalHoursDaysDaysWeeks-MonthsLong-term maintenanceArize teamRAGAS communityConfident AI (Vendor)Wells Fargo team

Show why we chose Arize Phoenix:


Already deployed at Wells Fargo (Tachyon Overwatch)
Native trace integration eliminates ETL overhead
Battle-tested templates with published benchmarks
Aligns with broader Wells Fargo observability strategy


But honestly mention:


RAGAS would be better if we were RAG-only focused
DeepEval would be better for unit-test CI integration
Scratch would give maximum flexibility but at huge engineering cost


Slide 7: Scratch-Built Alternative — What We Avoided

This shows engineering maturity — "we considered building from zero and chose not to."

Architecture diagram of what we'd build from scratch:

[Scratch Eval Framework]

Data Layer:
- Custom span storage (PostgreSQL? Or columnar?)
- Schema design for traces, spans, evaluations
- ETL pipeline from Wells Fargo agent runtime

Evaluation Layer:
- Custom prompt template library
- Multi-model judge router
- Result aggregation engine
- Calibration/validation pipeline

Reliability Layer:
- Retry/backoff for judge LLM calls
- Cost tracking
- Rate limiting
- Caching of eval results

Observability Layer:
- Custom UI for browsing eval results
- Dashboard generation
- Alert engine for quality regressions
- API for downstream consumers

Compliance Layer:
- Audit logging
- PII redaction
- Data retention policies
- Access control

Estimated cost to build:


Engineering time: 12-18 months with a 3-engineer team
Maintenance overhead: 1 dedicated engineer ongoing
Risk: We'd be reinventing what Arize spent 4+ years building


Why we didn't:


Wells Fargo's value isn't in re-implementing observability infrastructure
Time-to-value: Phoenix gave us production-grade eval in days, not months
Quality: Arize's benchmarked templates outperform what a small team could build in similar time
Strategic alignment: Tachyon Overwatch is the COO-wide observability platform; standardizing on it is the right call


But preserved optionality:


Our span_evaluator.py abstracts the eval engine
Could swap to RAGAS or scratch implementation later without changing API contract
This is good architecture: depend on interfaces, not implementations


Slide 8: The Backend Lens — Service Architecture & Engineering Choices


Show the service architecture (high-level only) — the 5-stage pipeline
API design principles: REST endpoints, async patterns, separation of concerns
Integration approach: GraphQL to Overwatch, OpenAI-compatible gateway for judge
Key engineering decisions and their rationale:

Trace-driven vs dataset-driven (we chose trace-driven per Phoenix's recommended pattern)
No mock agent in eval service (real spans only)
No TAWK integration in eval service (it's a client, not an agent)
Stateless service design (horizontal scaling ready)



Error handling and reliability story (partial results > no results, every layer has try/except)
Connection back to the lens narrative: this is where ML/DL/GenAI insights become operational


Slide 9: How It All Comes Together + Strategic Forward Look


Show the complete request lifecycle in one slide
Tie back to all four lenses — where ML/DL/GenAI/Backend each show up
Quantify impact: how many spans evaluated, how fast, with what confidence [VERIFY from code]
Phased roadmap — what's next (Phase 1, 2, 3, 4)
How this scales to other Wells Fargo Gen AI use cases
Connection to the broader org strategy (AHP Pro, COO-wide observability vision)
The "ask" — what support is needed from leadership (EDITOR access, real agent endpoint, integration timeline)



Cross-Cutting Requirements

For Visual Content

When you describe visuals, be specific. For example:


"A 2x2 quadrant chart showing X axis: cost, Y axis: scalability, with quadrants labeled..."
"An architecture diagram showing 5 boxes connected by directional arrows..."
"A code snippet showing the exact lines from app/services/span_evaluator.py that demonstrate built-in template usage..."


When useful, embed actual code snippets from the codebase — but only short, illustrative ones (3-10 lines max).

For the comparison matrix in Slide 6, describe it as a table with specific row/column headers.

For the scratch-build architecture in Slide 7, describe it as a layered diagram with labeled components.

For Speaker Scripts


Write in first person ("I", "we", "our team")
Conversational but precise — like an experienced engineer briefing a director
No hedging language ("kind of", "maybe", "I think")
Use concrete numbers and examples
Reference specific files/functions from my codebase when relevant
Each script should be 60-90 seconds when spoken (roughly 150-220 words)


For Director Questions

Each slide should have one prepared question the Director is likely to ask. Make these questions:


Strategic (not tactical)
Pointed (a director would ask)
Slightly challenging (not softballs)


Examples of good director questions for each slide:

Slide 1: "How does this fit our overall AI strategy and roadmap?"
Slide 2: "If LLM-as-a-Judge has known biases, how do we trust the verdict for compliance-sensitive use cases?"
Slide 3: "What happens when the judge model itself hallucinates?"
Slide 4: "How is this different from what platform team is building for COO observability?"
Slide 5: "If we don't own the Phoenix codebase, what's our risk if Arize changes their open-source direction?"
Slide 6: "Why didn't we use RAGAS — I've heard it's the standard for RAG eval?"
Slide 7: "Twelve to eighteen months sounds aggressive — what if we'd taken three years and built it right?"
Slide 8: "What's the operational cost — engineer time, infra cost — to run this in production?"
Slide 9: "Who else at Wells Fargo is doing this — and can we partner instead of duplicate?"

Then provide a confident, structured answer (3-4 sentences max per question).


Reading My Codebase

Before generating the slides, please read these files in my workspace to understand what I built:


overwatch-eval-service/app/main.py — service entry
overwatch-eval-service/app/config.py — configuration
overwatch-eval-service/app/routers/evaluation.py — orchestration
overwatch-eval-service/app/services/overwatch_connector.py — how I fetch spans + log back
overwatch-eval-service/app/services/span_evaluator.py — how I use Phoenix built-in template
overwatch-eval-service/app/services/report_service.py — how I generate verdicts
overwatch-eval-service/app/models/schemas.py — data contracts
overwatch-eval-service/requirements.txt — dependencies


Use the actual function names, file paths, and design decisions from my code when generating slide content. Do not invent details. If something is unclear from the code, mark it with [VERIFY: ...] and I will clarify.


Tone Calibration Examples

Bad (Too Tutorial)


"LLM-as-a-Judge is a technique where a larger language model evaluates the output of a smaller language model. The judge reads the prompt and response, then decides if the response is correct."



Good (Director-Appropriate)


"We use LLM-as-a-Judge — a transformer evaluating another transformer's output — because human evaluation doesn't scale and reference-matching is too brittle. The trade-off is judge bias, which we mitigate through three controls: zero-temperature deterministic judgments, Arize's benchmarked template with documented precision-recall characteristics, and span-level granularity that lets domain experts spot-check judge outputs."



Bad (Defensive)


"I tried to follow the Phoenix tutorial as best I could and built something that hopefully works."



Good (Confident Ownership)


"We adopted the Phoenix evaluation pattern — fetch existing spans, score with built-in templates, write annotations back — because it's the canonical approach for trace-driven evaluation in our stack. The implementation aligns with how Arize themselves recommend evaluating production LLM traffic."



Bad (Vague Business Value)


"This will help engineers ship faster and catch more issues."



Good (Concrete Business Value)


"When the model team retires Gemini 2.5 next quarter, we'll evaluate the replacement against fifty curated test cases in under three minutes — versus the days of manual spot-checking that would otherwise be required. That's the difference between a controlled model migration and a risky one."



Bad (One-sided Framework Pitch)


"We chose Arize Phoenix because it's the best framework for everything."



Good (Balanced Engineering Judgment)


"We chose Arize Phoenix for three reasons: it's already deployed at Wells Fargo, it has native span integration, and its built-in templates come with published benchmarks. RAGAS would have been a stronger choice if we were RAG-only, and DeepEval has better CI/CD ergonomics. We made the right local-optimum decision for our context."




Constraints


Do not invent metrics or numbers that aren't in my code or reasonable to infer. If you need a number, mark it with [VERIFY].
Do not include architecture I haven't built — only describe what's actually in the code. If you want to suggest future work, put it in Slide 9's roadmap section.
Keep tech jargon balanced — use terms a director would know, define ones they wouldn't.
Each slide should stand alone — if the Director only sees one slide, it should still convey value.
Framework comparison must be balanced — don't trash RAGAS or DeepEval; explain why Arize fits OUR context.
Scratch-build slide is about engineering maturity — show we considered it, not that we dismissed it.
Total length: 9 slides × (description + key points + script + Q&A) — approximately 6000-8000 words total.



Output Format

Generate a single markdown file with this structure:

markdown# Multi-Perspective Director Presentation — Overwatch Evaluation Service

## Presenter Notes
[Brief notes on how to present this — pacing, transitions, key moments to emphasize]

---

## SLIDE 1: [Title]

### Subtitle
[One-line descriptor]

### Visual Content
[Detailed description of what's on the slide]

### Key Points
- Point 1
- Point 2
- Point 3

### Speaker Script (60-90 seconds)
[Verbal walkthrough in first person, conversational but professional]

### Likely Director Question
**Q:** [Strategic question]

**A:** [Confident, structured answer]

---

## SLIDE 2: ...

[Same structure repeated for all 9 slides]

---

## CLOSING NOTES

### Key Themes Across Slides
[3-5 sentences on the meta-narrative — what story the 9 slides tell together]

### Transition Phrases Between Slides
[Suggested phrases to move from one slide to the next smoothly]

### What To Have Ready (Backup)
[List of things to have on hand in case Director goes deep — open VS Code tabs, etc.]

### If Time Is Cut Short
[Which slides to skip if Director only has 5 minutes — prioritized list]


Final Instruction

Read my codebase first. Then generate the presentation. Make it the kind of presentation that gets a junior engineer noticed by senior leadership — strategic, multi-disciplinary, landscape-aware, grounded in real implementation, and forward-looking.

The framework comparison slide and scratch-build slide are particularly important — they demonstrate that I evaluated alternatives and made an informed engineering decision, not just "I followed a tutorial."

Begin.


END COPYING HERE ⬆️


Tu Yeh Kar — Step By Step


VS Code khol overwatch-eval-service/ project mein
Claude Code panel open kar
Yeh entire prompt (Start se End tak) copy kar aur paste kar Claude Code mein
Claude Code tera codebase padhega, then 9 slides generate karega
Output ek markdown file mein milega
Tu uss file ko padh, refine kar agar kuch tweak chahiye
Phir uss content se PPT bana — sirf 9 slides



Kyun Yeh Approach Director Ko Impress Karegi

Reason 1: Multi-disciplinary depth (Slides 2-4)
Most engineers ek perspective se baat karte hain. Tu 4 perspectives blend kar raha hai — ML, DL, GenAI, Backend — yeh sirf senior engineers karte hain.

Reason 2: Landscape awareness (Slides 5-6)
Tu sirf use nahi kar raha — tu alternatives jaanta hai. Arize internals, RAGAS, DeepEval. Yeh director ko dikhata hai ki tu informed engineering decision le raha hai, blind copy-paste nahi.

Reason 3: Engineering maturity (Slide 7)
"We considered building from scratch and chose not to" — yeh statement bahut powerful hai. Junior engineers blindly use kar lete hain frameworks. Senior engineers consciously skip karte hain scratch-build.

Reason 4: Production thinking (Slide 8)
Architecture + reliability + integration choices — yeh production-grade engineering thinking dikhata hai.

Reason 5: Strategic positioning (Slide 9)
Roadmap + ask + alignment with COO strategy — director ko dikhega ki tu future-thinking aur org-aware hai.

Reason 6: Prepared for hard questions
Har slide ke saath challenging Q&A hai — director ne tough question puchha, tu confident jawab dega. Yeh impression banaata hai senior leadership pe.


Backup Plan

Agar Claude Code kuch part incomplete chhode ya [VERIFY: ...] markers chhode — woh good sign hai, kyunki Claude honestly bata raha hai "yeh detail tere code mein nahi hai, confirm kar."

Tu uss verify section ko khud fill kar de. Yeh ensures content accurate rehta hai — galat info director ke saamne credibility kill kar deti hai.


Specific Things To Highlight During Live Demo

When you present, especially these slides will have impact:

Slide 6 Power Move

When showing the framework comparison matrix, pause and let it sink in. Then say:


"I want to be transparent — we evaluated four options. We chose Arize because of WF-specific deployment context, not because it's universally the best. Different context might warrant a different choice."



This positions you as an engineer with judgment, not a fanboy.

Slide 7 Power Move

When showing the scratch-build architecture, emphasize what we avoided:


"This is what we considered building. Twelve to eighteen months of engineering, three engineers, ongoing maintenance overhead. Instead, we got production-grade evaluation in a week. That's the leverage we created."



This shows ROI thinking — directors love this.

Slide 9 Power Move

End with the strategic ask. Don't be shy. Specifically say:


"To accelerate Phase 1, I need three things from leadership: EDITOR access to Tachyon Overwatch, confirmation of the target agent endpoint, and alignment on integration approach."



Directors respect engineers who know what they need and ask clearly.

