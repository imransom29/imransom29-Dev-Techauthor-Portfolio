# Overwatch Eval Service — FRESH BUILD

**Yeh document 3 parts mein hai:**

1. **PART A:** Prompt jo tu GitHub Copilot / Claude Code mein paste karega
2. **PART B:** Poora code jo generate hona chahiye (reference ke liye)
3. **PART C:** Line-by-line explanation — jaise tu Kaz ko samjha raha hai

---

# PART A: PROMPT FOR GITHUB COPILOT / CLAUDE CODE

Yeh prompt copy-paste karega tu. Bas yeh paste kar aur generate hone de.

---

```
# Build: Overwatch Trace-Based Evaluation Service

## What This Service Does (Plain English)

I need a Python FastAPI service that does ONE thing:

1. Connects to Tachyon Overwatch (which is Arize Phoenix deployed at Wells Fargo)
2. Fetches EXISTING traces/spans from a project that's already running
3. Runs built-in Hallucination evaluation on those spans using Phoenix's eval templates
4. Logs the evaluation results BACK to Overwatch — so each span shows its hallucination score in the UI
5. Returns a summary report

This is NOT about creating a new agent or mock agent. Real agents are ALREADY running and producing traces in Tachyon Overwatch. My service just evaluates those existing traces.

## The Flow (Step by Step)

Step 1: User hits POST /api/v1/evaluate
        User provides: project_name (which Overwatch project to evaluate)
        
Step 2: Service connects to Tachyon Overwatch using Phoenix Python SDK
        Endpoint: https://tachyon-observe-uat.wellsfargo.net
        Auth: API Key + Space ID
        
Step 3: Service fetches spans from that project
        Uses: phoenix.Client().spans.get_spans_dataframe()
        Filters to: LLM spans only (span_kind == 'LLM')
        
Step 4: Service runs Phoenix's built-in Hallucination eval template
        Uses: phoenix.evals.HallucinationEvaluator or equivalent
        Judge model: gpt-oss-20b (available on Overwatch)
        Each span gets evaluated individually
        
Step 5: Service logs evaluation results BACK to Overwatch
        Uses: phoenix.Client().spans.log_span_annotations_dataframe()
        Now each span in Overwatch UI shows "Hallucination: yes/no" with explanation
        
Step 6: Service generates a summary report
        Total spans evaluated, hallucination count, rate, verdict
        Per-span breakdown with question, answer, label, explanation

## Tech Stack

- Python 3.10+
- FastAPI + Uvicorn
- arize-phoenix-evals (for built-in eval templates)
- arize-phoenix[client] (for connecting to Overwatch)
- openai (judge model SDK)
- pandas
- python-dotenv
- rich (terminal output)

## Project Structure

```
overwatch-eval-service/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # All settings from .env
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py             # Request/Response Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   └── evaluation.py          # API endpoint handlers
│   └── services/
│       ├── __init__.py
│       ├── overwatch_connector.py # Connect to Overwatch, fetch spans
│       ├── span_evaluator.py      # Run hallucination eval on spans
│       └── report_service.py      # Generate summary report
├── .env.example
├── requirements.txt
├── run.py                          # Entry point: python run.py
└── README.md
```

## Environment Variables (.env.example)

```
# Tachyon Overwatch (= Arize Phoenix deployed at Wells Fargo)
OVERWATCH_ENDPOINT=https://tachyon-observe-uat.wellsfargo.net
OVERWATCH_API_KEY=ak-5a61be62...
OVERWATCH_SPACE_ID=U3BhY2U6NDI6S2NSNA==

# Judge Model (for LLM-as-a-Judge evaluation)
OPENAI_API_KEY=...
JUDGE_MODEL=gpt-oss-20b

# Default project to evaluate
DEFAULT_PROJECT=Tachyon Generation

# Service
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8000
```

## API Endpoints

### POST /api/v1/evaluate
Trigger evaluation on an Overwatch project's existing traces.

Request:
```json
{
  "project_name": "Tachyon Generation",
  "span_filter": "LLM",
  "evaluator": "hallucination",
  "limit": 50
}
```

Response:
```json
{
  "evaluation_id": "eval-abc123",
  "status": "completed",
  "summary": {
    "total_spans": 50,
    "hallucinated": 7,
    "not_hallucinated": 43,
    "hallucination_rate": 14.0,
    "verdict": "FAILED"
  },
  "per_span_results": [
    {
      "span_id": "span-xyz",
      "input": "What is leave policy?",
      "output": "24 days annually",
      "label": "not_hallucinated",
      "score": 0.05,
      "explanation": "Answer matches factual content"
    }
  ],
  "logged_to_overwatch": true
}
```

### GET /api/v1/health
Check connectivity to Overwatch.

Response:
```json
{
  "status": "connected",
  "endpoint": "https://tachyon-observe-uat.wellsfargo.net",
  "project_count": 1,
  "projects": ["Tachyon Generation"]
}
```

### GET /api/v1/projects
List available projects in Overwatch.

### GET /api/v1/projects/{project_name}/stats
Get span count and basic stats for a project.

## Detailed File Specs

### app/main.py
- Create FastAPI app with title "Overwatch Eval Service"
- Mount evaluation router at /api/v1
- Add root endpoint returning service info
- Setup logging on startup

### app/config.py
- Use Pydantic BaseSettings
- Load from .env file
- Fields: overwatch_endpoint, overwatch_api_key, overwatch_space_id, 
  openai_api_key, judge_model, default_project, service_host, service_port

### app/models/schemas.py
- EvaluateRequest: project_name, span_filter, evaluator, limit
- EvaluateResponse: evaluation_id, status, summary, per_span_results, logged_to_overwatch
- HealthResponse: status, endpoint, project_count, projects
- SpanResult: span_id, input, output, label, score, explanation
- Summary: total_spans, hallucinated, not_hallucinated, hallucination_rate, verdict

### app/services/overwatch_connector.py

This is the critical file. It connects to Tachyon Overwatch using Phoenix's Python client.

```python
import os
import pandas as pd
from phoenix.client import Client

class OverwatchConnector:
    """
    Connects to Tachyon Overwatch (= Arize Phoenix).
    Fetches existing spans from projects.
    Logs evaluation results back.
    """
    
    def __init__(self, endpoint: str, api_key: str, space_id: str):
        # Configure Phoenix client to point at Tachyon Overwatch
        os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = endpoint
        os.environ["PHOENIX_API_KEY"] = api_key
        os.environ["PHOENIX_CLIENT_HEADERS"] = f"space-id={space_id}"
        
        self.client = Client(endpoint=endpoint, api_key=api_key)
    
    def list_projects(self) -> list[str]:
        """List all projects in the Overwatch space."""
        projects = self.client.list_projects()
        return [p.name for p in projects]
    
    def fetch_spans(
        self, 
        project_name: str, 
        span_kind: str = "LLM",
        limit: int = 50
    ) -> pd.DataFrame:
        """
        Fetch spans from an existing project.
        These are REAL traces from a REAL agent already running.
        """
        spans_df = self.client.spans.get_spans_dataframe(
            project_identifier=project_name
        )
        
        if spans_df is None or spans_df.empty:
            return pd.DataFrame()
        
        # Filter to specific span kind (LLM, AGENT, RETRIEVER, etc.)
        if span_kind:
            filtered = spans_df[spans_df["span_kind"] == span_kind]
        else:
            filtered = spans_df
        
        # Limit
        return filtered.head(limit)
    
    def log_evaluations_back(self, evaluations_df: pd.DataFrame) -> bool:
        """
        Log evaluation results back to Overwatch.
        After this, each span in Overwatch UI shows its score.
        """
        try:
            self.client.spans.log_span_annotations_dataframe(
                dataframe=evaluations_df
            )
            return True
        except Exception as e:
            print(f"Warning: Could not log back to Overwatch: {e}")
            return False
```

### app/services/span_evaluator.py

This file runs Phoenix's built-in Hallucination eval on the fetched spans.

```python
import pandas as pd
from phoenix.evals import (
    HallucinationEvaluator,
    OpenAIModel,
    run_evals,
)
# OR if HallucinationEvaluator not available in newer SDK:
from phoenix.evals import (
    create_classifier,
    HALLUCINATION_PROMPT_TEMPLATE,
    HALLUCINATION_PROMPT_RAILS_MAP,
)
from phoenix.evals.llm import LLM

class SpanEvaluator:
    """
    Runs built-in Phoenix eval templates on spans.
    Uses LLM-as-a-Judge pattern with built-in Hallucination template.
    """
    
    def __init__(self, judge_model: str = "gpt-oss-20b"):
        self.judge_model = judge_model
        
        # Initialize the judge LLM
        self.llm = LLM(
            provider="openai",
            model=judge_model,
            temperature=0.0,
        )
    
    def evaluate_hallucination(self, spans_df: pd.DataFrame) -> pd.DataFrame:
        """
        Run hallucination evaluation on each span.
        Uses Phoenix's built-in template — NOT custom prompts.
        
        Returns DataFrame with columns:
        - span_id
        - label ("hallucinated" / "not_hallucinated")  
        - score (0.0 to 1.0)
        - explanation (why judge decided this)
        """
        
        # Create the hallucination evaluator using built-in template
        hallucination_eval = create_classifier(
            name="hallucination",
            prompt_template=HALLUCINATION_PROMPT_TEMPLATE,
            llm=self.llm,
            choices=HALLUCINATION_PROMPT_RAILS_MAP,
        )
        
        # Prepare data for evaluation
        # Phoenix expects "input" and "output" columns
        eval_data = []
        for idx, row in spans_df.iterrows():
            input_val = row.get("attributes.input.value", "")
            output_val = row.get("attributes.output.value", "")
            
            if input_val and output_val:
                result = hallucination_eval.evaluate({
                    "input": str(input_val),
                    "output": str(output_val),
                })
                
                eval_data.append({
                    "span_id": str(idx),
                    "input": str(input_val)[:200],
                    "output": str(output_val)[:200],
                    "label": result[0].label if result else "unknown",
                    "score": result[0].score if result else 0.0,
                    "explanation": result[0].explanation if result else "",
                })
        
        return pd.DataFrame(eval_data)
```

### app/services/report_service.py

Generates terminal-friendly and JSON reports.

```python
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()

class ReportService:
    
    def generate_summary(self, eval_results: pd.DataFrame) -> dict:
        total = len(eval_results)
        hallucinated = (eval_results["label"] == "hallucinated").sum()
        rate = (hallucinated / total * 100) if total > 0 else 0
        
        if rate < 5:
            verdict = "PASSED"
        elif rate <= 10:
            verdict = "REVIEW"
        else:
            verdict = "FAILED"
        
        return {
            "total_spans": int(total),
            "hallucinated": int(hallucinated),
            "not_hallucinated": int(total - hallucinated),
            "hallucination_rate": round(rate, 2),
            "verdict": verdict,
        }
    
    def print_report(self, summary: dict, per_span: list):
        """Pretty print to terminal."""
        # Summary panel
        table = Table(title="Evaluation Summary")
        table.add_column("Metric", style="cyan")
        table.add_column("Value")
        table.add_row("Total Spans", str(summary["total_spans"]))
        table.add_row("Hallucinated", str(summary["hallucinated"]))
        table.add_row("Rate", f"{summary['hallucination_rate']}%")
        table.add_row("Verdict", summary["verdict"])
        
        color = {"PASSED": "green", "REVIEW": "yellow", "FAILED": "red"}.get(summary["verdict"], "white")
        console.print(Panel(table, border_style=color))
        
        # Per-span table
        span_table = Table(title="Per-Span Breakdown")
        span_table.add_column("Input", max_width=40)
        span_table.add_column("Output", max_width=40)
        span_table.add_column("Label")
        
        for span in per_span[:20]:  # Show first 20
            label_style = "red" if span["label"] == "hallucinated" else "green"
            span_table.add_row(
                span["input"][:40],
                span["output"][:40],
                f"[{label_style}]{span['label']}[/{label_style}]"
            )
        console.print(span_table)
```

### app/routers/evaluation.py

The API endpoint handlers.

```python
from fastapi import APIRouter
from app.models.schemas import EvaluateRequest, EvaluateResponse, HealthResponse
from app.services.overwatch_connector import OverwatchConnector
from app.services.span_evaluator import SpanEvaluator
from app.services.report_service import ReportService
from app.config import settings
import uuid

router = APIRouter()

@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate(request: EvaluateRequest):
    evaluation_id = f"eval-{uuid.uuid4().hex[:8]}"
    
    # Step 1: Connect to Overwatch
    connector = OverwatchConnector(
        endpoint=settings.overwatch_endpoint,
        api_key=settings.overwatch_api_key,
        space_id=settings.overwatch_space_id,
    )
    
    # Step 2: Fetch existing spans
    spans_df = connector.fetch_spans(
        project_name=request.project_name,
        span_kind=request.span_filter,
        limit=request.limit,
    )
    
    if spans_df.empty:
        return EvaluateResponse(
            evaluation_id=evaluation_id,
            status="no_spans",
            summary={"total_spans": 0, "verdict": "NO DATA"},
            per_span_results=[],
            logged_to_overwatch=False,
        )
    
    # Step 3: Run hallucination evaluation
    evaluator = SpanEvaluator(judge_model=settings.judge_model)
    eval_results = evaluator.evaluate_hallucination(spans_df)
    
    # Step 4: Log results back to Overwatch
    from phoenix.evals.utils import to_annotation_dataframe
    annotations_df = to_annotation_dataframe(dataframe=eval_results)
    logged = connector.log_evaluations_back(annotations_df)
    
    # Step 5: Generate report
    reporter = ReportService()
    summary = reporter.generate_summary(eval_results)
    per_span = eval_results.to_dict(orient="records")
    
    # Print to terminal
    reporter.print_report(summary, per_span)
    
    return EvaluateResponse(
        evaluation_id=evaluation_id,
        status="completed",
        summary=summary,
        per_span_results=per_span,
        logged_to_overwatch=logged,
    )

@router.get("/health")
async def health():
    connector = OverwatchConnector(
        endpoint=settings.overwatch_endpoint,
        api_key=settings.overwatch_api_key,
        space_id=settings.overwatch_space_id,
    )
    try:
        projects = connector.list_projects()
        return {
            "status": "connected",
            "endpoint": settings.overwatch_endpoint,
            "project_count": len(projects),
            "projects": projects,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.get("/projects")
async def list_projects():
    connector = OverwatchConnector(
        endpoint=settings.overwatch_endpoint,
        api_key=settings.overwatch_api_key,
        space_id=settings.overwatch_space_id,
    )
    return {"projects": connector.list_projects()}
```

### run.py

```python
import uvicorn
from dotenv import load_dotenv
load_dotenv()

from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.service_host,
        port=settings.service_port,
        reload=True,
    )
```

### requirements.txt

```
fastapi>=0.100.0
uvicorn>=0.23.0
arize-phoenix[evals]>=8.0.0
openai>=1.0.0
pandas>=2.0.0
python-dotenv>=1.0.0
rich>=13.0.0
httpx>=0.24.0
pydantic-settings>=2.0.0
```

## IMPORTANT NOTES FOR CODE GENERATION

1. This service does NOT have a mock agent. It evaluates REAL existing traces.

2. The Phoenix client SDK connects to Tachyon Overwatch (same product). 
   The endpoint is configurable via .env.

3. Use ONLY Phoenix's built-in eval templates (HALLUCINATION_PROMPT_TEMPLATE 
   or HallucinationEvaluator). Do NOT write custom evaluation prompts.

4. The evaluation flow is:
   Fetch spans → Run eval template → Log annotations back → Report
   
   NOT:
   Create agent → Query agent → Upload dataset → Trigger experiment

5. If the Phoenix SDK's exact method names don't match what I wrote above,
   check the latest arize-phoenix docs and use the correct method names.
   The PATTERN is what matters:
   - Get spans from project
   - Run built-in eval on them
   - Log results back as annotations
   
6. Handle errors gracefully — if Overwatch is unreachable, if spans are empty,
   if eval fails, if logging back fails. Never crash the service.

7. Keep it simple. No TAWK. No mock agent. No dataset upload. 
   Just: fetch existing spans → evaluate → log back → report.
```

---

# PART B: EXPECTED RESULT — COMPLETE CODE

Yeh code hai jo generate hona chahiye. Reference ke liye rakh — agar Copilot kuch alag banaye toh compare kar.

---

## File: `requirements.txt`

```
fastapi>=0.100.0
uvicorn>=0.23.0
arize-phoenix[evals]>=8.0.0
openai>=1.0.0
pandas>=2.0.0
python-dotenv>=1.0.0
rich>=13.0.0
httpx>=0.24.0
pydantic-settings>=2.0.0
```

---

## File: `.env.example`

```bash
# === Tachyon Overwatch (= Arize Phoenix) ===
OVERWATCH_ENDPOINT=https://tachyon-observe-uat.wellsfargo.net
OVERWATCH_API_KEY=ak-5a61be62...
OVERWATCH_SPACE_ID=U3BhY2U6NDI6S2NSNA==

# === Judge Model ===
OPENAI_API_KEY=sk-...
JUDGE_MODEL=gpt-oss-20b

# === Default Project ===
DEFAULT_PROJECT=Tachyon Generation

# === Service ===
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8000
```

---

## File: `run.py`

```python
"""
Entry point. Just run: python run.py
"""
import uvicorn
from dotenv import load_dotenv

load_dotenv()

from app.config import settings

if __name__ == "__main__":
    print(f"\n🚀 Starting Overwatch Eval Service")
    print(f"   Endpoint: {settings.overwatch_endpoint}")
    print(f"   Judge Model: {settings.judge_model}")
    print(f"   Default Project: {settings.default_project}\n")
    
    uvicorn.run(
        "app.main:app",
        host=settings.service_host,
        port=settings.service_port,
        reload=True,
    )
```

---

## File: `app/__init__.py`

```python
# Empty init
```

---

## File: `app/main.py`

```python
"""
FastAPI application entry point.
Mounts the evaluation router and sets up the service.
"""
import logging
from fastapi import FastAPI
from app.routers.evaluation import router as eval_router

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

app = FastAPI(
    title="Overwatch Eval Service",
    description="Trace-driven evaluation service for Tachyon Overwatch (Arize Phoenix)",
    version="1.0.0",
)

# Mount routes
app.include_router(eval_router, prefix="/api/v1", tags=["evaluation"])


@app.get("/")
async def root():
    return {
        "service": "overwatch-eval-service",
        "version": "1.0.0",
        "description": "Evaluates existing traces in Tachyon Overwatch using Phoenix built-in templates",
    }
```

---

## File: `app/config.py`

```python
"""
All configuration loaded from .env file.
Single source of truth for settings.
"""
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Tachyon Overwatch connection
    overwatch_endpoint: str = Field(
        default="https://tachyon-observe-uat.wellsfargo.net",
        alias="OVERWATCH_ENDPOINT",
    )
    overwatch_api_key: str = Field(default="", alias="OVERWATCH_API_KEY")
    overwatch_space_id: str = Field(default="", alias="OVERWATCH_SPACE_ID")
    
    # Judge model for LLM-as-a-Judge evaluation
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    judge_model: str = Field(default="gpt-oss-20b", alias="JUDGE_MODEL")
    
    # Default project to evaluate
    default_project: str = Field(
        default="Tachyon Generation", alias="DEFAULT_PROJECT"
    )
    
    # Service settings
    service_host: str = Field(default="0.0.0.0", alias="SERVICE_HOST")
    service_port: int = Field(default=8000, alias="SERVICE_PORT")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
```

---

## File: `app/models/__init__.py`

```python
# Empty init
```

---

## File: `app/models/schemas.py`

```python
"""
Pydantic models for API request/response.
Clean data contracts — what goes in, what comes out.
"""
from pydantic import BaseModel, Field
from typing import Optional


class EvaluateRequest(BaseModel):
    """What the user sends to trigger evaluation."""
    project_name: str = Field(
        default="Tachyon Generation",
        description="Name of the Overwatch project whose traces to evaluate"
    )
    span_filter: str = Field(
        default="LLM",
        description="Filter spans by kind: LLM, AGENT, RETRIEVER, or empty for all"
    )
    evaluator: str = Field(
        default="hallucination",
        description="Which evaluator to run"
    )
    limit: int = Field(
        default=50,
        description="Max number of spans to evaluate"
    )


class SpanResult(BaseModel):
    """Evaluation result for one span."""
    span_id: str
    input: str
    output: str
    label: str
    score: float
    explanation: str = ""


class Summary(BaseModel):
    """Aggregate evaluation summary."""
    total_spans: int
    hallucinated: int
    not_hallucinated: int
    hallucination_rate: float
    verdict: str  # PASSED / REVIEW / FAILED


class EvaluateResponse(BaseModel):
    """What the service returns after evaluation."""
    evaluation_id: str
    status: str
    summary: dict
    per_span_results: list = []
    logged_to_overwatch: bool = False
```

---

## File: `app/routers/__init__.py`

```python
# Empty init
```

---

## File: `app/routers/evaluation.py`

```python
"""
API endpoint handlers.

POST /api/v1/evaluate   — Run evaluation on existing traces
GET  /api/v1/health     — Check Overwatch connectivity
GET  /api/v1/projects   — List available projects
"""
import uuid
import logging
from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models.schemas import EvaluateRequest, EvaluateResponse
from app.services.overwatch_connector import OverwatchConnector
from app.services.span_evaluator import SpanEvaluator
from app.services.report_service import ReportService

logger = logging.getLogger(__name__)
router = APIRouter()


def _get_connector() -> OverwatchConnector:
    """Create a connector to Tachyon Overwatch."""
    return OverwatchConnector(
        endpoint=settings.overwatch_endpoint,
        api_key=settings.overwatch_api_key,
        space_id=settings.overwatch_space_id,
    )


@router.post("/evaluate")
async def evaluate(request: EvaluateRequest):
    """
    Main endpoint. Evaluates existing traces in Overwatch.
    
    Flow:
    1. Connect to Tachyon Overwatch
    2. Fetch existing spans from the specified project
    3. Run built-in Hallucination eval on each span
    4. Log results back to Overwatch (per-span annotations)
    5. Return summary + per-span report
    """
    evaluation_id = f"eval-{uuid.uuid4().hex[:8]}"
    logger.info(f"[{evaluation_id}] Starting evaluation on project: {request.project_name}")
    
    # Step 1: Connect
    connector = _get_connector()
    
    # Step 2: Fetch spans
    logger.info(f"[{evaluation_id}] Fetching spans (kind={request.span_filter}, limit={request.limit})")
    spans_df = connector.fetch_spans(
        project_name=request.project_name,
        span_kind=request.span_filter,
        limit=request.limit,
    )
    
    if spans_df.empty:
        logger.warning(f"[{evaluation_id}] No spans found in project '{request.project_name}'")
        return EvaluateResponse(
            evaluation_id=evaluation_id,
            status="no_spans",
            summary={
                "total_spans": 0,
                "hallucinated": 0,
                "not_hallucinated": 0,
                "hallucination_rate": 0,
                "verdict": "NO DATA",
            },
            per_span_results=[],
            logged_to_overwatch=False,
        )
    
    logger.info(f"[{evaluation_id}] Fetched {len(spans_df)} spans. Running evaluation...")
    
    # Step 3: Run hallucination evaluation
    evaluator = SpanEvaluator(judge_model=settings.judge_model)
    eval_results_df = evaluator.evaluate_hallucination(spans_df)
    
    # Step 4: Log results back to Overwatch
    logged = connector.log_evaluations_back(eval_results_df)
    if logged:
        logger.info(f"[{evaluation_id}] Per-span scores logged back to Overwatch")
    else:
        logger.warning(f"[{evaluation_id}] Could not log back to Overwatch (continuing anyway)")
    
    # Step 5: Generate report
    reporter = ReportService()
    summary = reporter.generate_summary(eval_results_df)
    per_span = eval_results_df.to_dict(orient="records")
    
    # Print to terminal
    reporter.print_report(summary, per_span)
    
    logger.info(
        f"[{evaluation_id}] Complete. "
        f"Verdict: {summary['verdict']} "
        f"({summary['hallucination_rate']}% hallucination rate)"
    )
    
    return EvaluateResponse(
        evaluation_id=evaluation_id,
        status="completed",
        summary=summary,
        per_span_results=per_span,
        logged_to_overwatch=logged,
    )


@router.get("/health")
async def health():
    """Check connectivity to Tachyon Overwatch."""
    connector = _get_connector()
    try:
        projects = connector.list_projects()
        return {
            "status": "connected",
            "endpoint": settings.overwatch_endpoint,
            "project_count": len(projects),
            "projects": projects,
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "error",
            "endpoint": settings.overwatch_endpoint,
            "error": str(e),
        }


@router.get("/projects")
async def list_projects():
    """List all projects in Overwatch."""
    connector = _get_connector()
    try:
        projects = connector.list_projects()
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects/{project_name}/stats")
async def project_stats(project_name: str):
    """Get basic stats for a project."""
    connector = _get_connector()
    try:
        spans_df = connector.fetch_spans(project_name, span_kind=None, limit=1000)
        if spans_df.empty:
            return {"project": project_name, "total_spans": 0}
        
        kind_counts = spans_df["span_kind"].value_counts().to_dict()
        return {
            "project": project_name,
            "total_spans": len(spans_df),
            "by_kind": kind_counts,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## File: `app/services/__init__.py`

```python
# Empty init
```

---

## File: `app/services/overwatch_connector.py`

```python
"""
Connects to Tachyon Overwatch (which is Arize Phoenix deployed at Wells Fargo).

This file is the BRIDGE between your service and Overwatch.
It does 3 things:
1. Lists projects
2. Fetches existing spans from a project
3. Logs evaluation results back (so they appear in the UI per-span)
"""
import os
import logging
import pandas as pd

logger = logging.getLogger(__name__)


class OverwatchConnector:
    """
    Phoenix SDK client configured to talk to Tachyon Overwatch.
    
    Since Tachyon Overwatch = Arize Phoenix (same product),
    the Phoenix Python SDK works directly against it.
    Just point it to the Tachyon Overwatch endpoint.
    """
    
    def __init__(self, endpoint: str, api_key: str, space_id: str):
        self.endpoint = endpoint
        self.api_key = api_key
        self.space_id = space_id
        
        # Configure Phoenix SDK environment to point at Tachyon Overwatch
        os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = endpoint
        os.environ["PHOENIX_API_KEY"] = api_key
        if space_id:
            os.environ["PHOENIX_CLIENT_HEADERS"] = f"space-id={space_id}"
        
        # Import Phoenix client here (after env vars are set)
        from phoenix.client import Client
        self.client = Client(endpoint=endpoint, api_key=api_key)
        
        logger.info(f"Connected to Tachyon Overwatch at {endpoint}")
    
    def list_projects(self) -> list[str]:
        """
        List all tracing projects in the Overwatch space.
        
        Example return: ["Tachyon Generation", "ahp-pro-supervisor"]
        """
        try:
            projects = self.client.list_projects()
            project_names = [p.name for p in projects]
            logger.info(f"Found {len(project_names)} projects: {project_names}")
            return project_names
        except Exception as e:
            logger.error(f"Failed to list projects: {e}")
            raise
    
    def fetch_spans(
        self,
        project_name: str,
        span_kind: str = "LLM",
        limit: int = 50,
    ) -> pd.DataFrame:
        """
        Fetch spans from an existing Overwatch project.
        
        These spans are from a REAL agent that already ran and produced traces.
        We are NOT creating new traces — we are reading existing ones.
        
        Args:
            project_name: e.g. "Tachyon Generation"
            span_kind: Filter by span type — "LLM", "AGENT", "RETRIEVER", etc.
                       None or "" means all spans.
            limit: Maximum spans to return.
        
        Returns:
            DataFrame where each row is one span, with columns like:
            - span_kind
            - attributes.input.value (what was asked)
            - attributes.output.value (what was answered)
            - latency_ms
            - status_code
            - etc.
        """
        try:
            spans_df = self.client.spans.get_spans_dataframe(
                project_identifier=project_name
            )
        except Exception as e:
            logger.error(f"Failed to fetch spans from '{project_name}': {e}")
            return pd.DataFrame()
        
        if spans_df is None or spans_df.empty:
            logger.warning(f"No spans found in project '{project_name}'")
            return pd.DataFrame()
        
        logger.info(f"Fetched {len(spans_df)} total spans from '{project_name}'")
        
        # Filter by span kind if specified
        if span_kind:
            filtered = spans_df[spans_df["span_kind"] == span_kind].copy()
            logger.info(f"Filtered to {len(filtered)} spans of kind '{span_kind}'")
        else:
            filtered = spans_df.copy()
        
        # Apply limit
        result = filtered.head(limit)
        logger.info(f"Returning {len(result)} spans (limit={limit})")
        
        return result
    
    def log_evaluations_back(self, eval_results_df: pd.DataFrame) -> bool:
        """
        Log evaluation results back to Overwatch as span annotations.
        
        After this call, each span in the Overwatch UI will show:
        - Hallucination label (yes/no)
        - Score (0.0 to 1.0)
        - Explanation (why judge decided this)
        
        This is the KEY step that makes per-span scoring visible in the UI.
        This is what Kaz saw in the Phoenix demo and wants us to adopt.
        """
        try:
            # Convert eval results to annotation format
            from phoenix.evals.utils import to_annotation_dataframe
            annotations_df = to_annotation_dataframe(dataframe=eval_results_df)
            
            # Log back to Overwatch
            self.client.spans.log_span_annotations_dataframe(
                dataframe=annotations_df
            )
            
            logger.info(
                f"Successfully logged {len(eval_results_df)} span annotations "
                f"back to Overwatch"
            )
            return True
            
        except Exception as e:
            # Don't crash the service if logging fails
            # The evaluation results are still available locally
            logger.warning(
                f"Could not log evaluations back to Overwatch: {e}. "
                f"Results are still available in the API response."
            )
            return False
```

---

## File: `app/services/span_evaluator.py`

```python
"""
Runs built-in Phoenix evaluation templates on spans.

This file uses Phoenix's BUILT-IN Hallucination eval template.
We do NOT write custom prompts — Arize has already tested and optimized these.

This is the pattern Kaz pointed to:
- "Run Evals With Built-In Eval Templates" (Phoenix docs)
- "I see Hallucination values for each span. This is something we should adopt."
"""
import logging
import pandas as pd

logger = logging.getLogger(__name__)


class SpanEvaluator:
    """
    Evaluates spans using Phoenix's built-in templates.
    
    Currently supports: Hallucination
    Future: Relevance, Toxicity, Correctness, User Frustration
    """
    
    def __init__(self, judge_model: str = "gpt-oss-20b"):
        self.judge_model = judge_model
        logger.info(f"SpanEvaluator initialized with judge model: {judge_model}")
    
    def evaluate_hallucination(self, spans_df: pd.DataFrame) -> pd.DataFrame:
        """
        Run hallucination evaluation on each span.
        
        How it works (step by step):
        
        1. Take each span's input (what user asked) and output (what agent answered)
        2. Feed them to Phoenix's HALLUCINATION_PROMPT_TEMPLATE
        3. The template asks a bigger LLM (judge): "Is this output hallucinated?"
        4. Judge returns: label (yes/no) + score (0-1) + explanation (why)
        5. We collect all results into a DataFrame
        
        This is the EXACT pattern from Phoenix's "Run Evals With Built-In Eval Templates" tutorial.
        """
        from phoenix.evals import (
            create_classifier,
            HALLUCINATION_PROMPT_TEMPLATE,
            HALLUCINATION_PROMPT_RAILS_MAP,
        )
        from phoenix.evals.llm import LLM
        
        # Initialize judge model
        llm = LLM(
            provider="openai",
            model=self.judge_model,
            temperature=0.0,
        )
        
        # Create evaluator using built-in template
        hallucination_eval = create_classifier(
            name="hallucination",
            prompt_template=HALLUCINATION_PROMPT_TEMPLATE,
            llm=llm,
            choices=HALLUCINATION_PROMPT_RAILS_MAP,
        )
        
        logger.info(f"Evaluating {len(spans_df)} spans for hallucination...")
        
        # Evaluate each span
        results = []
        
        for idx, row in spans_df.iterrows():
            # Extract input and output from span attributes
            input_val = self._extract_value(row, "attributes.input.value")
            output_val = self._extract_value(row, "attributes.output.value")
            
            if not input_val or not output_val:
                logger.debug(f"Skipping span {idx}: missing input or output")
                continue
            
            try:
                # Run the built-in template on this span
                eval_result = hallucination_eval.evaluate({
                    "input": str(input_val),
                    "output": str(output_val),
                })
                
                if eval_result and len(eval_result) > 0:
                    result = eval_result[0]
                    results.append({
                        "span_id": str(idx),
                        "input": str(input_val)[:300],
                        "output": str(output_val)[:300],
                        "label": result.label or "unknown",
                        "score": result.score if result.score is not None else 0.0,
                        "explanation": result.explanation or "",
                    })
                else:
                    results.append({
                        "span_id": str(idx),
                        "input": str(input_val)[:300],
                        "output": str(output_val)[:300],
                        "label": "error",
                        "score": 0.0,
                        "explanation": "Evaluator returned no result",
                    })
                    
            except Exception as e:
                logger.warning(f"Eval failed for span {idx}: {e}")
                results.append({
                    "span_id": str(idx),
                    "input": str(input_val)[:300],
                    "output": str(output_val)[:300],
                    "label": "error",
                    "score": 0.0,
                    "explanation": f"Evaluation error: {str(e)}",
                })
        
        logger.info(f"Evaluation complete. {len(results)} spans scored.")
        return pd.DataFrame(results)
    
    def _extract_value(self, row, column_name: str):
        """
        Safely extract a value from a span DataFrame row.
        Handles cases where column might not exist or value might be None.
        """
        try:
            val = row.get(column_name, None)
            if val is None or (isinstance(val, str) and val.strip() == ""):
                return None
            return val
        except Exception:
            return None
```

---

## File: `app/services/report_service.py`

```python
"""
Generates human-readable reports from evaluation results.

Two outputs:
1. Rich terminal output (pretty tables)
2. Summary dict (for API response / JSON save)
"""
import logging
import pandas as pd
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

logger = logging.getLogger(__name__)
console = Console()


class ReportService:
    """Generate summary and pretty-print evaluation results."""
    
    def generate_summary(self, eval_results: pd.DataFrame) -> dict:
        """
        From per-span results, generate aggregate summary.
        
        Verdict logic:
        - Hallucination < 5%  → PASSED (safe to deploy)
        - 5-10%               → REVIEW (check failed cases)
        - > 10%               → FAILED (do not deploy)
        """
        total = len(eval_results)
        
        if total == 0:
            return {
                "total_spans": 0,
                "hallucinated": 0,
                "not_hallucinated": 0,
                "hallucination_rate": 0.0,
                "verdict": "NO DATA",
            }
        
        hallucinated = int(
            (eval_results["label"] == "hallucinated").sum()
        )
        not_hallucinated = total - hallucinated
        rate = round((hallucinated / total) * 100, 2)
        
        if rate < 5:
            verdict = "PASSED"
        elif rate <= 10:
            verdict = "REVIEW"
        else:
            verdict = "FAILED"
        
        return {
            "total_spans": total,
            "hallucinated": hallucinated,
            "not_hallucinated": not_hallucinated,
            "hallucination_rate": rate,
            "verdict": verdict,
        }
    
    def print_report(self, summary: dict, per_span: list):
        """
        Pretty print evaluation report to terminal.
        Uses Rich library for nice formatting.
        """
        # Summary panel
        summary_table = Table(title="Evaluation Summary", show_header=True)
        summary_table.add_column("Metric", style="cyan", width=25)
        summary_table.add_column("Value", style="white", width=20)
        
        summary_table.add_row("Total Spans Evaluated", str(summary["total_spans"]))
        summary_table.add_row("Hallucinations Detected", str(summary["hallucinated"]))
        summary_table.add_row("Clean Spans", str(summary["not_hallucinated"]))
        summary_table.add_row("Hallucination Rate", f"{summary['hallucination_rate']}%")
        summary_table.add_row("Verdict", summary["verdict"])
        
        verdict_color = {
            "PASSED": "green",
            "REVIEW": "yellow",
            "FAILED": "red",
            "NO DATA": "dim",
        }.get(summary["verdict"], "white")
        
        console.print()
        console.print(Panel(
            summary_table,
            title="[bold]Overwatch Evaluation Report[/bold]",
            border_style=verdict_color,
        ))
        
        # Per-span breakdown
        if per_span:
            span_table = Table(
                title="Per-Span Breakdown",
                show_header=True,
                show_lines=True,
            )
            span_table.add_column("#", style="dim", width=4)
            span_table.add_column("Input", max_width=35, overflow="ellipsis")
            span_table.add_column("Output", max_width=35, overflow="ellipsis")
            span_table.add_column("Label", width=18)
            span_table.add_column("Score", width=6)
            
            for i, span in enumerate(per_span[:20], 1):  # Show first 20
                label = span.get("label", "unknown")
                score = span.get("score", 0.0)
                
                if label == "hallucinated":
                    label_display = f"[red bold]{label}[/red bold]"
                elif label == "not_hallucinated":
                    label_display = f"[green]{label}[/green]"
                else:
                    label_display = f"[yellow]{label}[/yellow]"
                
                span_table.add_row(
                    str(i),
                    str(span.get("input", ""))[:35],
                    str(span.get("output", ""))[:35],
                    label_display,
                    f"{score:.2f}",
                )
            
            console.print(span_table)
            
            if len(per_span) > 20:
                console.print(
                    f"[dim]... and {len(per_span) - 20} more spans "
                    f"(showing first 20)[/dim]"
                )
        
        console.print()
```

---

## File: `README.md`

```markdown
# Overwatch Eval Service

Trace-driven evaluation service for Tachyon Overwatch (Arize Phoenix).

## What This Does

Evaluates EXISTING traces in Tachyon Overwatch using Phoenix's built-in 
evaluation templates. No mock agents. No dataset uploads. Just:

1. Fetch existing spans from an Overwatch project
2. Run built-in Hallucination eval on each span
3. Log per-span scores back to Overwatch UI
4. Return a summary report

## Quick Start

```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Overwatch credentials
python run.py
```

## Usage

```bash
# Check connectivity
curl http://localhost:8000/api/v1/health

# List projects
curl http://localhost:8000/api/v1/projects

# Run evaluation
curl -X POST http://localhost:8000/api/v1/evaluate \
  -H "Content-Type: application/json" \
  -d '{"project_name": "Tachyon Generation", "limit": 50}'
```

## Architecture

```
Your laptop                      Tachyon Overwatch (= Phoenix)
     │                                    │
     │  1. Fetch existing spans  ────────>│
     │                           <────────│  (4,400+ traces)
     │                                    │
     │  2. Run hallucination eval         │
     │     (locally, using judge LLM)     │
     │                                    │
     │  3. Log results back      ────────>│
     │                                    │  (per-span annotations)
     │  4. Return report                  │
```
```

---

# PART C: LINE-BY-LINE EXPLANATION — Jaise Tu Kaz Ko Samjha Raha Hai

---

## Scene Set Karte Hain

Soch tu Kaz ke saath meeting mein baitha hai. Tu present kar raha hai. Kaz ke paas laptop hai, tera code khula hai. Tu line-by-line samjha raha hai.

---

### "Sir, sabse pehle yeh service kya karti hai"

*"Sir, yeh service **existing traces evaluate** karti hai. Matlab agar koi agent already Tachyon Overwatch pe traces produce kar raha hai — jaise Tachyon Generation mein 4,400 traces hain — toh meri service un traces ko fetch karegi, har span pe hallucination check chalayegi, aur results wapas Overwatch UI mein attach kar degi."*

*"Service ko kuch naya banana nahi hai — na dataset, na experiment. Sirf existing data pe quality signal generate karna hai."*

---

### "Entry point dikhata hoon — `run.py`"

```python
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

*"Sir, yeh simple hai. FastAPI server start hota hai port 8000 pe. `reload=True` matlab agar code change kiya toh automatically restart ho jaata hai — development ke liye useful."*

---

### "Configuration — `app/config.py`"

```python
overwatch_endpoint: str = "https://tachyon-observe-uat.wellsfargo.net"
overwatch_api_key: str = "..."
overwatch_space_id: str = "..."
judge_model: str = "gpt-oss-20b"
```

*"Sir, saari settings ek jagah hain. `.env` file se load hoti hain. 4 important cheezein:*
*1. Overwatch ka URL — yahaan pe API calls jaayengi*
*2. API key — authentication ke liye*
*3. Space ID — hamari team ka namespace*
*4. Judge model — hallucination check kaunsa LLM karega*

*Production mein yeh values environment variables se aayengi. Local mein `.env` file se."*

---

### "Ab core flow — `app/routers/evaluation.py` — `/evaluate` endpoint"

*"Sir, jab koi `POST /api/v1/evaluate` hit karta hai, yeh 5 steps hote hain:"*

#### Step 1: Connect

```python
connector = OverwatchConnector(
    endpoint=settings.overwatch_endpoint,
    api_key=settings.overwatch_api_key,
    space_id=settings.overwatch_space_id,
)
```

*"Phoenix SDK ko configure karta hoon Tachyon Overwatch ke endpoint pe. Kyunki Overwatch = Phoenix, same SDK kaam karta hai."*

#### Step 2: Fetch Spans

```python
spans_df = connector.fetch_spans(
    project_name="Tachyon Generation",
    span_kind="LLM",
    limit=50,
)
```

*"Sir, yeh sabse important line hai. Hum Tachyon Overwatch se **existing traces** pull kar rahe hain. 'Tachyon Generation' project se. Sirf LLM spans filter kar rahe hain — kyunki hallucination LLM calls mein hota hai, retrieval mein nahi. Aur limit 50 rakha — demo ke liye."*

*"Yeh koi naya data nahi bana rahe — yeh REAL data hai jo already agent produce kar chuka hai."*

#### Step 3: Evaluate

```python
evaluator = SpanEvaluator(judge_model="gpt-oss-20b")
eval_results = evaluator.evaluate_hallucination(spans_df)
```

*"Sir, yahaan pe Phoenix ka built-in `HALLUCINATION_PROMPT_TEMPLATE` use hota hai. Hum custom prompt nahi likh rahe — Arize ka battle-tested template use kar rahe hain. Har span pe individually judge model decide karta hai — hallucinated ya nahi."*

#### Step 4: Log Back

```python
logged = connector.log_evaluations_back(eval_results)
```

*"Sir, **yeh woh step hai jo aapne Phoenix demo mein dekha tha.** Evaluation results wapas Overwatch mein jaate hain — aur har span ke saath attached ho jaate hain UI mein. Iske baad agar koi Overwatch UI khole, har LLM span ke saath 'Hallucination: yes/no' dikhega."*

#### Step 5: Report

```python
summary = reporter.generate_summary(eval_results)
```

*"Final summary generate hota hai — total spans, kitne hallucinated, rate, verdict. PASSED/REVIEW/FAILED."*

---

### "Ab andar jaate hain — `overwatch_connector.py`"

*"Sir, yeh file Tachyon Overwatch se baat karti hai. 3 kaam karti hai:"*

#### 1. List Projects

```python
def list_projects(self):
    projects = self.client.list_projects()
    return [p.name for p in projects]
```

*"Simple. Overwatch mein kitne projects hain — list nikaal do. Health check mein use hota hai."*

#### 2. Fetch Spans

```python
def fetch_spans(self, project_name, span_kind="LLM", limit=50):
    spans_df = self.client.spans.get_spans_dataframe(
        project_identifier=project_name
    )
    filtered = spans_df[spans_df["span_kind"] == span_kind]
    return filtered.head(limit)
```

*"Sir, `get_spans_dataframe` — yeh Phoenix SDK ka built-in method hai. Ek project ka naam do, woh us project ke saare spans DataFrame mein de deta hai. Har row ek span. Columns mein hota hai — input, output, latency, span_kind, etc."*

*"Hum filter karte hain `span_kind == 'LLM'` — kyunki hallucination sirf LLM calls mein detect hota hai."*

#### 3. Log Evaluations Back

```python
def log_evaluations_back(self, eval_results_df):
    annotations_df = to_annotation_dataframe(dataframe=eval_results_df)
    self.client.spans.log_span_annotations_dataframe(dataframe=annotations_df)
```

*"Sir, **yeh woh function hai** jiske baad Overwatch UI mein har span pe score dikhna shuru hota hai. `log_span_annotations_dataframe` — yeh exact function hai jo Phoenix tutorial mein dikhaya gaya tha — same wahi link jo aapne share kiya tha."*

---

### "Evaluator — `span_evaluator.py`"

*"Sir, yeh file evaluation ka actual kaam karti hai."*

```python
from phoenix.evals import (
    create_classifier,
    HALLUCINATION_PROMPT_TEMPLATE,
    HALLUCINATION_PROMPT_RAILS_MAP,
)
```

*"Yeh imports Phoenix library se aate hain. `HALLUCINATION_PROMPT_TEMPLATE` — yeh Arize ka pre-built, tested template hai. Hum apna custom prompt nahi likh rahe. Arize ne isko benchmark datasets pe test kiya hai — precision 70-90%, F1 70-85%."*

```python
hallucination_eval = create_classifier(
    name="hallucination",
    prompt_template=HALLUCINATION_PROMPT_TEMPLATE,
    llm=llm,
    choices=HALLUCINATION_PROMPT_RAILS_MAP,
)
```

*"Evaluator ready ho gaya. Ab har span pe chalaayenge."*

```python
for idx, row in spans_df.iterrows():
    input_val = row.get("attributes.input.value")
    output_val = row.get("attributes.output.value")
    
    result = hallucination_eval.evaluate({
        "input": str(input_val),
        "output": str(output_val),
    })
```

*"Sir, ek loop. Har span ka input (kya pucha tha) aur output (kya jawab diya) liya. Phoenix template ko diya. Template ne judge model (`gpt-oss-20b`) ko pucha — 'yeh output hallucinated hai kya?' — judge ne decide kiya."*

*"Result mein aata hai:*
*- `label`: 'hallucinated' ya 'not_hallucinated'*
*- `score`: 0.0 to 1.0 (confidence)*
*- `explanation`: kyun judge ne yeh decision liya*

*Yeh EXACT wahi pattern hai jo aapne Phoenix demo mein dekha tha — per-span hallucination values."*

---

### "Report — `report_service.py`"

*"Sir, yeh simple hai. Results ko 2 formats mein dikhata hai:"*

*"Terminal mein — Rich library se pretty tables. API response mein — JSON."*

```python
if rate < 5:
    verdict = "PASSED"
elif rate <= 10:
    verdict = "REVIEW"
else:
    verdict = "FAILED"
```

*"Threshold-based verdict. 5% se kam hallucination — safe. 10% se zyada — deploy mat karo. Beech mein — manually review karo failed cases."*

---

### "Summary — Poora Flow Ek Slide Mein"

```
Engineer hits: POST /api/v1/evaluate {"project_name": "Tachyon Generation"}
                    ↓
Service connects to Tachyon Overwatch (= Phoenix)
                    ↓
Fetches 50 LLM spans from "Tachyon Generation" project
(these are REAL traces from a REAL agent that already ran)
                    ↓
Runs HALLUCINATION_PROMPT_TEMPLATE on each span
(Phoenix's built-in, battle-tested template)
                    ↓
Each span gets: label + score + explanation
                    ↓
Results logged BACK to Overwatch as span annotations
(now visible in Overwatch UI per-span — exactly what Kaz asked)
                    ↓
Summary report returned:
  Total: 50 spans | Hallucinated: 7 | Rate: 14% | Verdict: FAILED
  + per-span breakdown with explanations
```

---

### "Sir, aur questions?"

*"Summary: service kuch naya nahi banati. Existing traces pe quality signal generate karti hai. Built-in templates use karti hai. Results Overwatch UI mein attach ho jaate hain. Per-span visibility exactly jaise aapne Phoenix demo mein dekha tha."*

---

# END OF DOCUMENT

**Tu yeh 3 cheezein karega:**

1. **PART A ka prompt** → GitHub Copilot / Claude Code mein paste kar → code generate ho jaayega
2. **PART B ka code** → Reference ke liye rakh — compare kar generated output se
3. **PART C ka script** → Kaz ke saamne demo mein yeh dialogue use kar

---

— Rahul Vinayak, June 14, 2026
