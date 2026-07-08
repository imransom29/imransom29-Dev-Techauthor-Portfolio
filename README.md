Create a new Remotion scene component called WhoUsesItScene.tsx inside src/scenes/ folder. This scene runs for 1800 frames (60 seconds at 30 fps) and shows how three distinct enterprise workflows integrate with the Supervisor Evaluation Service. No cartoon characters — the visuals are entirely tool interfaces, code snippets, and workflow diagrams styled to feel like screenshots of real production systems.

Each workflow gets 20 seconds and follows the same 4-part structure:


Frames 0-90 (3s): Role header + tool stack reveal
Frames 90-330 (8s): Pain point in current workflow
Frames 330-510 (6s): Integration with Supervisor Evaluation Service
Frames 510-600 (3s): Concrete benefit / outcome


Global Scene Design

Background:


Deep navy (#0a0e27) base — no distractions
Very subtle grid overlay (5% opacity cyan lines forming faint circuit texture)
Left border ribbon: 4px thick vertical bar showing the workflow's signature color (updates per workflow)


Typography:


Inter font (imported via @remotion/google-fonts/Inter) for headers
JetBrains Mono for code snippets and terminal output (import via @remotion/google-fonts/JetBrainsMono)
Headers: 900 weight, 56-64px
Body: 400 weight, 22-26px
Code: 400 weight, 18-20px monospace
All text should feel like it belongs on a production dashboard — clean, dense, no wasted space


Color palette (add to constants.ts):


MLOPS_CYAN: '#00d4ff' — Workflow 1
RESEARCH_PURPLE: '#a78bfa' — Workflow 2
RISK_AMBER: '#facc15' — Workflow 3
SUCCESS_GREEN: '#4ade80'
ERROR_RED: '#ff6b6b'
TERMINAL_BG: '#0d1117' — GitHub-style dark for code panels
CARD_BG: 'rgba(255, 255, 255, 0.03)'
BORDER_SUBTLE: 'rgba(255, 255, 255, 0.08)'


Transitions between workflows:


Clean vertical wipe (top-to-bottom) with signature color, 15-frame duration
Previous workflow content fades to 15% opacity as new one enters



WORKFLOW 1: MLOps Engineering (Frames 0-600, 20 seconds)

Frame 0-90 (3 seconds): Role header + tool stack reveal

Layout:


Top-left corner: Small monospace label "01 / MLOPS ENGINEERING" (cyan color, 24px, letter-spacing 2px)
Center-left: Large heading "MLOps Engineering" (56px, white)
Below heading: Subtitle "Preventing bad models from reaching production" (22px, muted)
Right side: A "tool stack" panel showing 4 tool logos as small cards (each card has icon + name):

Harness CD (icon: pipeline arrows)
OpenShift (icon: red hat shape)
JFrog Artifactory (icon: frog silhouette in green)
Grafana (icon: orange flame with rings)



Cards animate in with 20-frame staggered fade + slight slide from right
Use lucide-react icons where actual logos aren't available: Workflow, Container, Package, LineChart


Frame 90-330 (8 seconds): Pain point visualization

Layout: Split into two vertical panels

Left panel (60% width): A recreated Harness pipeline UI mockup showing:


Header bar: "Deployment Pipeline — supervisor-agent-service"
5 pipeline stages horizontally connected by arrows:

Build ✓ (green)
Test ✓ (green)
Push to Artifactory ✓ (green)
Deploy to Dev ✓ (green)
Deploy to Prod — this stage pulses red with warning icon



Below the pipeline, a red alert banner slides in:


  ⚠ ALERT: Post-deployment hallucination rate: 12.4%
  ⚠ ALERT: 47 user complaints in 2 hours


The banner has a subtle red pulse animation


Right panel (40% width): Terminal-style panel with real error messages appearing (typewriter effect):

> Model deployed at 14:22 UTC
> Overwatch trace count: 1,247
> Hallucination detected: 12.4% (baseline: 3.1%)
> ROLLBACK INITIATED at 14:36 UTC
> Downtime: 14 minutes
> Business impact: HIGH

Below all this, in the bottom center, a bold statement appears at frame 240:


"The problem: hallucinations detected AFTER deployment."
(font: 32px, white, subtle fade-in)



Frame 330-510 (6 seconds): The integration

Transition: Left panel visuals stay, but the pipeline reorganizes to show a new stage inserted between "Deploy to Dev" and "Deploy to Prod".

The new stage animates in with a purple glow:


Stage 4.5: Supervisor Evaluation (purple, glowing)
Small text below stage: "Pre-production LLM validation"


Right panel updates with new terminal output:

> Pre-deployment evaluation triggered
> Fetching 100 production spans via Overwatch...
> Judging with Claude 4.5 Sonnet...
> Verdict: HALLUCINATION RATE 3.2% ✓
> Threshold: <5% PASS
> Pipeline PROCEEDING to production

At frame 420, a code snippet card appears at bottom of screen showing the actual Harness pipeline YAML integration:

yaml- stage: supervisor-eval
  when: pre-production
  action: evaluate
  threshold: hallucination_rate < 0.05
  block_on_failure: true

(displayed in a JetBrains Mono panel with syntax highlighting — YAML keys in cyan, values in green)

Frame 510-600 (3 seconds): The outcome


All visuals dim to 30% opacity
Center screen: Large green checkmark icon (Lucide CheckCircle2) with pulse animation
Below: Bold text: "Bad models blocked before production."
Small text: "Reduced mean-time-to-detection from hours to seconds"
Bottom-right: Metrics card:


  ⚡ 47 seconds  →  average eval time
  🛡  0 rollbacks →  since integration


WORKFLOW 2: Model Research (Frames 600-1200, 20 seconds)

Transition (Frames 600-615): Purple vertical wipe

Frame 615-705 (3 seconds): Role header + tool stack reveal

Layout:


Top-left: "02 / MODEL RESEARCH" (purple, 24px monospace)
Center-left: Large heading "Model Research"
Subtitle: "Comparing models on production data, not benchmarks"
Right side tool stack cards:

VS Code / Jupyter (icon: code brackets)
Arize Phoenix (icon: phoenix bird silhouette, use Bird from lucide-react if needed)
Tachyon Overwatch (WF logo placeholder — small "T" in cyan)
Python (icon: snake or FileCode)





Frame 705-945 (8 seconds): Pain point visualization

Layout: Two-panel Jupyter notebook interface

Top panel: A realistic Jupyter notebook cell with syntax-highlighted Python code appearing (typewriter effect):

python# Question: Is Claude 4.5 actually better than Gemini 2.5?

# Traditional approach:
run_public_benchmark("MMLU")  # Score: 88.7 vs 85.2
run_public_benchmark("HellaSwag")  # Score: 92.1 vs 89.3

Bottom panel: A frustrated comment appears next to the code (as an inline notebook markdown cell):


"But public benchmarks don't reflect OUR customer questions.
OUR domain. OUR context. OUR risk tolerance."



Then a red-highlighted callout at the bottom:

❌ Benchmark score ≠ Production performance

At frame 840, transition text appears:


"The problem: research decisions based on benchmarks that don't match reality."



Frame 945-1125 (6 seconds): The integration

Notebook clears and rewrites with new code (typewriter effect):

pythonfrom supervisor_eval import compare_models

# Compare models on YOUR actual production traces
results = compare_models(
    models=["gemini-2.5", "claude-4-5-sonnet"],
    traces_from="overwatch",
    trace_count=500,
    date_range="last_7d"
)

results.push_to_arize()  # View in Phoenix UI

At frame 1020, an Arize Phoenix UI mockup slides in from the right side:


Header: "Arize Phoenix — Model Comparison"
Two horizontal bar charts stacked:

Gemini 2.5: Hallucination rate 7.8% (yellow-orange bar, animates left-to-right)
Claude 4.5: Hallucination rate 3.2% (green bar, animates left-to-right, shorter)



Below charts, a table showing:
MetricGemini 2.5Claude 4.5ΔHallucination %7.8%3.2%-59%Avg latency1.2s1.4s+17%Cost / eval$0.006$0.009+50%


Green highlight on "Hallucination %" row
Small badge: "500 real production traces"


Frame 1125-1200 (3 seconds): The outcome


Visuals dim
Center: Green checkmark
Bold text: "Every experiment, backed by production data."
Small text: "Directly integrated with Arize Phoenix"
Metrics card:


  🔬 500 traces   → per comparison
  📊 Live in Arize → results streamed


WORKFLOW 3: Model Risk & Governance (Frames 1200-1800, 20 seconds)

Transition (Frames 1200-1215): Amber vertical wipe

Frame 1215-1305 (3 seconds): Role header + tool stack reveal

Layout:


Top-left: "03 / MODEL RISK & GOVERNANCE" (amber, 24px monospace)
Center-left: Large heading "Model Risk & Governance"
Subtitle: "Auditable evidence for SR 11-7 compliance"
Right side tool stack cards:

Confluence (icon: page/document)
ServiceNow (icon: Ticket)
MRM Dashboard (icon: Shield)
Audit Reports (icon: FileText)





Frame 1305-1545 (8 seconds): Pain point visualization

Layout: Simulate an incoming audit request

Top panel: An email/ticket UI mockup:

From: Federal Reserve MRM Examiner
Subject: SR 11-7 — Model Validation Evidence Request

For your production AI advisor system, please provide:
1. Evidence of continuous hallucination monitoring
2. Traceable audit trail for all model changes
3. Third-party validation of model outputs
4. Documentation of testing methodology

Response required within 15 business days.

Bottom panel: A frantic Confluence/SharePoint search interface with red X marks appearing on multiple results:


❌ "Model_Validation_Report_Q1_2025.pdf" — outdated
❌ "Screenshot_evaluation_dashboard.png" — not auditable
❌ "Email_from_data_science_team.msg" — informal
❌ Manual monthly reports — labor-intensive


At frame 1440, transition text:


"The problem: no auditable trail for AI decisions."



Frame 1545-1725 (6 seconds): The integration

Visuals clear. An MRM Compliance Dashboard interface materializes:

Header: "Model Risk Management — Audit Trail"

Below header, a professional table appears with rows animating in (staggered):

TimestampModelTrace IDVerdictHallucinationAuditor2026-07-06 14:23claude-4-5ovw_a3f21✓ PASSED3.2%System2026-07-06 12:15claude-4-5ovw_b7c88✓ PASSED2.8%System2026-07-05 16:44gemini-2.5ovw_x9d02⚠ REVIEW6.1%System2026-07-05 09:20gemini-2.5ovw_p4e56✓ PASSED4.2%System

Each row has a small "View Trace" button that pulses briefly (suggests one-click drill-down to Overwatch span).

Below the table:


Green badge: "SR 11-7 Compliant Report Ready"
Button: "📄 Export Full Audit Package"


Small footer text: "Every evaluation. Every trace. Every timestamp. Signed and hashed."

Frame 1725-1800 (3 seconds): The outcome + Scene closing


Visuals dim
Center: Green shield icon (Lucide ShieldCheck)
Bold text: "Audit-ready by default."
Small text: "Full traceability from verdict to source span"


Closing beat (last 30 frames = 1 second):


All three workflow color-bars appear as thin horizontal stripes at the top of screen (cyan / purple / amber)
Below them, unifying text scales in with spring animation:



"One platform. Three workflows. Zero friction."



(text: 64px, white, bold; scale from 0.9 to 1.0 with spring damping 12)

Small footer under the closing text: "Supervisor Evaluation Service · Enterprise-grade LLM evaluation" (18px, muted)


Technical Requirements


Component name: WhoUsesItScene
Export as default
Use useCurrentFrame() and useVideoConfig() for all timing
Use interpolate() with extrapolateRight: 'clamp' for opacity and position
Use spring() for entrance animations (damping: 12, mass: 1)
All colors from constants.ts
Use lucide-react icons: Workflow, Container, Package, LineChart, Bird, FileCode, Ticket, Shield, FileText, ShieldCheck, CheckCircle2, AlertTriangle, TrendingDown
Terminal panels should have TERMINAL_BG background with subtle 1px border in BORDER_SUBTLE
Code panels use JetBrains Mono font
All UI mockups should look like production interfaces — clean lines, consistent padding (16px card padding, 8px between elements)


Reusable Sub-Components

Add to src/components/:


WorkflowHeader.tsx — reusable role header with monospace label + heading + subtitle (props: number, role, subtitle, color)
ToolStackCards.tsx — reusable tool stack card row (props: tools array with name+icon+color, staggerDelay)
TerminalPanel.tsx — reusable terminal-style code panel (props: lines array, delay, showCursor)
MockupCard.tsx — reusable rounded card container for UI mockups (props: title, children, color, glowIntensity)
CodePanel.tsx — syntax-highlighted code display (props: language, code, delay)
AnimatedTable.tsx — table with staggered row animations (props: headers, rows, colorHighlights)


Integration

After creating this scene, update SupervisorEvalDemo.tsx to include:

tsx<Sequence from={<PREVIOUS_END_FRAME>} durationInFrames={1800}>
  <WhoUsesItScene />
</Sequence>

Confirm the scene renders without errors and preview at 30fps.


PART 2 — VOICE-OVER SCRIPT (60 SECONDS)


Recording tips:


Total: 60 seconds. ~140 words at professional pace.
Tone: Bloomberg news anchor meets McKinsey partner. Confident, informative, no drama.
Record 3 blocks of 20 seconds each for easier retakes.
No excessive pauses. Corporate rhythm — measured but not slow.
Emphasize BOLD words with subtle weight, not volume shifts.
Pause markers: [.] = short 200ms; [..] = 400ms





[0:00 – 0:20] Workflow 1: MLOps Engineering

[0:00] (As the "01 / MLOPS ENGINEERING" header and tool stack appears)


"For MLOps engineering. [.] The team responsible for deploying models to production."



[0:05] (As the Harness pipeline and red alert visualize the pain)


"Today, [.] hallucinations are detected only after users complain. [..] Rollbacks happen in hours."



[0:11] (As the new "Supervisor Evaluation" stage animates into the pipeline)


"The Supervisor Evaluation Service integrates directly into Harness pipelines [.] as a pre-production gate. [..] Failed evaluations block the deployment."



[0:19] (As the "Bad models blocked" outcome appears)


"Bad models never reach production."




[0:20 – 0:40] Workflow 2: Model Research

[0:20] (As the "02 / MODEL RESEARCH" header appears)


"For model research. [.] The team evaluating new models and prompts."



[0:25] (As the Jupyter notebook shows benchmark scores + frustrated markdown comment)


"Public benchmarks don't reflect production reality. [..] Different domain. [.] Different customers. [.] Different risks."



[0:32] (As the new Python code + Arize comparison appears)


"A single Python call [.] compares any two models on real production traces. [..] Results stream directly into Arize Phoenix."



[0:39] (As the "Every experiment" outcome appears)


"Decisions backed by production data."




[0:40 – 1:00] Workflow 3: Model Risk & Governance

[0:40] (As the "03 / MODEL RISK & GOVERNANCE" header appears)


"For model risk and governance. [.] The team accountable for regulatory compliance."



[0:46] (As the SR 11-7 audit request email and failed searches appear)


"Regulators demand auditable evidence. [..] Screenshots and manual reports don't hold up."



[0:52] (As the MRM audit trail table appears)


"Every evaluation is signed and hashed. [.] Every verdict traces to a source span. [.] Every report is SR 11-7 compliant."



[0:58] (As the "One platform" closing text appears)


"One platform. [.] Three workflows. [.] Zero friction."



[1:00] END.


PART 3 — VISUAL-AUDIO SYNC TABLE

TimeVisual ElementVoice-Over LineFeel0-3sRole header + tool stack cards"For MLOps engineering..."Setup3-11sHarness pipeline + red alert + terminal"Hallucinations detected only after..."Pain11-19sPipeline gets new stage + YAML snippet"Integrates directly into Harness..."Solution19-20sGreen check + outcome text"Bad models never reach production"Payoff20-25sResearch role header + tool cards"For model research..."Setup25-32sJupyter + benchmark scores + frustration"Public benchmarks don't reflect..."Pain32-39sNew Python code + Arize UI + charts"A single Python call compares..."Solution39-40sGreen check + outcome text"Decisions backed by production data"Payoff40-46sRisk role header + tool cards"For model risk and governance..."Setup46-52sAudit email + failed Confluence search"Regulators demand auditable evidence..."Pain52-58sMRM audit trail table + compliance badge"Every evaluation signed and hashed..."Solution58-60sThree color bars + closing text"One platform. Three workflows. Zero friction."Unify


PART 4 — WHY THIS VERSION WORKS

What we fixed from v1:


❌ Cartoon characters (Priya, Arjun, Sara) — replaced with actual tool interfaces
❌ Emotional storytelling ("she sleeps at 2 AM") — replaced with factual outcomes ("Bad models never reach production")
❌ Duolingo aesthetic — replaced with Bloomberg terminal aesthetic
❌ Names and personalities — replaced with role titles and workflows


Why enterprise audiences will connect:


They see their own tools — Harness, Arize, Jupyter, Confluence
They see their own pain — post-deployment surprises, benchmark mismatch, audit anxiety
They see integration, not disruption — "we plug into what you use"
Concrete outcomes — "47 seconds", "500 traces", "signed and hashed"


Political / Strategic wins:

For Deepak Elias:


Shows enterprise integration, not standalone tool
Concrete business outcomes (0 rollbacks, audit-ready)
Familiar tools = credibility


For David Mosciatti:


Arize Phoenix prominently featured = validates alignment with model team framework
Positions your service as enhancement layer, not competing solution
"500 real production traces" = production-grounded story (your differentiator)


For Akash Tamar:


Clear ROI framing per role
No jargon overload, but not dumbed down either
60 seconds cover three departments' concerns


For Kaz:


Honors his June 4 guidance: "self-driven, not tech-team-tested"
Shows the eval service as a platform, not just his mentee's project



PART 5 — RENDERING & DELIVERY

Preview:

bashnpm run start
