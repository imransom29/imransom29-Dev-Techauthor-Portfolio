DECK 1: AI Agentic Starter Kit (AHP Pro)
Problem Statement
Across WIMT, every team building a new AI agent today starts from scratch — duplicating effort on project structure, supervisor patterns, MCP integration, authentication, observability, and deployment.
Initial scaffolding consumes 4–6 weeks per team before any business logic is written, slowing time-to-value across the LOB.
Without a shared foundation, compliance, security, and governance controls are implemented inconsistently — creating audit and regulatory risk.
No standardized, reusable mechanism exists today to onboard new teams onto a production-grade AI teammate pattern.
Manual setup increases operational risk and blocks the bank from scaling GenAI adoption efficiently.
Solution Overview
Build a production-grade AI Agentic Starter Kit (AHP Pro) packaging the Supervisor Agent, MCP Server, and Chatbot UI as reusable cookiecutter templates.
Onboard the starter kit to Tachyon Marketplace as a reference app, enabling discovery and code-level reuse across all WIMT teams.
Onboard the bundled service to Orchestra IDP Storefront, allowing developers to fill a form and receive a fully provisioned, ready-to-build project ZIP — no Git access required.
Bake in enterprise standards by default — Tachyon routing, structured logging, observability hooks, and security controls — so every consuming team inherits compliance out of the box.
Savings Levers (After)
Time-to-value: New team onboarding reduced from 4–6 weeks to under 1 day.
Standardization: Single source of truth for agent patterns — eliminates 80%+ of duplicated scaffolding work across teams.
Compliance: Built-in Tachyon governance, audit logging, and security controls applied uniformly across every adopting team.
Side Table: AHP Pro Components & Adoption Pipeline
Component
Status
Supervisor Agent
Production-Ready
MCP Server
Production-Ready
Chatbot UI
Production-Ready
Tachyon Marketplace Onboarding
In Progress
Orchestra IDP Storefront Onboarding
In Progress
Automation Endpoint (FastAPI)
Built — Deployment Pending
Target Teams (WIMT)
15+
🎯 DECK 2: Tachyon SDK 2.0 Implementation
Problem Statement
The AHP Pro supervisor agent currently uses direct model calls, bypassing the enterprise-standard gateway and creating governance, audit, and resiliency gaps.
Switching between models (e.g., Gemini 2.5 to next-gen models) today requires code-level changes, blocking teams from adapting quickly to model retirements or new model availability.
No standardized path exists for WIMT agents to leverage Tachyon SDK 2.0 capabilities — model resiliency, automatic failover, observability hooks, and centralized governance.
Existing teams that onboard the starter kit do not inherit Tachyon connectivity by default — every team has to wire it manually.
Without SDK adoption, model migration timelines are slow and expose the bank to availability and compliance risks.
Solution Overview
Integrate Tachyon SDK 2.0 (TAWK) into the AHP Pro cookiecutter supervisor agent, replacing direct model calls with SDK-managed routing.
Enable multi-model connectivity through the enterprise gateway — currently Gemini 2.5, with flexibility to onboard future models without architectural changes.
Bundle the SDK integration into the reference app, so every new team onboarding through the starter kit inherits Tachyon connectivity out of the box — no additional setup required.
Activate enterprise capabilities by default — model resiliency, automatic failover, request-level observability, and governance compliance — through the SDK.
Savings Levers (After)
Model migration time: Reduced from weeks of code-level changes to configuration-only updates.
Resiliency: Automatic failover to backup models — eliminates downtime when a primary model is slow or unavailable.
Compliance: 100% of starter-kit-adopting teams inherit enterprise-grade governance, audit trails, and gateway routing by default.
Side Table: SDK 2.0 Capabilities Enabled
Capability
Provided By Tachyon SDK 2.0
Multi-model Routing
✓
Automatic Failover (Model Resiliency)
✓
Enterprise Authentication
✓
Guardrails
✓
Session & Memory Handling
✓
Trace Generation (for Overwatch)
✓
Centralized Governance
✓
Total Enterprise Capabilities
7
🎯 DECK 3: Evaluation Framework with Tachyon Overwatch
Problem Statement
WIMT AI systems have no self-service way for teams to validate their agent's performance — every evaluation today requires tech team involvement.
When teams change the system prompt, swap models, or upgrade agent logic, there is no standardized validation path before going live.
Critical model migrations (e.g., Gemini 2.5 retirement) lack a data-driven validation step, exposing the bank to quality, hallucination, and compliance risks.
Existing evaluation approaches are manual, inconsistent across teams, and not aligned with the Overwatch platform already available in the enterprise.
Without an evaluation framework, model and prompt changes go to production with limited confidence in accuracy, relevance, and safety.
Solution Overview
Build a self-service Overwatch Evaluation Framework that allows WIMT teams to upload custom test cases, trigger on-demand evaluation runs, and receive actionable metrics — without tech team dependency.
Leverage Tachyon Overwatch (built on Arize AI) as the evaluation backbone — traces flow automatically from the agent (via TAWK), and Overwatch auto-evaluates each trace.
Surface key metrics directly to users — hallucination rate, relevance score, toxicity, tool-calling accuracy, and latency — in a single evaluation report.
Trigger evaluations on demand for two critical scenarios — (a) system prompt or agent logic changes, and (b) model migrations — ensuring every change is data-validated before going live.
Savings Levers (After)
Tech team dependency: Eliminated for routine evaluations — teams self-serve on demand.
Model migration confidence: Every transition is data-validated against custom test cases before production rollout.
Quality & compliance: Continuous visibility into hallucination, relevance, and safety metrics across all WIMT AI systems.
Side Table: Evaluation Metrics Captured
Metric
Purpose
Hallucination Rate
Detects fabricated or unsupported responses
Relevance Score
Measures how well the response addresses the prompt
Toxicity Score
Flags unsafe or inappropriate content
Tool-Calling Accuracy
Validates if agent picked the right tool/API
Latency
Measures response time
Test Cases Passed
Aggregate pass/fail per evaluation run
Total Auto-Evaluated Metrics
6
