Sprint — Integration Readiness
Goal: Be ready to integrate with the model team by next Tuesday.
Everything Rohan asked for, structured as deliverable stories.
Definition of ready-for-Tuesday: a partner can call the service to trigger extraction, the traces land in our own store as raw JSON, the index makes them findable, and there is a defined place for partners to pick up data and drop their results.
STORY 1 — Storage wrapper
As the platform, I need a storage abstraction so that where data lives can change without touching the rest of the service.
Why (Rohan): "Create a wrapper. It should have a storage, it doesn't have to be a bucket." Local now, bucket later, same interface. The work is not blocked on the bucket being provisioned.
Task
Detail
1.1
Define Storage interface — add, get, remove, list, exists. Rohan asked for more than read/write
1.2
Implement LocalStorage — writes to a system directory / NAS / file server
1.3
add returns the location so callers hold a pointer, not the data
1.4
Backend selected by config — swapping it later is a config change, no code change above
1.5
Path convention — traces/{run_id}/{trace_id}.json
Acceptance:
Writing through the wrapper returns a location I can read back from
Nothing above the wrapper references a filesystem or a bucket directly
Switching the backend touches only config
STORY 2 — Extraction into the store
As the platform, I need to pull traces from Overwatch and store the complete raw JSON, so nothing is lost when Overwatch clears its window.
Why (Rohan): "Extract the complete JSON itself and store it. Your extraction point is totally oblivious of the change, and only the reading time it has to be taken." Data shape keeps changing as new agents and tools appear.
Task
Detail
2.1
Extract the whole trace JSON, unmodified — no field mapping at write time
2.2
Write at fetch time, never lazily — the source expires
2.3
One JSON file per trace_id
2.4
Generate a manifest per run listing rows and their identifiers
2.5
Stamp each blob with extracted_at and a schema marker
2.6
All reads defensive (.get()), so a missing field degrades one row, not the run
Acceptance:
A run produces a folder of raw trace JSONs plus a manifest
Adding a new field upstream does not break extraction
A trace stored today is still readable after Overwatch has cleared it
STORY 3 — Index
As the platform, I need a small queryable index over the stored blobs, so data is findable without defining what's inside it.
Why (Rohan): Keep key indicators queryable, the rest as an unstructured block. Two IDs anchor everything — trace_id (one complete round) and conversation_id / thread_id.
Task
Detail
3.1
runs collection — run IDs, status, storage location, framework version
3.2
trace_index — trace_id, conversation_id, prompt_id, run_id, timestamp, environment, location. No content
3.3
Indexes for the real queries — by run, trace, time, environment
3.4
Checkpoint field in runs so a failed long run resumes instead of restarting
Acceptance:
I can find any stored trace by run, trace, conversation, time or environment
The index holds pointers and keys only — no trace content
STORY 4 — The integration contract
As a partner team, I need a defined way to trigger a run and pick up results, so I can integrate without depending on the internal shape of anything.
Why (Rohan): The contract needs two things defined — where partners call the service from, and where the output gets picked up. The minimum he confirmed: run ID, row/prompt ID, and a pointer. Everything inside the output stays theirs. And because a partner's evaluation may run two or three hours, it can't be an online session held open — the result has to land somewhere and be picked up.
Task
Detail
4.1
Define the entry point — where a partner calls to trigger extraction / a run
4.2
Publish the run location and manifest so partners can read the stored data
4.3
Define the exit point — where partners write their results
4.4
Ingestion endpoint accepting the five-field payload — run_id, row_id, prompt_id, result_location, produced_by
4.5
result_index — stores the pointer, never the content
4.6
Async by design — trigger returns immediately, result is collected from the store later, not held on an open connection
Acceptance:
A partner can trigger a run, read the stored data, and write results back against the contract
The service never holds a connection open for the length of a partner's evaluation
We hold pointers to partner results, never redefine their content
STORY 5 — Remove the competing verdict
As the platform, I should present the partner teams' verdicts, not compete with them.
Why (Rohan): A second verdict just creates multiple signals development teams can't act on. The risk teams' verdict gates release anyway. Keep the judge internal as a benchmark, not on the product surface. (Confirm the silent-benchmark part with Rohan.)
Task
Detail
5.1
Remove the Arize hallucination verdict from the UI
5.2
Keep the judge code in place, disabled from the surface
5.3
Confirm with Rohan whether it can run silently to measure agreement with the partner verdict
Acceptance:
No Arize verdict shown on the product surface
Judge code retained, not deleted
STORY 6 — Stored data as an input source
As a partner, I should be able to evaluate an existing stored extraction, not only a freshly uploaded dataset.
Why: Once traces are stored, the store becomes the input. A team re-running an evaluation after a change points at the stored run instead of firing every prompt at the agent again — which is exactly the change-management case.
Task
Detail
6.1
Add "stored extraction" as a source in the UI alongside dataset upload
6.2
A stored run can be selected and evaluated without hitting the agent again
Acceptance:
A user can pick a stored run and evaluate it directly
Re-running against stored data does not re-fire prompts at the agent
Not in this sprint — deliberately
Rohan was explicit on sequencing.
Deferred
When
GCS bucket implementation
After the model team integration works
Bucket auth / network / lifecycle questions to platform
With the bucket work, not now
MRM onboarding
After the bucket
Enterprise / other LOBs
Out of scope — WIM only. Other teams replicate the pattern themselves
Sequence Rohan set
Code
Day plan to Tuesday
Day
Focus
Mon–Tue
Story 1 (wrapper + LocalStorage), Story 2 (extraction)
Wed–Thu
Story 3 (index), Story 4 entry/exit points
Fri
Story 4 ingestion endpoint, Story 5 remove verdict, Story 6 stored source
In parallel
Chase TAC016 with the agent team; Ping auth
By Tuesday: wrapper working, extraction producing raw JSONs, index queryable, entry and exit points defined, ingestion endpoint live. That's the "be ready" bar.