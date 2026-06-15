# Overwatch Eval Service — Detailed Walkthrough Script For Kaz

**Presenter:** Rahul Vinayak
**Audience:** Kazhian Muthusami (Principal Engineer)
**Duration:** ~25 minutes
**Purpose:** Walk through the complete codebase — what it does, how it works, every important function, every design decision, and why.

---

## How To Use This Script

Rahul, yeh script tu Kaz ke saamne baithke use karega. VS Code khula hoga tera. Tu ek-ek file kholega, aur yeh script ke dialogues bolta jaayega.

**Bold text** = tu bolega (verbal).
`Code blocks` = screen pe dikha raha hai.
*Italic text* = internal note (mat bol, sirf samajh ke liye).

---

## OPENING (1 minute)

**"Kaz, I'll walk you through the Overwatch Eval Service — the trace-driven evaluator we discussed. After going through the Phoenix tutorial and the Built-In Eval Templates link you shared, I built this service to follow the exact same pattern."**

**"Quick summary before I dive in — this service does NOT create mock agents or upload fresh datasets. Instead, it connects to Tachyon Overwatch, fetches REAL traces from an existing project like Tachyon Generation, runs Phoenix's built-in Hallucination evaluator on each span, and logs the scores back to Overwatch. After this, each span in the Overwatch UI shows its hallucination label — exactly like you showed me in the Phoenix demo."**

**"Let me walk through the architecture first, then file by file."**

---

## SECTION 1: ARCHITECTURE OVERVIEW (3 minutes)

*Open README.md or draw on whiteboard*

**"The architecture is a 5-stage pipeline. Let me draw it out:"**

```
Stage 1: API Request
    Engineer hits POST /api/v1/evaluate
    Provides: project_name, span_filter, limit

Stage 2: Fetch Existing Spans
    OverwatchConnector calls Tachyon Overwatch GraphQL API
    Pulls real spans from the specified project
    Filters by span_kind (LLM, AGENT, etc.)

Stage 3: Evaluate Each Span
    SpanEvaluator uses Phoenix's HALLUCINATION_PROMPT_TEMPLATE
    Judge model (gpt-oss-20b) scores each span individually
    Returns: label + score + explanation per span

Stage 4: Log Results Back to Overwatch
    OverwatchConnector pushes evaluation scores as span annotations
    After this, Overwatch UI shows hallucination score per span

Stage 5: Return Report
    ReportService computes aggregate metrics
    Verdict: PASSED (<5%) / REVIEW (5-10%) / FAILED (>10%)
    Returns JSON with summary + per-span breakdown
```

**"Notice what this pipeline does NOT have — no mock agent, no dataset creation, no experiment triggering. Those were part of the old approach. This follows the pattern from the Phoenix 'Run Evals With Built-In Eval Templates' tutorial you shared — fetch traces, evaluate, log back."**

**"The service has clear separation of concerns:"**

```
Transport/Connectivity  →  overwatch_connector.py
Evaluation Logic        →  span_evaluator.py
Reporting               →  report_service.py
API Layer               →  routers/evaluation.py
Configuration           →  config.py
Data Models             →  models/schemas.py
```

**"Each file does one thing. If we need to change how we connect to Overwatch, we touch only the connector. If we add a new evaluator, we touch only the evaluator. Clean boundaries."**

---

## SECTION 2: ENTRY POINT & CONFIGURATION (2 minutes)

### File: `run.py`

*Open run.py in VS Code*

**"Starting from the top. `run.py` is the entry point. One command to start everything."**

```python
import uvicorn
from dotenv import load_dotenv

load_dotenv()  # Load .env file first — before anything else touches settings

from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.service_host,
        port=settings.service_port,
        reload=True,
    )
```

**"Three things happen here:"**

**"First — `load_dotenv()` loads the `.env` file. This must happen BEFORE we import settings, otherwise environment variables won't be available."**

**"Second — `settings` object is created from `app/config.py`. All configuration is centralized there."**

**"Third — `uvicorn.run` starts the FastAPI server. `reload=True` means if I change any file, server auto-restarts. Useful for development."**

### File: `app/config.py`

*Open config.py*

**"All configuration lives here. Single source of truth."**

```python
class Settings(BaseSettings):
    overwatch_endpoint: str    # Tachyon Overwatch URL
    overwatch_api_key: str     # Authentication
    overwatch_space_id: str    # Our team's namespace
    judge_model: str           # Which LLM judges hallucinations
    default_project: str       # Default project to evaluate
    service_host: str          # Where to run the server
    service_port: int          # Which port
```

**"Why is this important? Because when we move from UAT to Production, we change ONE file — `.env`. The code stays exactly the same. Same service, different environment."**

**"For example, right now:"**
```
OVERWATCH_ENDPOINT=https://tachyon-observe-uat.wellsfargo.net  (UAT)
```

**"In production, we just change to:"**
```
OVERWATCH_ENDPOINT=https://tachyon-observe.wellsfargo.net  (Production)
```

**"No code change required. This is environment-driven configuration — standard production pattern."**

---

## SECTION 3: API LAYER (3 minutes)

### File: `app/main.py`

*Open main.py*

**"FastAPI app construction. Simple."**

```python
app = FastAPI(
    title="Overwatch Eval Service",
    description="Trace-driven evaluation service for Tachyon Overwatch",
)

app.include_router(eval_router, prefix="/api/v1", tags=["evaluation"])
```

**"We create the app, mount the evaluation router under `/api/v1`. FastAPI auto-generates OpenAPI docs at `/docs` — so anyone can see the API contract without reading code."**

### File: `app/routers/evaluation.py`

*Open evaluation.py*

**"This is the orchestration layer. When someone hits the API, THIS file coordinates everything."**

**"The main endpoint — `POST /api/v1/evaluate`:"**

```python
@router.post("/evaluate")
async def evaluate(request: EvaluateRequest):
    evaluation_id = f"eval-{uuid.uuid4().hex[:8]}"
```

**"First, generate a unique evaluation ID. Every run gets its own ID for tracking."**

```python
    # Step 1: Connect to Overwatch
    connector = _get_connector()
```

**"Create the connector. This configures the Phoenix SDK to talk to our Tachyon Overwatch endpoint. Since Overwatch IS Phoenix — same SDK works."**

```python
    # Step 2: Fetch existing spans
    spans_df = connector.fetch_spans(
        project_name=request.project_name,
        span_kind=request.span_filter,
        limit=request.limit,
    )
```

**"This is where we pull REAL data. No mock, no synthetic data. These are actual traces from an agent that already ran. In Tachyon Generation's case, that's 4,400+ real traces."**

**"The user controls what gets evaluated — which project, which span type, how many."**

```python
    if spans_df.empty:
        return EvaluateResponse(
            status="no_spans",
            summary={"total_spans": 0, "verdict": "NO DATA"},
        )
```

**"If no spans found — return a clean 'NO DATA' response. Don't crash. This is defensive programming."**

```python
    # Step 3: Run hallucination evaluation
    evaluator = SpanEvaluator(judge_model=settings.judge_model)
    eval_results_df = evaluator.evaluate_hallucination(spans_df)
```

**"This is the core evaluation step. SpanEvaluator uses Phoenix's built-in HALLUCINATION_PROMPT_TEMPLATE — the exact template from the link you shared. Judge model `gpt-oss-20b` scores each span individually."**

```python
    # Step 4: Log results back to Overwatch
    logged = connector.log_evaluations_back(eval_results_df)
```

**"THIS is the key step. After evaluation, we push scores BACK to Overwatch. Now each span in the Overwatch UI shows its hallucination label. This is what you demonstrated in the Phoenix demo — 'I see Hallucination values for each span.' This line makes that happen."**

```python
    # Step 5: Generate report
    reporter = ReportService()
    summary = reporter.generate_summary(eval_results_df)
    per_span = eval_results_df.to_dict(orient="records")
```

**"Finally, compute the aggregate summary — total spans, hallucination count, rate, and verdict. Return both summary and per-span detail."**

**"Other endpoints are simpler:"**

```python
@router.get("/health")     # Check Overwatch connectivity
@router.get("/projects")   # List available projects
@router.get("/projects/{name}/stats")  # Span stats for a project
```

**"Health endpoint verifies we can reach Overwatch and lists projects. Useful for debugging connectivity issues before running evaluation."**

---

## SECTION 4: OVERWATCH CONNECTOR — The Bridge (5 minutes)

### File: `app/services/overwatch_connector.py`

*Open overwatch_connector.py*

**"This is the most critical infrastructure file. It's the bridge between our service and Tachyon Overwatch. Every interaction with Overwatch goes through this file."**

**"Let me walk through each method."**

### Constructor

```python
class OverwatchConnector:
    def __init__(self, endpoint, api_key, space_id):
        self.endpoint = endpoint
        self.api_key = api_key
        self.space_id = space_id
        self.graphql_url = f"{endpoint}/graphql"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
```

**"We store the Tachyon Overwatch endpoint, API key, and space ID. The GraphQL URL is just `{endpoint}/graphql`. Headers include Bearer token for authentication."**

**"Why GraphQL instead of REST? Because Overwatch's primary API is GraphQL — it lets us query exactly the data we need in one call. REST would require multiple round-trips."**

### `_gql()` — Generic GraphQL Executor

```python
async def _gql(self, query: str, variables: dict = None) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            self.graphql_url,
            json={"query": query, "variables": variables or {}},
            headers=self.headers,
        )
        response.raise_for_status()
        data = response.json()
        if "errors" in data:
            raise Exception(f"GraphQL errors: {data['errors']}")
        return data.get("data", {})
```

**"This is the internal workhorse. Every GraphQL call goes through here. We send the query, check for HTTP errors, check for GraphQL errors, and return the data."**

**"Notice `httpx.AsyncClient` — async HTTP calls. The service doesn't block while waiting for Overwatch to respond."**

### `_resolve_space()` — Find Our Space

```python
async def _resolve_space(self) -> str:
    query = """
    query { spaces { edges { node { id name } } } }
    """
    data = await self._gql(query)
    spaces = data.get("spaces", {}).get("edges", [])
    # Find matching space by name or return first
    ...
    return space_id
```

**"Overwatch is multi-tenant. Each team has a 'space'. This method discovers our space ID dynamically from the API. We don't hardcode it — we resolve it."**

**"Why? Because space IDs can change between UAT and Production. Resolving dynamically is more robust."**

### `list_projects()` — What Projects Exist

```python
async def list_projects(self) -> list:
    query = """
    query { projects { edges { node { id name } } } }
    """
    data = await self._gql(query)
    return [edge["node"]["name"] for edge in data["projects"]["edges"]]
```

**"Lists all tracing projects in our space. Simple GraphQL query. Returns project names like 'Tachyon Generation'."**

### `_resolve_project_id()` — Name to ID

```python
async def _resolve_project_id(self, project_name: str) -> str:
    # GraphQL query to find project by name
    # Returns the internal ID needed for span queries
```

**"Overwatch internally uses IDs, not names. When user says 'Tachyon Generation', we need to resolve that to its internal ID first. This method does that lookup."**

### `fetch_spans()` — THE Critical Method

```python
async def fetch_spans(self, project_name, span_kind="LLM", limit=50):
    project_id = await self._resolve_project_id(project_name)
    
    query = """
    query GetSpans($projectId: ID!, $first: Int) {
        spans(projectId: $projectId, first: $first) {
            edges {
                node {
                    id
                    name
                    spanKind
                    input { value }
                    output { value }
                    latencyMs
                    statusCode
                }
            }
        }
    }
    """
    
    data = await self._gql(query, {"projectId": project_id, "first": limit})
    spans = data["spans"]["edges"]
    
    # Convert to DataFrame
    rows = []
    for edge in spans:
        node = edge["node"]
        rows.append({
            "span_id": node["id"],
            "name": node.get("name", ""),
            "span_kind": node.get("spanKind", ""),
            "input": node.get("input", {}).get("value", ""),
            "output": node.get("output", {}).get("value", ""),
            "latency_ms": node.get("latencyMs"),
            "status": node.get("statusCode", ""),
        })
    
    df = pd.DataFrame(rows)
    
    # Filter by span kind
    if span_kind and not df.empty:
        df = df[df["span_kind"] == span_kind]
    
    return df.head(limit)
```

**"THIS is the most important method in the entire codebase. Let me explain step by step."**

**"First — resolve the project name to its internal ID."**

**"Second — send a GraphQL query asking for spans. We request: span ID, name, kind, input value, output value, latency, and status. This is what the agent actually processed."**

**"Third — convert the GraphQL response into a Pandas DataFrame. Each row = one span. Columns = span attributes."**

**"Fourth — filter by span_kind. We default to 'LLM' because hallucination happens in LLM calls, not in retrieval or tool calls."**

**"Fifth — apply the limit and return."**

**"The result is a clean DataFrame like:"**

```
| span_id | span_kind | input                    | output                  | latency_ms |
|---------|-----------|--------------------------|-------------------------|------------|
| span-01 | LLM       | What is leave policy?    | 24 days annually        | 1240       |
| span-02 | LLM       | Who is the CEO?          | Tim Sloan is the CEO    | 890        |
| span-03 | LLM       | What is dress code?      | Business casual         | 1100       |
```

**"These are REAL spans from a REAL agent. Not mock data."**

### `log_evaluations_back()` — Push Scores To Overwatch

```python
async def log_evaluations_back(self, eval_results_df):
    for _, row in eval_results_df.iterrows():
        mutation = """
        mutation LogAnnotation($input: CreateSpanAnnotationInput!) {
            createSpanAnnotation(input: $input) {
                annotation { id }
            }
        }
        """
        variables = {
            "input": {
                "spanId": row["span_id"],
                "name": "Hallucination",
                "annotatorKind": "LLM",
                "label": row["label"],
                "score": row["score"],
                "explanation": row.get("explanation", ""),
            }
        }
        await self._gql(mutation, variables)
    
    return True
```

**"This is the SECOND most important method. After evaluation, we push each span's score back to Overwatch."**

**"For each span, we create an 'annotation' — a label attached to that span. The annotation says: 'This span was evaluated for Hallucination. The label is hallucinated/not_hallucinated. The confidence score is X. The explanation is Y.'"**

**"After this mutation runs, if you open Tachyon Overwatch UI and navigate to the project's traces, each LLM span will show its Hallucination score. This is EXACTLY what you saw in the Phoenix demo."**

**"Notice this is a mutation-per-span approach. For 50 spans, 50 mutations. If one fails, the rest still succeed — partial results are better than no results."**

---

## SECTION 5: SPAN EVALUATOR — The Brain (5 minutes)

### File: `app/services/span_evaluator.py`

*Open span_evaluator.py*

**"This file does the actual evaluation work. It's where Phoenix's built-in templates meet your data."**

### Constructor

```python
class SpanEvaluator:
    def __init__(self, judge_model="gpt-oss-20b"):
        self.judge_model = judge_model
```

**"Simple. Takes the judge model name. `gpt-oss-20b` is available on our Overwatch platform."**

### `_build_hallucination_evaluator()` — Create the Evaluator

```python
def _build_hallucination_evaluator(self):
    from phoenix.evals import (
        create_classifier,
        HALLUCINATION_PROMPT_TEMPLATE,
        HALLUCINATION_PROMPT_RAILS_MAP,
    )
    from phoenix.evals.llm import LLM
    
    llm = LLM(
        provider="openai",
        model=self.judge_model,
        temperature=0.0,
    )
    
    evaluator = create_classifier(
        name="hallucination",
        prompt_template=HALLUCINATION_PROMPT_TEMPLATE,
        llm=llm,
        choices=HALLUCINATION_PROMPT_RAILS_MAP,
    )
    
    return evaluator
```

**"This is where we configure the evaluator. Let me break it down."**

**"`HALLUCINATION_PROMPT_TEMPLATE` — this is Phoenix's built-in template. We did NOT write this prompt. Arize's team wrote it, tested it against benchmark datasets, validated precision at 70-90% and F1 at 70-85%. It's battle-tested."**

**"`HALLUCINATION_PROMPT_RAILS_MAP` — this defines what labels the evaluator can return. For hallucination, it's 'hallucinated' or 'not_hallucinated'. These are called 'rails' — they constrain the judge's output."**

**"`LLM(provider='openai', model='gpt-oss-20b')` — the judge model. We use OpenAI-compatible provider mode because `gpt-oss-20b` is accessible through an OpenAI-compatible gateway on our infrastructure."**

**"`temperature=0.0` — zero temperature means deterministic output. Same input always gives same judgment. This is critical for reproducibility — if we run evaluation twice on same data, we should get same results."**

**"`create_classifier` — Phoenix's function that combines template + judge model + rails into a ready-to-use evaluator object."**

**"This is the direct implementation of the pattern from the 'Run Evals With Built-In Eval Templates' tutorial."**

### `evaluate_hallucination()` — The Main Loop

```python
def evaluate_hallucination(self, spans_df):
    evaluator = self._build_hallucination_evaluator()
    
    results = []
    for idx, row in spans_df.iterrows():
        input_val = row.get("input", "")
        output_val = row.get("output", "")
        
        if not input_val or not output_val:
            continue  # Skip spans without input/output
        
        try:
            eval_result = evaluator.evaluate({
                "input": str(input_val),
                "output": str(output_val),
            })
            
            result = eval_result[0]
            results.append({
                "span_id": row["span_id"],
                "input": str(input_val)[:300],
                "output": str(output_val)[:300],
                "label": result.label,
                "score": result.score,
                "explanation": result.explanation,
            })
        except Exception as e:
            results.append({
                "span_id": row["span_id"],
                "input": str(input_val)[:300],
                "output": str(output_val)[:300],
                "label": "error",
                "score": 0.0,
                "explanation": f"Eval error: {str(e)}",
            })
    
    return pd.DataFrame(results)
```

**"This loops through every span and evaluates it. Let me trace through one iteration."**

**"Say we have this span:"**
```
input: "Who is the CEO of Wells Fargo?"
output: "Tim Sloan is the current CEO of Wells Fargo."
```

**"Step 1 — we extract input and output from the span."**

**"Step 2 — we call `evaluator.evaluate()`. Internally, this:"**
- **"Takes the HALLUCINATION_PROMPT_TEMPLATE"**
- **"Fills in {input} and {output} placeholders with our data"**
- **"Sends the filled prompt to gpt-oss-20b"**
- **"gpt-oss-20b reads the prompt and judges: 'Is this output hallucinated?'"**
- **"Returns a structured result"**

**"Step 3 — we get back:"**
```python
result.label = "hallucinated"
result.score = 0.95
result.explanation = "The output names Tim Sloan as CEO, but the factual 
    record shows Charles W. Scharf has been CEO since October 2019. 
    Tim Sloan resigned in 2019. This is a direct factual hallucination."
```

**"Step 4 — we store this result with the span_id. Later we'll log it back to Overwatch."**

**"Notice the try/except — if evaluation fails for one span, we label it 'error' and continue to the next span. One bad span doesn't crash the entire evaluation."**

**"Also notice `[:300]` truncation — we limit stored input/output to 300 chars for report readability. Full data stays in Overwatch."**

---

## SECTION 6: REPORT SERVICE (2 minutes)

### File: `app/services/report_service.py`

*Open report_service.py*

**"This file takes evaluation results and makes them human-readable."**

### `generate_summary()` — Aggregate Metrics

```python
def generate_summary(self, eval_results):
    total = len(eval_results)
    hallucinated = (eval_results["label"] == "hallucinated").sum()
    rate = (hallucinated / total * 100) if total > 0 else 0
    
    if rate < 5:
        verdict = "PASSED"
    elif rate <= 10:
        verdict = "REVIEW"
    else:
        verdict = "FAILED"
```

**"Simple math. Count hallucinated spans, compute rate, apply verdict thresholds."**

**"The thresholds are:"**
- **"Less than 5% hallucination → PASSED — safe to proceed with model/prompt change"**
- **"5 to 10% → REVIEW — manually inspect the failed spans before deciding"**  
- **"More than 10% → FAILED — do not deploy this change"**

**"These thresholds are configurable. If the team decides 3% is the bar, we change one number."**

### `print_report()` — Terminal Visualization

```python
def print_report(self, summary, per_span):
    # Rich library creates colored tables
    # Summary panel with color-coded border (green/yellow/red)
    # Per-span breakdown table showing each span's verdict
```

**"Uses Rich library for terminal output. When you run the service and trigger an evaluation, you see a colored summary table plus a per-span breakdown right in the terminal. Green border for PASSED, red for FAILED."**

**"This is for operators monitoring the service. The same data also goes back as JSON in the API response for downstream automation."**

---

## SECTION 7: DATA MODELS (1 minute)

### File: `app/models/schemas.py`

*Open schemas.py*

**"Clean data contracts. What goes in, what comes out."**

```python
class EvaluateRequest(BaseModel):
    project_name: str = "Tachyon Generation"
    span_filter: str = "LLM"
    evaluator: str = "hallucination"
    limit: int = 50

class EvaluateResponse(BaseModel):
    evaluation_id: str
    status: str
    summary: dict
    per_span_results: list
    logged_to_overwatch: bool
```

**"Request model — user tells us WHAT to evaluate. Project name, span filter, evaluator type, and how many spans."**

**"Response model — we return evaluation ID for tracking, status, aggregate summary, per-span results, and whether we successfully logged back to Overwatch."**

**"The `logged_to_overwatch` boolean is important — it tells the consumer whether the Overwatch UI will show the scores or not. If it's false, scores are still in the API response but not in the UI."**

---

## SECTION 8: RELIABILITY STORY (2 minutes)

**"Let me talk about why this is production-friendly, not just a POC hack."**

### Failure Isolation

**"Every major stage has try/except with stage-specific error handling:"**

```
Connection error     → "Cannot reach Overwatch at {endpoint}"
Fetch error          → "No spans found in project {name}" → returns NO DATA
Individual span eval → "error" label → batch continues
Log-back failure     → "Could not log back" → eval results still returned
```

**"Key principle: **partial results are better than no results.** If 49 out of 50 spans evaluate fine and one fails, you still get 49 results plus one 'error' label. The service never crashes because of one bad span."**

### Empty State Handling

**"If a project has zero spans, we return a clean 'NO DATA' response with zero hallucination rate. No crash, no 500 error."**

### Logging Throughout

**"Every step is logged with the evaluation_id prefix. If something goes wrong in production, you can grep for the evaluation ID and trace exactly what happened at each stage."**

```
[eval-a1b2c3d4] Starting evaluation on project: Tachyon Generation
[eval-a1b2c3d4] Fetched 50 LLM spans
[eval-a1b2c3d4] Evaluating span 1/50...
[eval-a1b2c3d4] Per-span scores logged back to Overwatch
[eval-a1b2c3d4] Complete. Verdict: FAILED (14.0% hallucination rate)
```

---

## SECTION 9: LIBRARIES USED (1 minute)

**"Quick overview of the tech stack:"**

| Library | Why We Use It |
|---------|---------------|
| **FastAPI** | Modern Python REST framework. Auto-generates docs. Async support. |
| **uvicorn** | ASGI server to run FastAPI. Production-grade. |
| **pydantic / pydantic-settings** | Request/response validation. Config management from .env. |
| **httpx** | Async HTTP client for GraphQL calls to Overwatch. |
| **pandas** | Span data manipulation. Aggregation for reports. |
| **arize-phoenix[evals]** | Phoenix's built-in evaluation templates. HALLUCINATION_PROMPT_TEMPLATE lives here. |
| **openai** | SDK used by Phoenix's LLM provider mode to call judge model. |
| **rich** | Pretty terminal output — colored tables, panels. |
| **python-dotenv** | Load .env file for local development. |

**"All standard, well-maintained libraries. No custom forks, no internal-only dependencies beyond the Overwatch endpoint."**

---

## SECTION 10: LIVE DEMO (5 minutes)

### Step 1: Start Service

```bash
python run.py
```

**"Service starts on port 8000. Banner shows our config — endpoint, judge model, default project."**

### Step 2: Health Check

```bash
curl http://localhost:8000/api/v1/health
```

```json
{
  "status": "connected",
  "endpoint": "https://tachyon-observe-uat.wellsfargo.net",
  "projects": ["Tachyon Generation"]
}
```

**"Connected. We can see Tachyon Generation project."**

### Step 3: Run Evaluation

```bash
curl -X POST http://localhost:8000/api/v1/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Tachyon Generation",
    "span_filter": "LLM",
    "limit": 10
  }'
```

**"Evaluating 10 LLM spans from Tachyon Generation. Watch the terminal..."**

*Terminal shows progress logs*

```
[eval-abc123] Starting evaluation on project: Tachyon Generation
[eval-abc123] Fetched 10 LLM spans
[eval-abc123] Evaluating span 1/10...
[eval-abc123] Evaluating span 2/10...
...
[eval-abc123] Per-span scores logged back to Overwatch
[eval-abc123] Complete. Verdict: REVIEW (8.0% hallucination rate)
```

### Step 4: Show Response

```json
{
  "evaluation_id": "eval-abc123",
  "status": "completed",
  "summary": {
    "total_spans": 10,
    "hallucinated": 1,
    "not_hallucinated": 9,
    "hallucination_rate": 10.0,
    "verdict": "REVIEW"
  },
  "per_span_results": [
    {
      "span_id": "span-xyz-001",
      "input": "What is leave policy?",
      "output": "24 paid vacation days annually",
      "label": "not_hallucinated",
      "score": 0.05,
      "explanation": "Answer aligns with standard Wells Fargo HR policy."
    },
    {
      "span_id": "span-xyz-002",
      "input": "Who is the CEO?",
      "output": "Tim Sloan is the CEO",
      "label": "hallucinated",
      "score": 0.95,
      "explanation": "Tim Sloan resigned in 2019. Charles Scharf is CEO since Oct 2019."
    }
  ],
  "logged_to_overwatch": true
}
```

**"The response includes both the executive summary — '10% hallucination, REVIEW needed' — and the operational detail — exactly which span hallucinated and why."**

### Step 5: Show Overwatch UI

*Switch to browser, open Tachyon Overwatch*

**"And now if we open Tachyon Overwatch UI, navigate to Tachyon Generation project, and look at the spans..."**

*Navigate to a specific span*

**"See? Each span now has a 'Hallucination' annotation attached. The one for 'Who is the CEO' shows 'hallucinated' with score 0.95 and the explanation. This is exactly what you showed me in the Phoenix demo."**

---

## SECTION 11: EXTENSIBILITY (2 minutes)

**"This architecture is designed to grow. Let me show what's easy to add."**

### Adding New Evaluators (Phase 2)

**"Right now we have Hallucination. Phoenix has more built-in templates:"**

```python
# Just add more evaluators in span_evaluator.py
from phoenix.evals import (
    HALLUCINATION_PROMPT_TEMPLATE,     # ← Current
    RAG_RELEVANCY_PROMPT_TEMPLATE,     # ← Phase 2
    TOXICITY_PROMPT_TEMPLATE,          # ← Phase 2
    QA_CORRECTNESS_PROMPT_TEMPLATE,    # ← Phase 2
)
```

**"Same pattern. Different template. One new method per evaluator. The API already accepts `evaluator` parameter — user just passes `'relevance'` or `'toxicity'` instead of `'hallucination'`."**

### Targeting Different Projects

**"User already passes `project_name` in the request. Want to evaluate a different project? Just change the parameter."**

```bash
# Evaluate AHP Pro Supervisor (when it's deployed)
curl -X POST /api/v1/evaluate \
  -d '{"project_name": "ahp-pro-supervisor"}'
```

### Scheduled Evaluation (Phase 3)

**"Add a cron job that hits the API weekly. Same endpoint, scheduled trigger."**

### Self-Service UI (Phase 3)

**"Build a simple React frontend that calls the same API. Non-engineers can select project, click 'Evaluate', see results."**

---

## CLOSING (1 minute)

**"To summarize:"**

**"This service follows the exact pattern from the Phoenix 'Run Evals With Built-In Eval Templates' tutorial you pointed me to. It's trace-driven — we evaluate what already exists, not what we create. It uses Phoenix's battle-tested templates — not custom prompts. It logs results back to Overwatch for per-span visibility — exactly what you saw in the demo."**

**"The architecture is clean, the code is modular, and the path to production is clear — we just change the endpoint in `.env`."**

**"I have a few open questions before moving to the next phase:"**

1. **"Is this approach aligned with your vision?"**
2. **"Which project should be the primary target — Tachyon Generation, or should I wait for AHP Pro Supervisor to be deployed?"**
3. **"Do I need EDITOR access for the log-back-to-Overwatch functionality, or does my current VIEWER access cover annotations?"**

**"Thank you. Happy to take any questions."**

---

# APPENDIX: QUICK REFERENCE — Key Function Map

For Kaz's reference (or anyone reviewing the code):

## Entry → Orchestration

| Function | File | What It Does |
|----------|------|--------------|
| `uvicorn.run()` | run.py | Starts the server |
| `app.include_router()` | main.py | Mounts API routes |
| `evaluate()` | routers/evaluation.py | Orchestrates the 5-stage pipeline |
| `_get_connector()` | routers/evaluation.py | Creates Overwatch connection |

## Overwatch Communication

| Function | File | What It Does |
|----------|------|--------------|
| `_gql()` | overwatch_connector.py | Executes any GraphQL query |
| `_resolve_space()` | overwatch_connector.py | Discovers our space |
| `_resolve_project_id()` | overwatch_connector.py | Name → internal ID lookup |
| `list_projects()` | overwatch_connector.py | Lists all projects |
| `fetch_spans()` | overwatch_connector.py | **Fetches real spans from Overwatch** |
| `log_evaluations_back()` | overwatch_connector.py | **Pushes scores back per-span** |

## Evaluation

| Function | File | What It Does |
|----------|------|--------------|
| `_build_hallucination_evaluator()` | span_evaluator.py | Configures Phoenix template + judge |
| `evaluate_hallucination()` | span_evaluator.py | **Runs eval loop on all spans** |

## Reporting

| Function | File | What It Does |
|----------|------|--------------|
| `generate_summary()` | report_service.py | Computes aggregate metrics + verdict |
| `print_report()` | report_service.py | Pretty terminal output |

---

*End of Walkthrough Script*
