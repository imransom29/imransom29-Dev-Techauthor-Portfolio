Remotion Scene: "The Problem" — 40 Seconds

Style: 3Blue1Brown


PART 0 — DESIGN PHILOSOPHY (Read this first)

3Blue1Brown's animation style has 6 non-negotiable rules. Every frame of this scene must obey them:

Rule 1 — One idea on screen at a time.
Never show two concepts simultaneously. When a new idea arrives, the old one fades to 15% opacity or exits entirely.

Rule 2 — The visual carries the meaning, not the text.
Text is a label, never an explanation. If you're writing a sentence on screen, you've failed. Maximum 4-6 words per text element.

Rule 3 — Objects transform, they don't cut.
A circle becomes a dot. A dot joins a group. A group reveals a pattern. Nothing appears or disappears abruptly — everything morphs, grows, or dissolves.

Rule 4 — Silence and stillness are tools.
Hold on a single frame for 1-2 seconds after a reveal. Let the viewer absorb. Don't rush to the next thing.

Rule 5 — Color means something.
Never decorative. Blue = neutral/data. Gray = unknown. Red = failure. Yellow = attention. If a color changes, something changed conceptually.

Rule 6 — Motion is eased, never linear.
Everything uses spring or ease-in-out. Nothing moves at constant speed. Objects have a sense of weight.


PART 1 — COPILOT ANIMATION PROMPT

Paste this into VSCode Copilot Chat (Agent mode):


Create a Remotion scene component ProblemStatementScene.tsx in src/scenes/. Duration: 1200 frames (40 seconds at 30 fps). Resolution 1920×1080.

This scene explains a problem using pure visual storytelling in the style of 3Blue1Brown (Grant Sanderson's math animation channel). Study that aesthetic: near-black background, a small number of geometric objects, smooth eased motion, colors that carry semantic meaning, and minimal text used only as labels.

Absolute constraints:


Never more than 2 distinct concepts on screen simultaneously
Text elements never exceed 6 words
Every transition is a transformation (morph/scale/fade), never a hard cut
Every animation uses spring() or eased interpolate() — never linear motion
Hold on key frames for at least 30 frames after a reveal (let it breathe)


Color System

BG:        '#0d0d1a'   // near-black with blue undertone
BLUE:      '#58C4DD'   // 3B1B signature blue — neutral data
GRAY:      '#6b7280'   // unknown / unjudged
RED:       '#FC6255'   // 3B1B red — failure, hallucination
YELLOW:    '#F0DB4F'   // attention, the question
WHITE:     '#FFFFFF'   // primary text
DIM:       '#3a3a4a'   // backgrounded elements

Typography


Font: Inter, imported via @remotion/google-fonts/Inter
Weights: 300 (labels), 500 (emphasis), 700 (the one key statement)
Sizes: labels 24px, statements 42px, the single hero line 64px
Letter-spacing: 1px on all uppercase labels
All text fades in with opacity + slight upward translate (8px). Never slides in from the side.



BEAT 1 — One interaction (Frames 0–150, 5 seconds)

Frame 0–30: Empty black screen. Hold.

Frame 30–60: A single small circle (radius 12px, color BLUE) fades in at position (560, 540) — left-center of screen. Scale from 0.6 → 1.0 with spring (damping 12).

Small label below it, 24px, WHITE, opacity 0.7: "Advisor"

Frame 60–100: A line draws itself from the circle to the right, ending at (1360, 540). The line draws using strokeDasharray animation — it grows from length 0 to full length. Color BLUE, 2px stroke.

Frame 100–130: At the line's endpoint, a second circle fades in (same size, BLUE). Label below: "AI Teammate"

Frame 130–150: Two small text elements fade in above the line:


Above left circle, 22px, WHITE 0.8 opacity: "What's the minimum investment?"
Above right circle, 22px, BLUE: "$25,000"


Hold this frame. This is a complete, clean, simple picture. Do not add anything else.


BEAT 2 — It becomes a trace (Frames 150–300, 5 seconds)

Frame 150–200: Everything on screen — both circles, the line, both text labels — collapses inward toward the center point (960, 540). Use a scale transform from 1.0 → 0.0 with easing. As they collapse, opacity drops to 0.

Frame 200–230: At the exact moment of collapse, a single dot (radius 8px, GRAY) appears at center with a small scale-pop (0 → 1.2 → 1.0, spring damping 8).

This is the key transformation: an entire interaction has become one data point.

Frame 230–270: The dot travels rightward along an eased path to (1400, 540). As it moves, a rectangle outline fades in around that destination — a box, 300×400px, stroke BLUE 1.5px, no fill, corner radius 8px.

Label above the box, 24px letter-spaced uppercase, BLUE: "TACHYON OVERWATCH"

Frame 270–300: The dot enters the box and settles at the top-left of an invisible grid inside it. Hold.


BEAT 3 — Multiplication (Frames 300–540, 8 seconds)

This is the scale reveal. The single dot becomes thousands.

Frame 300–380: Dots begin streaming in from the left edge of the screen toward the box. Start slow (2-3 dots), then accelerate. Each dot:


Enters at a random y-position on the left edge
Follows a slightly curved eased path to the box
Settles into the next available position in a grid inside the box


Simultaneously, a counter appears below the box, 32px, monospace (JetBrains Mono), WHITE:

1

It counts up as dots arrive. Use easing so it accelerates: 1 → 12 → 87 → 340 → 1,200 → 4,800 → 10,000

Frame 380–460: The stream becomes a blur of motion — hundreds of dots per second. The box fills with a dense grid of GRAY dots. The counter races.

Frame 460–500: The stream stops abruptly. Counter locks at 10,000.

Camera pulls back slightly (scale entire scene 1.0 → 0.85) to reveal the full box, now dense with gray dots.

Below the counter, small label fades in, 24px, WHITE 0.6: "Every week."

Frame 500–540: Hold. Complete stillness. Let the scale land.


BEAT 4 — All identical, all unknown (Frames 540–750, 7 seconds)

Frame 540–600: The box and its 10,000 dots slide to the left third of the screen and scale down slightly. Everything else on screen (counter, labels) fades to 20% opacity.

Frame 600–650: A single line of text fades in on the right side of the screen, 42px, WHITE, weight 500:

"Every answer. Stored."

Hold 30 frames.

Frame 650–700: That text fades out. A new line fades in, same position, same style — but in YELLOW:

"Which ones are correct?"

Frame 700–750: All 10,000 dots begin a slow synchronized pulse (opacity 0.6 → 1.0 → 0.6, period 60 frames). They are all identical. Indistinguishable. The pulse emphasizes: we cannot tell them apart.

Hold.


BEAT 5 — The hidden failures (Frames 750–960, 7 seconds)

This is the emotional core of the scene.

Frame 750–800: The camera zooms into the box — scale up 1.0 → 2.5, centering on a section of ~100 visible dots. Individual dots become clearly visible.

All still GRAY. All still identical.

Frame 800–850: Suddenly, ~8 dots flip to RED — one at a time, in rapid succession (5-frame intervals). Each flip is a quick color transition + tiny scale pulse.

Text fades in at bottom, 42px, RED:

"Some are hallucinated."

Hold 20 frames.

Frame 850–900: The RED dots flip back to GRAY.

The text changes to, in WHITE:

"We just don't know which."

This is the punch. The failures exist. But they're invisible.

Frame 900–960: All dots resume the uniform gray pulse. Hold in silence. The viewer should feel the weight of not knowing.


BEAT 6 — The gap (Frames 960–1200, 8 seconds)

Frame 960–1010: Camera pulls back out to show the full box again (scale 2.5 → 1.0).

The box moves to center-left. Everything else fades away.

Frame 1010–1060: An arrow draws itself pointing INTO the box from the left. Label above the arrow, 24px, BLUE: "Traces in"

Frame 1060–1120: On the right side of the box, another arrow attempts to draw itself pointing OUT — but it stops halfway and turns into a dashed line, then fades.

In its place, a large "?" appears, 96px, YELLOW, with a soft scale-in.

Below the "?", small text, 24px, WHITE 0.7: "No verdict."

Frame 1120–1170: A single line of text fades in at the bottom center, 42px, WHITE, weight 700:

"Overwatch stores. It doesn't judge."

Frame 1170–1200: Everything holds. Then, in the final 15 frames, a dashed rectangle fades in to the right of the box — an empty outline, stroke GRAY 1.5px dashed, same size as the Overwatch box.

It is empty. It is the missing piece.

The scene ends on this frame — the visual question mark of what should go there.


Technical Requirements


Component name: ProblemStatementScene, default export
Use useCurrentFrame() and useVideoConfig()
All entrance animations use spring({ frame, fps, config: { damping: 12, mass: 1 } })
All fades use interpolate() with extrapolateRight: 'clamp' and easing: Easing.bezier(0.25, 0.1, 0.25, 1)
Dots should be rendered as SVG <circle> elements inside a single <svg> for performance
The 10,000 dots: render only ~400 visible dots in the grid (visual density is enough — nobody counts). The counter says 10,000; the visual shows a dense representative sample.
Camera zoom = wrap the entire scene content in a <div> with a transform: scale() driven by interpolate()
Colors from constants.ts


Reusable Components

Create in src/components/:


Dot.tsx — a single circle with color, pulse, and flip animations (props: x, y, color, pulseDelay, flipAtFrame, flipColor)
DrawnLine.tsx — line that draws itself via strokeDasharray (props: x1, y1, x2, y2, startFrame, duration, color)
DrawnArrow.tsx — arrow that draws itself, with optional "fails halfway" variant
FadeText.tsx — text that fades in with 8px upward translate (props: text, size, color, weight, startFrame, x, y)
CountUp.tsx — animated number counter with easing (props: from, to, startFrame, duration)


Integration

tsx<Sequence from={0} durationInFrames={1200}>
  <ProblemStatementScene />
</Sequence>


PART 2 — VOICE-OVER SCRIPT (40 seconds)


Tone: Calm, deliberate, curious. Think documentary narrator — not salesman.
Pace: Slow. Let the silences breathe with the visuals.
[.] = 400ms pause · [..] = 800ms pause · [...] = 1.5s silence (visual carries it)




[0:00 – 0:05] (Single interaction draws itself on screen)


"An advisor asks a question. [.] The AI answers."



[0:05 – 0:10] (Everything collapses into one gray dot, travels into the box)


"That's one interaction. [..] And it gets recorded."



[0:10 – 0:18] (Dots stream in. Counter races to 10,000)


"One trace. [.] Stored in Tachyon Overwatch."

[...]

"Ten thousand of them. [.] Every week."



[0:18 – 0:25] (Box slides left. Text: "Every answer. Stored." → "Which ones are correct?")


"Every answer we've ever given [.] is sitting right there."

[..]

"So — [.] which ones are correct?"



[0:25 – 0:32] (Zoom in. 8 dots flash red, then vanish back to gray)


"Some of these [..] are hallucinated. [.] Made up."

[...]

"We just don't know which ones."



[0:32 – 0:40] (Arrow in. No arrow out. A question mark. The empty dashed box appears)


"Because Overwatch stores. [..] It doesn't judge."

[...]

"And that's the gap."



[0:40] END.


Word count: ~75 words in 40 seconds.

That's deliberately slow — roughly 110 words/minute instead of the usual 150. The silences are not dead air. They're where the visual does the talking. That's the 3Blue1Brown discipline: if the animation is doing its job, you should be able to stay quiet.


PART 3 — WHY THIS WORKS

The core visual argument, in three moves:


Abstraction — a rich human interaction collapses into a single gray dot. The viewer feels the reduction. This is what data does: it flattens.
Scale — one dot becomes ten thousand. The viewer feels the impossibility of manual review. Nobody says "you can't check 10,000 by hand" — the animation says it.
The invisible failure — red dots appear, then vanish. This is the single most important frame in the scene. The failures exist, but they are not visible. That gap between existence and visibility is the entire problem, expressed in one animation beat.


What we deliberately did NOT do:


No architecture diagram
No logos
No bullet points
No mention of Claude, GraphQL, FastAPI, or any implementation detail
No numbers except one: 10,000


The scene has exactly one job: make the executive feel the weight of not knowing. Everything else comes later.


PART 4 — THE FINAL FRAME

The scene ends on an empty dashed box. Nothing fills it.

That silence is intentional. The next scene answers it.
ArtifactsComplete voiceover scriptDocument · MD Phase 2 implementation promptDocument · MD Where we are sceneDocument · MD Remotion demo codeDocument · MD Who uses it corporateDocument · MD Final voiceover scriptDocument · MD Complete voiceover conversationalDocument · MD Remotion demo previewCode · HTML Final short scriptDocument · MD Live demo scriptDocument · MD Three cases remotion sceneDocument · MD Combined final scriptDocument · MD Trigger flow remotion sceneDocument · MD Copilot remotion promptDocument · MD Where we are architectureCode · HTML Benchmarking sceneDocument · MD Who uses it sceneDocument · MD ContentTurboScribe Recording (29/06/2026, 13:16:23)
29 Jun 2026, 13:33
TurboScribe Recording (29/06/2026, 13:16:23)
Play


09:22
00:45
Mute

Settings
(0:12) Okay (0:42) Yeah (1:12) Okay (1:17) Okay (1:27) Okay (1:42) Other three are coming under group test environment. Okay, so you have PTE, under PXP and pasted
TurboScribe Recording (03/07/2026, 20:44:40)
Play


12:49
12:53
Mute

Settings
(0:00) Just take it as far as we can, it's likely going to carry over into August for the hybrid work. (0:07) Okay, got it. So here's the key behind this.
So this this one happens to be a spreadsheet for (0:14) PTE, righpastedurboScribe Recording (04/06/2026, 12:15:11)
4 Jun 2026, 13:04
TurboScribe Recording (04/06/2026, 12:15:11)
Play


00:00
34:06
Mute

Settings
(0:32) But this one, we have to work with the team. (0:35) That... (0:36) Portability is where they will help us to fix it. (0:39) Okay, this is going to be thpasted(0:00) This is a test ID to map to this particular PPID (0:04) You have just requested (0:05) Now when it is approved (0:07) You will get a test ID in your name (0:10) Like 0786 or something like that (0:14) When you get that test ID (0:16) Then your test ID (0:18) Which was generated (0:20) The newpastedTurboScribe Logo
TurboScribe
Pricing
FAQs
Blog
1 of 3 daily transcriptions used

Shortcuts
Folders
Export





More




TurboScribe Recording (06/07/2026, 12:41:58)
6 Jul 2026, 12:55
TurboScribe Recording (06/07/2026, 12:41:58)
Play


00:00
13:38
Mute

Settings
(0:16) Pranav, do you remember the reppasted
TurboScribe Recording (06/07/2026, 17:43:35)
Play


03:19
14:11
Mute

Settings
(0:17) Hi guys, so I was doing that but I was confused with the IT factory which is present in the (0:24) Jproc. (0:25) I mean I was like here I am getting some different names. (0:28) So what it would be then, so I justpasted
