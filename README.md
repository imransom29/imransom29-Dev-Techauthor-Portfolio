STAGE 7 — Index
Small store. Keys and pointers only.
#
Task
Status
Notes
65
Decide where the index lives — own instance or shared? It's small now
⬜
Ask platform
66
Build runs collection — run IDs, status, storage location, framework version
⬜

67
Build trace_index — trace_id, conversation_id, prompt_id, run_id, timestamp, environment, storage location
⬜
Nine fields, no content
68
Index for the queries that matter — by run, by trace, by time, by environment
⬜

69
Add checkpointing to runs so a failed long run resumes instead of restarting
⬜
Answers currently live in memory during PRE
70
Build audit_log — append only
⬜