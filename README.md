Task

You are helping me build a 4-minute Remotion demo video for my project Supervisor Evaluation Service — a production hallucination evaluation pipeline I built at Wells Fargo (WIMT GenAI team). The demo will be presented to Akash Tamar and senior leadership.

Create a new Remotion project in a sibling folder (do NOT modify my current Python service). Name it supervisor-eval-remotion-demo. Scaffold the complete project, install dependencies, and generate all scene components.


Project Context

My service: FastAPI-based Python microservice that fetches LLM traces from Tachyon Overwatch (internally deployed Arize Phoenix), applies hallucination evaluation via LLM-as-Judge (Claude 4.5 Sonnet), and produces verdict reports.

Architecture:

User → UI (click "Run Evaluation") 
     → FastAPI backend (/evaluate endpoint)
     → OverwatchConnector (GraphQL query to Tachyon Overwatch)
     → SpanEvaluator (calls Tachyon Generation gateway with Apigee OAuth → Claude 4.5 Sonnet as judge)
     → ReportService (aggregates verdicts: PASSED / REVIEW / FAILED)
     → Response back to UI (and annotations pushed back to Overwatch)

Core modules (already built):


app/connectors/overwatch_connector.py — GraphQL client
app/evaluators/hallucination/evaluator.py — LLM-as-Judge logic using Phoenix's HALLUCINATION_PROMPT_TEMPLATE
app/services/report_service.py — Verdict aggregation with thresholds
app/routers/evaluation.py — FastAPI routes


Judge model: Claude 4.5 Sonnet (accurate scoring)
Optional suggestion model: Gemini 2.5 Flash (cheaper, only when include_suggestions=true)


Video Structure — 4 minutes total (7200 frames at 30 fps)

Scene 1: Hook / Title (0–20s | frames 0–600)


Opening: Fade in Wells Fargo brand-appropriate title card
Title: "Supervisor Evaluation Service"
Subtitle: "Trace-driven hallucination validation for production AI"
Bottom tag: "WIMT GenAI · Wells Fargo"
Animation: Title fades up, subtitle fades in, subtle particle background
Colors: Dark navy background (#0a0e27), Wells Fargo red accent (#D71E28), gold highlight (#FFCD41)


Scene 2: Business Purpose — Why Evaluation Matters (20s–90s | frames 600–2700)

Show 10 business capabilities as animated cards that appear one by one in a grid, staggered. Each card fades/slides in with a subtle icon.

The 10 capabilities (create as data array):


Monitor AI Assistant quality — Clear, measurable framework
Detect Hallucinations — Catch wrong or made-up information
Identify failed responses — Flag poor quality outputs
Provide improvement suggestions — Actionable feedback per response
Track quality trends — Over time, per model, per use case
Validate via benchmark pipeline — Production-grounded synthetic datasets
Measure accuracy, relevance, completeness — Multi-dimensional scoring
Enable data-driven improvement — Move beyond gut-feel decisions
Compare performance before/after changes — Safe model migration
Maintain reliability at scale — Continuous quality assurance


Layout: 2 columns × 5 rows OR 5 columns × 2 rows — whichever fits 1920×1080 aesthetically
Animation: Each card scales in from 0.8 to 1.0 with fade, spring-based, ~4 seconds apart (staggered)
Card style: Semi-transparent dark card with cyan/purple gradient border, icon on left, headline + description on right
Header: "Why We Built This" (fades in at top before cards appear)

Scene 3: The Real Problem — Model Migration & Change Validation (90s–130s | frames 2700–3900)

Structure:


Section header: "The Real Problem" (fades in)
Big statement (headline animation): "Every model change is a risk. Every prompt update is unknown territory."
Visual metaphor: Show two boxes side-by-side:

Left box: "Old Model (Gemini 2.5)" with green checkmarks
Right box: "New Model (Claude 4.5 / GPT-5)" with question marks
Arrow between them labeled "Migration"



Pain points list (staggered fade-in):

"Will hallucinations increase?"
"Will response quality drop?"
"Will edge cases break?"



Punchline: "You need proof, not hope." (color: WF red #D71E28, dramatic pause)


Scene 4: How It Works — Live Flow Visualization (130s–220s | frames 3900–6600)

This is the most important scene. Show the full end-to-end flow using animated UI mockup + backend architecture.

Sub-scene 4A (130s–150s): User triggers evaluation via UI

Show a mock UI (simulated dashboard):


Wells Fargo-styled top bar with logo placeholder + "Supervisor Evaluation Service" title
Main panel with:

"Select Span Set" dropdown (pre-filled with "Production Traces — Last 24h")
"Judge Model" dropdown showing "Claude 4.5 Sonnet" ✓
"Include Suggestions" toggle (off by default) → animate toggle turning ON
Big call-to-action button: "Run Evaluation" — animate mouse cursor moving to it and clicking



Loading state after click: subtle pulse animation + "Fetching traces from Tachyon Overwatch..."


Sub-scene 4B (150s–170s): Backend flow — Fetch traces

Transition into architecture visualization:


Central node: "Supervisor Evaluation Service" (glowing purple)
Left node: "Tachyon Overwatch" (Phoenix logo placeholder, cyan)
Animated flow: GraphQL query line drawing from center to Overwatch with query preview:


graphql  query FetchSpans {
    spans(spaceId: "wimt", limit: 100, timeRange: "24h") {
      id, userInput, modelResponse, context, timestamp
    }
  }


Response animation: 100 span dots flowing back to service (particle stream)
Counter animating: "0 → 100 traces fetched" (in ~1 second)


Sub-scene 4C (170s–195s): Backend flow — Judge Evaluation


Show LLM-as-Judge process:

Each trace card animates one by one (4-5 visible at a time, sliding)
Each card shows: user input snippet + model response snippet + judge prompt being applied
Judge model animation: pulse effect on "Claude 4.5 Sonnet (Judge)" node
Verdict appears next to each card: green ✓ (PASSED), yellow ⚠ (REVIEW), red ✗ (FAILED)



Right-side counter dashboard updating live:

Total: 100
Passed: 87
Review: 8
Failed: 5



Bottom metric: "Avg latency: 1.2s per span · Total cost: ~$0.85"


Sub-scene 4D (195s–210s): Verdict aggregation & Report


Cards collapse into 3 big verdict cards:

PASSED — 87% (green, "Hallucination rate < 5%")
REVIEW — 8% (yellow, "Rate 5–10%, human check")
FAILED — 5% (red, "Rate > 10%, block release")



Overall verdict banner: "BUILD APPROVED FOR PRODUCTION" (green, large)


Sub-scene 4E (210s–220s): Push back to Overwatch


Small animation: annotations flowing back to Overwatch
Text: "Verdicts logged back to Tachyon Overwatch for full audit trail"


Scene 5: Live Metrics Dashboard (220s–260s | frames 6600–7800)

Show a fake but realistic dashboard:


Top row — Big Numbers (counter animations):

"12,847" evaluations this month
"94.3%" avg pass rate
"$0.008" avg cost per evaluation
"1.4s" avg response time



Middle — Trend Chart: Line graph showing hallucination % over 4 weeks:

Week 1: 8.2%
Week 2: 6.5%
Week 3: 4.1%
Week 4: 3.2%
(Animated line drawing from left to right)



Bottom — Comparison Bar Chart: "Before vs After model migration"

Gemini 2.5: 7.8% hallucination
Claude 4.5: 3.2% hallucination
Improvement callout: "-59% hallucination rate"





Scene 6: Impact & Roadmap (260s–240s | frames 7800–8400... wait, adjust)

Actually, restructure: Scene 5 ends at 260s, Scene 6 runs 260s–240s... let me recalibrate.

REVISED TIMING:


Scene 1: 0–15s (title)
Scene 2: 15–75s (business purpose, 10 cards)
Scene 3: 75–110s (problem)
Scene 4: 110–200s (how it works, full flow)
Scene 5: 200–225s (metrics dashboard)
Scene 6: 225–240s (roadmap / closing)


Scene 6: Roadmap & Closing (225s–240s | frames 6750–7200)

Roadmap highlights (fade in as bullets):


"Q3 2026: Model team framework alignment"
"Q4 2026: Weekly automated drift detection"
"2027: Multi-LOB deployment across Wells Fargo"


Closing card:


Title: "Supervisor Evaluation Service"
Tagline: "Because trust in AI needs proof, not promises."
Attribution: "WIMT GenAI Team · Wells Fargo"
Contact: "Rahul Vinayak · Isita Mohapatra · Kaz Muthusami"
Fade out to black



Design System — MUST FOLLOW STRICTLY

Color Palette:


Background: #0a0e27 (deep navy) primary, #050810 (near-black) secondary
Primary accent: #00d4ff (cyan — for tech, connections, data)
Secondary accent: #a78bfa (purple — for our service, focal points)
Success: #4ade80 (green — PASSED verdicts)
Warning: #facc15 (amber — REVIEW verdicts)
Error: #ff6b6b (red — FAILED verdicts)
Wells Fargo brand red: #D71E28 (use sparingly, for key emphasis)
Wells Fargo gold: #FFCD41 (subtle highlights only)
Text primary: #ffffff
Text secondary: #8a92b2 (muted labels)
Text tertiary: #c9d0e3 (body text on cards)


Typography:


Font: Inter (import via @remotion/google-fonts/Inter)
Weights used: 400 (body), 600 (subheadings), 700 (headings), 900 (hero titles)
Sizes: Hero 84–96px, H1 56–72px, H2 42–48px, Body 22–28px, Small 16–18px


Animation Principles:


Use spring() for entrance animations (damping: 12, feels natural)
Use interpolate() with extrapolateRight: 'clamp' for opacity/position
Stagger delays: 15–30 frames between related elements
All transitions should be smooth — NEVER use hard cuts
Add subtle particle background or grid pattern for depth (optional)


Composition Style:


Cinematic dark theme — this is NOT a corporate PowerPoint
Heavy use of glow effects on primary elements (boxShadow: '0 0 40px <color>66')
Cards should have backdrop-filter: blur(10px) and semi-transparent backgrounds
Use consistent border-radius: 12px for cards, 16px for panels, 20px for hero elements



File Structure to Create

supervisor-eval-remotion-demo/
├── package.json
├── remotion.config.ts
├── tsconfig.json
├── src/
│   ├── Root.tsx
│   ├── SupervisorEvalDemo.tsx        (main orchestrator, 4 min total)
│   ├── constants.ts                  (color palette, timings)
│   ├── scenes/
│   │   ├── TitleScene.tsx            (Scene 1: 0-15s)
│   │   ├── BusinessPurposeScene.tsx  (Scene 2: 15-75s, 10 cards)
│   │   ├── ProblemScene.tsx          (Scene 3: 75-110s)
│   │   ├── HowItWorksScene.tsx       (Scene 4: 110-200s, WITH SUB-SCENES)
│   │   ├── MetricsDashboardScene.tsx (Scene 5: 200-225s)
│   │   └── RoadmapClosingScene.tsx   (Scene 6: 225-240s)
│   └── components/
│       ├── UIDashboardMockup.tsx     (Wells Fargo styled UI mockup)
│       ├── ArchitectureFlow.tsx      (animated backend flow)
│       ├── VerdictCard.tsx           (reusable verdict card)
│       ├── AnimatedCounter.tsx       (number counting animation)
│       ├── LineChart.tsx             (simple animated line chart)
│       ├── BarChart.tsx              (comparison bar chart)
│       └── ParticleBackground.tsx    (subtle background depth)
└── public/
    └── (assets folder — placeholder for logos, screenshots)


Package.json Requirements

Include these dependencies (latest stable):


remotion (core)
@remotion/cli
@remotion/google-fonts
@remotion/shapes (for architecture diagrams)
lucide-react (for icons on cards)
react, react-dom


Include scripts:


start: remotion studio
build: remotion render SupervisorEvalDemo out/demo.mp4 --codec=h264 --crf=18
build-4k: remotion render SupervisorEvalDemo out/demo-4k.mp4 --scale=2



Technical Requirements


Composition dimensions: 1920 × 1080 (16:9, 1080p)
Frame rate: 30 fps
Total duration: 7200 frames (240 seconds = 4 minutes)
Language: TypeScript strict mode
All components: Functional React with hooks
Reusable components: Extract common patterns (cards, counters, charts) into components/ folder
Constants: All colors, timings, and shared values in constants.ts



Content Fidelity — DO NOT CHANGE

The following exact content MUST appear:

Numbers to show (create as data):


100 traces per run
87% passed, 8% review, 5% failed (in Scene 4)
$0.008 avg cost per evaluation (in Scene 5)
1.4s avg response time (in Scene 5)
12,847 evaluations this month (in Scene 5)
Weekly hallucination trend: 8.2% → 6.5% → 4.1% → 3.2% (in Scene 5)
Model comparison: Gemini 2.5 (7.8%) vs Claude 4.5 (3.2%), -59% improvement (in Scene 5)


Names to mention:


Rahul Vinayak (creator)
Isita Mohapatra (parallel workstream)
Kaz Muthusami (mentor)
WIMT GenAI Team
Wells Fargo


Technical terms to use accurately:


Tachyon Overwatch (not Arize Phoenix — even though it's Phoenix internally, we call it Overwatch)
Tachyon Generation gateway
Apigee OAuth
LLM-as-Judge
Claude 4.5 Sonnet (judge)
Gemini 2.5 Flash (suggestion, optional)



What I DO NOT Want


❌ Do NOT modify my existing Python service code
❌ Do NOT create the Remotion project inside my Python project folder — create it as a sibling folder
❌ Do NOT use stock icons that look generic — use lucide-react icons that fit the concept
❌ Do NOT use light theme — this is a dark cinematic demo
❌ Do NOT add voice-over yet — I'll add it manually after
❌ Do NOT hardcode animations without using Remotion's spring() and interpolate() — everything should be frame-driven
❌ Do NOT skip the Wells Fargo branding — subtle red/gold accents are required



Delivery Expectations


Scaffold the entire project with npx create-video@latest or manual folder creation
Install all dependencies via npm install
Generate every scene file with production-quality animations
Test that npm run start opens Remotion Studio with the composition visible
All 6 scenes must render without errors
Explain to me at the end: how to preview, how to render MP4, and how to customize any scene



Execution Instructions

Work in agent mode:


First, create the folder ../supervisor-eval-remotion-demo (sibling to current directory)
cd into it
Scaffold the Remotion project
Install dependencies
Generate all files listed in the file structure above
Confirm npm run start command works
Give me a summary of:

Project location
How to preview
Which files to edit if I want to change specific scenes
How to render the final MP4
