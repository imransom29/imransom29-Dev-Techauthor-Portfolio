3.1 — July Week 3 (July 21–25)
Sequence Diagram & Architecture (July 23)
Kaz shared detailed Mermaid sequence diagram covering the full evaluation flow: Client -> Router -> EvaluationService -> OverwatchConnector -> Evaluator plugin -> Judge LLM -> back. Includes per-span loop, streaming events, annotation push-back.
Shared architecture diagram with Kaz for walkthrough.
Demo Agenda Drafted (July 23)
Prepared demo agenda for WIMT - Supervisor Evaluation Service:
How is it implemented? (Framework + Design Pattern)
How Hallucination works? (Pass and failure case)
How can we take it forward? UI? (UI Admin or current React Service)
Difference with respect to Model Testing Framework?
Relevancy Check Feature (July 24)
In Founder Standup, David asked whether we do relevancy checks on chunks before scoring.
Already implemented — no separate story existed. Offered Monday demo including relevancy.
UI Code Shared (July 24)
Kaz busy with hackathon. Proposed Saturday or Monday walkthrough.
Kaz asked for UI code to test over weekend. Shared repo: K208083/Supervisor-Evaluation-Service-UI.
Model Testing Framework Local Run (July 27)
Ran model testing framework locally to compare approaches.
Planned end-to-end demo for Kaz (moved to 3 PM).
3.2 — Week 3 Action Items for Next Week
Demo to Deepak (first-cut evaluation feature)
Incorporate Bishal's improvement suggestions
Plan model team presentation
Set up mail threads for UI updates and model team integration
4.1 — July Week 4 (July 28 – Aug 1)
Demo to Deepak (July 28)
Demoed evaluation service to Deepak — first-cut feature walkthrough.
Kaz: "Don't close the story. Comment: We demo-ed to Deepak. We will demo to model team in next sprint, so move this to next sprint."
Kaz created new stories for upcoming sprint.
Bishal's Improvements (July 28)
Connected with Bishal — suggested good improvements. Going through them and making changes.
Ananya's Access (July 28)
Raised that Ananya might need editor access for Tachyon Overwatch. Kaz asked for role name.
Two Mail Threads Started (July 29-30)
Thread 1: Bishal + Rahul + Kaz with Deepak CC — UI update progress.
Thread 2: Model team integration strategies — David gave names for the call. Started a thread putting Rohan's ideas forward so everyone is on the same page.
Integration Call Alignment (Thursday-Friday)
Discussed everything in 2 PM Friday call. All aligned before model team presentation.
4.2 — Week 4 Action Items for Next Week
Present to model team (Kibashini)
Incorporate Bishal's UI improvements
Set up Ananya's Overwatch access
Start integration based on model team feedback
5.1 — Model Team Demo (Aug 3)
Presentation
Presented integration approach to Kibashini's team. Rohan on the call.
Covered: question flow (5 steps, 7 components), differences table, integration approach (wrapper + hosting + async contract), unified architecture, code architecture, open questions.
Showed live demo: evaluation pipeline, SSE streaming, annotation push-back.
Key Outcomes
Start small — pick one evaluator, prove it works, then expand.
Each evaluator is independent — no "whose verdict wins" decision at framework level.
Benchmarking pushback: model-vs-model not sufficient, need human annotation.
Retention concern: traces expire in 2 weeks. No solid answer in meeting — needs solution.
Model team will use our API. Their evaluators plug in through the wrapper.
Post-Meeting Direction (from Rohan)
MRM (Level 2) and Model Team (Level 1) are separate teams.
Kibashini's team maintains Model Testing Framework — correct audience.
Direction: use their evaluators, not ours. Helps our team focus on features instead of evaluator maintenance.
5.2 — Next Steps After Model Team Demo
Start integration with hallucination evaluator as first target
Solve retention: store raw trace data in MongoDB alongside verdicts
Drop "whose verdict wins" framing — each evaluator is independent
Schedule technical follow-up with Kibashini's team (working session, not presentation)
Clarify what Freddy's team has already implemented to avoid overlap
Confirm data classification for shared artifact store
6 — Meeting Log
Meeting 1: First Demo to Deepak

Date: ~July 15 (Week 2) Participants: Rahul Vinayak, Kazhian Muthusami (Kaz), Deepak Elias Purpose: First-cut demo of the Supervisor Evaluation Service

What was shown:

The evaluation service running on OCP — connected to a space ID, org ID, and tracing projects.
Selected SIT environment and ran hallucination evaluator on live spans.
Showed the live event stream (SSE) on the right side — real-time visibility into what is happening during evaluation (evaluation started, span scored, suggestion generated for failed spans, evaluation completed).
Showed the evaluation pipeline on the left side — stages: extract production spans, generate synthetic output, review and label (auto review vs manual review), benchmark dataset, judge model comparison.
Demonstrated pushing annotations back to Overwatch — factual/hallucinated label updated with the service key.

Key Decisions:

Deepak wanted to understand whether we are doing relevancy checks on chunks before scoring. (Answered in next session — already implemented.)
Kaz instructed: do not close the story. Comment it as "demo-ed to Deepak, will demo to model team in next sprint, move to next sprint."

Action Items:

Wrap up first-cut feature and prepare for broader demo.
Look into the Model Testing Framework that David shared and compare approaches.
Meeting 2: Demo to Deepak, David, Kaz, Ishita (Post-Annotation Push)

Date: ~July 23–24 (Week 3) Participants: Rahul Vinayak, Kazhian Muthusami, Deepak Elias, David Mosciatti, Ishita Mohapatra Purpose: Broader demo after annotation push-back was working end-to-end, including relevancy check

What was shown:

End-to-end evaluation flow — from span extraction to verdict to annotation push-back to Overwatch.
Relevancy check functionality — David had asked in the Founder Standup whether we check relevancy on chunks before scoring. Showed that this was already implemented (no separate story existed for it).
Architecture walkthrough using the diagram Kaz had reviewed.
Difference between Supervisor Evaluation Service and Model Testing Framework (high-level).

Key Decisions:

David shared the Model Testing Framework repo (NonApp-rifamcoe-AI-Teammate-main) and asked Rahul to compare both approaches.
David gave names to add to the model team integration call.
Decided on phased presentation: Dev team first, then Product, then Model team.
Kaz noted: for LLM calls, should use Tachyon SDK instead of Apigee gateway (but next step, not immediate).

Action Items:

Run Model Testing Framework locally and identify the differences.
Prepare the comparison and integration approach.
Incorporate Bishal's UI improvement suggestions.
Set up Ananya's Tachyon Overwatch editor access.
Meeting 3: Rohan One-on-One

Date: ~July 28–29 (Week 4) Participants: Rahul Vinayak, Rohan Sharma Purpose: Align on integration strategy before presenting to model team

Discussion:

Rohan walked through his view of what the integration should achieve — evaluation across the full lifecycle, not just UAT. Three scopes: developmental testing for new features, change management for existing features, and ongoing production monitoring.
Discussed what "hosting" means in practice — not just one deployment, but multiple environments (dev, SIT, UAT, prod). A developer running a branch should be able to test against the model evaluation service.
Rohan explained the job concept — a whole package submitted as a job (e.g., single thread with 20 correlated prompts). The service should evaluate how the LLM evolved throughout the conversation, not just individual prompts.
Discussed Freddy Asman's team — separate group focused on production monitoring. His scope is different but there may be overlap.

Key Decisions:

Start with a thread putting Rohan's ideas forward via email so everyone is on the same page before the model team call.
Two mail threads going: 1) Bishal + Kaz + Rahul with Deepak CC for UI updates, 2) Model team integration strategies with David's contacts.

Action Items:

Schedule the model team call with names David provided.
Prepare the presentation covering integration approach, not just a demo.
Frame the discussion around "how do we join the two systems" not "here is what I built."
Meeting 4: Dev Team Alignment

Date: ~July 30–31 (Week 4, Thursday–Friday) Participants: Rahul Vinayak, Kazhian Muthusami, Rohan Sharma, Deepak Elias, Ishita Mohapatra Purpose: Final alignment before model team presentation

Discussion:

Walked through the full presentation deck: how one question flows (5 steps, 7 components), the differences table, the integration approach (wrapper + hosting + async contract), unified architecture, code and architecture of the service.
Rohan provided context on what the model team expects — they need to see that their work is respected and preserved, not replaced.
Discussed the three-part approach: thin wrapper (not rewrite), we host (they don't have FID), async contract (POST job, poll result).
Aligned on the open questions to put to the model team: where does wrapper code live, whose verdict wins, data classification, which evaluator first.
Discussed retention — traces expire in 2 weeks. Need a plan before the model team asks.

Key Decisions:

Presentation is ready. Rahul to present, Kaz to support.
Agreed to be transparent about gaps (1 production evaluator vs their 11, 74% benchmark vs 85% trust gate).
The framing should be complementary, not competitive — "two halves of one system built separately."

Action Items:

Finalise the presentation deck.
Schedule the model team meeting for the following week (Aug 3).
Prepare for pushback on retention and judge disagreement.
Meeting 5: Model Team Demo

Date: August 3 (Week 5) Participants: Rahul Vinayak, Kazhian Muthusami, Rohan Sharma, Kibashini (Model Team Lead), Model Team members Purpose: Present integration approach and get alignment on how to connect the two systems

What was presented:

Slide 1: Introduction — AHP Pro team, purpose of the session.
Slide 2: How one question flows — 5 steps across 7 components, every hop is a chance to hallucinate.
Slide 3: The differences — side-by-side comparison table (purpose, architecture, evaluators, judge prompts, datasets, reliability, reporting, tech stack).
Slide 4: The integration approach — wrapper class, deployment (we host, they own), async API contract. Sub-points on volume handling, results shape, and Phoenix data expiry.
Slide 5: Unified evaluation architecture — full diagram walkthrough top to bottom.
Slide 6: The code and architecture — layered FastAPI service, evaluator framework plugin layer.
Slide 7: Open questions — where does wrapper live, whose verdict wins, data classification, which evaluator first.
Live demo: evaluation pipeline, SSE streaming, annotation push-back to Overwatch.

Key Discussion Points:

Retention (first question from Kibashini): Traces expire in 2 weeks on Overwatch. What happens if test needs re-run and data is gone? No solid answer in the meeting. Kaz said valid point, will figure out during integration.
Scope question: Kibashini asked what our scope is — dev, production, or both? Kaz answered all three (developmental testing, change management, ongoing monitoring). Kibashini accepted but noted it means multiple environments and deployments.
Multiple judges: Kibashini's clear position — the integration framework should NOT decide which judge is right. It should be a platform. Any evaluator plugs in, gives its result, everything goes into the report. No winner, no loser. Each evaluator is separate. Even if model team has overlapping judges, they are still separate evaluators and part of the comprehensive report.
"Do we give you our judge or use your API?": Answered — they use our API. Their evaluators plug into our service through the wrapper. They use our interface.
Benchmarking pushback: Showed synthetic output benchmarking (Gemini generates test data, Claude judges). Kibashini said "for us that won't cut it, we still need human annotation at the end." Model-vs-model not enough proof.
Start small: Kibashini clearly said let's not try everything on day one. Pick something small, prove it, expand. Kaz agreed.

Key Decisions:

Start with a small piece of integration — one evaluator, one environment.
Integration framework is a platform, not a decision maker.
Their evaluators, our hosting.
Need to solve retention before next meeting.

Action Items:

Start integration with hallucination evaluator as first target.
Store raw trace data in MongoDB alongside verdicts (solves retention).
Drop "whose verdict wins" framing — each evaluator is independent.
Schedule technical follow-up with Kibashini's team (working session).
Clarify Freddy's implementation to avoid overlap.
Post-Meeting: Rohan's Follow-Up (Aug 3, same day)

Channel: Teams DM Participants: Rahul Vinayak, Rohan Sharma

Rahul's Questions:

Are MRM and Model Team separate teams?
Is Kibashini's team the one that maintains the Model Testing Framework?
Are we good to start with hallucination evaluator?

Rohan's Answers:

MRM is Level 2, Model Team is Level 1. Separate teams.
Yes, Kibashini's team maintains the Model Testing Framework. Correct audience.
For integration, use their evaluators, not ours. "I would use their eval instead of mine simply because this is also a piece of code which would require maintenance and they are on top of it. This will help our team to focus on features."

Impact on Direction:

Our hallucination judge (Claude 4.5) gets replaced by theirs in the integrated service.
Wrapper stays, hosting stays, contract stays. Evaluator inside is theirs.
No "disagreement" scenario anymore — single evaluator per type.
