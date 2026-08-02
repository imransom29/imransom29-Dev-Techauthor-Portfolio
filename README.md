# UI Build Prompt — Supervisor Evaluation Dashboard

Paste this whole document to your coding agent. It is written to be executed
section by section. Do not skip Section 5 — every later section depends on the
tokens defined there.

---

## 1. ROLE AND CONTEXT

You are building the front end for the **Supervisor Evaluation Service** at a
large bank. This service evaluates the output of an internal AI assistant used
by financial advisors, and it needs a review interface that a human can use to
inspect thousands of evaluated responses quickly.

The reference for **information architecture only** is Google's LLM
Comparator. Study its layout logic: a dense scrollable table of evaluated
items on the left, a persistent analysis sidebar on the right, filter state
surfaced as removable chips at the top, and per-row micro-visualisations that
let a reviewer scan without expanding anything.

**Do not copy its visual style.** Colours, typography, spacing, motion and
component shapes must come from the design system defined in Section 5. The
resemblance should be structural, not cosmetic — someone who knows LLM
Comparator should recognise the *shape* of the workflow, not the product.

---

## 2. WHAT THE PRODUCT DOES

A reviewer selects a project and a time window, presses Evaluate, and the
service:

1. Pulls traces from an observability platform called **Overwatch**
2. Runs our own evaluator (hallucination detection, using an LLM as a judge)
3. Calls a partner team's evaluators over an API (sensitivity, explainability,
   performance and others)
4. Compares the two sets of verdicts and classifies where they agree
5. Writes verdicts back to Overwatch as annotations

**Results stream in over Server-Sent Events while this happens.** The UI must
show rows arriving progressively, not a spinner followed by a full table.

### Core domain vocabulary

| Term | Meaning |
|---|---|
| **Span** | One operation inside a trace — an LLM call, a tool call, a chain step |
| **Trace** | One complete request cycle, containing many spans |
| **Thread** | One conversation, containing many traces |
| **Verdict** | A categorical outcome: `PASSED`, `REVIEW`, `FAILED` |
| **Grounded** | The output is supported by the retrieved context |
| **Hallucinated** | The output asserts something the context does not support |
| **Agreement** | Whether two independent evaluators reached the same verdict |
| **SME** | Subject matter expert — the human who resolves disagreements |
| **Annotation** | A verdict written back onto the span in Overwatch |

---

## 3. USERS AND WHAT THEY NEED

### Persona A — Engineering reviewer (primary, daily)
Runs evaluations after a prompt change and needs to know whether quality moved.
Cares about: which spans failed, why, and whether the failure clusters around
a particular kind of query.

### Persona B — SME reviewer (weekly)
Opens the disagreement list, reads both machine verdicts, decides which is
right. Their decision becomes training data. Cares about: seeing the full
evidence for one span with minimum clicks.

### Persona C — Model risk reviewer (monthly, and during audit)
Needs aggregate numbers and an export. Cares about: pass rate by category,
sample sizes, and provenance — who scored this, with which evaluator version,
when.

**Design implication:** the default view serves Persona A. Persona B gets a
dedicated filtered view. Persona C gets the aggregation panel and export.

---

## 4. TECH STACK — HARD CONSTRAINTS

```
React 18 with TypeScript, strict mode on
Vite
Tailwind CSS — core utility classes only, no arbitrary values in JSX
TanStack Query for server state
TanStack Virtual for list virtualisation
Zustand for client UI state
Recharts for charts
lucide-react for icons
react-router-dom v6
```

### Rules

- **No `localStorage` or `sessionStorage`.** Persist view state in the URL
  query string instead.
- **No component file over 200 lines.** Split before you exceed it.
- **No arbitrary Tailwind values** (`w-[347px]`). Extend the theme instead.
- **Every list over 100 rows must be virtualised.** Time-range runs can return
  200,000 rows.
- **No `any`.** If a type is genuinely unknown use `unknown` and narrow it.
- All colour, spacing, radius and duration values come from tokens. No raw hex
  in components.

---

## 5. DESIGN SYSTEM

This is the section that makes the product feel like ours rather than a clone.
Define these as Tailwind theme extensions in `tailwind.config.ts` and as CSS
custom properties on `:root`.

### 5.1 Concept

**Dark, calm, instrument-panel.** The reviewer stares at this for an hour at a
time. Surfaces recede, data comes forward. Colour is used almost exclusively
for verdict semantics — nothing decorative competes with it.

Reference feel: an aircraft systems display or a professional audio meter.
Precise, quiet, high signal density, no visual noise.

### 5.2 Colour tokens

```ts
// Surfaces — four levels of elevation, each a small step
surface: {
  base:     '#0B0F16',  // page background
  raised:   '#121823',  // cards, table body
  overlay:  '#1A2231',  // expanded rows, dropdowns, modals
  hover:    '#212B3D',  // row hover, button hover
}

// Borders — two weights only
border: {
  subtle:   '#1E2735',  // between rows, inside cards
  strong:   '#2C3849',  // card outlines, input borders
  focus:    '#4C8DFF',  // focus ring, never used for anything else
}

// Text — four levels, strictly hierarchical
text: {
  primary:   '#E8EDF5',  // values, headings
  secondary: '#96A3B8',  // labels, column headers
  tertiary:  '#5E6B7E',  // metadata, timestamps, counts
  disabled:  '#3C4655',
}

// Verdict semantics — the only saturated colour in the product
verdict: {
  pass:      '#2DD4A7',  // teal-green, not the usual green
  passBg:    '#0E2A24',
  passBorder:'#1B4A3F',

  fail:      '#FF6B7A',  // coral-red, softer than pure red
  failBg:    '#2B1219',
  failBorder:'#4A1F29',

  review:    '#FFB454',  // amber
  reviewBg:  '#2B2113',
  reviewBorder:'#4A3A1F',

  neutral:   '#7B8CA6',  // no verdict yet
  neutralBg: '#171E2A',
}

// Agreement — deliberately distinct from verdict so a reviewer never
// confuses "both judges agreed it failed" with "one judge said fail"
agreement: {
  aligned:   '#4C8DFF',  // blue — both judges concur
  alignedBg: '#111C33',
  conflict:  '#C77DFF',  // violet — they disagree, this is the interesting case
  conflictBg:'#1F1630',
}

// Data visualisation — for charts and sparklines only
chart: {
  primary:   '#4C8DFF',
  secondary: '#C77DFF',
  tertiary:  '#2DD4A7',
  quaternary:'#FFB454',
  grid:      '#1E2735',
  axis:      '#5E6B7E',
}
```

**Rule:** verdict colours never appear on anything that is not a verdict.
Buttons, links and chart series use `chart.*` or neutral tokens.

### 5.3 Typography

```ts
fontFamily: {
  sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
}

fontSize: {
  '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.04em' }],
  'xs':  ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
  'sm':  ['12px', { lineHeight: '18px' }],
  'base':['13px', { lineHeight: '20px' }],
  'md':  ['14px', { lineHeight: '22px' }],
  'lg':  ['16px', { lineHeight: '24px' }],
  'xl':  ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
  '2xl': ['26px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
}
```

**Usage rules:**

- Span IDs, checksums, scores, token counts, timestamps → **mono**
- Everything else → **sans**
- Column headers → `xs`, `font-medium`, `uppercase`, `tracking-wide`,
  `text-secondary`
- Table cell content → `base`
- Metric card values → `2xl`, `font-semibold`, mono
- Never use font weight above 600. This is an instrument, not a poster.

### 5.4 Spacing

Strict 4px base scale. Only these values exist:

```
0, 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px), 10(40px), 12(48px), 16(64px)
```

**Applied consistently:**

- Card padding: `p-4`
- Card gap in a grid: `gap-3`
- Table cell padding: `px-3 py-2`
- Expanded row padding: `p-4`
- Section gap in sidebar: `gap-4`
- Icon to label gap: `gap-2`

### 5.5 Radius

```
none: 0
sm:   3px    // chips, badges, small buttons
md:   5px    // inputs, buttons
lg:   8px    // cards, panels
xl:   12px   // modals
full: 9999px // pills, avatar
```

Deliberately tighter than typical. Sharp corners read as technical.

### 5.6 Motion

```ts
transitionDuration: {
  instant: '80ms',   // hover, focus — must feel immediate
  fast:    '140ms',  // chip appear, badge change
  normal:  '220ms',  // row expand, panel slide
  slow:    '320ms',  // route transition
}

transitionTimingFunction: {
  out:     'cubic-bezier(0.16, 1, 0.3, 1)',      // default, decelerating
  inOut:   'cubic-bezier(0.65, 0, 0.35, 1)',     // symmetric moves
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',  // new row arrival only
}
```

**Rules:**

- Hover states: `duration-instant`
- Row expand/collapse: `duration-normal ease-out`, animate `max-height` and
  `opacity` together
- **New row arriving over SSE:** fade in over `duration-fast` with a 4px
  upward translate, using `ease-spring`. Stagger by 20ms per row, capped at
  10 rows of stagger so a burst of 500 does not queue for ten seconds.
- Never animate `width` or `height` on anything containing a virtualised list
- Wrap all motion in `@media (prefers-reduced-motion: no-preference)`

### 5.7 Elevation

No drop shadows on the dark surface — they read as smudges. Use background
step plus a 1px border instead.

```
Level 0: bg-surface-base
Level 1: bg-surface-raised   + border-border-subtle
Level 2: bg-surface-overlay  + border-border-strong
Level 3: bg-surface-overlay  + border-border-strong + ring-1 ring-black/40
```

### 5.8 Focus

Every interactive element:

```
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-border-focus
focus-visible:ring-offset-2
focus-visible:ring-offset-surface-base
```

Never remove the focus ring. Never use `outline: none` without a replacement.

---

## 6. INFORMATION ARCHITECTURE

### Routes

```
/                                    → redirect to /evaluate
/evaluate                            → Run view (default)
/results/:jobId                      → Results table
/results/:jobId/spans/:spanId        → Results with a span expanded
/review/:jobId                       → Disagreements only
/benchmark                           → Judge validation
/settings                            → Project defaults
```

### Left navigation rail

Fixed 220px, collapsible to 56px icon-only. Collapse state in URL as
`?nav=collapsed`.

```
┌────────────────────────┐
│  ▣  Evaluation         │  ← wordmark, 20px icon + text-md
├────────────────────────┤
│  ▷  Run                │  /evaluate
│  ▤  Results            │  /results
│  ⚠  Review        [12] │  /review   badge = disagreement count
│  ◈  Benchmark          │  /benchmark
├────────────────────────┤
│                        │
│         (spacer)       │
│                        │
├────────────────────────┤
│  ⚙  Settings           │
│  ●  Connected          │  ← single status dot, see §12.4
└────────────────────────┘
```

**Active item:** `bg-surface-hover`, `text-primary`, and a 2px
`bg-border-focus` bar flush to the left edge of the rail.

**Review badge:** only rendered when count > 0. `bg-agreement-conflict`,
`text-surface-base`, `text-2xs`, `font-semibold`, `rounded-full`, `px-1.5`.

---

## 7. LAYOUT — RESULTS VIEW

This is the primary screen. Get this right and everything else follows.

```
┌──────┬──────────────────────────────────────────┬─────────────────────┐
│      │  CONTROL BAR                    56px     │                     │
│      ├──────────────────────────────────────────┤   ANALYSIS SIDEBAR  │
│ NAV  │  FILTER CHIP BAR                40px     │        360px        │
│ RAIL ├──────────────────────────────────────────┤      (sticky)       │
│ 220  │  METRIC CARDS                   88px     │                     │
│      ├──────────────────────────────────────────┤                     │
│      │                                          │                     │
│      │  RESULTS TABLE                           │                     │
│      │  (virtualised, fills remaining height)   │                     │
│      │                                          │                     │
└──────┴──────────────────────────────────────────┴─────────────────────┘
```

**Breakpoints:**

- `< 1280px` — sidebar collapses to a right-edge drawer, toggled by a button
  in the control bar
- `< 1024px` — nav rail auto-collapses to icons
- `< 768px` — not supported. Show a message: "This view needs a wider screen."

**Scroll:** only the table body scrolls. Control bar, chip bar, metric cards
and sidebar are all fixed. The table header is sticky within the table.

---

## 8. COMPONENT SPECIFICATIONS

### 8.1 Control bar

Height 56px. `bg-surface-raised`, `border-b border-border-subtle`,
`px-4`, flex, `items-center`, `gap-3`.

**Left group:**

| Control | Width | Detail |
|---|---|---|
| Project select | 200px | Searchable. Placeholder "Select project". |
| Time range picker | 240px | See §8.2 |
| Evaluator multi-select | 180px | "All evaluators" when none chosen |

**Right group** (`ml-auto`):

| Control | Detail |
|---|---|
| Row count | `text-tertiary text-sm` — "1,247 spans" |
| Export | Icon button, opens menu: CSV / XLSX |
| Run Evaluate | Primary button, see below |

**Evaluate button states:**

```
idle      "Run Evaluation"  bg-chart-primary  text-surface-base
running   "Evaluating…"     bg-surface-hover  + 14px spinner + Cancel affordance
done      returns to idle after 2s
disabled  when no project selected — cursor-not-allowed, opacity-50,
          tooltip "Select a project first"
```

While running, the button must show a **live count**: `Evaluating… 342 / 1,247`.
Pull this from the SSE progress events.

### 8.2 Time range picker

**Replaces any count-based limit control.** A reviewer thinks in time, not in
row counts. "Last 100 spans" forces them to work out how many spans happened
yesterday; "Yesterday" does not.

```
┌───────────────────────────────────────┐
│  Last 24 hours              ▾         │   trigger, shows current selection
└───────────────────────────────────────┘
       ↓ opens popover, 320px wide
┌───────────────────────────────────────┐
│  Last 1 hour                          │
│  Last 6 hours                         │
│  Last 24 hours                    ✓   │
│  Last 7 days                          │
│  Last 30 days                         │
│  ─────────────────────────────────    │
│  Custom range…                        │
└───────────────────────────────────────┘
```

Custom opens a two-month calendar with time inputs. On apply, the trigger
shows `12 Jul 09:00 → 13 Jul 17:30` in mono.

**URL sync:** `?from=2026-07-12T09:00:00Z&to=2026-07-13T17:30:00Z`
Presets serialise as `?range=24h` so a shared link stays relative.

**Guard rail:** if the selected range would exceed 50,000 spans, show an
inline warning under the picker before the run starts:
> ⚠ This range covers approximately 180,000 spans. Consider narrowing it or
> the run may take over an hour.

Do not block it. Warn and let them proceed.

### 8.3 Filter chip bar

Height 40px, `bg-surface-base`, `border-b border-border-subtle`, `px-4`,
horizontally scrollable if chips overflow.

```
Showing 847 of 1,247 spans   [Verdict: FAILED ×]  [Theme: RMD ×]  [Clear all]
```

**Count text:** `text-sm text-secondary`. Show `of N` only when a filter is
active.

**Chip:** `bg-surface-overlay`, `border border-border-strong`, `rounded-sm`,
`px-2 py-0.5`, `text-xs`. Label in `text-tertiary`, value in `text-primary`.
The `×` is a 14px button with `hover:text-verdict-fail`.

**Clear all:** text button, only when ≥ 2 chips active.

**Every chip is added from somewhere else** — clicking an aggregation row,
clicking a verdict badge, clicking a chart segment. The bar itself is a
display and removal surface, not an input.

**URL sync:** each filter becomes a query param. Removing a chip removes the
param. The URL must always be shareable and restore the exact view.

### 8.4 Metric cards

Four cards, `grid-cols-4 gap-3`, each `h-[88px]`, `bg-surface-raised`,
`border border-border-subtle`, `rounded-lg`, `p-4`.

| Card | Value | Sub-line |
|---|---|---|
| Hallucination rate | `24.3%` | `303 of 1,247 spans` |
| Clean rate | `75.7%` | `944 of 1,247 spans` |
| Judge agreement | `91.2%` | `110 disagreements` |
| Coverage | `87.0%` | `162 spans not evaluated` |

**Do not include a latency card.** Latency is not a quality signal and it
competes for attention with the numbers that are.

**Card internals:**

```
┌────────────────────────────┐
│ HALLUCINATION RATE         │  text-2xs uppercase tracking-wide text-secondary
│                            │
│ 24.3%          ▲ 2.1       │  value: text-2xl font-semibold mono
│                            │  delta: text-sm, verdict-fail if worse
│ 303 of 1,247 spans         │  text-xs text-tertiary
└────────────────────────────┘
```

**Delta rules:**
- Only shown when a previous comparable run exists
- Direction arrow + absolute change in percentage points
- Colour by whether it is *good*, not by direction. Hallucination rate going
  up is `verdict-fail`; clean rate going up is `verdict-pass`.
- Tooltip on hover: "vs previous run on 30 Jul, 14:20"

**Agreement card is clickable** — navigates to `/review/:jobId`. Show
`cursor-pointer` and `hover:bg-surface-hover`.

### 8.5 Results table

The core surface. Virtualised, sticky header, expandable rows.

#### Columns

| # | Column | Width | Content |
|---|---|---|---|
| 1 | Expand | 32px | Chevron, rotates 90° when open |
| 2 | Span | 120px | First 8 chars of span ID, mono, `text-tertiary`. Click copies full ID. |
| 3 | Query | 1fr min 200px | Truncated at 2 lines |
| 4 | Output | 1.5fr min 280px | Truncated at 3 lines, with signal chips beneath |
| 5 | Our verdict | 110px | Badge |
| 6 | Model team | 110px | Badge, or `—` if not run |
| 7 | Agreement | 90px | Icon + label |
| 8 | Score | 100px | Number + sparkline |
| 9 | Actions | 44px | Kebab menu |

**Row height:** 72px collapsed. Fixed — required for virtualisation.

**Row states:**

```
default   bg-surface-raised
hover     bg-surface-hover, duration-instant
expanded  bg-surface-overlay, border-l-2 border-l-border-focus
selected  bg-surface-hover + ring-1 ring-inset ring-border-focus
disagree  border-l-2 border-l-agreement-conflict   ← always, even collapsed
```

The disagreement left-border is the single most important scanning affordance
on this screen. A reviewer should be able to find every disagreement by
scrolling and looking at the left edge, without reading anything.

#### Verdict badge

```
PASSED   bg-verdict-passBg   text-verdict-pass   border-verdict-passBorder
FAILED   bg-verdict-failBg   text-verdict-fail   border-verdict-failBorder
REVIEW   bg-verdict-reviewBg text-verdict-review border-verdict-reviewBorder
—        text-text-disabled, no background
```

`rounded-sm border px-2 py-0.5 text-2xs font-medium uppercase tracking-wide`

**Clicking a badge filters the table to that verdict** and adds a chip.

#### Agreement indicator

| State | Icon | Colour | Label |
|---|---|---|---|
| Both passed | `CheckCheck` | `agreement.aligned` | "Aligned" |
| Both failed | `CheckCheck` | `agreement.aligned` | "Aligned" |
| Disagree | `GitCompareArrows` | `agreement.conflict` | "Conflict" |
| One source | `Minus` | `text.tertiary` | "Single" |

Icon 14px, label `text-2xs`. Clicking filters.

#### Signal chips

Under the output text, a row of chips showing the free-tier evaluator results —
the ones computed without an LLM call.

```
[Grounded: No]  [Citations: 0]  [Tool: search_infomax]  [847 tok]
```

`text-2xs`, `rounded-sm`, `px-1.5 py-0.5`, `bg-surface-overlay`,
`text-tertiary`. A failing signal uses `text-verdict-fail` on the value only,
label stays tertiary.

Max 4 chips. If more exist, show 3 and `+2` which reveals the rest on hover.

#### Score cell

```
0.847
▁▂▄█▆▃▁
```

Number in mono `text-base`. Beneath it a 60×16px sparkline showing where this
score falls in the run's distribution, with the current value marked.

**Shared axis across all rows.** Each row auto-scaling would make the
sparklines meaningless — the whole point is comparing this span against the
population.

#### Expanded row

Opens beneath the row, `duration-normal`, `bg-surface-overlay`, `p-4`.

```
┌─────────────────────────────────────────────────────────────────────┐
│  QUERY                                                              │
│  What is 530?                                                       │
│                                                                     │
│  RETRIEVED CONTEXT                            3 chunks · 1,204 tok   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ An IRA is an Individual Retirement Account…                   │  │
│  │ ── chunk 2 ──                                                 │  │
│  │ The QRP to IRA Rollover Questionnaire…                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  OUTPUT                                                             │
│  530 refers to several IRS forms related to retirement plans:       │
│  ▚▚▚▚▚▚▚▚▚▚▚▚ 5304-SIMPLE IRA, 5305-SEP ▚▚▚▚▚▚▚▚▚▚▚▚               │
│  ↑ highlighted = not supported by the context above                 │
│                                                                     │
│  ┌─────────────────────────┬─────────────────────────┐              │
│  │ OUR VERDICT             │ MODEL TEAM              │              │
│  │ FAILED · 0.92           │ hallucinated · 0.87     │              │
│  │ hallucination v1.2      │ hallucination v2.1      │              │
│  │ claude-4-5-sonnet       │ tachyon-completions     │              │
│  │                         │                         │              │
│  │ The response claims 530 │ Output introduces form  │              │
│  │ refers to IRS forms…    │ numbers absent from…    │              │
│  └─────────────────────────┴─────────────────────────┘              │
│                                                                     │
│  SUGGESTION                                                         │
│  Ground the response solely in the retrieved context. Avoid          │
│  generating form numbers not present in the source.                 │
│                                                                     │
│  [ Copy span ID ]  [ Open in Overwatch ↗ ]  [ Push to Overwatch ]   │
└─────────────────────────────────────────────────────────────────────┘
```

**Section labels:** `text-2xs uppercase tracking-wide text-secondary mb-1`

**Context block:** `bg-surface-base`, `rounded-md`, `p-3`, `max-h-[200px]`,
scrollable, `font-mono text-sm`. Chunk separators are a 1px
`border-border-subtle` line with a centred `text-2xs text-tertiary` label.

**Ungrounded highlighting:** when the backend supplies character offsets,
wrap those ranges in `bg-verdict-failBg text-verdict-fail rounded-sm px-0.5`.
When offsets are absent, render plain text — never guess at the spans.

**Verdict comparison:** two columns, `gap-3`. When they disagree, both get
`border border-agreement-conflict` and a small header strip reading
"Judges disagree — SME review required" in `agreement.conflict`.

**Push to Overwatch** lives here, at row level. **There must be no global push
button.** The reviewer inspects one span, decides, and pushes that one.

Push button states: `idle` → `pushing` (spinner, disabled) → `pushed` (check
icon, `text-verdict-pass`, disabled, tooltip shows timestamp). Failure shows a
toast with a Retry action, and the button returns to idle.

**Pushed state must survive a refresh** — read it from the job payload, not
component state.

### 8.6 Analysis sidebar

360px, sticky, `overflow-y-auto`, `bg-surface-raised`,
`border-l border-border-subtle`. Sections separated by
`border-t border-border-subtle`, each `p-4`.

#### Section 1 — Score distribution

Histogram, 20 buckets, height 120px.

```
SCORE DISTRIBUTION

     ▁▂▅███▆▃▂▁
  0.0            1.0
  ← hallucinated    grounded →
```

Bars use `chart.primary`. Bars below the failure threshold use
`verdict.fail`. Hovering a bar shows a tooltip with the count and filters on
click.

#### Section 2 — Breakdown by attribute ★

**This is the most important panel in the product.** It is what makes this
tool different from a generic trace viewer. Build it carefully.

```
BREAKDOWN BY                    [ Theme ▾ ]

Category            n     Pass rate
────────────────────────────────────────
Account balance    67   ███░░░░░░░  52%   ⚠
IRA rollover       98   ███████░░░  74%
RMD queries       142   █████████░  88%
Compliance        203   █████████▉  94%
Small sample (n<10) — 4 groups hidden  ▾
```

**Grouping selector:** Theme, Entitlement, Tool used, Channel, Model.
The available list comes from the backend, not a hardcoded array.

**Sort:** worst pass rate first by default. This is deliberate — the reviewer
should see the problem, not the alphabet.

**Bar:** 80px wide, 6px tall, `rounded-full`. Fill uses `verdict.pass`, track
uses `surface.overlay`. Below 60% the fill switches to `verdict.fail`.

**Small samples:** any group with n < 10 is collapsed behind a disclosure and
marked. A pass rate of 33% over three spans is not a finding, and presenting
it next to a rate over two hundred spans invites a wrong conclusion.

**Warning icon** on any group more than 15 percentage points below the overall
rate. Tooltip: "Pass rate 22 points below the run average."

**Clicking a row filters the table** to that group and adds a chip.

#### Section 3 — Disagreements

```
DISAGREEMENTS                              110

  Both passed              892   ████████░░
  Both failed              245   ██░░░░░░░░
  Judges disagree          110   █░░░░░░░░░

  [ Review 110 disagreements → ]
```

The button navigates to `/review/:jobId`.

#### Section 4 — Failure patterns

Clustered judge explanations, so a reviewer sees recurring causes instead of
reading 300 individual strings.

```
FAILURE PATTERNS

  Invented identifiers not in context     48
  Answered from general knowledge         31
  Context retrieved was off-topic         19
  Contradicted the retrieved source       12
```

Clicking a pattern filters the table.

Clustering happens on the backend. The UI renders whatever labels it receives
and must not attempt to cluster client-side.

#### Section 5 — Live event stream

Only visible while a run is in progress. Auto-hides 5 seconds after
completion.

```
LIVE                                    ● running

  12:04:31  Extracted 1,247 spans
  12:04:33  Response length: 1,203 passed
  12:04:35  Context selection complete
  12:04:41  Judge: 340 / 1,203
  12:04:44  ⚠ Disagreement on span 192b8b03
```

Monospace, `text-xs`. Newest at the bottom, auto-scrolled unless the user has
scrolled up — in which case show a "Jump to latest" pill and hold position.

Cap at 200 entries in the DOM. Older ones are dropped.

### 8.7 Review view (`/review/:jobId`)

Same table, pre-filtered to disagreements, with two differences:

1. The **Agreement** column is replaced by an **SME decision** column
   containing three buttons: `Ours` / `Theirs` / `Neither`
2. Rows are expanded by default, because the reviewer is here to read

Recording a decision:
- Optimistic update — the row shows the decision immediately
- Row fades to `opacity-60` and moves to the bottom of the list after 400ms
- The sidebar counter decrements
- On failure, revert and show a toast

**Keyboard flow** — this view will be used for an hour at a time:

```
j / ↓     next row
k / ↑     previous row
1         decide: ours
2         decide: theirs
3         decide: neither
o         open in Overwatch
Enter     expand / collapse
?         shortcuts overlay
```

---

## 9. DATA CONTRACTS

Mirror the backend exactly. Do not invent fields.

```ts
export type Verdict = 'PASSED' | 'REVIEW' | 'FAILED';

export type Agreement =
  | 'agree_pass'
  | 'agree_fail'
  | 'disagree'
  | 'single_source'
  | 'not_comparable';

export type ExtractionLevel = 'prompt' | 'thread' | 'time_range';

export interface SourceVerdict {
  source: string;              // 'supervisor-eval-service' | 'model-team'
  evaluator: string;
  verdict: string;
  score: number | null;
  reasoning: string | null;
  evaluatorVersion: string;
  judgeModel: string | null;
  evaluatedAt: string;         // ISO 8601
}

export interface SignalChip {
  label: string;
  value: string;
  status: 'ok' | 'warn' | 'fail' | 'neutral';
}

export interface HighlightRange {
  start: number;               // character offset into output
  end: number;
  reason: string;
}

export interface SpanResult {
  spanId: string;
  traceId: string;
  threadId: string | null;
  timestamp: string;

  query: string;
  retrievedContext: string;
  contextChunks: number;
  contextTokens: number;
  output: string;

  sources: SourceVerdict[];
  agreement: Agreement;
  action: 'auto_push' | 'auto_push_alert' | 'human_review' | 'provisional';

  signals: SignalChip[];
  highlights: HighlightRange[];
  suggestion: string | null;

  attributes: Record<string, string>;   // theme, entitlement, tool, channel

  humanVerdict: string | null;
  humanReviewer: string | null;
  humanReviewedAt: string | null;

  pushedAt: string | null;
}

export interface AttributeGroup {
  key: string;
  label: string;
  count: number;
  passRate: number;            // 0..1
  avgScore: number;
  isSmallSample: boolean;      // count < 10
}

export interface FailurePattern {
  label: string;
  count: number;
  spanIds: string[];
}

export interface JobSummary {
  jobId: string;
  project: string;
  level: ExtractionLevel;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'partial';

  totalSpans: number;
  evaluatedSpans: number;

  agreePass: number;
  agreeFail: number;
  disagree: number;
  singleSource: number;

  hallucinationRate: number;
  agreementRate: number;
  coverage: number;

  scoreDistribution: { bucket: number; count: number }[];
  attributeGroups: Record<string, AttributeGroup[]>;   // keyed by grouping
  failurePatterns: FailurePattern[];

  evaluatorsRun: string[];
  evaluatorsFailed: string[];

  previousJobId: string | null;
  startedAt: string;
  completedAt: string | null;
}
```

### SSE event types

```ts
type ProgressEvent =
  | { event: 'started';    data: { jobId: string; level: string } }
  | { event: 'extracted';  data: { jobId: string; rows: number } }
  | { event: 'span_scored'; data: { span: SpanResult } }
  | { event: 'disagreement'; data: { spanId: string } }
  | { event: 'aggregated'; data: { summary: JobSummary } }
  | { event: 'pushed';     data: { annotations: number } }
  | { event: 'completed';  data: { jobId: string; status: string } }
  | { event: 'error';      data: { error: string } };
```

**Handling:** `span_scored` appends to the table. Batch DOM updates with
`requestAnimationFrame` — at 200 rows per second, updating per event will
drop frames.

---

## 10. STATE MANAGEMENT

### Server state — TanStack Query

```ts
useJob(jobId)                       // 30s stale, no refetch on focus
useSpans(jobId, filters)            // infinite query, 200 per page
useAttributeGroups(jobId, groupBy)  // 5min stale
useCapabilities()                   // 10min stale
```

### Client state — Zustand

```ts
interface UiStore {
  expandedSpanIds: Set<string>;
  selectedSpanId: string | null;
  sidebarCollapsed: boolean;
  navCollapsed: boolean;
  groupBy: string;
  liveEvents: ProgressEvent[];      // capped at 200
}
```

### URL state — the source of truth for anything shareable

```
?from=…&to=…&verdict=FAILED&agreement=disagree&theme=RMD&groupBy=theme&span=192b8b03
```

Every filter, the expanded span, and the grouping selection live here. Pasting
a URL into a colleague's chat must reproduce the exact view.

Use `useSearchParams`. Debounce writes by 300ms so dragging a slider does not
create fifty history entries.

---

## 11. PERFORMANCE

| Requirement | Target |
|---|---|
| First contentful paint | < 1.2s |
| Table interactive with 1,000 rows | < 300ms |
| Scroll at 200,000 rows | 60fps sustained |
| Row expand | < 100ms to first paint |
| SSE burst of 500 rows | no dropped frames |

### Techniques

- **Virtualise** above 100 rows. `overscan: 8`.
- **Memoise every row.** `React.memo` with a comparator on `spanId`,
  `agreement`, `pushedAt` and expanded state. A row must not re-render because
  a sibling changed.
- **Batch SSE** into `requestAnimationFrame`. Never `setState` per event.
- **Debounce** filter inputs at 300ms, search at 250ms.
- **Lazy load** the expanded row body. Do not mount context and reasoning for
  1,000 collapsed rows.
- **Truncate on the server.** Do not ship 8KB of context per row for a
  collapsed view — request it on expand.
- **Code split** by route.

---

## 12. STATES

### 12.1 Empty

| Situation | Message | Action |
|---|---|---|
| No job selected | "Select a project and time range, then run an evaluation." | — |
| Run returned nothing | "No spans found in this time range." | "Widen range" |
| All filtered out | "No spans match these filters." | "Clear filters" |
| No disagreements | "All evaluators agreed on this run." | "View all results" |

Centre the block, `text-secondary`, with a 32px `text-tertiary` icon above.
No illustrations.

### 12.2 Loading

**Never a full-page spinner.** Skeletons that match final layout:

- Metric cards: pulsing `bg-surface-hover` blocks at the value position
- Table: 8 skeleton rows at exactly 72px
- Sidebar: skeleton bars matching the panel shapes

Pulse: `animate-pulse` at 1.8s.

### 12.3 Error

| Error | Presentation |
|---|---|
| Job failed | Inline banner above the table, `verdict-fail`, with Retry |
| Partial | Amber banner: "3 of 11 evaluators failed" + "See details" |
| SSE dropped | Toast: "Live updates disconnected" + Reconnect. Table keeps existing rows. |
| Push failed | Toast with Retry, button returns to idle |

### 12.4 Connection status

**One indicator only.** The current UI shows both "API Connected" and
"Healthy" — they say the same thing, so remove one.

Bottom of the nav rail: a 6px dot plus a label.

```
● Connected      verdict.pass
● Degraded       verdict.review    (evaluator service unreachable)
● Disconnected   verdict.fail
```

---

## 13. ACCESSIBILITY

- Contrast: 4.5:1 for body text, 3:1 for large text and UI borders. Verify
  every verdict colour against its background token.
- **Never encode meaning in colour alone.** Every verdict badge carries text.
  Every agreement state carries an icon and a label.
- Table uses semantic `<table>` with `<th scope="col">`. Not divs.
- Expandable rows: `aria-expanded`, `aria-controls`.
- Live region on the results table: `aria-live="polite"` announcing
  "247 spans evaluated" — throttled to once every 3 seconds, not per row.
- Full keyboard reachability. Logical tab order. Visible focus at all times.
- Modals trap focus and restore it on close.
- Respect `prefers-reduced-motion` for every transition defined in §5.6.

---

## 14. DO NOT BUILD

These were explicitly removed in review. Do not reintroduce them.

| Item | Why |
|---|---|
| Evaluator visibility panel | Adds no reviewer value |
| Rollout telemetry section | Its numbers contradicted the chart above it |
| Judge / suggestion model labels in the header | Backend detail, not user-facing |
| Duplicate connection indicators | Two controls saying one thing |
| Elapsed timer | Nobody watches it |
| Latency metric card | Not a quality signal, competes for attention |
| Global "Push to Overwatch" button | Push is per-span, after review |
| Count-based limit ("last 100") | Replaced by the time range picker |
| Backend API URL visible in the address bar | Config, not navigation |

---

## 15. FILE STRUCTURE

```
src/
├── app/
│   ├── router.tsx
│   ├── providers.tsx
│   └── layout/
│       ├── AppShell.tsx
│       ├── NavRail.tsx
│       └── AnalysisSidebar.tsx
├── features/
│   ├── evaluate/
│   │   ├── EvaluateView.tsx
│   │   ├── ControlBar.tsx
│   │   ├── TimeRangePicker.tsx
│   │   └── EvaluatorSelect.tsx
│   ├── results/
│   │   ├── ResultsView.tsx
│   │   ├── FilterChipBar.tsx
│   │   ├── MetricCards.tsx
│   │   ├── table/
│   │   │   ├── ResultsTable.tsx
│   │   │   ├── TableHeader.tsx
│   │   │   ├── SpanRow.tsx
│   │   │   ├── ExpandedRow.tsx
│   │   │   ├── VerdictBadge.tsx
│   │   │   ├── AgreementIndicator.tsx
│   │   │   ├── SignalChips.tsx
│   │   │   └── ScoreCell.tsx
│   │   └── sidebar/
│   │       ├── ScoreDistribution.tsx
│   │       ├── AttributeBreakdown.tsx
│   │       ├── DisagreementPanel.tsx
│   │       ├── FailurePatterns.tsx
│   │       └── LiveEventStream.tsx
│   ├── review/
│   │   ├── ReviewView.tsx
│   │   ├── DecisionButtons.tsx
│   │   └── useReviewShortcuts.ts
│   └── benchmark/
│       └── BenchmarkView.tsx
├── components/
│   ├── Button.tsx
│   ├── Select.tsx
│   ├── Chip.tsx
│   ├── Tooltip.tsx
│   ├── Toast.tsx
│   ├── Skeleton.tsx
│   ├── EmptyState.tsx
│   └── Sparkline.tsx
├── hooks/
│   ├── useEvaluationStream.ts
│   ├── useFilters.ts
│   ├── useVirtualRows.ts
│   └── useCopyToClipboard.ts
├── lib/
│   ├── api.ts
│   ├── sse.ts
│   ├── format.ts
│   └── verdict.ts
├── stores/
│   └── uiStore.ts
├── types/
│   └── domain.ts
└── styles/
    └── tokens.css
```

---

## 16. FORMATTING RULES

Put these in `lib/format.ts` and use them everywhere. Inconsistent number
formatting is the fastest way to make a data product look unfinished.

```ts
formatRate(0.2431)        → '24.3%'      // one decimal, always
formatScore(0.8472)       → '0.847'      // three decimals, mono
formatCount(1247)         → '1,247'      // thousands separator
formatTokens(847)         → '847 tok'
formatDuration(48200)     → '48.2s'
formatDelta(0.021)        → '▲ 2.1'      // percentage points, not percent
formatSpanId(id)          → id.slice(0, 8)
formatTimestamp(iso)      → '12:04:31'   // time only within a run
formatDate(iso)           → '31 Jul, 14:20'
formatSampleSize(7)       → 'n=7 ⚠'      // warn below 10
```

**Truncation:**
- Query in the table: 2 lines, CSS `line-clamp-2`
- Output in the table: 3 lines, `line-clamp-3`
- Never truncate mid-word with JS. Use CSS clamping so full text stays
  selectable and searchable.

---

## 17. BUILD ORDER

Do not build everything at once. Follow this order and verify each step.

1. **Tokens.** `tailwind.config.ts` and `tokens.css`. Render a swatch page
   showing every colour, size and radius. Verify contrast before continuing.
2. **Shell.** AppShell, NavRail, routing. Static, no data.
3. **Primitives.** Button, Select, Chip, Tooltip, Toast, Skeleton, EmptyState.
4. **Table with mock data.** 50 static rows. Get row height, hover, badges
   and the disagreement border exactly right before adding anything else.
5. **Virtualisation.** Swap to 10,000 mock rows. Confirm 60fps.
6. **Expanded row.** Including highlighting and the verdict comparison.
7. **Control bar and filters.** With URL sync.
8. **Metric cards.**
9. **Sidebar panels.** Distribution first, then attribute breakdown.
10. **SSE streaming.** With batching.
11. **Review view** and keyboard shortcuts.
12. **Empty, loading and error states** across every view.
13. **Accessibility pass.** Keyboard-only walkthrough, contrast audit.

---

## 18. ACCEPTANCE CHECKLIST

Before calling any part done:

- [ ] No raw hex in any component file
- [ ] No arbitrary Tailwind values in JSX
- [ ] No component file over 200 lines
- [ ] Every interactive element has a visible focus ring
- [ ] Every verdict conveys meaning without colour
- [ ] Table holds 60fps while scrolling 200,000 rows
- [ ] A row does not re-render when a sibling changes (verify in Profiler)
- [ ] URL restores the exact view including filters and expanded span
- [ ] SSE burst of 500 rows does not drop frames
- [ ] Every empty, loading and error state is implemented
- [ ] Keyboard-only path through the entire review flow works
- [ ] Small-sample groups are visibly marked
- [ ] Push to Overwatch exists only at row level
- [ ] No backend URL appears in the address bar
- [ ] `prefers-reduced-motion` disables all transitions
- [ ] Nothing from Section 14 exists in the build


<img width="546" height="174" alt="Screenshot 2026-07-31 at 8 38 40 PM" src="https://github.com/user-attachments/assets/7b02f582-3e7d-4d11-b313-987620fc0537" />


<img width="561" height="258" alt="Screenshot 2026-07-31 at 8 39 07 PM" src="https://github.com/user-attachments/assets/8211c43c-5e73-4c4a-b402-00a9dfe757e2" />



<img width="588" height="247" alt="Screenshot 2026-07-31 at 8 39 40 PM" src="https://github.com/user-attachments/assets/ce90f780-1891-4e82-9a70-6a03f04f73d3" />


<img width="605" height="344" alt="Screenshot 2026-07-31 at 8 39 58 PM" src="https://github.com/user-attachments/assets/e66e3330-e092-47db-9614-b1aacd0625f4" />



<img width="643" height="247" alt="Screenshot 2026-07-31 at 8 40 20 PM" src="https://github.com/user-attachments/assets/aaeb2d2e-1769-4313-8948-58a5810581c0" />

[Unified_Evaluation_Platform_v2 (1).pptx](https://github.com/user-attachments/files/30594481/Unified_Evaluation_Platform_v2.1.pptx)



Rohan, I went through their code — the orchestrator already produces a run manifest with artefact paths rather than inline results, and the agreement metrics come back as a flat scalar dict. So the shape varies by evaluator.

The part I cannot work out from the code is how we carry the file-based ones across an API boundary. Their paths are local to wherever the run happened, so we cannot use those directly.

Do we hand back a signed URL or a fetch endpoint, or do we assume both sides read from a shared store and just pass a reference?



Here's the message in simple English:

Rohan, wanted to clear one thing about the response shape.

For the simple evaluators it is straightforward. Hallucination gives a verdict and a score. Agreement metrics give four numbers. All of that fits in a JSON response easily.

But for something like sensitivity or performance, the result is a big table — could be 500 rows with full text in each. Their code today just writes it to an Excel file and returns the file path. That works locally, but over an API it will not, because the file sits on their machine and our service cannot read that path.

So for these bigger results, which way should we go?

Send the full data inline in the JSON response, which could get very large.

Or return a download URL that we fetch separately.

Or have both sides read from a shared store, and the response just carries a reference to it.






Simple evaluators are fine — hallucination gives a verdict, agreement metrics give a few numbers, all fits in JSON.

But sensitivity or performance returns a big table, maybe 500 rows. Their code writes it to Excel and returns the file path, which will not work over an API since the file is on their machine.

For those, do we send the data inline, return a download URL, or use a shared store and just pass a reference?
