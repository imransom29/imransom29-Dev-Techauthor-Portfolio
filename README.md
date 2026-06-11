Overwatch Evaluation Service — Complete Prompt for Claude Code
Context
I am building an Overwatch Evaluation Service for the WIMT GenAI team at Wells Fargo. This is part of the AHP Pro (AI Agentic Starter Kit) project.
What is Overwatch?
Tachyon Overwatch is Wells Fargo's internal AI/LLM observability and evaluation platform
It is built on top of Arize AI (commercial ML observability product)
It is hosted on WF infrastructure
UAT URL: https://tachyon-observe-uat.wellsfargo.net/
It provides: Tracing, Monitoring Dashboards, and LLM-as-a-Judge Evaluations
What I have access to:
Space ID: U3BhY2U6NTg6TkZnRQ==
API Key: I will provide this via environment variable OVERWATCH_API_KEY
Base URL: https://tachyon-observe-uat.wellsfargo.net/
VIEWER access on the platform
Available judge models on the platform: gpt-oss-20b, gemma-3-12b-it
What Overwatch already has:
Evaluator Hub with LLM-as-a-Judge evaluators (hallucination, toxicity, correctness)
Datasets & Experiments section to upload test cases
Tracing Projects — traces are already flowing (3,999+ traces in "Tachyon Generation" project)
APIs available via Settings page (Arize-compatible REST API)


What I Need You to Build
Build a FastAPI-based Evaluation Service in Python that does the following:
Core Flow:
User uploads test cases (CSV/JSON)

        ↓

Service reads each test case (question + expected_answer)

        ↓

Service sends each question to the AI Agent endpoint

        ↓

Agent responds (traces automatically go to Overwatch via TAWK instrumentation)

        ↓

Service calls Overwatch/Arize API to trigger LLM-as-a-Judge evaluation

        ↓

Service pulls evaluation results from Overwatch/Arize API

        ↓

Service generates and returns an evaluation report to the user
Important Clarifications:
Test cases are uploaded BY THE USER — they provide the question + expected answer pairs
The agent is already instrumented with TAWK — traces flow to Overwatch automatically
We are starting with ONE evaluator only: Hallucination — more evaluators (relevance, toxicity) will be added later
The user should NEVER need to open Overwatch UI — everything happens through this service
This is NOT part of CI/CD — it's triggered on-demand only


Technical Requirements
Tech Stack:
Python 3.10+
FastAPI for the service
Uvicorn for running the server
httpx or requests for API calls
pandas for reading CSV test cases
python-dotenv for environment variables
Project Structure:
overwatch-eval-service/

├── app/

│   ├── __init__.py

│   ├── main.py                 # FastAPI app entry point

│   ├── config.py               # Environment variables and configuration

│   ├── models/

│   │   ├── __init__.py

│   │   └── schemas.py          # Pydantic models for request/response

│   ├── services/

│   │   ├── __init__.py

│   │   ├── agent_service.py    # Sends test questions to the AI agent

│   │   ├── overwatch_service.py # Interacts with Overwatch/Arize API

│   │   └── report_service.py   # Generates evaluation report

│   └── routers/

│       ├── __init__.py

│       └── evaluation.py       # API endpoints

├── test_cases/

│   └── sample_test_cases.csv   # Sample test case file

├── reports/

│   └── .gitkeep                # Generated reports go here

├── .env.example                # Example environment variables

├── requirements.txt

├── README.md

└── run.py                      # Entry point to start the server
Environment Variables (.env):
# Overwatch / Arize Configuration

OVERWATCH_BASE_URL=https://tachyon-observe-uat.wellsfargo.net

OVERWATCH_SPACE_ID=U3BhY2U6NTg6TkZnRQ==

OVERWATCH_API_KEY=<your-api-key>

# Agent Configuration

AGENT_BASE_URL=http://localhost:8000

AGENT_ENDPOINT=/api/v1/chat

# Evaluation Settings

DEFAULT_EVALUATOR=hallucination

JUDGE_MODEL=gpt-oss-20b


API Endpoints to Build
1. POST /api/v1/evaluate
Purpose: Main endpoint — accepts test cases, runs evaluation, returns report

Input: Upload a CSV or JSON file with test cases

// JSON format

{

  "test_cases": [

    {

      "question": "What is our leave policy?",

      "expected_answer": "You get 24 paid leaves per year",

      "context": "optional - reference document content"

    },

    {

      "question": "Who is the CEO?",

      "expected_answer": "Charles Scharf",

      "context": "optional"

    }

  ],

  "evaluator": "hallucination",

  "model_name": "gemini-2.5"

}

OR accept CSV file upload with columns: question, expected_answer, context (optional)

Process:

Parse the test cases
For each test case, send the question to the agent endpoint
Collect agent's response
Call Overwatch API to create a dataset with the results
Trigger LLM-as-a-Judge evaluation (hallucination) on the dataset
Poll for evaluation completion
Pull results
Generate report

Output:

{

  "evaluation_id": "eval-uuid-123",

  "model_tested": "gemini-2.5",

  "evaluator": "hallucination",

  "timestamp": "2026-06-11T12:00:00Z",

  "summary": {

    "total_test_cases": 50,

    "passed": 47,

    "failed": 3,

    "hallucination_rate": 6.0,

    "avg_confidence_score": 0.92

  },

  "details": [

    {

      "question": "What is our leave policy?",

      "expected_answer": "24 paid leaves per year",

      "agent_answer": "You get 24 paid leaves per year",

      "hallucination_detected": false,

      "confidence_score": 0.95

    },

    {

      "question": "What is the dress code?",

      "expected_answer": "Business casual",

      "agent_answer": "There is no dress code policy",

      "hallucination_detected": true,

      "confidence_score": 0.3

    }

  ],

  "report_path": "reports/eval-uuid-123.json"

}
2. GET /api/v1/evaluate/{evaluation_id}/status
Purpose: Check status of a running evaluation Output: { "status": "running" | "completed" | "failed", "progress": "30/50" }
3. GET /api/v1/evaluate/{evaluation_id}/report
Purpose: Get the full evaluation report for a completed evaluation
4. GET /api/v1/evaluators
Purpose: List available evaluators Output: ["hallucination", "relevance", "toxicity", "correctness"]
5. POST /api/v1/test-cases/upload
Purpose: Upload and validate test cases (CSV/JSON) without running evaluation Output: { "valid": true, "total_cases": 50, "format": "csv" }


Overwatch / Arize API Integration
Since Overwatch is built on Arize AI, it follows Arize's REST API patterns. Here's how to interact with it:
Authentication:
headers = {

    "Authorization": f"Bearer {OVERWATCH_API_KEY}",

    "Content-Type": "application/json",

    "Space-Id": OVERWATCH_SPACE_ID

}
Key API Operations Needed:
1. List Projects (to verify connection)

GET {OVERWATCH_BASE_URL}/v1/projects

2. Create/Upload Dataset (test cases)

POST {OVERWATCH_BASE_URL}/v1/datasets

Body: { "name": "eval-{timestamp}", "data": [...test_cases...] }

3. Trigger Evaluation

POST {OVERWATCH_BASE_URL}/v1/evaluations

Body: {

  "dataset_id": "...",

  "evaluator": "hallucination",

  "model": "gpt-oss-20b"

}

4. Get Evaluation Results

GET {OVERWATCH_BASE_URL}/v1/evaluations/{eval_id}/results

IMPORTANT NOTE: The exact API endpoints may differ from what I've listed above. The service should be built with a clean abstraction layer (OverwatchClient class) so that endpoints can be easily updated once we confirm the exact API documentation. Build the OverwatchClient as a separate class with clear methods:

verify_connection()
create_dataset(test_cases)
trigger_evaluation(dataset_id, evaluator_type)
get_evaluation_status(eval_id)
get_evaluation_results(eval_id)

If the Arize REST API is not directly accessible, also include a fallback approach using the arize-phoenix-otel or arize Python SDK as an alternative client.


Agent Service
The agent service sends questions to our existing supervisor agent:

async def query_agent(question: str) -> str:

    """Send a question to the AI agent and get response"""

    response = await httpx.post(

        f"{AGENT_BASE_URL}{AGENT_ENDPOINT}",

        json={"message": question}

    )

    return response.json()["response"]

For local testing/POC: If the agent is not running, build a mock agent that returns dummy responses. This way I can test the full evaluation flow without needing the actual agent running.

# Mock mode for testing

MOCK_AGENT = True  # Set via env var

async def query_agent(question: str) -> str:

    if MOCK_AGENT:

        return f"Mock response for: {question}"

    # Real agent call

    ...


Sample Test Cases (CSV)
Create a sample_test_cases.csv:

question,expected_answer,context

"What is our leave policy?","Employees get 24 paid leaves per year","HR Policy Document Section 4.2"

"Who is the CEO of Wells Fargo?","Charles Scharf is the CEO","Company Leadership Page"

"What is the dress code?","Business casual is the standard dress code","Employee Handbook Section 2.1"

"How many holidays do we get?","12 public holidays plus 24 paid leaves","HR Policy Document Section 4.3"

"What is the work from home policy?","Hybrid model - 3 days office, 2 days WFH","HR Policy Document Section 5.1"


Report Generation
Generate two types of reports:

1. JSON Report — saved to reports/ folder 2. Console Summary — printed in terminal

Console summary example:

╔══════════════════════════════════════════════════╗

║        OVERWATCH EVALUATION REPORT               ║

╠══════════════════════════════════════════════════╣

║  Model Tested    : Gemini 2.5                    ║

║  Evaluator       : Hallucination                 ║

║  Date            : 2026-06-11                    ║

╠══════════════════════════════════════════════════╣

║  Total Test Cases : 50                           ║

║  Passed           : 47                           ║

║  Failed           : 3                            ║

║  Hallucination %  : 6.0%                         ║

║  Avg Confidence   : 92%                          ║

╠══════════════════════════════════════════════════╣

║  RESULT: ⚠️  REVIEW NEEDED                       ║

╚══════════════════════════════════════════════════╝

Result logic:

Hallucination < 5% → ✅ PASSED — Model is good to go
Hallucination 5-10% → ⚠️ REVIEW NEEDED — Check failed cases
Hallucination > 10% → ❌ FAILED — Do not deploy this model


Additional Requirements
Logging: Use Python logging module. Log every step — test case sent, response received, evaluation triggered, results pulled.

Error Handling: Graceful error handling at every step. If agent is down, skip that test case and note it. If Overwatch API fails, retry 3 times with backoff.

Async: Use async/await for agent calls and API calls for better performance. Run multiple test cases in parallel (configurable concurrency limit, default 5).

Progress Tracking: Show progress while evaluation is running — "Processing test case 5/50..."

Retry Logic: Implement retry with exponential backoff for Overwatch API calls.

Timeout: Configurable timeout for agent calls (default 30 seconds) and Overwatch API calls (default 60 seconds).


How to Run
# Install dependencies

pip install -r requirements.txt

# Set up environment

cp .env.example .env

# Edit .env with your actual credentials

# Run the service

python run.py

# The service starts at http://localhost:8080

# Test with sample data

curl -X POST http://localhost:8080/api/v1/evaluate \

  -F "file=@test_cases/sample_test_cases.csv" \

  -F "evaluator=hallucination"


Summary
Build a clean, well-structured FastAPI service that:

Accepts test cases from the user (CSV or JSON)
Sends each question to the AI agent (with mock mode for testing)
Calls Overwatch/Arize API to trigger hallucination evaluation
Pulls results and generates a clear evaluation report
Returns the report to the user

Start with hallucination evaluator only. Keep the code modular so we can add relevance, toxicity, and other evaluators later.

The OverwatchClient should be a clean abstraction — if API endpoints change, we only update one file.

Make sure the mock mode works perfectly so I can demo the full flow even without the real agent or Overwatch connection.

