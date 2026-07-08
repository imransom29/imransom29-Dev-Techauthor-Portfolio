THE THREE CHARACTERS (Each gets 20 seconds)

To make this scene memorable, we're creating three distinct, likeable personas. These aren't stock characters — they have names, quirks, and specific pain points. Audience will remember them and relate.

Character 1: Priya, MLOps Engineer (0:00-0:20)


Vibe: Sharp, busy, always in Slack/Terminal, coffee in hand
Personality trait: Loves clean dashboards, hates surprise pages at 2 AM
Style: Wearing dark hoodie, glasses, tech-forward
Color signature: Cyan/blue tones (#00d4ff)


Character 2: Arjun, Data Scientist (0:20-0:40)


Vibe: Curious, analytical, always tweaking experiments
Personality trait: Excited about new models, cautious about deploying them
Style: Casual shirt, laptop stickers, has 15 browser tabs open
Color signature: Purple/violet tones (#a78bfa)


Character 3: Sara, Compliance Lead (0:40-1:00)


Vibe: Detail-oriented, calm, asks the hard questions
Personality trait: Needs everything documented and auditable
Style: Business casual, clipboard/tablet, professional but warm
Color signature: Green/gold tones (#4ade80, #facc15)



PART 1 — COPILOT ANIMATION PROMPT

Paste this prompt into VSCode Copilot (Agent mode) inside your existing Remotion project:


Create a new Remotion scene component called WhoUsesItScene.tsx inside src/scenes/ folder. This scene runs for 1800 frames (60 seconds at 30 fps) and introduces three relatable character personas who use the Supervisor Evaluation Service in their daily work.

The visual language should feel like modern flat-illustration character animation — think Duolingo, Notion, or Linear.app style. Characters are stylized (not photorealistic), warm colors, expressive, and immediately readable.

Each character gets 20 seconds with a consistent structure:


3 seconds: Character reveal + name/role
6 seconds: Their pain point (what they struggle with)
8 seconds: How they use the Supervisor Evaluation Service
3 seconds: The outcome + emotional payoff


Overall Scene Design

Background:


Deep navy (#0a0e27) base with soft warm accent gradients per character
Very subtle animated dots/particles in the background (feels alive, not empty)
Each character has their own "office environment" background hint (screens, coffee cup icon, plants) — created with simple geometric shapes


Typography:


Inter font (imported via @remotion/google-fonts/Inter)
Character name: 900 weight, 64px
Role/title: 400 weight, 28px, muted color
Speech/thought bubbles: 500 weight, 22-26px
Description text: 400 weight, 20-24px


Character illustration style:


Simple geometric shapes for bodies (rounded rectangles, circles)
Expressive faces with simple line-drawn features
3-4 color palette per character
NO complex textures — clean, flat, modern
Slight bounce/idle animation on character (like they're breathing)
Use <div> + CSS transforms and gradients — no need for external SVG unless needed
If SVG is easier, use React SVG components with animated attributes



Character 1: Priya, MLOps Engineer (Frames 0-600)

Frame 0-90 (3 seconds): Character reveal


Fade in on a warm cyan-gradient background (top-right corner has a subtle glow)
Priya slides in from the left with a spring animation (damping: 10)
She's illustrated as:

Circular head with short bob haircut
Round glasses (thin cyan frames)
Dark hoodie with a small "MLOps" badge
Sitting at a desk with 2 monitors visible in background (simple rectangles)
Coffee mug beside her (with steam animation — 3 curved lines rising)



Below her, name card animates in:

"PRIYA" (large, bold, white)
"MLOps Engineer" (smaller, muted cyan)
"Wells Fargo · WIMT" (tiny, gray)



She has a soft idle animation (subtle 2px up-down movement, 60-frame loop)


Frame 90-270 (6 seconds): The pain point


A thought bubble emerges from Priya's head (soft rounded speech bubble style)
Inside the bubble, text types out (typewriter effect):

"Every model update, I hold my breath."



After bubble is complete, a small "😰" emoji or worry icon appears next to it
Then Priya's face subtly shifts (frown expression) — animate by swapping the mouth curve
Below, in a lower banner, three small worry icons appear (staggered fade-in):

"Will hallucinations spike?" (with alert triangle icon)
"Will latency explode?" (with clock icon)
"Will users complain?" (with message icon)





Frame 270-510 (8 seconds): How she uses it


Thought bubble fades out
Priya's expression brightens (smile animation — swap mouth curve)
A laptop screen materializes in front of her, showing the Supervisor Evaluation Service dashboard mockup
On the screen (which should be animated):

"Model Version Comparison" panel
Two columns: "v1.2 (current)" vs "v1.3 (new)"
Metrics counter animating up:

Hallucination rate: 3.2% → 3.4% (green tick)
Latency: 1.4s → 1.5s (green tick)
Cost: $0.008 → $0.008 (green tick)






Priya's speech bubble appears (different color — cyan tint):

"I run the eval before every deploy. [...] Now I sleep."



Bottom text (fades in near end): "Model validation → 3 minutes"


Frame 510-600 (3 seconds): The emotional payoff


Priya visibly relaxes (idle animation slows)
She takes a sip of coffee (arm animates up, mug moves, then down)
Above her head, a peaceful "💤" or "✓" icon glows softly
Bottom banner text: "No more surprise pages at 2 AM."
Fade to black for 15 frames (character transition)



Character 2: Arjun, Data Scientist (Frames 600-1200)

Frame 600-690 (3 seconds): Character reveal


Fade in on warm purple-gradient background
Arjun slides in from the right with spring animation
He's illustrated as:

Circular head with curly hair (small curved lines on top)
Casual t-shirt with a small graph icon on the chest
Laptop open in front of him with many tabs (small colored rectangles at top)
Behind him: a small potted plant, whiteboard with equations (represented by simple lines and Greek letters)



Name card:

"ARJUN"
"Data Scientist"
"Wells Fargo · WIMT GenAI"





Frame 690-870 (6 seconds): The pain point


Arjun looks curious/excited (raised eyebrows animation)
Thought bubble emerges:

"I want to try Claude 4.5. [...] But is it actually better?"



Beside him, 3 model comparison cards appear (staggered):

"GPT-4" (gray)
"Gemini 2.5" (yellow)
"Claude 4.5" (purple, glowing) — Arjun is looking at this one



His expression shifts to uncertainty (small "?" appearing above his head)


Frame 870-1110 (8 seconds): How he uses it


Arjun clicks something on his laptop (small mouse cursor animation)
The evaluation dashboard materializes above his laptop, floating
Dashboard shows a live comparison chart:

X-axis: 100 test cases
Y-axis: Hallucination score
Two colored lines drawing themselves left-to-right:

Gemini 2.5: bouncy line, averaging around 7-8%
Claude 4.5: smoother line, averaging around 3-4%






As the lines complete, big text appears:

"Claude 4.5: -59% hallucination"



Arjun's speech bubble:

"I compare models on real production data. [...] No guesswork."



Bottom text: "Model comparison → data-driven decision"


Frame 1110-1200 (3 seconds): The emotional payoff


Arjun looks triumphant (fist pump animation — small motion of arm going up)
Above him, sparkle/star icons animate
Bottom banner: "Every experiment, backed by evidence."
Fade to black for 15 frames



Character 3: Sara, Compliance Lead (Frames 1200-1800)

Frame 1200-1290 (3 seconds): Character reveal


Fade in on warm green-gold gradient background
Sara slides in from below with spring animation (different direction feels intentional)
She's illustrated as:

Circular head with medium-length hair
Blazer over a simple top
Clipboard/tablet in hand
Behind her: a filing cabinet (rectangle with drawer lines), a small "✓ AUDIT" stamp on wall



Name card:

"SARA"
"Compliance Lead"
"Wells Fargo · Risk & Governance"





Frame 1290-1470 (6 seconds): The pain point


Sara has a serious but calm expression
Thought bubble emerges:

"When auditors ask 'how do you know your AI is safe?' [......] I need proof."



Around her, official-looking document icons animate in (small rectangles with lines):

"SR 11-7 Model Risk"
"EU AI Act"
"CFPB Guidelines"



These documents form a small stack that appears heavy (subtle downward movement)


Frame 1470-1710 (8 seconds): How she uses it


Sara's expression softens (she has a solution)
A compliance report materializes on her tablet
Report shows:

"Evaluation Audit Trail" header
Timestamp: "2026-07-06 14:23:45"
Model: "Claude 4.5 Sonnet"
Test cases: "100 production traces"
Verdict: "PASSED — 3.2% hallucination"
"Full traceability: 100/100 spans linked"
"MRM-compliant ✓" badge



Sara's speech bubble:

"Every evaluation is logged. [...] Every verdict is traceable. [...] I have the evidence."



Bottom text: "Audit-ready reports → auto-generated"


Frame 1710-1800 (3 seconds): The emotional payoff


Sara nods (small head movement, then still)
She smiles subtly
Above her head, a "🛡️" shield icon appears with a green checkmark
Bottom banner: "Compliance without the chaos."
Final closing beat (last 20 frames):

All three characters appear in a horizontal row at the bottom (small size)
Above them, unifying text scales in:

"One platform. [...] Three humans. [...] Zero blind spots."









Technical Requirements


Component name: WhoUsesItScene
Export as default
Use useCurrentFrame() for all timing
Use interpolate() with extrapolateRight: 'clamp' for smooth animations
Use spring() for character entrance animations (damping: 12, mass: 1)
All colors from constants.ts (add if needed):

PRIYA_CYAN: '#00d4ff'
ARJUN_PURPLE: '#a78bfa'
SARA_GREEN: '#4ade80'
WARM_GOLD: '#facc15'



Use lucide-react icons: Coffee, AlertTriangle, Clock, MessageSquare, CheckCircle2, Sparkles, FileText, Shield, BarChart3
Add subtle idle animations to characters (breathing effect via 2-4px vertical translation on 60-frame loop)
Add subtle sound design placeholder comments (e.g., // SFX: soft pop for character reveal at frame 0)


Reusable Sub-Components (Create)

Add to src/components/:


Character.tsx — reusable character illustration (props: name, role, color, expression, position)
SpeechBubble.tsx — reusable speech bubble with typewriter text animation (props: text, delay, position, color)
ThoughtBubble.tsx — same as SpeechBubble but with the dotted-cloud style
DashboardMockup.tsx — reusable mini-dashboard visualization (reuse from other scenes if exists)


Character Illustration Approach

Since we don't have designer assets, use CSS + emoji + SVG shapes creatively:


Head: Circle with gradient background (skin tone: #F5D6C2, #E5B08F, #C08863)
Body: Rounded rectangle in character's clothing color
Face features: Simple SVG paths for eyes (dots), eyebrows (small curves), mouth (curved lines that swap for expressions)
Hair: Curved SVG shapes or simple emoji reference (💇 style but as geometry)
Accessories: Simple SVG shapes for glasses (two circles connected), coffee mug (rectangle + curved handle)
Backgrounds: Gradient divs + geometric shape overlays


If character illustration gets too complex, use these fallback illustrations from undraw.co style (open-source flat illustrations you can inspire from — but generate original with code).

Integration

After creating this scene, update SupervisorEvalDemo.tsx to include:

tsx<Sequence from={<PREVIOUS_END_FRAME>} durationInFrames={1800}>
  <WhoUsesItScene />
</Sequence>

Confirm the scene renders without errors, and share a preview.


PART 2 — VOICE-OVER SCRIPT (60 SECONDS, PERFECTLY SYNCED)


Recording tips:


Total: 60 seconds. Aim for ~150 words (natural pace)
Tone: Warm, storytelling, conversational. This is different from previous scenes — less "product marketing," more "meet the people."
Recommended: Record each character block (20 seconds) separately for cleaner edits
Change tone slightly per character:

Priya: Empathetic, tired-but-hopeful energy
Arjun: Curious, energetic
Sara: Calm, confident, reassuring



Pause markers: [...] = short 300ms; [......] = longer 700ms





[0:00 – 0:20] Priya — MLOps Engineer

[0:00] (As Priya slides in and her name appears)


"This is Priya. [...] She runs MLOps at Wells Fargo."



[0:04] (As her thought bubble appears)


"Every time a model updates, [......] she used to worry."



[0:09] (As the three worry icons appear)


"Will hallucinations spike? [...] Will users complain? [...] Will she get paged at 2 AM?"



[0:15] (As her laptop shows the eval dashboard)


"Now, she runs an evaluation — [...] before every deploy."



[0:19] (As the payoff text appears)


"She sleeps."




[0:20 – 0:40] Arjun — Data Scientist

[0:20] (As Arjun slides in and his name appears)


"This is Arjun. [...] Data scientist. [...] Endlessly curious."



[0:25] (As the three model comparison cards appear)


"He wants to try the newest model. [...] Claude 4.5. [...] GPT-5. [......] But is it really better?"



[0:33] (As the comparison chart draws itself)


"He runs both models on the same production traces. [...] Side by side. [...] No guesswork."



[0:39] (As the fist-pump animation happens)


"Data-driven decisions."




[0:40 – 1:00] Sara — Compliance Lead

[0:40] (As Sara slides in and her name appears)


"And this is Sara. [...] She keeps our AI compliant."



[0:44] (As the compliance documents appear)


"When auditors ask [......] 'how do you know your AI is safe?' [...] she needs proof."



[0:52] (As the audit report materializes)


"Every evaluation is logged. [...] Every verdict is traceable. [...] Every model change has a record."



[0:58] (As the three characters appear together and the closing text lands)


"One platform. [...] Three humans. [...] Zero blind spots."



[1:00] END.


PART 3 — VISUAL-AUDIO SYNC TABLE

TimeCharacterVisualVoice-OverEmotion0-4sPriyaSlides in, name reveals"This is Priya. She runs MLOps..."Warm intro4-9sPriyaThought bubble + worry face"Every model update, she used to worry"Empathy9-15sPriya3 worry icons appear"Will hallucinations spike?..."Relatable pain15-19sPriyaLaptop shows eval dashboard"Now she runs an evaluation before every deploy"Solution19-20sPriyaSipping coffee, ✓ icon"She sleeps."Relief20-25sArjunSlides in, name reveals"This is Arjun. Data scientist. Curious."Curious energy25-33sArjun3 model cards appear"He wants to try the newest model..."Excited but cautious33-39sArjunComparison chart draws"He runs both on same production traces"Empowered39-40sArjunFist pump, sparkles"Data-driven decisions."Confident40-44sSaraSlides in, name reveals"And this is Sara. She keeps our AI compliant."Calm authority44-52sSaraCompliance docs appear"When auditors ask..."Serious weight52-58sSaraAudit report materializes"Every evaluation is logged..."Reassuring58-60sAll 3Characters appear together"One platform. Three humans. Zero blind spots."Unifying


PART 4 — WHY THESE THREE CHARACTERS?

Strategic Persona Coverage:

Priya (MLOps) — Represents: Operational users


Kaz, Ishita, model deployment engineers
Story: "AI can break. I'm the one who wakes up when it does."
Message: Peace of mind


Arjun (Data Scientist) — Represents: Innovation users


Mahalakshmi (newly onboarded on eval framework), model researchers
Story: "I want to push the frontier, but safely."
Message: Empowered experimentation


Sara (Compliance) — Represents: Governance users


David Mosciatti's MRM concern, Deepak Elias's audit needs
Story: "Regulators are watching. I need paper trails."
Message: Audit-ready by default


Emotional Arc:


Priya: Fear → Relief
Arjun: Uncertainty → Confidence
Sara: Pressure → Preparedness


Each character resolves their pain point in a way that makes the audience feel: "That's a real problem, and this really solves it."

Why This Works Better Than Feature Lists:

Most technical demos show features. This scene shows humans. That's what makes it memorable.

When Deepak Elias watches this, he won't remember "hallucination percentages." He'll remember:


"Priya sleeps."
"Arjun makes data-driven decisions."
"Sara has the paper trail."


Human stories stick. Feature lists don't.


PART 5 — INTEGRATION WITH FULL DEMO

Updated Scene Order:

SceneDurationContent1. Title0:00–0:15Hook2. Business Purpose0:15–1:1510 capabilities3. Three Cases1:15–2:15Air Canada, ICICI, Builder.ai4. Trigger Flow2:15–2:55How evaluation is triggered5. Who Uses It (THIS scene)2:55–3:55Priya, Arjun, Sara6. Roadmap & Closing3:55–4:15Future + credits

Total video length now: ~4:15

If you need to cut to strict 4 minutes, trim the closing scene to 20 seconds instead of 40.


PART 6 — DELIVERY CHECKLIST

Before recording voice-over:


 Watch the animated scene 2-3 times, note when each character transitions
 Practice tone shifts (Priya: empathetic → Arjun: excited → Sara: calm)
 Record each character block separately for cleaner audio editing
 Save as high-quality WAV, convert to MP3 for Remotion


Voice-over integration:

tsximport { Audio, staticFile } from 'remotion';

// Inside WhoUsesItScene:
<Audio src={staticFile('voice-over-who-uses-it.mp3')} startFrom={0} endAt={1800} />


PART 7 — A NOTE ON MAKING CHARACTERS LIKEABLE

Small details that make them relatable:


Priya's coffee: Everyone knows the coffee-during-crisis vibe
Arjun's browser tabs: Every technical person has 20 tabs open — instantly relatable
Sara's clipboard: Signals "someone who takes notes and gets things done"


Facial expression animations to include:


Priya: Worried (frown) → Relaxed (small smile) → Content (eyes closed briefly)
Arjun: Curious (raised eyebrow) → Uncertain (?) → Triumphant (small grin)
Sara: Serious (neutral) → Focused (slight lean forward) → Reassured (calm smile)


Micro-animations:


Steam from Priya's coffee (3 rising curves, looping)
Blinking cursor on Arjun's laptop
Slight breeze on Sara's plant behind her


These tiny details make the characters feel alive and warm.


Bhai — jab Copilot yeh scene generate kare, character illustrations pehle-pehle simple lag sakti hain. Preview dekhkar batao — agar characters bahut basic dikh rahe hain, hum next iteration mein illustration style ko refine kar sakte hain. Style guide already tight hai, generation ke baad tweaks minimal honge.
