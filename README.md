SLIDE 1 — "What problem we are solving?"
Script:
"Kaz, let me quickly explain what I've understood about the Overwatch Evaluation Framework.
Right now, our supervisor agent runs on Gemini 2.5. It's working fine. But models keep getting retired. So tomorrow, if we switch to a new model, how do we know it'll work just as well?
We can't check every answer manually. That's not practical.
So we're building an automated exam system for our agent. We send test questions to the agent. Overwatch checks the answers — is there hallucination? Is the response relevant? Is it toxic? Then we show the scores to the user. They decide if the new model is ready or not."

SLIDE 2 — "When is this triggered?"
Script:
"This is not regular testing. It's on-demand only. We trigger it in two cases:
One — when we switch models. Like Gemini 2.5 gets retired, we move to something new.
Two — when we change the system prompt or agent logic.
Now let me walk through the flow.
User uploads test cases — just questions and expected answers. Our service sends each question to the agent. Agent gives a response.
Since the agent is connected to Overwatch through TAWK, every question-answer gets recorded as a trace. Overwatch sees these traces and automatically checks — hallucination? Relevance? Toxicity?
Then our service pulls those scores from Overwatch and shows the user a report. Done."

SLIDE 3 — "How to Find Traces in Chatbot Responses?"
Script:
"The whole thing comes down to three steps.
Step 1 — Connect the agent to Overwatch. We use TAWK for this since it works with LangGraph directly. Once connected, the agent starts sending traces automatically.
Step 2 — Run the test cases. User uploads questions, agent answers them, and all traces go into Overwatch. Overwatch evaluates each one.
Step 3 — Pull the results. We call Overwatch and get back the scores — hallucination, relevance, toxicity. That becomes our evaluation report."

SLIDE 4 — "TAWK Overwatch Features"
Script:
"Why TAWK? Because it's not just for tracing. It gives us five things in one package:
Tracing — records what the agent does and sends it to Overwatch.
Authentication — secure connection to Tachyon.
Guardrails — blocks harmful content.
Memory — remembers past conversations.
Session Handling — manages user sessions.
Right now, we mainly need the tracing part. But once TAWK is in, everything else is ready to use too."

SLIDE 5 — "Onboarding Process"
Script:
"Before we start, we need access to Overwatch. There are four steps:
First — raise a ticket on the CASE portal. Request type is 'Observability and Evaluation Onboarding.' Reference ticket is CASE-48949.
Second — once the ticket is done, we get role-based access through AIMS.
Third — we get our credentials — Space ID and API Key — from the Fargo Foundations team. Without these, the agent can't send traces.
Fourth — if we want guardrails, same CASE portal process.
So Kaz, two things I need from you:
One — are we already onboarded? Do we have the Space ID and API Key?
Two — does Overwatch have an API to pull metrics? That decides how I build the service.
Once I know these two things, I'll have the full plan ready."
