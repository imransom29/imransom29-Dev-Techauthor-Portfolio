Step 1   Advisor asks a question in AI-Teammate-UI
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


