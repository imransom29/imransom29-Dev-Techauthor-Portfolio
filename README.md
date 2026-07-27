| **Aspect**           | **Model Team Framework**                      | **Our Service**                           | **Recommendation**                                |
| -------------------- | --------------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| **Purpose**          | Offline MRM validation                        | Live production monitoring                | **Keep both** – They serve different purposes     |
| **How it Runs**      | CLI batch execution                           | Always-on FastAPI service                 | **Keep both** – Support both batch and live modes |
| **Architecture**     | Pre → Traces → Post pipeline                  | Layered plugin-based service              | **Use our service as the foundation**             |
| **Evaluators**       | 11 mature evaluator types                     | 1 production evaluator + 5 stubs          | **Adopt their evaluator suite**                   |
| **Judge Prompts**    | Mature, well-tuned prompts                    | Functional but basic prompts              | **Adopt their prompts**                           |
| **Judge Model**      | Tachyon completions                           | Claude 4.5 + Gemini 2.5                   | **Keep our judge model**                          |
| **Datasets**         | 3 specialised datasets with train/test splits | 100-entry benchmark dataset               | **Adopt their datasets**                          |
| **Reliability**      | Checkpointing and rerun logs                  | Concurrency support and graceful shutdown | **Keep both**                                     |
| **Human Feedback**   | Built-in SME review workflow                  | Annotation support only                   | **Adopt their review workflow**                   |
| **Reporting**        | Excel reports for MRM                         | Live dashboard                            | **Keep both**                                     |
| **Technology Stack** | Python CLI                                    | FastAPI service architecture              | **Keep our technology stack**                     |
<img width="594" height="511" alt="Screenshot 2026-07-27 at 8 59 41 PM" src="https://github.com/user-attachments/assets/ad73e618-b93c-4799-adc9-6b44aaae2ee7" />



<img width="617" height="531" alt="Screenshot 2026-07-27 at 8 25 08 PM" src="https://github.com/user-attachments/assets/7e66f5b6-7eb9-4d1e-acb1-912bfe223085" />
<img width="1202" height="669" alt="Screenshot 2026-07-23 at 8 47 01 AM" src="https://github.com/user-attachments/assets/5bfc2ec5-907b-45b5-90a7-64e045a78ad5" />
%%{init: {
  "theme": "base",
  "flowchart": { "nodeSpacing": 55, "rankSpacing": 70, "curve": "basis" },
  "themeVariables": {
    "background": "#ffffff",
    "lineColor": "#000000",
    "primaryTextColor": "#000000",
    "clusterBkg": "#ffffff",
    "clusterBorder": "#000000",
    "edgeLabelBackground": "#ffffff",
    "fontSize": "14px"
  }
}}%%
flowchart TB
    %% ═══ TIER 1: CLIENTS ═══
    subgraph CLIENTS["👥 Clients"]
        direction LR
        UI["Web UI Dashboard<br/>(live.html / TraceExplorer.jsx)"]
        AUTO["Automated Scripts<br/>CI/CD / Cron Jobs"]
    end

    SSO["🔐 SSO Gateway / Apigee Proxy<br/>(injects identity headers)"]

    %% ═══ TIER 2: APP ═══
    subgraph APP["🚀 FastAPI Application (app/main.py)"]
        direction LR
        MW["Middleware<br/>CORS + TrustedHost + Access Logs"]
        LIFE["Lifespan Manager<br/>warmup + SIGTERM drain"]
    end

    %% ═══ TIER 3: ROUTERS ═══
    subgraph ROUTERS["🧭 Router Layer (app/routers)"]
        direction LR
        RHALL["hallucination/router.py<br/>capabilities info"]
        REVAL["evaluation.py<br/>/evaluations, /stream, /push<br/>/live, /ready, /dashboard/realtime"]
        RBENCH["benchmark.py<br/>/benchmark/status, /run"]
    end

    %% ═══ TIER 4: GUARDS + SERVICES (side by side) ═══
    subgraph ROW1[" "]
        direction LR
        subgraph GUARDS["🛡️ Request Guards (app/core)"]
            direction LR
            LIMIT["limiter.py<br/>concurrency semaphore"]
            SSEC["sse.py<br/>event stream framing"]
            ERR["errors.py<br/>sanitized error mapping"]
            SCRUB["scrub.py<br/>PII redaction"]
        end
        subgraph SERVICES["⚙️ Service Layer (app/services)"]
            direction LR
            EVSVC["EvaluationService<br/>run / run_stream<br/>push_annotations"]
            REPORT["ReportService<br/>summary + terminal report"]
            BENSVC["BenchmarkService<br/>status / pipeline"]
            JUDGE["JudgeFactory<br/>builds LLM judge clients"]
        end
    end

    %% ═══ TIER 5: UTILS + CONNECTORS (side by side) ═══
    subgraph ROW2[" "]
        direction LR
        subgraph UTILS["🧰 Shared Toolkit (app/core)"]
            direction LR
            VALID["validation.py<br/>config guard"]
            SPAN["span_fields.py<br/>column normalizer"]
            REG["registry.py<br/>evaluator plugin lookup"]
            PARA["parallel.py<br/>thread fan-out"]
            RETRY["retry.py<br/>backoff"]
        end
        subgraph CONNECTORS["🔌 Connector Layer (app/connectors)"]
            direction LR
            CONST["constants.py<br/>GraphQL + pagination limits"]
            OWC["OverwatchConnector<br/>fetch_spans / log_evaluations_back"]
            TAUTH["TachyonAuth<br/>Apigee OAuth token cache"]
        end
    end

    %% ═══ TIER 6: EVALUATORS + PLATFORM (side by side) ═══
    subgraph ROW3[" "]
        direction LR
        subgraph EVALS["🔬 Evaluator Plugins (app/evaluators)"]
            direction LR
            BASE["BaseEvaluator (contract)<br/>+ metadata"]
            HEVAL["HallucinationEvaluator<br/>@register_evaluator"]
            OTHERS["coherence / completeness<br/>correctness / relevance / toxicity"]
        end
        subgraph PLATFORM["🏦 Internal Tachyon Platform (Wells Fargo)"]
            direction LR
            OVERWATCH[("Tachyon Overwatch<br/>Arize Platform<br/>GraphQL – spans + annotations")]
            TACHYON[("Tachyon Generation Gateway<br/>Apigee – Judge LLM<br/>OpenAI-compatible")]
        end
    end

    %% ═══ MAIN FLOW ═══
    CLIENTS --> SSO
    SSO --> MW
    MW --> ROUTERS

    %% Routers fan out — each lands one tier below
    REVAL --> GUARDS
    REVAL --> EVSVC
    RBENCH --> BENSVC
    RHALL -.->|list evaluators| REG

    %% Services use toolkit + connectors — both one tier below
    EVSVC --> UTILS
    EVSVC ==>|fetch + write spans| OWC
    JUDGE ==>|LLM calls| TAUTH
    EVSVC -.->|validated by| VALID

    %% Toolkit + connectors reach the bottom tier
    REG --> BASE
    BASE --> HEVAL
    BASE --> OTHERS
    PARA -.->|used by| HEVAL
    RETRY -.->|used by| HEVAL
    OWC --> CONST
    OWC ==>|"GraphQL: fetch spans<br/>+ push annotations"| OVERWATCH
    TAUTH ==>|"OAuth + LLM calls"| TACHYON

    %% Cross-cutting
    LIFE -.->|warmup| EVSVC
    ERR -.->|logs via| SCRUB

    %% ═══ STYLES: white canvas · black pen · colored blocks ═══
    classDef clientCls fill:#4c1d95,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef ssoCls fill:#5b21b6,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef appCls fill:#1e3a5f,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef routerCls fill:#0c4a6e,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef guardCls fill:#312e81,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef svcCls fill:#22543d,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef utilCls fill:#1a365d,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef evalCls fill:#744210,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef connCls fill:#7b341e,stroke:#000000,color:#ffffff,stroke-width:1.5px
    classDef platCls fill:#7f1d1d,stroke:#000000,color:#ffffff,stroke-width:2px

    class UI,AUTO clientCls
    class SSO ssoCls
    class MW,LIFE appCls
    class REVAL,RBENCH,RHALL routerCls
    class LIMIT,SSEC,ERR,SCRUB guardCls
    class EVSVC,BENSVC,JUDGE,REPORT svcCls
    class VALID,SPAN,REG,PARA,RETRY utilCls
    class BASE,HEVAL,OTHERS evalCls
    class OWC,TAUTH,CONST connCls
    class OVERWATCH,TACHYON platCls

    style ROW1 fill:none,stroke:none
    style ROW2 fill:none,stroke:none
    style ROW3 fill:none,stroke:none
