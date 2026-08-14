iiStep 1   Advisor asks a question in AI-Teammate-UI
Step 2   AI-Teammate-BE runs → agent → retrieval → LLM → answer
Step 3   Trace is written to Tachyon Overwatch
Step 4   Our service pulls the trace from Overwatch (GraphQL)
Step 5   Evaluators run — hallucination, response length
Step 6   Verdict streams to our UI




Step 1   Someone prepares dataset.xlsx on their laptop
Step 2   Runs: python pre_X.py
Step 3   pre_X.py fires queries over websocket at the Supervisor Agent
Step 4   Traces land in Tachyon Overwatch
Step 5   Runs: python traces_extractor.py → traces.json
Step 6   Runs: python post_X.py
Step 7   post_X.py calls Tachyon APIs — LLM judge + cosine similarity
Step 8   Writes hallucination_result.xlsx, sensitivity_result.xlsx, and so on
Step 9   Emails the spreadsheet to an SME, who fills it in and mails it back
Step 10  Runs: agreement.py to compare LLM verdicts against human ones





Step 1   SME uploads a golden dataset in our UI
Step 2   Stored in MongoDB, versioned, status = draft
Step 3   SME reviews and approves rows → status = approved
Step 4   Optional: generate perturbations → derived dataset, linked to parent
Step 5   SME submits a run — dataset, environment, test types, baseline
Step 6   Job created in Mongo, job ID returned immediately
Step 7   Background worker picks it up

         PRE PHASE
Step 8   Worker writes the dataset to blob storage, generates a signed URL
Step 9   Calls their pre_X.py with that URL instead of a local path
Step 10  Queries fire at the Supervisor → traces land in Overwatch

         EXTRACT PHASE
Step 11  Calls their traces_extractor.py → traces.json to blob storage

         POST PHASE
Step 12  Calls their post_X.py with the traces URL
Step 13  Their evaluators run — LLM judge, cosine similarity
Step 14  Our evaluators run on the same traces
Step 15  Both sets of verdicts bulk-inserted into Mongo, tagged by source
Step 16  Progress incremented per batch, streamed to the UI

         COMPLETION
Step 17  Aggregate written to run summary; job marked complete
Step 18  SME reviews rows in our UI → annotations stored
Step 19  LLM-versus-human agreement computed automatically
Step 20  Compare screen diffs this run against the baseline






What we built
We built the Supervisor Evaluation Service. It connects to Tachyon Overwatch, pulls out the conversations the AI Teammate has had with advisors, and checks whether each answer was actually supported by the documents the assistant retrieved. Results show up on our own UI.
It's built, deployed, and running in the lower region.
The limitation: it can only look at conversations that have already happened in Overwatch. If someone is still building or changing the assistant, there's nothing in Overwatch to look at — so we can't help them at that stage.
What the model team built
They built a testing framework with eleven tests, written specifically for our Supervisor Agent. Hallucination, sensitivity, retrieval, tool correctness, cyber guardrail, and others. It sends questions to the Supervisor Agent, collects the results from Overwatch, and uses Tachyon APIs to score them.
The problem is where it runs. Every person on that team runs it from their own laptop — three programs in sequence from a terminal. Results come out as Excel files saved locally. When a subject matter expert needs to review, they get emailed a spreadsheet and email it back.
So nothing is shared, nothing is kept, and there's no way to compare this month's results against last month's.
Why we're combining them
We have a deployed service with two checks. They have eleven strong checks with nowhere to run them.
That's the change in scope. We're no longer just reading conversations from Overwatch and scoring them. We host their framework and become the place it runs.
What it looks like when it's done
Someone opens our UI and uploads a set of questions with the expected answers. An SME reviews and approves the list.
They pick which tests to run, which environment to run against, and submit. They get a job ID back straight away and walk away — a run of a few hundred questions takes minutes to hours, so nobody waits.
Behind the scenes, the questions go to the Supervisor Agent, the conversations land in Overwatch, the framework pulls them back out, the tests score them, and everything is stored in our own database.
When it's done, they open the results in our UI. The SME reviews row by row and records their verdict there — no spreadsheet, no email. The agreement between the automated scores and the SME's own judgement is calculated automatically.
And because everything is stored, they can compare this run against a previous one and see exactly which questions got better and which got worse.
What changes for the model team
Very little. Their tests stay theirs, and we're not rewriting their logic.
Three small adjustments so their programs can read the data we hand them instead of files on a laptop.
Both their checks and ours run, and both appear in the results side by side. Neither overrules the other, and the SME verdict sits alongside both.
Why this matters
Today the only reliable way to find out the assistant got worse is to notice it after it's live in UAT or production.
With this, the team finds out while they're still building and changing — which is cheaper to fix and lower risk. That development stage is also the part Freddy's Risk Oversight Engine doesn't cover, since that platform is focused on model validation and production monitoring.

