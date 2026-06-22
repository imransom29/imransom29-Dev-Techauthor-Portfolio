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
