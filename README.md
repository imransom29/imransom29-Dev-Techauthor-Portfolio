# Fix and Enhancement Prompt — Supervisor Evaluation Dashboard

This document addresses defects found in the running build plus the missing
capability that causes most of them. Execute in the order given — Part A is a
prerequisite for everything else.

---

## PART A — THE ROOT CAUSE

### What is wrong

The application currently treats **a span as the unit of evaluation**. It is
not.

An Overwatch trace for a single advisor question decomposes into roughly eight
spans:

```
Trace  (one question, one evaluable unit)
├─ LangGraph              CHAIN   — orchestration only
├─ start_graph            CHAIN   — orchestration only
├─ trim_state_messages    CHAIN   — orchestration only
├─ chatbot                CHAIN   — orchestration only
├─ RunnableSequence       CHAIN   — orchestration only
├─ ChatPromptTemplate     CHAIN   — orchestration only
├─ ChatOpenAI             LLM     — the query and the final output live here
└─ tools_condition        TOOL    — the retrieved context lives here
```

The three inputs a grounding judge needs — **query**, **retrieved context**,
**output** — are in *different spans of the same trace*.

So evaluating a span in isolation cannot work. The observed symptom is exactly
this: `No context captured. 0 chunks • 0 tok` on a trace where a tool call
demonstrably ran.

### Why every other defect follows from it

| Symptom | Cause |
|---|---|
| `No context captured` | Context is in the TOOL span, not the span being judged |
| Query renders as raw JSON | The message envelope is never parsed to reach `content` |
| `10 spans matched (any kind)` | CHAIN spans are being counted as evaluable |
| `Span scored 1/10` | Only 1 of 10 had any output — the rest were orchestration |
| Arize shows 73, we fetch 10 | 73 spans ≈ 9 traces. Different units entirely. |
| Judge returns a score with no context | It was asked an impossible question and answered anyway |

### The fix

Introduce **extraction level** as a first-class concept in the UI, the API and
the extraction layer. Everything else in this document depends on it.

---

## PART B — EXTRACTION LEVEL

### B1. The three levels

| Level | Unit | What it joins | Typical volume |
|---|---|---|---|
| `prompt` | One question and its answer | All spans in one trace, flattened into query + context + output | 1 row per trace |
| `thread` | One conversation | All traces sharing a thread id, ordered by time | ~400 rows at load |
| `time_range` | A population | Every trace in a window | up to ~200,000 rows |

### B2. UI control — new

Add a level selector to the control bar, positioned **immediately after the
project selector and before the time range picker**, because it changes what
the time range means.

```
[ Project ▾ ]  [ Level: Prompt ▾ ]  [ Last 24 hours ▾ ]  [ Evaluators ▾ ]
```

Options and their help text:

```
Prompt      Evaluate each question and answer on its own
Thread      Evaluate whole conversations across turns
Time range  Evaluate a population for aggregate metrics
```

Default to `Prompt`, because it is the only level at which grounding can be
judged and grounding is the primary use case today.

**URL param:** `?level=prompt`

### B3. Level changes what is available

The level must gate the rest of the UI. Selecting a level that an evaluator
does not support and letting the run fail five minutes later is a worse
experience than disabling the option up front.

| Evaluator | prompt | thread | time_range | Reason |
|---|---|---|---|---|
| hallucination | ✓ | ✓ | ✓ | Needs query + context + output together |
| generation relevancy | ✓ | ✓ | ✓ | Needs query and answer |
| retrieval relevancy | ✓ | ✓ | ✓ | Needs query and chunks |
| toxicity | ✓ | ✓ | ✓ | Output only |
| tool correctness | ✓ | ✓ | ✓ | Needs the tool sequence |
| coherence | ✗ | ✓ | ✗ | A contradiction needs two or more turns |
| context retention | ✗ | ✓ | ✗ | Same reason |
| task completion | ✗ | ✓ | ✗ | Judged over a whole conversation |
| sensitivity | ✗ | ✗ | ✓ | Compares two runs across a population |
| agreement metrics | ✗ | ✗ | ✓ | A correlation over one item is not a number |
| drift detection | ✗ | ✗ | ✓ | Needs a population to compare against |

Evaluators unavailable at the selected level render **disabled with a
tooltip** explaining why, rather than being hidden. Hiding them makes the
product look less capable than it is; disabling them teaches the user the
model.

Tooltip copy: *"Coherence needs multiple turns. Switch to Thread level."*

### B4. Extraction per level

#### Prompt level

Fetch **traces**, not spans. For each trace, flatten:

```python
{
    "unit_id":            trace_id,          # the evaluable unit
    "trace_id":           trace_id,
    "thread_id":          thread_id,
    "root_span_id":       <the LLM span that produced the final output>,
    "timestamp":          trace.start_time,

    "query":              <parsed user question, plain text>,
    "retrieved_context":  <joined chunks from TOOL spans>,
    "context_chunks":     <count>,
    "context_tokens":     <count>,
    "output":             <final assistant text, plain>,

    "tool_calls":         [ ... names in call order ],
    "tool_errors":        [ ... any tool that returned status error ],
    "model":              <model name>,
    "latency_ms":         <trace total>,
    "token_count":        <trace total>,
}
```

**Parsing rules — these matter, the current build gets all three wrong:**

**Query.** Walk `spans[].input_messages`, take the **last** message with
`role == "human"` or `role == "user"`, return `content` as plain text.

If `content` is itself a JSON string (the current payloads wrap it), parse one
level and take `.content` again. Do not render the envelope.

Fallback order: last human message → `trace.input` → empty string. Never dump
the raw payload into the UI.

**Retrieved context.** Walk spans where `kind == "TOOL"`. For each, read
`output.hits[]` and collect `record.raw_context`. Join with a separator.

If a tool span has `status == "error"`, record it in `tool_errors` and
contribute **nothing** to context. An error message is not retrieved context.

**Output.** Take the **last** span with `kind == "LLM"` and non-empty text
content. If its content is a JSON envelope, parse to `.content`.

Skip spans whose only content is a `tool_call` — a tool invocation is not an
answer.

#### Thread level

Fetch every trace with the same `thread_id`, ordered ascending by start time.
Flatten each turn using the prompt-level rules above, plus:

```python
{
    "unit_id":     thread_id,
    "turn_index":  <0-based, in time order>,
    ...prompt-level fields per turn
}
```

Ordering is not cosmetic. Coherence is judged by comparing an earlier turn
against a later one, so a shuffled frame produces silently meaningless
results.

#### Time range level

Same as prompt level, but paged over the whole window. Page size 500.

---

## PART C — DEFECT FIXES

### C1. Time range filter is not applied

**Observed:** Changing between Last 1 hour, Last 24 hours and Last 7 days
returns the same result set.

**Diagnose in this order:**

1. Confirm the UI sends it. Network tab — does the request carry
   `start_time` and `end_time`, in ISO 8601 with a timezone?
2. Confirm the backend forwards it into the GraphQL variables, not just into
   its own log line.
3. Confirm Phoenix accepts the field names being used. Its spans connection
   expects the time bounds on the connection arguments; passing them at the
   wrong nesting level is **silently ignored**, which matches the symptom
   exactly.
4. Confirm no default `limit` is being applied after the time filter and
   truncating the result to a fixed count.

**The `10` is the strongest clue.** A round number that never changes is a
hardcoded limit, not a query result. Find it and make it configurable.

**Required behaviour after fix:**

- Selecting a preset re-queries immediately, no separate Apply step
- Timezone is explicit — send UTC, render in the browser's local zone
- The applied range is shown in the chip bar so it is never ambiguous
- The result count changes when the range changes, and if it does not,
  that is a bug not a coincidence

### C2. Unit count is wrong in three places

**Observed:**

```
Spans fetched      10 spans matched (any kind)
Span scored        FACTUAL • span 6219ff2e… • 1/10
Run completed      completed • 0 spans • 10.06s
```

Three numbers, none of which agree.

**Fix each:**

**`10 spans matched (any kind)`** — replace with unit counting at the selected
level, and stop counting CHAIN spans:

```
1,247 traces matched          (prompt level)
89 threads matched            (thread level)
198,432 traces in range       (time range level)
```

Remove `(any kind)` entirely. Filter to traces that contain at least one LLM
span with output. A trace of pure orchestration is not evaluable and should
not be in the denominator.

**`1/10`** — the denominator must be evaluable units, not fetched spans. If 9
of 10 had no output, the correct denominator was 1 all along.

**`0 spans`** — a counter bug. The completion handler is reading a different
variable from the one the scoring loop increments. Assert in a test that the
completion count equals the number of `span_scored` events emitted.

**Add a reconciliation line** to the completion event, because a silent gap
between fetched and evaluated is how bad numbers reach a report:

```
Run completed — 1,247 fetched · 1,203 evaluated · 44 skipped (no output) · 10.06s
```

### C3. No control over how many units to evaluate

**Add a limit control** next to the time range picker.

```
[ Last 24 hours ▾ ]  [ Limit: All ▾ ]
```

Options: `10`, `50`, `100`, `500`, `All`.

Default `All`, because a silent cap is what produced the current confusion.
When a limit is active it must appear as a chip: `[Limit: 100 ×]`.

**Estimate before running.** When the range and level are chosen, call a cheap
count endpoint and show:

```
About 198,000 traces in this range. Estimated run time 45 minutes.
```

If the estimate exceeds 10,000 units, show an inline warning suggesting a
limit or a narrower range. Warn, do not block.

### C4. Query and output render as raw JSON

**Observed:** the Query panel shows
`{"channel_name": ["PCG"], "messages": [{"type": "human", "data": {"content": …`

**Fix:** apply the parsing rules in B4. The UI should show:

```
QUERY
How to open an IRA?
```

**Keep the raw payload available but not primary.** Add a `{ }` toggle on each
panel that switches between parsed and raw. Default parsed.

The raw view is genuinely useful for debugging extraction, so do not delete
it — just stop making it the default thing a reviewer sees.

### C5. Judge runs with no context

**Observed:** `No context captured. 0 chunks • 0 tok` and the judge still
returned `score 0.000`.

This is the most serious defect on the list. A grounding judge asked to assess
grounding with no source has nothing to compare against, so whatever it
returns is not a measurement.

**Fix — guard before the judge is called:**

```python
if not retrieved_context.strip():
    return VerdictResult(
        span_id=unit_id,
        verdict="NOT_APPLICABLE",
        score=None,
        reasoning=(
            "No retrieved context on this trace, so grounding cannot be "
            "assessed. Tool calls: {tools}. Tool errors: {errors}."
        ),
    )
```

**Add `NOT_APPLICABLE` as a first-class verdict**, styled neutral, filterable,
and **excluded from the hallucination rate denominator**. Including
un-assessable units in a rate makes the rate wrong.

Metric cards must then read:

```
Hallucination rate    24.3%
303 of 1,247 assessable · 44 not applicable
```

### C6. Score and verdict text contradict each other

**Observed:** reasoning says the response is accurate with no unsupported
facts, and the score reads `0.000`.

Both may be correct — 0 means no hallucination — but the reviewer cannot tell
whether 0 is good or bad without knowing the scale.

**Fix:**

1. Always render a **verdict label** alongside the score. The label is
   primary, the score is supporting detail.
2. State the scale explicitly next to the number: `0.000 (0 = grounded, 1 = hallucinated)`
3. If the judge returns no meaningful score, render `—` rather than `0.000`.
   Zero and absent are different facts and must not look identical.

### C7. Two different span identifiers

**Observed:** the payload contains
`"span_id": "1cd40883-d927-4fd2-a23c-97ae6e777303"` while the footer shows
`span id: 6219ff2ee31d0f2c`.

One is an application-level identifier from the Supervisor payload; the other
is the OpenTelemetry span id. They are different namespaces.

**Fix — name them distinctly everywhere:**

```
otel_span_id     6219ff2ee31d0f2c     ← what Overwatch keys on
otel_trace_id    …                    ← what we key units on
app_prompt_id    f4c83d3a-c935-…      ← from the Supervisor payload
app_thread_id    …-K217675-cfcbd0c4-… ← from the Supervisor payload
```

**Annotations must be pushed against the OTel span id**, since that is what
Overwatch indexes. Using the application id will silently write annotations
that never appear.

Show all four in the expanded row footer, each labelled, each click-to-copy.

### C8. Peer verdict states are not distinguished

**Observed:** `PEER / MODEL TEAM — No peer verdict.`

This is currently correct — the model team's API does not exist yet — but the
UI collapses several very different situations into one message.

**Fix — four distinct states:**

| State | Display | When |
|---|---|---|
| Not configured | "Peer evaluator not connected" + neutral styling | No base URL configured |
| Not requested | "Not selected for this run" | Configured, but the user did not pick it |
| Failed | "Peer evaluation failed: {reason}" + Retry button | Call was made and errored |
| Not applicable | "Not supported at {level} level" | Evaluator does not support this level |
| Pending | Skeleton + "Evaluating…" | Job accepted, still polling |

A reviewer needs to know whether a missing verdict means *nobody asked*,
*it broke*, or *it cannot apply here*. Those lead to three different actions.

---

## PART D — SIDEBAR SECTIONS

Four sections exist. Define what each contains.

### D1. Run

The launch surface. Project, level, time range, limit, evaluator selection,
estimate, and the Run button. Live event stream appears here during a run.

**Add to the event stream** — the current entries are too sparse to diagnose a
run:

```
#1  Started       AI-Teammate-Supervisor-LOCAL · prompt level · hallucination
#2  Fetched       1,247 traces · 44 skipped (no LLM output)
#3  Ready         hallucination · concurrency 8
#4  Scored        FACTUAL · trace 6219ff2e · 1/1,203
#5  Skipped       trace 8a2f91c4 · no retrieved context
#6  Peer sent     sensitivity · job-a1b2 · 198,432 rows by reference
#7  Peer result   sensitivity · distribution · mean 0.887
#8  Completed     1,247 fetched · 1,203 evaluated · 44 skipped · 10.06s
```

Colour the left edge by kind: neutral for info, amber for skip, red for error.

### D2. Results

The table. Already largely built. Apply C4, C6, C7, C8 here.

**Add a unit column** whose header follows the level:

```
prompt level      → "Trace"
thread level      → "Thread"  with a turn count badge
time_range level  → "Trace"
```

**Add the attribute breakdown panel** to the right sidebar. This is the
capability that makes the tool useful to the model team rather than merely
usable — pass rate grouped by theme, entitlement, tool used or channel, worst
first, with small samples marked.

### D3. Review

Disagreements only. Currently every unit shows `agreement: single_source`
because the peer side is not live, so this view will be empty until the model
team's endpoint exists.

**Until then, make it useful anyway** by including:

- Units where our judge returned `REVIEW`
- Units where the score sits within a configurable band of the threshold
- Units marked `NOT_APPLICABLE` with tool errors, since those indicate a
  system fault rather than a model fault

Label the section honestly: "Needs human review" rather than "Disagreements",
because today the reason is not disagreement.

### D4. Benchmark

Judge validation. Currently at 74% against a trust gate of 85%.

Should show:

- Current accuracy against the golden set, with the gate marked
- Confusion matrix — false positives and false negatives are not equally
  costly and a single accuracy number hides which is happening
- Accuracy over time, per judge version
- The failing cases, so prompt changes can be targeted
- Golden set size and its composition (factual vs hallucinated)

**Gate the auto-push behaviour on this number.** Below the gate, auto-push
should be disabled and the UI should say so:

> Judge accuracy is 74%, below the 85% trust gate. Auto-push is disabled and
> all verdicts require review.

---

## PART E — WHAT THE MODEL TEAM ACTUALLY NEEDS

The stated goal is that this helps the model team. Their current pain is
running the framework on individual laptops. Three things serve that directly:

### E1. Scheduled runs

They should be able to configure a run and leave.

```
Schedule: Daily at 02:00
Project:  AI-Teammate-UAT
Level:    Time range (previous 24h)
Evaluators: all
Notify:   email on completion
```

This is the single feature that removes their laptop dependency.

### E2. Run history and comparison

```
Run              Date          Units    Hallucination    Agreement
run-0891         02 Aug 02:00   1,247        24.3%          91.2%
run-0876         01 Aug 02:00   1,198        22.1%          89.7%
run-0854         31 Jul 02:00   1,301        31.8%          88.4%
```

Selecting two runs shows a diff — which units changed verdict, and the
aggregate movement. **This is what tells them whether a prompt change helped**,
and it is not obtainable from a single run at all.

### E3. Export that matches their format

They work in xlsx with specific column names. Export should offer:

- Their existing result schema, so it drops into their current analysis
- A generic CSV
- A parquet artifact reference for large runs

Read the actual column names from their result files rather than inventing
them — matching their format is the entire point.

---

## PART F — ORDER OF WORK

1. **B4 prompt-level extraction.** Nothing else matters until query, context
   and output are correctly joined from a trace. Verify against the known
   trace where `infomax_search` errored — context should be empty *and*
   `tool_errors` should be populated.
2. **C5 the no-context guard.** Stop producing scores that are not
   measurements.
3. **C2 unit counting.** All three numbers must agree.
4. **C1 time filtering.** Confirm the result count changes with the range.
5. **B2 and B3 the level selector**, with evaluator gating.
6. **C4 parsed rendering**, with a raw toggle.
7. **C6, C7, C8** — verdict labels, identifier naming, peer states.
8. **B4 thread level.**
9. **D2 attribute breakdown.**
10. **D4 benchmark view** with the trust gate.
11. **E1 scheduled runs.**
12. **E2 run comparison.**
13. **B4 time range level** with paging.

---

## PART G — ACCEPTANCE

- [ ] A prompt-level unit contains query, context and output joined from the
      correct spans of one trace
- [ ] Query renders as plain text, never as a JSON envelope
- [ ] A trace whose tool call errored shows empty context **and** a recorded
      tool error
- [ ] The judge is never invoked without context
- [ ] `NOT_APPLICABLE` is excluded from rate denominators
- [ ] Fetched, evaluated and skipped counts reconcile and are all reported
- [ ] Changing the time range changes the result count
- [ ] Selecting Thread level disables sensitivity and agreement with a reason
- [ ] Selecting Prompt level disables coherence with a reason
- [ ] OTel and application identifiers are labelled distinctly
- [ ] Annotations are pushed against the OTel span id
- [ ] The five peer states are visually distinct
- [ ] A score of zero and an absent score do not look the same
- [ ] Auto-push is disabled while judge accuracy is below the gate
