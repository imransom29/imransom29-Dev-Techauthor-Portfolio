Remotion Scene: "3 Cases of AI Failure" — 60-Second Segment


For: Rahul Vinayak's Supervisor Evaluation Service demo video
Purpose: Show 3 real-world AI failure cases to justify the need for evaluation
Duration: 60 seconds (1800 frames at 30 fps)
Structure: 20 seconds per case × 3 cases




PART 1 — COPILOT ANIMATION PROMPT

Paste this prompt into VSCode Copilot (Agent mode) inside your existing Remotion project:


Create a new Remotion scene component called ThreeCasesScene.tsx inside src/scenes/ folder. This scene runs for 1800 frames (60 seconds at 30 fps) and dramatically presents three real-world AI failure cases that justify why continuous LLM evaluation is critical for enterprises.

Scene Structure (3 sub-scenes, 20 seconds each = 600 frames each)

Each case follows the same visual pattern for consistency, but with distinct branding colors:


Case 1 (Air Canada): Frames 0-600 — Red accent (#D91E28)
Case 2 (ICICI Bank): Frames 600-1200 — Orange accent (#F58220)
Case 3 (Builder.ai): Frames 1200-1800 — Purple accent (#9333EA)


Global Scene Design

Background:


Deep navy base (#0a0e27) with subtle particle grid
Add a horizontal scanline effect that sweeps top-to-bottom during case transitions (creates cinematic "breaking news" feel)
Include a persistent bottom-left counter showing "CASE 1/3", "CASE 2/3", "CASE 3/3" that updates per sub-scene


Typography:


Use Inter font (imported via @remotion/google-fonts/Inter)
Headlines: 900 weight, 72-84px
Body text: 400 weight, 24-28px
Company name: 700 weight, 42-56px



Sub-Scene 1: Air Canada (Frames 0-600, 20 seconds)

Frame 0-90 (3 seconds): Case reveal


Red scanline sweeps across screen top-to-bottom (frames 0-30)
"CASE 1" appears bottom-left (small, white, monospace)
"AIR CANADA" fades in from black to red (#D91E28) at center-top with a slight scale bounce (spring animation, damping: 8)
Date "February 2024" appears below in small muted text
Location tag: "Canadian Civil Resolution Tribunal"


Frame 90-270 (6 seconds): The scenario


Split screen: Left half shows chat bubble animation (simulated chatbot conversation)
Chat bubble 1 (customer, gray): "My grandmother passed away. Can I get a bereavement fare?"
Chat bubble 2 (chatbot, cyan): "Yes, you can claim it retroactively within 90 days after your trip."
Chatbot bubble should have a subtle glitch/error effect (red flicker for 3 frames) — visual hint that this is wrong
Right half shows text callout: "BUT THAT WAS NEVER THE POLICY." (large, red, animated typewriter effect)


Frame 270-420 (5 seconds): The consequence


Split screen collapses
Center of screen: Court gavel icon (from lucide-react Gavel icon), scale in from 0 with spring
Below: "Air Canada Held Legally Liable"
Damages banner: "$812.02 damages + legal fees" (typewriter effect)
Precedent text (smaller): "First case establishing corporate liability for AI hallucinations"


Frame 420-570 (5 seconds): The lesson


Full-width bottom bar (red gradient background)
Left: Large "❌" red X icon
Center text: "WRONG BELIEF: 'The chatbot is a separate entity — we're not responsible.'"
This entire section slides in from bottom with spring animation


Frame 570-600 (1 second): Transition out


Everything fades to 20% opacity
Red scanline sweeps top-to-bottom in reverse (setup for Case 2)



Sub-Scene 2: ICICI Bank (Frames 600-1200, 20 seconds)

Frame 600-690 (3 seconds): Case reveal


Orange scanline sweeps
"CASE 2" updates bottom-left
"ICICI BANK" fades in with orange accent (#F58220)
Date subtitle: "2023 — Public Twitter incident"
Location tag: "India — Retail Banking"


Frame 690-870 (6 seconds): The scenario


Center of screen: Simulated chat interface with 4 stacked messages:

Customer: "I want to close my credit card. I didn't get the credit limit increase." (gray bubble)
Chatbot: "Great! Let me help you INCREASE your credit limit..." (cyan bubble with glitch effect)
Customer: "NO. I want to CLOSE the account." (gray bubble, slight red border to show frustration)
Chatbot: "Let me redirect you. Try again to get your limit increased..." (cyan bubble, more prominent glitch)



Each message slides in from bottom with 20-frame delay stagger
After all 4 appear, a red "LOOP DETECTED" stamp animates in overlay (rotated 15 degrees, scale bounce)


Frame 870-1020 (5 seconds): The consequence


Chat interface fades to background (30% opacity)
Foreground: 3 metrics counter animation (numbers count up from 0):

"4+ Days" — customer wait time (large, orange)
"0" — successful resolutions (red)
"Twitter" — public complaint channel (with Twitter/X bird icon)



Below: "Customer trust: DAMAGED" in white bold


Frame 1020-1170 (5 seconds): The lesson


Full-width bottom bar (orange gradient background)
Left: Large "❌" red X icon
Center text: "WRONG BELIEF: 'AI can replace customer service without testing edge cases.'"
Slides in with spring animation


Frame 1170-1200 (1 second): Transition out


Fade to 20% opacity
Orange scanline sweeps (setup for Case 3)



Sub-Scene 3: Builder.ai (Frames 1200-1800, 20 seconds)

Frame 1200-1290 (3 seconds): Case reveal


Purple scanline sweeps
"CASE 3" updates bottom-left
"BUILDER.AI" fades in with purple accent (#9333EA)
Sub-header: "aka 'Engineer.ai' — the fake AI unicorn"
Date subtitle: "Collapsed May 2025"
Location tag: "London / India — $445M raised"


Frame 1290-1470 (6 seconds): The scenario


Center: Large "NATASHA" text with fake AI hologram effect (subtle glow, tech border)
Below: Marketing tagline appears typewriter: "AI that builds apps 6x faster, 70% cheaper"
Then, a "reveal" animation:

"NATASHA" logo shatters/glitches out
Behind it, 700+ small human silhouettes appear in a grid pattern (rows of stick figures)
Text overlay: "700 Indian developers manually coding"
Small red "EXPOSED" stamp animates in top-right corner





Frame 1470-1620 (5 seconds): The consequence


Screen splits into 4 quadrants (2x2 grid), each with a metric:

Top-left: "$445M" — investors lost (with SoftBank, Microsoft, Qatar logos as icons)
Top-right: "8 years" — deception duration
Bottom-left: "BANKRUPT" — company status (large red text)
Bottom-right: "FBI" — federal investigation (with justice scale icon)



Each quadrant slides in from its corner with staggered animation (10-frame delays)


Frame 1620-1770 (5 seconds): The lesson


Full-width bottom bar (purple gradient)
Left: Large "❌" red X icon
Center text: "WRONG BELIEF: 'Nobody will verify if the AI is real — deploy and market it.'"
Slides in with spring


Frame 1770-1800 (1 second): Powerful closing beat


All three case titles reappear as small horizontal thumbnails at the top:

"AIR CANADA" (red)
"ICICI BANK" (orange)
"BUILDER.AI" (purple)



Below, one unifying message appears center screen with dramatic scale-up spring animation:

"THE COMMON FAILURE: NO EVALUATION."



This text is 96px, bold white, with a subtle red-to-purple gradient
Underline appears after 15 frames



Technical Requirements


Component name: ThreeCasesScene
Export as default
Use useCurrentFrame() for all timing
Use interpolate() with extrapolateRight: 'clamp' for smooth animations
Use spring() for entrance animations (damping: 12, mass: 1)
All colors from constants.ts (add new ones: AIR_CANADA_RED: '#D91E28', ICICI_ORANGE: '#F58220', BUILDER_PURPLE: '#9333EA')
Use lucide-react icons: Gavel, AlertTriangle, MessageSquare, X, Users, Scale
Add subtle sound design placeholder comments (e.g., // SFX: scanline whoosh at frame 0)


Reusable Sub-Components

Create these helpers in src/components/:


Scanline.tsx — the sweeping horizontal line effect
ChatBubble.tsx — reusable chat message component (props: sender, message, delay, isError)
CaseCounter.tsx — bottom-left "CASE X/3" indicator
WrongBeliefBanner.tsx — the full-width bottom bar with the wrong belief text


Integration

After creating this scene, update SupervisorEvalDemo.tsx to include:

tsx<Sequence from={<PREVIOUS_END>} durationInFrames={1800}>
  <ThreeCasesScene />
</Sequence>

Confirm the scene renders without errors, then let me know the total updated composition duration.


PART 2 — VOICE-OVER SCRIPT (60 SECONDS, PERFECTLY SYNCED)


Recording tips:


Total: 60 seconds. Aim for ~155 words (natural pace ~150 words/min for professional narration)
Tone: Serious, journalistic, with dramatic pauses
Recommended: Record 3 separate 20-second clips, then stitch — makes retakes easier
Emphasize BOLD words with slight volume/pace shift
Pause markers [...] = short 300ms pause; [......] = longer 800ms pause





[0:00 – 0:20] Case 1: Air Canada

[0:00] (As the red scanline sweeps and "AIR CANADA" appears)


"February 2024. [...] Air Canada's chatbot [...] told a grieving customer he could claim a bereavement fare after his flight."



[0:07] (As the chat bubbles animate on screen)


"But that was never the policy. [......] The chatbot had hallucinated it."



[0:12] (As the gavel icon and damages banner appear)


"The court's ruling? [...] Air Canada was legally liable for what its AI said. [...] They paid damages [...] and set a global precedent."



[0:19] (Wrong belief banner slides in)


(No narration — let the on-screen text land silently for 1 second)




[0:20 – 0:40] Case 2: ICICI Bank

[0:20] (Orange scanline, ICICI BANK appears)


"India, 2023. [...] An ICICI Bank customer tried to close his credit card."



[0:26] (As the chat loop animates)


"The chatbot [...] kept redirecting him [...] to increase his credit limit instead. [......] Again. [...] And again."



[0:34] (As metrics counter animates)


"Four days later — [...] no resolution. [...] The complaint went public on Twitter. [...] Customer trust — gone."



[0:39] (Wrong belief banner)


(Silence, let text land)




[0:40 – 1:00] Case 3: Builder.ai

[0:40] (Purple scanline, BUILDER.AI appears)


"Builder dot A-I. [...] The London startup that raised four hundred and forty-five million dollars [...] from SoftBank, Microsoft, and Qatar."



[0:49] (As NATASHA logo shatters into human figures)


"Their 'AI assistant' Natasha [......] was actually seven hundred Indian engineers [...] manually writing code."



[0:55] (As the 4-quadrant metrics land)


"The company collapsed. [...] The FBI is investigating."



[0:58] (As the closing message appears)


"Three companies. Three disasters. [......] One common failure: [...] no evaluation."



[1:00] END.


PART 3 — DELIVERY CHECKLIST

Before recording voice-over:


 Watch the scene render at least twice to internalize timing
 Practice each 20-second block separately with a stopwatch
 Record in a quiet room with no background noise
 Use a decent USB mic (Blue Yeti, or even iPhone with pop filter)
 Save as high-quality WAV, then convert to MP3 for Remotion


Voice-over integration in Remotion:

tsximport { Audio, staticFile, Sequence } from 'remotion';

// Inside ThreeCasesScene:
<Audio src={staticFile('voice-over-3-cases.mp3')} />

Rendering with audio:

bashnpx remotion render src/index.ts SupervisorEvalDemo out/demo-with-audio.mp4

Remotion automatically syncs audio to video timeline.


PART 4 — WHY THIS SCENE WORKS (For Your Own Understanding)

Psychological arc:


Case 1 (Air Canada): Legal consequence — hits leadership/regulatory concerns
Case 2 (ICICI Bank): Customer trust — hits business/UX concerns
Case 3 (Builder.ai): Corporate integrity — hits investor/credibility concerns
Closing punchline: All three failures had one common root — no evaluation — which directly justifies the existence of the Supervisor Evaluation Service.


Emotional pacing:


Case 1: Serious, factual (legal drama)
Case 2: Frustrating, relatable (bad UX everyone has faced)
Case 3: Shocking, dramatic (fraud reveal)
Ending: Unifying, purposeful (your service = the answer)


Audience takeaway:


"Every company that skipped evaluation paid a price. Wells Fargo isn't going to be next — because we built this."



This is exactly what Deepak Elias and David Mosciatti need to see: the risk case in 60 seconds.
