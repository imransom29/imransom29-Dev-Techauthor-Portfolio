# Implementation Prompt — API Wrapper for the Model Testing Framework

Give this whole document to your coding agent. It is written to be executed
against the existing `NONAPP-RIFAMCOE-AI-TEAMMATE-MAIN` repository.

---

## 1. WHAT YOU ARE BUILDING

This repository currently runs as a set of local Python scripts, invoked
through a CLI dispatcher:

```bash
python run.py performance run --input data/sample_queries.xlsx
```

You are adding a **thin HTTP API layer on top of it**, so that another
service — the Supervisor Evaluation Service — can invoke the same evaluators
over the network instead of someone running them on a laptop.

### The single most important rule

**Do not rewrite, refactor or "improve" anything under `tests_module/` or
`evaluation/`.**

That code is the model team's evaluation methodology. It is the reason this
integration is worth doing. Your job is to make it callable, not to change
what it does.

If you find yourself editing scoring logic, prompt text, metric calculations
or thresholds — stop. You have gone outside scope.

### What you may touch

| Path | Change allowed |
|---|---|
| `api/` | **New package.** All your work goes here. |
| `core/data_io.py` | **One function only.** See §4. |
| `Dockerfile` | New file. |
| `requirements-api.txt` | New file. |
| `tests_module/` | **Read only.** Import from it, never edit. |
| `evaluation/` | **Read only.** |
| `core/orchestrator.py` | **Read only.** Reuse its patterns, do not modify. |
| `kpi_scripts/` | **Do not touch.** |
| `run.py` | **Do not touch.** The CLI keeps working exactly as it does today. |

Both entry points must coexist. After your change, this must still work
unchanged:

```bash
python run.py performance run --input data/sample_queries.xlsx
```

---

## 2. WHY THIS SHAPE

Read this section. It explains decisions that will otherwise look arbitrary
when you hit them.

### Why a wrapper and not a rewrite

The consuming team operates services. This team writes evaluation science.
Rewriting the evaluators into a service architecture would take months and
would put evaluation logic in the hands of people who did not design it.

A wrapper means the evaluators stay exactly where they are, owned by the
people who understand them, and the only new surface is the HTTP layer.

### Why the request carries a `level`

The consumer extracts data at three different granularities, and the volumes
are not close:

| Level | Rows at 20K user load |
|---|---|
| `prompt` | 1 |
| `thread` | ~400 |
| `time_range` | ~200,000 |

That is five orders of magnitude. A single transport cannot serve all three,
so the request declares which one it is and the payload arrives accordingly.

### Why large payloads arrive as a URL

Two hundred thousand rows is not a reasonable HTTP body. So above a threshold
the consumer writes the data to shared object storage and sends only a
reference.

This works with almost no change on your side **because this codebase already
reads a file into a pandas frame before doing anything with it**. That read
step just needs to accept a URL as well as a path. That is the change in §4,
and it is the only edit to existing code in this whole task.

### Why the API is asynchronous

Some evaluators here make LLM calls, some involve human review steps. Those
will not finish inside an HTTP request timeout. So `POST /evaluate` returns
immediately with a job id, and the caller polls for the result.

### Why results have four shapes rather than one

The evaluators in this repository do not all produce the same kind of answer:

- `hallucination` produces a verdict per span
- `agreement` produces a handful of scalars over a population
- `sensitivity` produces a distribution across hundreds of perturbed pairs
- `explainability` produces a table with several scored columns per row

Forcing those into one response shape would either lose information or make
every consumer special-case anyway. So the response is a tagged union and
each evaluator declares which shape it returns.

---

## 3. NEW PACKAGE LAYOUT

```
api/
├── __init__.py
├── main.py                 FastAPI app, lifespan, routes mounted
├── config.py               settings, reads from env
├── contracts.py            Pydantic models — this IS the Swagger spec
├── registry.py             evaluator name → callable + metadata
├── executor.py             runs an evaluator in a worker, maps its output
├── jobs.py                 job state, idempotency, persistence
├── storage.py              fetch input artifacts, upload result artifacts
├── mappers/
│   ├── __init__.py
│   ├── base.py             ResultMapper interface
│   ├── verdict.py          frame → VerdictResult[]
│   ├── scalars.py          dict  → ScalarsResult
│   ├── distribution.py     series → DistributionResult
│   └── tabular.py          frame → TabularResult (uploads, returns ref)
└── routers/
    ├── __init__.py
    ├── evaluate.py         POST /evaluate, GET /jobs/{id}/result
    ├── capabilities.py     GET /capabilities
    └── health.py           GET /health, GET /ready
```

No file over 250 lines. Split before you exceed it.

---

## 4. THE ONE CHANGE TO EXISTING CODE

**File:** `core/data_io.py`
**Function:** `read()`

Today it dispatches on file extension:

```python
def read(path, sheet_name=None, **kwargs) -> pd.DataFrame:
    p = Path(path)
    if p.suffix == ".parquet":
        return pd.read_parquet(p, **kwargs)
    if p.suffix == ".json":
        return pd.read_json(p, **kwargs)
    if p.suffix in (".xlsx", ".xls"):
        ...
    if p.suffix == ".csv":
        return pd.read_csv(p, **kwargs)
    raise ValueError(f"Unsupported file type: {p.suffix}")
```

Add URL support **in front of** the existing logic. Do not restructure what is
already there.

```python
from urllib.parse import urlparse

def _is_url(value: str) -> bool:
    return urlparse(str(value)).scheme in ("http", "https")


def read(path, sheet_name=None, **kwargs) -> pd.DataFrame:
    """
    Smart reader — dispatches by extension.

    Accepts a local path or an http(s) URL. URL support exists so that a
    caller running elsewhere can hand over data without needing shared
    filesystem access. Everything after the fetch is unchanged.
    """
    if _is_url(path):
        return _read_from_url(str(path), sheet_name=sheet_name, **kwargs)

    p = Path(path)
    # ... existing logic untouched from here down
```

And the fetch helper:

```python
def _read_from_url(url: str, sheet_name=None, **kwargs) -> pd.DataFrame:
    """
    Fetch a remote artifact and parse it.

    Streamed to a temp file rather than held in memory, because a time-range
    extraction can be hundreds of megabytes and loading it twice — once as
    bytes, once as a frame — would double peak memory for no reason.

    Format is taken from the URL path, ignoring any query string, since
    signed URLs carry signature parameters after the extension.
    """
    import tempfile
    import requests

    parsed = urlparse(url)
    suffix = Path(parsed.path).suffix or ".parquet"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        with requests.get(url, stream=True, timeout=300) as response:
            response.raise_for_status()
            for chunk in response.iter_content(chunk_size=1024 * 1024):
                tmp.write(chunk)
        tmp_path = Path(tmp.name)

    try:
        return read(tmp_path, sheet_name=sheet_name, **kwargs)
    finally:
        tmp_path.unlink(missing_ok=True)
```

**Verify after this change:** every existing CLI command still runs. This
function is called from `pipeline.py`, `orchestrator.py` and every module
under `tests_module/`. A regression here breaks the whole repository.

---

## 5. THE CONTRACT

`api/contracts.py`. These models generate the OpenAPI document, so field names
and types here are the agreement with the consumer. Do not rename anything
without agreeing it with them first.

### 5.1 Enums

```python
from enum import Enum

class ExtractionLevel(str, Enum):
    PROMPT = "prompt"
    THREAD = "thread"
    TIME_RANGE = "time_range"


class DeliveryMode(str, Enum):
    INLINE = "inline"
    REFERENCE = "reference"


class ArtifactFormat(str, Enum):
    PARQUET = "parquet"
    JSON = "json"
    CSV = "csv"
    XLSX = "xlsx"


class JobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    PARTIAL = "partial"


class ResultKind(str, Enum):
    VERDICT = "verdict"
    SCALARS = "scalars"
    DISTRIBUTION = "distribution"
    TABULAR = "tabular"
```

### 5.2 Payload descriptors

```python
class ArtifactRef(BaseModel):
    url: HttpUrl
    format: ArtifactFormat = ArtifactFormat.PARQUET
    row_count: int = Field(ge=0)
    size_bytes: int = Field(ge=0)
    checksum: str          # sha256 hex of the artifact bytes
    expires_at: datetime
    schema_version: str = "1.0"


class InlinePayload(BaseModel):
    rows: list[dict[str, Any]]
    schema_version: str = "1.0"
```

### 5.3 Request

```python
class EvaluationRequest(BaseModel):
    job_id: str
    idempotency_key: str

    evaluator: str
    level: ExtractionLevel
    delivery: DeliveryMode

    inline: InlinePayload | None = None
    artifact: ArtifactRef | None = None

    result_upload_url: HttpUrl | None = None

    options: dict[str, Any] = Field(default_factory=dict)
    requested_at: datetime = Field(default_factory=datetime.utcnow)
    timeout_seconds: int = Field(default=900, ge=1)
```

Add a model validator enforcing that **exactly one** of `inline` or `artifact`
is populated, and that it matches the declared `delivery`. Reject the request
with 422 otherwise — a mismatch here means the caller has a bug, and failing
loudly is more useful than guessing which field to read.

### 5.4 Result variants

```python
class VerdictResult(BaseModel):
    kind: Literal[ResultKind.VERDICT] = ResultKind.VERDICT
    span_id: str
    verdict: str                      # e.g. FAILED, hallucinated, irrelevant
    score: float | None = Field(default=None, ge=0.0, le=1.0)
    reasoning: str | None = None


class ScalarsResult(BaseModel):
    kind: Literal[ResultKind.SCALARS] = ResultKind.SCALARS
    metrics: dict[str, float]
    sample_size: int = Field(ge=0)


class DistributionResult(BaseModel):
    kind: Literal[ResultKind.DISTRIBUTION] = ResultKind.DISTRIBUTION
    metric_name: str
    count: int = Field(ge=0)
    mean: float
    median: float
    std_dev: float
    minimum: float
    maximum: float
    percentiles: dict[str, float] = Field(default_factory=dict)
    detail: ArtifactRef | None = None


class TabularResult(BaseModel):
    kind: Literal[ResultKind.TABULAR] = ResultKind.TABULAR
    artifact: ArtifactRef
    columns: list[str]
    summary: dict[str, float] = Field(default_factory=dict)


EvaluatorResult = VerdictResult | ScalarsResult | DistributionResult | TabularResult
```

`sample_size` on `ScalarsResult` is mandatory and must be the real n, not the
requested n. A kappa over eight samples and one over eight hundred are not the
same claim, and the consumer renders a warning below a threshold.

### 5.5 Responses

```python
class EvaluationAccepted(BaseModel):
    job_id: str
    evaluator: str
    status: Literal[JobStatus.QUEUED, JobStatus.RUNNING]
    poll_url: str
    estimated_seconds: int | None = None
    accepted_at: datetime = Field(default_factory=datetime.utcnow)


class EvaluationResponse(BaseModel):
    job_id: str
    evaluator: str
    status: JobStatus

    results: list[EvaluatorResult] = Field(default_factory=list)

    evaluator_version: str
    judge_model: str | None = None

    started_at: datetime | None = None
    completed_at: datetime | None = None
    duration_seconds: float | None = None

    error_code: str | None = None
    error_message: str | None = None
```

`evaluator_version` is not optional. Six months from now someone will ask which
version produced a given verdict, and the answer has to survive the evaluator
being upgraded in the meantime.

### 5.6 Capabilities

```python
class EvaluatorCapability(BaseModel):
    name: str
    display_name: str
    description: str
    version: str

    supported_levels: list[ExtractionLevel]
    result_kinds: list[ResultKind]

    requires_llm: bool
    typical_duration_seconds: int
    max_rows: int | None = None
    required_columns: list[str] = Field(default_factory=list)


class CapabilitiesResponse(BaseModel):
    service_name: str
    service_version: str
    evaluators: list[EvaluatorCapability]
    max_inline_rows: int = 1000
```

---

## 6. REGISTRY

`api/registry.py`. Maps an evaluator name to the existing callable plus the
metadata the capabilities endpoint returns.

**Populate this by reading `tests_module/` — do not invent entries.** Every
name here must correspond to a real module in that package. If a module you
expect is missing, leave it out and note it rather than stubbing it.

```python
from dataclasses import dataclass, field
from typing import Callable

@dataclass(frozen=True)
class EvaluatorSpec:
    name: str
    display_name: str
    description: str
    version: str

    # Callable taking (frame: pd.DataFrame, options: dict) and returning
    # whatever that evaluator naturally returns. Do not force a shape here —
    # the mapper handles conversion.
    runner: Callable

    result_kind: ResultKind
    supported_levels: list[ExtractionLevel]
    requires_llm: bool
    typical_duration_seconds: int
    required_columns: list[str] = field(default_factory=list)
    max_rows: int | None = None
```

### Expected registry contents

Fill `runner`, `version` and `required_columns` from the actual code. The
`result_kind` and `supported_levels` columns below are the design intent —
confirm each against what the module really produces, and flag any mismatch
rather than silently changing the mapping.

| name | result_kind | levels | requires_llm |
|---|---|---|---|
| `hallucination` | VERDICT | prompt, thread | yes |
| `generation` | VERDICT | prompt | yes |
| `retrieval` | VERDICT | prompt | yes |
| `prompt` | VERDICT | prompt | yes |
| `tool_correctness` | VERDICT | prompt, thread | yes |
| `cyber_guardrail` | VERDICT | prompt | yes |
| `sensitivity` | DISTRIBUTION | time_range | no |
| `replication` | DISTRIBUTION | time_range | no |
| `performance` | TABULAR | time_range | yes |
| `explainability` | TABULAR | time_range | yes |
| `key_parameters` | TABULAR | time_range | yes |
| `agreement` | SCALARS | time_range | no |

**`supported_levels` matters.** The consumer reads it and will not send a
thread-level payload to an evaluator that only handles a population. Getting
this wrong produces confusing failures at their end, so be conservative — if
you are unsure whether an evaluator handles a level, leave it out.

---

## 7. RESULT MAPPERS

`api/mappers/`. Each takes whatever the evaluator naturally returns and
produces contract objects.

**This is where the impedance mismatch gets absorbed.** The evaluators keep
returning frames, dicts and series exactly as they do today. Nothing upstream
of the mapper knows the API exists.

### 7.1 Interface

```python
class ResultMapper(Protocol):
    def map(
        self,
        raw: Any,
        *,
        job_id: str,
        evaluator: str,
        upload_url: str | None,
    ) -> list[EvaluatorResult]:
        ...
```

Return a list, because one evaluator can legitimately produce more than one
result — a distribution plus the per-row detail behind it, for example.

### 7.2 Verdict mapper

**Input:** a frame with one row per span.
**Output:** one `VerdictResult` per row.

Column names vary between modules in this repo, so resolve them from a
candidate list rather than assuming:

```python
SPAN_COLUMNS    = ["span_id", "Span ID", "spanId", "trace_id", "Trace ID"]
VERDICT_COLUMNS = ["verdict", "score", "label", "llm_verdict", "result"]
REASON_COLUMNS  = ["reasoning", "explanation", "rationale", "reason"]
```

Use the same `first_non_empty`-style resolution the existing code already uses
for input columns, so behaviour is consistent with the CLI path.

**Score handling.** Some evaluators return `0` / `1`, others return categorical
strings like `faithful` / `hallucinated`. Emit the categorical value in
`verdict` and, when a numeric score exists, put it in `score` normalised to
0..1. Never invent a score where the evaluator did not produce one — leave it
`None`.

### 7.3 Scalars mapper

**Input:** a flat dict, exactly what `evaluation/agreement.py` →
`all_agreement_metrics()` already returns.

**Output:** one `ScalarsResult`.

```python
{
    "percentage_agreement": 0.78,
    "cohens_kappa_weighted": 0.71,
    "pearson_r": 0.84,
    "pearson_p_value": 0.001,
}
```

Coerce every value to `float`. Drop any key whose value is `NaN` rather than
serialising it — `NaN` is not valid JSON and will fail at the consumer.

`sample_size` comes from the length of the frame the metrics were computed
over, not from the request.

### 7.4 Distribution mapper

**Input:** a numeric series or a frame with a score column.
**Output:** one `DistributionResult`, plus a `detail` reference when the row
count exceeds the inline threshold.

```python
DistributionResult(
    metric_name=metric_name,
    count=len(series),
    mean=float(series.mean()),
    median=float(series.median()),
    std_dev=float(series.std()),
    minimum=float(series.min()),
    maximum=float(series.max()),
    percentiles={
        "p05": float(series.quantile(0.05)),
        "p25": float(series.quantile(0.25)),
        "p50": float(series.quantile(0.50)),
        "p75": float(series.quantile(0.75)),
        "p95": float(series.quantile(0.95)),
    },
    detail=detail_ref,
)
```

The summary travels inline so the consumer can render a chart without
downloading anything. `detail` is there for drill-down only.

### 7.5 Tabular mapper

**Input:** a frame, typically hundreds of thousands of rows.
**Output:** one `TabularResult` with the frame uploaded and referenced.

Always upload. Never inline a tabular result, regardless of size — the
consumer's handling for this kind assumes a reference, and a size-dependent
shape would make their code branch on something they cannot predict.

Include a `summary` dict with two or three headline numbers, computed from
whichever numeric columns exist. Same reasoning as above: it lets the
dashboard show something immediately.

---

## 8. STORAGE

`api/storage.py`. Two responsibilities.

### 8.1 Fetching input

When `delivery` is `reference`, fetch and verify before doing anything else:

```python
def fetch_input(artifact: ArtifactRef) -> pd.DataFrame:
    """
    Download, verify, parse.

    Checksum is verified rather than trusted. A truncated download that
    silently produces a short frame would corrupt every metric computed from
    it, and that failure is invisible without this check.
    """
```

Verify `checksum` against the downloaded bytes. On mismatch raise, do not
proceed — the resulting numbers would be wrong and nobody would know.

Log a warning if `row_count` does not match the parsed frame, but continue —
a row count drift is worth knowing about but is not necessarily corruption.

Route this through `core.data_io.read()` so URL and local handling stay in one
place.

### 8.2 Uploading results

When a result is too large to inline and `result_upload_url` was supplied:

```python
def upload_result(
    frame: pd.DataFrame,
    upload_url: str,
    fmt: ArtifactFormat = ArtifactFormat.PARQUET,
) -> ArtifactRef:
    """
    Serialise, PUT to the pre-signed URL, return a reference.

    The URL arrives with the request rather than being negotiated, so no
    round trip is needed to find out where results should go.
    """
```

Default to parquet. At two hundred thousand rows it is roughly an order of
magnitude smaller than xlsx and materially faster to read back.

Compute the sha256 of the serialised bytes and put it in the returned
`ArtifactRef`, so the consumer can verify what they fetch.

**If `result_upload_url` is absent and the result is too large to inline:**
return a `PARTIAL` status with an explicit error message saying an upload URL
was required. Do not silently truncate.

---

## 9. JOB HANDLING

`api/jobs.py`.

### 9.1 Storage

SQLite via `aiosqlite`, in a file under the configured data directory. Not
in-memory — jobs must survive a restart, otherwise a run in flight during a
deploy is lost with no way to tell the consumer what happened.

```sql
CREATE TABLE IF NOT EXISTS jobs (
    job_id            TEXT PRIMARY KEY,
    idempotency_key   TEXT NOT NULL UNIQUE,
    evaluator         TEXT NOT NULL,
    level             TEXT NOT NULL,
    status            TEXT NOT NULL,
    request_json      TEXT NOT NULL,
    result_json       TEXT,
    error_code        TEXT,
    error_message     TEXT,
    started_at        TEXT,
    completed_at      TEXT,
    created_at        TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_idem   ON jobs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
```

The unique constraint on `idempotency_key` is the enforcement point, not just
an optimisation. It makes duplicate execution impossible at the storage layer
rather than relying on every code path remembering to check first.

### 9.2 Idempotency

This is the behaviour the consumer depends on. Get it exactly right.

```
POST arrives with idempotency_key K
    │
    ├─ K not seen         → create job, start work, return 202 QUEUED
    │
    ├─ K seen, RUNNING    → return 202 with the existing job_id and poll_url
    │                        Do NOT start a second run.
    │
    ├─ K seen, SUCCEEDED  → return 200 with the stored result
    │                        Do NOT re-run. This is the whole point.
    │
    └─ K seen, FAILED     → create a new attempt under the same job_id,
                             start work, return 202
```

The `SUCCEEDED` branch is what prevents paying twice for an LLM call when a
response was lost in transit rather than the work actually failing.

The `FAILED` branch allows retry, because a genuine failure should be
retryable — the consumer will retry with the same key after backoff.

### 9.3 Execution

`api/executor.py`. Run the evaluator off the event loop:

```python
result = await asyncio.get_running_loop().run_in_executor(
    process_pool, _run_evaluator_sync, evaluator_name, frame, options
)
```

Use a `ProcessPoolExecutor`, not threads. The evaluators here are CPU-bound —
pandas operations, similarity computation, statistical work — and threads
would be blocked by the GIL. Size the pool from config, default 2.

Guard with the request's `timeout_seconds`. On timeout mark the job `FAILED`
with `error_code = "TIMEOUT"` and a message naming the evaluator and the limit
it exceeded.

---

## 10. ENDPOINTS

### `POST /evaluate`

```
202  EvaluationAccepted     accepted, work started
200  EvaluationResponse     idempotent replay of a completed job
422  validation error       payload shape wrong, unknown evaluator,
                            or level not supported by that evaluator
503  service error          worker pool unavailable
```

Validate before accepting:

1. `evaluator` exists in the registry
2. `level` is in that evaluator's `supported_levels`
3. Payload matches the declared `delivery`
4. `required_columns` are present in the data

Failing at submission with a clear message is far better than failing five
minutes into a run with a `KeyError` from deep inside a scoring function.

### `GET /jobs/{job_id}/result`

```
200  EvaluationResponse     any status, terminal or not
404  unknown job
```

Return the response object regardless of status. The consumer polls this and
reads `status` to decide whether to keep polling.

### `GET /capabilities`

Returns `CapabilitiesResponse` built from the registry. No arguments.

This is how the consumer discovers what exists. An evaluator added here
becomes visible to them without a release on their side.

### `GET /health` and `GET /ready`

`/health` — process is up. Cheap, no dependencies touched.

`/ready` — dependencies are usable. Check the SQLite file is writable and the
process pool is alive.

Separate them, because a transient dependency issue should fail readiness and
take the pod out of rotation without triggering a restart.

---

## 11. CONFIG

`api/config.py`, using `pydantic-settings`, everything from environment.

```python
class ApiSettings(BaseSettings):
    service_name: str = "model-testing-framework-api"
    service_version: str = "1.0.0"

    host: str = "0.0.0.0"
    port: int = 8080

    data_dir: Path = Path("./data/api")
    jobs_db_path: Path = Path("./data/api/jobs.db")

    max_inline_rows: int = 1000
    max_workers: int = 2
    default_timeout_seconds: int = 900

    download_timeout_seconds: int = 300
    upload_timeout_seconds: int = 300

    log_level: str = "INFO"
```

Do not read any existing `settings/cfg` values into here. The CLI config and
the API config are separate concerns and coupling them means a change for one
path breaks the other.

---

## 12. CONTAINER

The consuming team operates this deployment, so the image must be
self-contained and start without manual steps.

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# System deps before Python deps so the layer caches across code changes
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc g++ \
    && rm -rf /var/lib/apt/lists/*

# Existing pinned dependencies stay exactly as they are. They are pinned for a
# reason and this container is precisely why that no longer conflicts with
# anything else.
COPY requirements.txt requirements-api.txt ./
RUN pip install --no-cache-dir -r requirements.txt -r requirements-api.txt

COPY core/ ./core/
COPY evaluation/ ./evaluation/
COPY tests_module/ ./tests_module/
COPY settings/ ./settings/
COPY api/ ./api/

RUN mkdir -p /app/data/api

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
```

**One uvicorn worker.** Concurrency comes from the process pool inside the
app. Multiple uvicorn workers would each open the SQLite file and each hold
their own pool, which is both wasteful and a source of lock contention.

`requirements-api.txt` — additive only, never edit `requirements.txt`:

```
fastapi>=0.110,<1.0
uvicorn[standard]>=0.27,<1.0
pydantic>=2.6,<3.0
pydantic-settings>=2.2,<3.0
aiosqlite>=0.19,<1.0
python-multipart>=0.0.9
```

---

## 13. TESTS

`tests/api/`. Do not put these under the existing `tests/` root alongside the
CLI tests — keep the two paths separately runnable.

### Required coverage

**Contract validation**
- Both `inline` and `artifact` present → 422
- Neither present → 422
- `delivery` disagrees with which field is populated → 422
- Unknown evaluator → 422
- Level not in `supported_levels` → 422

**Idempotency** — the most important tests here
- Same key twice while running → same job_id, one execution
- Same key after success → stored result returned, evaluator not called again
  (assert on a call counter, not on timing)
- Same key after failure → new attempt starts
- Different key, same data → separate execution

**Storage**
- Checksum mismatch on download → raises, job fails, does not proceed
- Row count mismatch → warns, proceeds
- Missing `result_upload_url` with an oversized result → `PARTIAL` with a
  clear error, not a truncated result

**Mappers** — one test per mapper, with a fixture frame shaped like what the
real evaluator produces. Take the fixtures from actual output files in `data/`
rather than inventing shapes.

**Regression** — run at least two existing CLI commands end to end after the
`data_io` change and assert output is byte-identical to before. This is the
test that proves you did not break the thing that already works.

---

## 14. DO NOT

| Do not | Why |
|---|---|
| Edit anything in `tests_module/` or `evaluation/` | That is the evaluation methodology. It is not yours to change. |
| Change scoring logic, thresholds or prompts | Same. If something looks wrong, raise it, do not fix it. |
| Modify `run.py` or the CLI dispatcher | Both entry points must keep working. |
| Loosen any pin in `requirements.txt` | They are pinned deliberately. The container is what makes that safe. |
| Add an ORM or a migration framework | One SQLite table does not need one. |
| Cache evaluation results beyond idempotency | Stale scores are worse than slow ones. |
| Use threads for the evaluators | They are CPU-bound. The GIL makes threads pointless here. |
| Invent registry entries for modules that do not exist | The consumer reads capabilities and will call what you advertise. |
| Return `NaN` in any JSON field | It is not valid JSON and will fail at the consumer. |
| Silently truncate a large result | Fail explicitly instead. |

---

## 15. BUILD ORDER

Do these in order. Verify each before moving on.

1. **`core/data_io.py` URL support.** Then run every existing CLI command and
   confirm nothing changed. Nothing else starts until this is clean.
2. **`api/contracts.py`.** Start the app with an empty router set and confirm
   `/docs` renders the full schema.
3. **`api/registry.py`.** Populate from the real `tests_module/`. Confirm
   `/capabilities` returns every evaluator with correct metadata.
4. **`api/jobs.py`.** Table, idempotency branching, status transitions. Test
   this in isolation with a stub runner before wiring anything real.
5. **`api/storage.py`.** Fetch with checksum verification, upload with
   reference return.
6. **One mapper — verdict.** Wire `hallucination` end to end. Prompt level,
   inline delivery.
7. **`POST /evaluate` and `GET /jobs/{id}/result`** for that one path.
   Confirm the full round trip against a local caller.
8. **Reference delivery.** Same evaluator, artifact instead of inline.
9. **Remaining three mappers.** Scalars, distribution, tabular.
10. **Remaining evaluators**, one at a time, verifying result shape against a
    known-good CLI run for each.
11. **Dockerfile.** Build, run, hit `/health`, run one evaluation inside the
    container.
12. **Full test suite** including the CLI regression tests.

---

## 16. ACCEPTANCE CHECKLIST

- [ ] Every existing CLI command produces byte-identical output to before
- [ ] `/docs` renders the complete contract
- [ ] `/capabilities` lists only evaluators that actually exist
- [ ] Same idempotency key after success does not re-execute — proven by a
      call counter, not by timing
- [ ] Checksum mismatch fails the job rather than producing wrong numbers
- [ ] Every result kind round-trips through the contract without loss
- [ ] Tabular results are always uploaded, never inlined
- [ ] `sample_size` on scalar results is the real n
- [ ] No `NaN` appears in any response
- [ ] Jobs survive a process restart
- [ ] Container starts clean and passes its healthcheck
- [ ] Nothing under `tests_module/` or `evaluation/` was modified
- [ ] No file in `api/` exceeds 250 lines

---

## 17. OPEN QUESTIONS — RAISE, DO NOT DECIDE

If you hit any of these, stop and flag it rather than choosing:

1. An evaluator's `supported_levels` is unclear from the code
2. An evaluator returns a shape that does not fit any of the four result kinds
3. `required_columns` cannot be determined without running the evaluator
4. An existing module has a bug that would surface through the API
5. Two evaluators disagree on a column name for the same concept

These are decisions for the model team and the consuming team jointly. Getting
them wrong quietly is worse than asking.
