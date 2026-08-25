STAGE 8 — Handoff
The contract with the model team.
#
Task
Status
Notes
71
Agree with the model team where they write results
⬜
Same bucket different prefix, or their own?
72
Agree file granularity — one per row or one per run
⬜
Parquet is already a convention on both sides
73
Agree notification — do we call them, or do they poll?
⬜

74
Publish run location and manifest via API
⬜

75
Build the ingestion endpoint accepting the five-field payload — run_id, row_id, prompt_id, result_location, produced_by
⬜
This is the entire contract. Hold this line
76
Build result_index — stores the pointer, never the content
⬜

77
Run one test type end to end — extract, handoff, evaluate, ingest, correlate
⬜
Kibashini asked for a small first slice. Agree it, don't assume it
STAGE 9 — Dashboard rework
#
Task
Status
Notes
78
Remove the arise verdict from the UI
⬜
Agreed with Rohan
79
Confirm with Rohan whether the judge can keep running silently as an agreement benchmark
⬜
Ask openly, don't just do it
80
Read results from result_location at display time, not ingest time
⬜
So a format change breaks rendering, not stored data
81
Render per-row detail — query, expected answer, actual output, their score
⬜

82
Add a distinct status for rows that failed upstream
⬜
A blocked run must not read as a bad model
83
Split React components into separate files
⬜
Bishal's review
84
Add sidebar navigation
⬜
Bishal's review
85
Move "Push to Overwatch" from the header to individual rows
⬜
Bishal's review
86
Remove Evaluator Visibility, Rollout Telemetry, duplicate health indicators, timer, latency card
⬜
Bishal's review
87
Expandable trace view — query, retrieved context, model output as separate panels
⬜

STAGE 10 — KPIs
#
Task
Status
Notes
88
Extract score fields from their result outputs
⬜
Whatever field they tell us to read
89
Aggregate by dimension — test type, environment, time window, producing team
⬜

90
Build kpi_snapshots with produced_by so teams' numbers sit side by side without reconciliation
⬜

91
Scheduled aggregation job
⬜

92
Dashboard view showing current scores without running anything
⬜
Tom's ask
93
Trend view over time
⬜

94
Segment KPIs by user type where the data supports it
⬜
Rohan described KPIs as per-segment, not one global number
STAGE 11 — Golden dataset
#
Task
Status
Notes
95
Add "Add to Golden Dataset" action on evaluated rows
⬜

96
Build golden_dataset collection — context copied in, not referenced
⬜
A baseline must stand alone
97
Version it, immutable once published
⬜

98
Export as CSV / Excel / JSON
⬜

99
Keep the entry schema flexible
⬜
Rohan warned the dataset shape will drift as tools and skills change
100
Removal flow, logged in audit
⬜

STAGE 12 — Human review
#
Task
Status
Notes
101
Build sme_reviews — confirm or override a verdict
⬜

102
Mandatory justification on override
⬜

103
Never modify the original verdict — the review sits alongside
⬜

104
Compute judge-versus-human agreement rate
⬜
This is how 74% becomes defensible
STAGE 13 — Second team
#
Task
Status
Notes
105
Onboard MRM against the same five-field contract
⬜
Second line of defence, they approve use cases
106
Support their prompt-level test cases
⬜
They'll run their own case types
107
Verify adding a team is configuration, not development
⬜
The real test of the pattern
108
Swap storage backend from local to GCS in a real environment
⬜

STAGE 14 — Hardening
#
Task
Status
Notes
109
RBAC — Viewer, SME Reviewer, Operator, Admin
⬜

110
Structured logs with correlation IDs across UI, backend, framework, agent
⬜

111
Metrics — job throughput, latency, error rate, queue depth, cost
⬜

112
Alerts — scheduled job failure, judge error rate, spend breach
⬜

113
Retry with backoff and a circuit breaker on judge calls
⬜

114
Cost telemetry and per-team spend limits
⬜
Gemini Pro is $0.74/scenario vs Flash at $0.07
115
Test coverage on evaluation and persistence paths
⬜
Silent bugs here produce wrong verdicts nobody notices
116
Migrate to the dedicated repository
⬜
Kaz's direction
117
Close open JIRA subtasks with OCP evidence attached
⬜
Kaz's direction
118
Promote to UAT and share the URL with the product team
⬜
Tom's ask
119
Request a dedicated Overwatch space ID
⬜
Currently shared across projects
120
Write the runbook and deployment docs
⬜