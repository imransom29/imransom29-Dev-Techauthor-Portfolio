Overwatch Evaluation Service — REAL API Integration

Mission

Build a Python service that actually calls Tachyon Overwatch (Arize AI) APIs to perform real LLM evaluations. Test case data is mock (we generate it), but everything else must be real — real API calls, real dataset upload, real evaluation triggered on the platform, real results pulled back.

No fake API responses. No simulated evaluation. Real platform interaction end-to-end.


Platform Context

Tachyon Overwatch is Wells Fargo's internal observability and evaluation platform, built on Arize AI (commercial product). This means the underlying APIs are Arize-compatible — same REST endpoints, same GraphQL schema, same SDK patterns.

Platform Details:


UAT Base URL: https://tachyon-observe-uat.wellsfargo.net/
Built on: Arize AI (Phoenix Arize observability stack)
My access level: VIEWER (may need EDITOR upgrade for some operations)


Credentials I have:

SPACE_ID = "U3BhY2U6NDI6S2NSNA=="
SERVICE_API_KEY = "ak-5a61be62...-T6P...ObF"   # From Service Keys tab (named GENAI417_DTNDCG249)
USER_API_KEY = "ak-572d9992...-CWC...wvx"        # From User API Keys tab (named AI_teammate_o11y)
DEVELOPER_KEY = "<from Ingestion Key > Developer Key tab>"  # For GraphQL calls

Use SERVICE_API_KEY for automated/service-to-service calls (it's labeled as "persistent credentials for automated systems with limited permissions").

Use DEVELOPER_KEY for GraphQL calls, exports, experiments, and datasets (per platform note).


What I Need You to Build

Service Purpose:

A FastAPI service where:


User uploads test cases (mock data is fine for now — we generate sample CSV)
Service hits REAL Overwatch APIs to:

Upload the dataset to the platform
Trigger an LLM-as-a-Judge Hallucination evaluation
Poll for completion
Pull real evaluation results back



Service generates a real evaluation report from actual platform data


Critical Requirements:


❌ NO mock API responses — every call goes to the actual platform
❌ NO simulated evaluation logic — Overwatch does the evaluation, not us
✅ Mock test case data is fine — we generate sample question/answer pairs
✅ All errors from real APIs must surface — don't hide failures
✅ Log every API call — full request/response for debugging
✅ Start with ONE evaluator only: Hallucination



Tech Stack


Python 3.10+
FastAPI + Uvicorn
httpx (async HTTP client) for REST calls
gql + requests-toolbelt for GraphQL calls (if needed)
arize Python SDK (official Arize SDK — try this first if REST is unclear)
pandas for CSV handling
python-dotenv for env vars
rich for pretty console output



Project Structure

overwatch-eval-service/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI entry
│   ├── config.py                    # Env vars, constants
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py               # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── overwatch_client.py      # REAL API client — CORE
│   │   ├── overwatch_graphql.py     # GraphQL client (for datasets/experiments)
│   │   ├── agent_service.py         # Mock agent (returns dummy responses)
│   │   ├── evaluation_runner.py     # Orchestrates the flow
│   │   └── report_service.py        # Builds the report
│   └── routers/
│       ├── __init__.py
│       └── evaluation.py            # API endpoints
├── test_cases/
│   └── generate_mock_data.py        # Generates sample test cases
│   └── sample_test_cases.csv        # Generated mock test cases
├── reports/
├── logs/
├── .env.example
├── requirements.txt
├── README.md
└── run.py


Environment Variables (.env)

bash# === Overwatch / Arize Configuration ===
OVERWATCH_BASE_URL=https://tachyon-observe-uat.wellsfargo.net
OVERWATCH_SPACE_ID=U3BhY2U6NDI6S2NSNA==

# Service Key for REST API (automated systems)
OVERWATCH_SERVICE_API_KEY=ak-5a61be62...-T6P...ObF

# Developer Key for GraphQL (datasets, experiments)
OVERWATCH_DEVELOPER_KEY=<paste-developer-key-here>

# User API Key (fallback)
OVERWATCH_USER_API_KEY=ak-572d9992...-CWC...wvx

# === Project Configuration ===
PROJECT_NAME=ahp-pro-evaluation
PROJECT_ID=<will be discovered from platform>

# === Evaluation Settings ===
DEFAULT_EVALUATOR=hallucination
JUDGE_MODEL=gpt-oss-20b   # Available on platform: gpt-oss-20b, gemma-3-12b-it

# === Server Settings ===
SERVER_HOST=0.0.0.0
SERVER_PORT=8080
LOG_LEVEL=INFO

# === Mock Agent ===
# Agent is mocked for now — we focus on real Overwatch integration
USE_MOCK_AGENT=true


OverwatchClient — The Core Component

This is the most important class. It must make real HTTP calls to the Overwatch platform.

Approach 1: Use Official Arize Python SDK (Try First)

pythonfrom arize.pandas.logger import Client as ArizeClient
from arize.experimental.datasets import ArizeDatasetsClient
from arize.experimental.evaluators import LLMEvaluator

# Initialize
client = ArizeClient(
    api_key=OVERWATCH_DEVELOPER_KEY,
    space_id=OVERWATCH_SPACE_ID,
    # Custom endpoint — point to Wells Fargo's Overwatch instance
    uri=f"{OVERWATCH_BASE_URL}/v1"
)

datasets_client = ArizeDatasetsClient(
    developer_key=OVERWATCH_DEVELOPER_KEY,
    api_key=OVERWATCH_DEVELOPER_KEY,
    space_id=OVERWATCH_SPACE_ID,
    host=OVERWATCH_BASE_URL
)

Approach 2: Direct REST/GraphQL Calls (Fallback)

Arize uses both REST and GraphQL. For datasets and experiments — typically GraphQL.

GraphQL Endpoint (per Arize docs pattern):

POST {OVERWATCH_BASE_URL}/graphql
Authorization: Bearer {DEVELOPER_KEY}

REST Endpoint for telemetry/spans:

POST {OVERWATCH_BASE_URL}/v1/spans
Authorization: Bearer {SERVICE_API_KEY}
Space-Id: {SPACE_ID}

Methods OverwatchClient Must Implement:

pythonclass OverwatchClient:
    """Real client for Tachyon Overwatch (Arize AI) platform."""
    
    def __init__(self, base_url, space_id, service_key, developer_key):
        ...
    
    async def verify_connection(self) -> dict:
        """
        Verify we can talk to the platform.
        Try: list projects via GraphQL or hit a simple REST endpoint.
        Return platform info if successful, raise if not.
        """
        ...
    
    async def list_projects(self) -> list[dict]:
        """List all projects in our space. Use GraphQL."""
        ...
    
    async def list_evaluators(self) -> list[dict]:
        """
        List available evaluators in the Evaluator Hub.
        We know from the UI that 'SQL Generator' exists.
        Use GraphQL to query evaluators.
        """
        ...
    
    async def create_dataset(self, name: str, test_cases: list[dict]) -> str:
        """
        Upload test cases as a new dataset.
        Returns dataset_id.
        
        Each test case has: question, expected_answer, agent_response
        Use Arize datasets GraphQL mutation: createDataset
        """
        ...
    
    async def get_dataset(self, dataset_id: str) -> dict:
        """Fetch dataset details."""
        ...
    
    async def trigger_evaluation(
        self, 
        dataset_id: str, 
        evaluator_name: str = "hallucination",
        judge_model: str = "gpt-oss-20b"
    ) -> str:
        """
        Trigger LLM-as-a-Judge evaluation on the dataset.
        Returns evaluation_run_id.
        
        Use Arize experiments API:
        - Create an experiment
        - Attach evaluator
        - Run experiment on dataset
        """
        ...
    
    async def get_evaluation_status(self, run_id: str) -> dict:
        """
        Check if evaluation is complete.
        Returns: {status: 'running'|'completed'|'failed', progress: 0-100}
        """
        ...
    
    async def get_evaluation_results(self, run_id: str) -> dict:
        """
        Pull real evaluation results once complete.
        Returns full results with per-row scores.
        """
        ...
    
    async def wait_for_completion(
        self, 
        run_id: str, 
        poll_interval: int = 5,
        timeout: int = 600
    ) -> dict:
        """Poll until evaluation completes or times out."""
        ...


Critical Investigation Step (DO THIS FIRST)

Before building the full service, discover the actual API contract by writing a small exploration script:

scripts/explore_overwatch_api.py

python"""
Exploration script — runs FIRST to discover the real API.
Hits the platform to:
1. Verify auth works with our keys
2. List projects (find our project)
3. List evaluators (confirm hallucination is available)
4. Get GraphQL schema (introspection query)
5. Document findings to a file
"""

Run this script first. It writes findings to docs/api_discovery.md. The actual evaluation service is built based on what we discover.

GraphQL Schema Introspection Query:

graphqlquery IntrospectionQuery {
  __schema {
    types {
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}

Things to Find Out:


✅ What's the correct authentication header? Authorization: Bearer ak-... or X-Api-Key: ak-...?
✅ Is Space-Id header required on every call?
✅ What's the GraphQL endpoint exactly?
✅ What mutations exist for creating datasets?
✅ How to trigger an experiment/evaluation?
✅ What does the response look like?



Sample GraphQL Queries (Arize patterns — verify these work)

List Projects

graphqlquery ListProjects($spaceId: ID!) {
  space(id: $spaceId) {
    projects {
      edges {
        node {
          id
          name
          createdAt
        }
      }
    }
  }
}

Create Dataset

graphqlmutation CreateDataset($spaceId: ID!, $name: String!, $examples: [DatasetExampleInput!]!) {
  createDataset(input: {
    spaceId: $spaceId
    name: $name
    examples: $examples
  }) {
    dataset {
      id
      name
    }
  }
}

Create Experiment (with evaluator)

graphqlmutation CreateExperiment(
  $datasetId: ID!
  $name: String!
  $evaluators: [EvaluatorInput!]!
) {
  createExperiment(input: {
    datasetId: $datasetId
    name: $name
    evaluators: $evaluators
  }) {
    experiment {
      id
      status
    }
  }
}

Get Experiment Results

graphqlquery GetExperimentResults($experimentId: ID!) {
  experiment(id: $experimentId) {
    id
    status
    runs {
      edges {
        node {
          id
          input
          output
          evaluations {
            name
            score
            label
            explanation
          }
        }
      }
    }
  }
}


Mock Test Case Generator

test_cases/generate_mock_data.py:

python"""Generates realistic mock test cases for Wells Fargo HR/Banking context."""

import pandas as pd

MOCK_TEST_CASES = [
    {
        "question": "What is Wells Fargo's leave policy?",
        "expected_answer": "Employees receive 24 paid vacation days per year, plus 12 federal holidays.",
        "context": "HR Policy Document v2.3 — Section 4.2 Paid Time Off"
    },
    {
        "question": "Who is the CEO of Wells Fargo?",
        "expected_answer": "Charles W. Scharf is the CEO of Wells Fargo since October 2019.",
        "context": "Wells Fargo Leadership Page"
    },
    {
        "question": "What is the company dress code?",
        "expected_answer": "Business casual is standard. Client-facing roles require business professional attire.",
        "context": "Employee Handbook Section 2.1"
    },
    {
        "question": "What is the work from home policy?",
        "expected_answer": "Hybrid model: 3 days in office, 2 days remote, subject to manager approval.",
        "context": "HR Policy 5.1 — Flexible Work Arrangements"
    },
    {
        "question": "How do I apply for parental leave?",
        "expected_answer": "Submit a request via HR Connect at least 30 days before expected leave start date.",
        "context": "HR Policy Section 4.5 — Parental Leave"
    },
    # Add 10 more realistic ones...
]

def generate_csv(output_path: str = "test_cases/sample_test_cases.csv"):
    df = pd.DataFrame(MOCK_TEST_CASES)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(MOCK_TEST_CASES)} mock test cases at {output_path}")

if __name__ == "__main__":
    generate_csv()


Mock Agent Service

Since we don't have the real agent running, mock it — but make it deterministic and realistic so evaluation makes sense:

python# app/services/agent_service.py
import random

# Mock responses — some correct, some hallucinated (intentionally)
MOCK_AGENT_RESPONSES = {
    "leave policy": "Employees get 24 paid vacation days annually plus federal holidays.",  # Good
    "ceo": "Tim Sloan is the current CEO of Wells Fargo.",  # HALLUCINATION (it's Charles Scharf)
    "dress code": "Business casual attire is the standard.",  # Good
    "work from home": "Fully remote work is available for all employees.",  # HALLUCINATION (hybrid only)
    "parental leave": "Submit via HR Connect 30 days in advance.",  # Good
}

async def query_agent(question: str) -> str:
    """Mock agent — returns realistic responses, some correct, some hallucinated."""
    q_lower = question.lower()
    for key, response in MOCK_AGENT_RESPONSES.items():
        if key in q_lower:
            return response
    return "I don't have information about that topic in my knowledge base."

This makes the evaluation meaningful — real Overwatch will detect the hallucinations we built in. That's the demo magic.


API Endpoints

POST /api/v1/evaluate/start

Starts the full evaluation pipeline. Returns immediately with evaluation_id.

Input:

json{
  "test_cases_source": "mock",     // or "csv_upload"
  "csv_file": null,
  "evaluator": "hallucination",
  "judge_model": "gpt-oss-20b"
}

Process (runs async in background):


Load test cases (from mock generator or CSV)
For each test case, call mock agent — collect responses
Call OverwatchClient.create_dataset(...) — REAL API CALL
Call OverwatchClient.trigger_evaluation(...) — REAL API CALL
Poll OverwatchClient.get_evaluation_status(...) until complete — REAL API CALLS
Call OverwatchClient.get_evaluation_results(...) — REAL API CALL
Generate report from real platform data


Output:

json{
  "evaluation_id": "eval-uuid-abc",
  "status": "started",
  "dataset_id": "ds-real-from-platform",
  "experiment_id": "exp-real-from-platform"
}

GET /api/v1/evaluate/{evaluation_id}/status

Returns current status with progress.

GET /api/v1/evaluate/{evaluation_id}/report

Returns the full evaluation report (real data from platform).

GET /api/v1/platform/health

Verifies connection to Overwatch. Returns space info, available projects, available evaluators.

GET /api/v1/platform/evaluators

Lists real evaluators from the platform.


Console Output (Rich)

Use the rich library for beautiful console output:

pythonfrom rich.console import Console
from rich.table import Table
from rich.progress import Progress

console = Console()

# Show progress as evaluation runs
with Progress() as progress:
    task = progress.add_task("[cyan]Running evaluation on Overwatch...", total=100)
    while not done:
        status = await client.get_evaluation_status(run_id)
        progress.update(task, completed=status['progress'])

# Final report
table = Table(title="Overwatch Evaluation Report — REAL DATA")
table.add_column("Question", style="cyan")
table.add_column("Hallucination?", style="red")
table.add_column("Score", style="green")
# ... populate from real results
console.print(table)


Final Report Format

Pull from REAL Overwatch results — do not fabricate scores:

╔══════════════════════════════════════════════════════════╗
║      OVERWATCH EVALUATION REPORT (REAL PLATFORM)        ║
╠══════════════════════════════════════════════════════════╣
║  Platform        : Tachyon Overwatch (UAT)              ║
║  Space ID        : U3BhY2U6NDI6S2NSNA==                 ║
║  Dataset ID      : <real id from platform>              ║
║  Experiment ID   : <real id from platform>              ║
║  Evaluator       : Hallucination (LLM-as-a-Judge)       ║
║  Judge Model     : gpt-oss-20b                          ║
╠══════════════════════════════════════════════════════════╣
║  Total Test Cases    : 15                                ║
║  Hallucinations      : 2 (detected by real evaluator)    ║
║  Hallucination Rate  : 13.3%                             ║
║  Avg Confidence      : 0.87 (from platform)              ║
╠══════════════════════════════════════════════════════════╣
║  VERDICT: ❌ FAILED — Model needs review                ║
╚══════════════════════════════════════════════════════════╝

View full results on platform:
https://tachyon-observe-uat.wellsfargo.net/experiments/<real-id>


Logging Requirements

Every API call must be logged to logs/api_calls.log:

2026-06-11 23:30:01 | INFO  | POST https://tachyon-observe-uat.wellsfargo.net/graphql
                              Mutation: createDataset
                              Status: 200 OK
                              Response: {"data": {"createDataset": {"dataset": {"id": "ds-xyz"}}}}

If any call fails, log the full request and response. No silent failures.


Success Criteria

The service is "done" when:


✅ Running python scripts/explore_overwatch_api.py successfully connects and lists real projects/evaluators
✅ Hitting POST /api/v1/evaluate/start triggers a real evaluation visible in the Overwatch UI
✅ I can see the dataset I created appear in the platform's Datasets section
✅ I can see the experiment run in the platform's Experiments section
✅ The evaluation completes and returns real hallucination scores
✅ The report shows real numbers (not hardcoded)
✅ Going to the platform UI confirms everything happened there too



Build Order


Step 1: scripts/explore_overwatch_api.py — discover the real API
Step 2: app/services/overwatch_client.py — implement based on discovery
Step 3: app/services/agent_service.py — mock agent with intentional hallucinations
Step 4: app/services/evaluation_runner.py — orchestrate the flow
Step 5: app/routers/evaluation.py — FastAPI endpoints
Step 6: app/services/report_service.py — generate reports from real data
Step 7: End-to-end test — run full flow, verify on platform UI



Important Notes for Claude Code


Do not skip the exploration step. I don't know the exact API endpoints. Discover them, document them, then build.
Do not fake any API responses. If something doesn't work, raise the error so I can debug.
Use the official arize Python SDK first. Only fall back to raw HTTP if SDK doesn't work with our custom endpoint.
The arize SDK supports custom endpoints — pass host=OVERWATCH_BASE_URL in initialization.
Add a --dry-run flag that shows what would be called without actually calling — useful for debugging.
Print clear errors if auth fails — most likely first issue.



What I'll Do After You Build


Run the explorer first — confirm we can talk to the platform
Generate mock test cases
Run the full evaluation
Open Overwatch UI — verify the dataset, experiment, and results appear there
Show this to Kaz as a working POC
Once approved, extend to relevance, toxicity, etc.



TL;DR for Claude Code:
Build a FastAPI service. Mock the test data and the agent. But every interaction with Overwatch must be real — real datasets uploaded, real evaluation triggered, real results pulled. Use the arize Python SDK pointing to our custom Overwatch endpoint. Start with hallucination evaluator only. Log everything. No fake responses.
