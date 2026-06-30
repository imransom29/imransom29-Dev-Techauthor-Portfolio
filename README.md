Prompt: LLM Trace Explorer — Observability Dashboard UI

Build a production-grade LLM Observability Trace Explorer as a single React component (.jsx) using inline styles only — no Tailwind classes, no external CSS files.


Design System

Color Palette


Background: Deep navy/near-black (#060b18) — never pure black
Surface cards: Subtle white overlays (rgba(255,255,255,0.012) to rgba(255,255,255,0.03))
Borders: Ultra-subtle (rgba(255,255,255,0.04) to rgba(255,255,255,0.06))
Primary text: #f1f5f9 (headings), #e2e8f0 (body), #cbd5e1 (secondary)
Muted text: #94a3b8, #64748b, #475569, #334155 (layered hierarchy)
Accent: Indigo #6366f1 with glow (box-shadow: 0 0 12px #6366f188)
Status colors:

Pass/Success: #34d399
Warning: #fbbf24
Fail/Error: #f87171



Span type colors (each with a bg, border, text variant at low opacity):

LLM: Indigo #6366f1
Embedding: Sky #0ea5e9
Retriever: Purple #a855f7
Tool: Amber #f59e0b
Evaluator: Teal #14b8a6





Typography


Font stack: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace for IDs, attribute keys/values, durations: monospace
Use fontVariantNumeric: "tabular-nums" on all numeric columns for alignment
Scale: 8px labels → 9-10px metadata → 11-12px body → 13-14px titles → 15-16px page header
Letter spacing: 0.05em to 0.08em on uppercase labels only
Weight: 400 body, 500 row names, 600 section titles, 700 headings/scores


Spacing & Layout


Page padding: 14-22px
Card padding: 11-16px
Card border-radius: 8px
Inner element border-radius: 3-6px
Consistent gap rhythm: 5, 6, 8, 10, 12px



Page Structure

1. Top Bar (fixed header)


Left: Dot indicator (accent color with glow) + App name (bold) + subtitle (muted)
Right: Trace count + time range (muted, small text)
Bottom border: 1px solid rgba(255,255,255,0.05)
Background: barely visible surface (rgba(255,255,255,0.012))


2. Trace List (main content area, scrollable)

Each trace is a collapsible card:


Collapsed row — CSS Grid: [name + id] [timestamp] [duration] [tokens]

Left: Chevron (▶, rotates 90° on open) + status dot + trace name (white, medium weight) + trace ID (monospace, very muted)
Hover: subtle background shift (rgba(255,255,255,0.02))
Active/open: indigo-tinted border and background



Expanded area (animated with max-height transition):

Column headers row: very small, uppercase, muted
Span rows — CSS Grid: [status dot] [name + model] [type tag] [duration] [eval badge] [waterfall bar]

Clickable — opens side panel
Selected state: indigo left border (2px solid #6366f1) + indigo background tint
Hover state: subtle white overlay








3. Waterfall Visualization


Horizontal bar per span, positioned by startOffset / totalDuration * 100%
Width = duration / totalDuration * 100% (min 2%)
Bar color: gradient from span type color (opaque → semi-transparent)
Smooth transition on all properties


4. Type Tags


Tiny uppercase pill: fontSize: 9, fontWeight: 700, letterSpacing: 0.05em
Background: type color at ~12% opacity
Border: type color at ~20% opacity
Text: type color light variant


5. Eval Badge (in span row)


Shows worst verdict across all eval factors for that span
Tiny uppercase text with verdict color + faint colored background



Side Panel

Behavior


Slides in from right: transform: translateX(0/100%)
Transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1) — fast spring-like ease
Width: 54%, min 420px
When open, a dark overlay (rgba(0,0,0,0.35)) covers the left portion, clickable to close
Close button: top-right, subtle bordered square, hover brightens


Panel Header


Top line: Status dot (with glow) + span name + type tag
Metadata line: Span ID (mono) · model name · duration (accent color)
Quick metrics row: Small cards showing Duration, Tokens, In, Out — each a mini box with uppercase label + bold value
Eval summary bar (if evals exist): Shows count of pass/warn/fail with colored dots
Tab switcher: "Evaluations (9)" | "Attributes & I/O" — underline-style tabs, indigo active indicator


Evaluations Tab

Each eval factor is a clickable accordion card:

Collapsed state:


Left: Score Ring (SVG circular progress — ring on dark background, colored arc, strokeLinecap: round, animated stroke-dashoffset)
Center: Factor name (bold) + verdict badge (tiny, colored) + description (truncated, muted)
Right: Score value (large, monospace, verdict-colored) + chevron


Expanded state (animated max-height):


Top border in verdict color
Reasoning block: Dark inset box (rgba(0,0,0,0.25)) with the LLM judge's explanation
Factor-specific detail widget (varies per factor):

Evidence list: Checkmark/cross icon per claim with text
Category bars: Horizontal progress bars per sub-category
Claim counts: Three stat boxes (supported / unsupported / total)
Key-value pairs: Simple label → value in subtle boxes
Metric grids: 3-column grid of stat boxes (value + label)





Attributes & I/O Tab

Collapsible sections (▶ toggle, animated max-height):


Attributes: Alternating-row table, monospace key-value pairs
Input: Monospace pre-wrap block with scroll, dark background
Output: Same as input



Animation Guidelines


Page mount: Fade in (opacity 0→1, 0.5s ease)
Trace cards: Stagger in with translateY(8px→0) + opacity, transitionDelay: index * 70ms
Span rows: Deeper stagger: (traceIndex * 4 + spanIndex) * 30 + 120ms
Expand/collapse: max-height transition with cubic-bezier(0.16, 1, 0.3, 1), ~400ms
Side panel: transform slide with spring bezier, 400ms
Score rings: stroke-dashoffset animated over 0.8s cubic-bezier(0.16, 1, 0.3, 1)
Hover states: transition: all 0.12-0.15s — snappy, not sluggish
Chevron rotation: transform rotate(0→90deg), 200ms



Interaction Model


Click trace row → expands to show spans (toggles closed if already open)
Click span row → side panel slides in with that span's details
Click eval factor card → expands to show detailed breakdown (accordion — only one open at a time)
Click tab → switches between Evaluations and Attributes views
Click overlay or ✕ → closes side panel
Hover on any interactive element → subtle visual feedback



Technical Constraints


Single .jsx file, default export
All styles inline (no CSS modules, no Tailwind, no styled-components)
Use React hooks: useState, useEffect
No external dependencies beyond React
Mock data defined at top of file
All colors as direct hex/rgba values — no CSS variables
Responsive considerations: min-widths on panel, grid layouts that don't break



What NOT to Do


No rounded-corner-everything — be selective (8px cards, 3-6px inner elements)
No gratuitous gradients or glassmorphism
No bouncy/playful animations — this is an engineering tool
No bright backgrounds or light mode
No emoji in the UI (use geometric symbols: ●, ▶, ✕, ✓, ✗, ⚠)
No shadows except the accent dot glow
No borders thicker than 2px (and 2px only for selected state indicator)
