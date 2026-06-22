## Visual Content

**Center — Phoenix architecture diagram:**

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   AI AGENTS                                                          │
│   (LangGraph, etc.)                                                  │
│         │                                                            │
│         │ OpenInference instrumentation                              │
│         │ (Arize's semantic conventions for LLM tracing)             │
│         ▼                                                            │
│   ┌───────────────────────────┐                                      │
│   │  OTLP Protocol            │                                      │
│   │  (OpenTelemetry standard) │                                      │
│   └─────────────┬─────────────┘                                      │
│                 │                                                    │
│                 ▼                                                    │
│   ╔════════════════════════════════════════════════════════════╗    │
│   ║                                                             ║    │
│   ║         TACHYON OVERWATCH (= ARIZE PHOENIX)                 ║    │
│   ║                                                             ║    │
│   ║   ┌──────────────────┐   ┌─────────────────────────────┐  ║    │
│   ║   │  COLLECTOR        │──▶│  STORAGE LAYER              │  ║    │
│   ║   │  (Receives spans) │   │  (Postgres / columnar)      │  ║    │
│   ║   └──────────────────┘   └────────────┬────────────────┘  ║    │
│   ║                                        │                    ║    │
│   ║                                        ▼                    ║    │
│   ║   ┌────────────────────────────────────────────────┐      ║    │
│   ║   │  EVALUATION ENGINE (phoenix.evals)             │      ║    │
│   ║   │  • Prompt Templates (HALLUCINATION, etc.)      │      ║    │
│   ║   │  • Rails (output constraints)                   │      ║    │
│   ║   │  • Classifier orchestrator                      │      ║    │
│   ║   └────────────────────────────────────────────────┘      ║    │
│   ║                            │                                ║    │
│   ║                            ▼                                ║    │
│   ║   ┌────────────────────────────────────────────────┐      ║    │
│   ║   │  ANNOTATION LAYER                              │      ║    │
│   ║   │  (Eval results attached to spans)              │      ║    │
│   ║   └────────────────────────────────────────────────┘      ║    │
│   ║                            │                                ║    │
│   ║                            ▼                                ║    │
│   ║   ┌────────────────────────────────────────────────┐      ║    │
│   ║   │  UI LAYER                                      │      ║    │
│   ║   │  (Spans + annotations rendered together)       │      ║    │
│   ║   └────────────────────────────────────────────────┘      ║    │
│   ║                                                             ║    │
│   ╚════════════════════════════════════════════════════════════╝    │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```


Before I show you what we built, I want to take a moment to explain what the platform itself is doing. Because everything we built sits on top of these concepts."**

**"What you see on screen is a real trace from Tachyon Overwatch. It captures one complete interaction with one of our AI agents. This particular trace happens to be from a multi-agent LangGraph workflow, so it has many steps."**

**"There are a few terms here that I want to clarify because they come from OpenTelemetry, which is the industry standard for observability."**

**"There are three types of signals we capture. The first is traces. The second is metrics. The third is logs. I'll deep dive into all of them in later slides, but for now let's focus on traces, because that is what powers our evaluation work."**

**"Each horizontal line you see here corresponds to what we call a span. A span is nothing more than one step inside the agent's work. When the agent thought about which tool to use, that was a span. When the agent called the LLM, that was another span. When the agent retrieved a document, that was yet another span."**

**"This entire collection of spans is wrapped together by what we call a trace. And the trace has a trace ID — you can see it right up there at the top."**

**"Now, if I click on any of these steps, look what happens here. The attributes panel changes. That is because each span has its own set of attributes — what input it received, what output it produced, how long it took, what model was called. Every span is unique."**

**"If I look at the attributes and search for parent, I can see that this span's parent ID is the span ID of the step above it. That is how the nested structure is created. Each child knows its parent, and that builds the tree."**

**"And if I go to the very first span at the top of the trace and search for parent, you will notice there is no parent. That is because this is the root span. It is the entry point. This is a useful trick — searching for spans without a parent gives you the root of any trace."**

**"You also see different icons next to each span. Those icons represent the span kind. We have Agent spans, Chain spans, LLM spans, Tool spans. The platform classifies each step automatically, which is what lets us filter to only LLM spans when we run hallucination evaluation — because that is where hallucinations happen."**

**"You will also see a status indicator and a latency value for each span. The latency is simply calculated from the start timestamp to the end timestamp of that step. And there is also something called a session, which groups related traces together — for example, a multi-turn conversation."**

**"To summarize — a span is one step. A trace is the full journey made of spans. Spans nest through parent IDs. Each span has a kind that tells us what type of work it did. This is the foundation. Everything we built next operates on this structure.

Before I show you what we built, I want to take a moment to explain what the platform itself is doing. Because everything we built sits on top of these concepts."**

**"What you see on screen is a real trace from Tachyon Overwatch. It captures one complete interaction with one of our AI agents. This particular trace happens to be from a multi-agent LangGraph workflow, so it has many steps."**

**"There are a few terms here that I want to clarify because they come from OpenTelemetry, which is the industry standard for observability."**

**"There are three types of signals we capture. The first is traces. The second is metrics. The third is logs. I'll deep dive into all of them in later slides, but for now let's focus on traces, because that is what powers our evaluation work."**

**"Each horizontal line you see here corresponds to what we call a span. A span is nothing more than one step inside the agent's work. When the agent thought about which tool to use, that was a span. When the agent called the LLM, that was another span. When the agent retrieved a document, that was yet another span."**

**"This entire collection of spans is wrapped together by what we call a trace. And the trace has a trace ID — you can see it right up there at the top."**

**"Now, if I click on any of these steps, look what happens here. The attributes panel changes. That is because each span has its own set of attributes — what input it received, what output it produced, how long it took, what model was called. Every span is unique."**

**"If I look at the attributes and search for parent, I can see that this span's parent ID is the span ID of the step above it. That is how the nested structure is created. Each child knows its parent, and that builds the tree."**

**"And if I go to the very first span at the top of the trace and search for parent, you will notice there is no parent. That is because this is the root span. It is the entry point. This is a useful trick — searching for spans without a parent gives you the root of any trace."**

**"You also see different icons next to each span. Those icons represent the span kind. We have Agent spans, Chain spans, LLM spans, Tool spans. The platform classifies each step automatically, which is what lets us filter to only LLM spans when we run hallucination evaluation — because that is where hallucinations happen."**

**"You will also see a status indicator and a latency value for each span. The latency is simply calculated from the start timestamp to the end timestamp of that step. And there is also something called a session, which groups related traces together — for example, a multi-turn conversation."**

**"To summarize — a span is one step. A trace is the full journey made of spans. Spans nest through parent IDs. Each span has a kind that tells us what type of work it did. This is the foundation. Everything we built next operates on this structure.



