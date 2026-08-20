MongoDB for the Supervisor Evaluation Service
Rahul Vinayak, AHP Pro
BZSD-333
The problem
My service doesn't save anything right now.
It pulls a trace from Overwatch, checks it, shows the verdict, done. Nothing stored.
That was fine for a demo. Not fine now. Overwatch deletes trace data after 2 weeks.
So I need my own place to keep things.
Why now
This came up in four separate reviews with different teams. Same conclusion each time — we can't use Overwatch as the repository because of the retention window, so results have to sit in our own ecosystem.
Five things are stuck until this exists:
Continuous KPI scores — no history to aggregate
Golden dataset — nowhere to put the examples
SME review and override — needs to persist and be auditable
Point-in-time evaluation — needs the old context, not today's data
Model team integration — their jobs need somewhere to write results
Two of those were confirmed as targets by the product owner. Nothing else can start until this is in place.
The collections
Going through each one — what it's for and what goes in it.
1. traces
Why I need it: Overwatch deletes after 2 weeks. Anything I want to look at later, I have to copy locally the moment I fetch it. There's no going back for it.
Fields:
Field
Type
Notes
trace_id
string
From Overwatch. Unique
thread_id
string
Groups traces in one conversation
environment
string
lower / uat / prod
fetched_at
timestamp
When I copied it
trace_timestamp
timestamp
When it actually happened
question
string
What the user asked
retrieved_context
array
The policy chunks that came back. Each has chunk text, source doc, score
model_output
string
What the model answered
spans
array
Nested. Retrieval span, generation span, tool call spans
tool_calls
array
Which tools ran, what params, what came back
model_metadata
object
Model name, version, token counts
is_redacted
boolean
Whether account numbers were masked
Size: biggest collection. The retrieved context is what makes it big — several policy chunks per trace.
Access: written once when fetched, never updated. Read by trace_id or filtered by date and environment.
2. evaluations
Why I need it: this is the actual output of the service. Verdicts have to survive so KPIs can be tracked over time and so MRM can ask me to explain a result months later.
Fields:
Field
Type
Notes
evaluation_id
string
Unique
trace_id
string
Links to the trace
evaluator_name
string
hallucination, response_length, retrieval_relevancy etc
verdict
string
PASSED / REVIEW / FAILED / NOT_EVALUABLE
score
number
Optional. Some evaluators give a number, some don't
explanation
string
Why the judge said what it said
judge_model
string
Which model ran it
judge_model_version
string
Needed for reproducibility
framework_version
string
If it came from the model team's framework
evaluated_at
timestamp

result_payload
object
Free-form. Different per evaluator
supersedes
string
If this corrects an earlier record, points at it
Why result_payload is free-form: the model team has 11 test types and each produces a different shape. Some combine an LLM verdict with cosine similarity. One adds TF-IDF. Another adds ROUGE. Fixing the schema means a migration every time a test type is added, and they will keep getting added.
NOT_EVALUABLE is there because of redaction. If the answer references an account number that's masked, I can't judge whether it was right. Marking that FAILED would be wrong and would skew the scores.
Nothing here ever gets updated. Corrections are new records with supersedes pointing at the old one. That's an MRM requirement — an editable result has no audit value.
3. golden_dataset
Why I need it: the product owner asked for the product team to pick good examples from evaluated runs and build a golden set. That's the baseline everything gets measured against later.
Fields:
Field
Type
Notes
entry_id
string
Unique
dataset_version
string
v1, v2 etc
source_trace_id
string
Which trace it came from
question
string

context
array
The chunks, copied in — not a reference
expected_answer
string
The confirmed correct answer
curated_by
string
Who added it
curated_at
timestamp

status
string
draft / published / retired
notes
string
Optional
Why context is copied, not referenced: if the trace changes or gets cleaned up later, the golden entry has to still make sense on its own. It's a baseline, it can't depend on something else staying put.
Versioned and immutable once published. If the ruler changes silently, every comparison made with it stops meaning anything.
4. sme_reviews
Why I need it: an LLM judging another LLM doesn't satisfy MRM. If someone asks how we verified the model is correct and the answer is "another AI checked it", the next question is who checked that AI. That doesn't end. There has to be a human somewhere in the chain.
Also — this is how I prove my judge is any good. My local benchmark is 74% right now. Agreement rate against human reviewers is what turns that into something defensible.
Fields:
Field
Type
Notes
review_id
string
Unique
evaluation_id
string
Which judge verdict is being reviewed
trace_id
string

sme_verdict
string
What the human said
agrees_with_judge
boolean
Computed
justification
string
Required when overriding
reviewed_by
string

reviewed_at
timestamp

The judge verdict never changes. The override sits alongside it. I need both to measure how often the judge is wrong — if the override replaced it, that measurement disappears.
Justification is mandatory on override. An override with no reason is as unauditable as no review at all.
5. kpi_snapshots
Why I need it: the ask was that KPIs run continuously so current scores can be stated at any point. If the dashboard recalculates from raw evaluations every time someone opens it, it'll be slow and get slower as data grows.
Fields:
Field
Type
Notes
snapshot_id
string
Unique
window_start
timestamp

window_end
timestamp

environment
string

evaluator_name
string

total_evaluated
number

passed / review / failed / not_evaluable
number
Counts
pass_rate
number

avg_score
number
Where applicable
computed_at
timestamp

Small collection, kept forever. The trend is the point — one number tells you nothing about direction.
Time-series shaped. Most queries are "last 30 days of this evaluator in this environment".
6. jobs
Why I need it: scheduled runs and async jobs need tracking. A time-range extraction can be 200,000 rows and take hours — I can't hold an HTTP connection open for that. Caller gets a job ID and polls.
Fields:
Field
Type
Notes
job_id
string
Unique
job_type
string
scheduled / on_demand / batch
status
string
queued / running / completed / failed / cancelled
submitted_by
string
User or scheduler
parameters
object
What was asked for
extraction_level
string
prompt / thread / time_range
trace_count
number
How many processed
checkpoint
object
Where it got to, for resume
result_location
string
Reference for large results
error_detail
string
If it failed
started_at / completed_at
timestamp

Checkpoint matters. A 4-hour job that fails at hour 3 and restarts from zero will never finish.
Only collection with a retention limit — 12 months, then archive. Operational data, not much value after that.
7. user_feedback
Why I need it: there's an open discussion about collecting feedback in the chat. It won't be mandatory — the position was that governance can't be pushed onto end users, and forcing it means people stop using the tool. So it'd be sampled.
Value is comparing what the judge said against what the user actually thought.
Fields:
Field
Type
Notes
feedback_id
string
Unique
trace_id
string
What it's about
thread_id
string

rating
string
positive / negative
comment
string
Optional
submitted_at
timestamp

Small. Sampled, not every conversation.
Blocked on another team — the chat UI has to build the prompt. Sampling rate not decided. Adding the collection now so it's ready.
8. audit_log
Why I need it: MRM will ask who did what. Also covers golden dataset changes, config changes, manual job triggers.
Fields:
Field
Type
Notes
log_id
string
Unique
actor
string
Who
action
string
What
target_type
string
Which collection
target_id
string
Which record
before / after
object
For config changes
timestamp
timestamp

Append-only. Never updated, never deleted except by firm retention policy.
Why MongoDB and not a normal database
A trace is a tree. Trace has spans, spans have chunks and tool calls. Split that into tables and showing one trace means joining across 4-5 tables every time.
Result shapes vary. Covered above under evaluations — 11 test types, 11 different result structures, more coming.
Size swings a lot. Prompt level is about 1 row, thread level about 400, time range about 200,000. No fixed size to design around.
What else I looked at:
Postgres JSONB — would work. But most of it is semi-structured, so I'd get little schema benefit and pay migration cost per new test type
Object storage only — can't query. "Show me last week's failures" means scanning everything
Keep using Overwatch — that's the problem I'm trying to solve
How much space
One thing first — the trace count is solid, from published figures. The per-document size is my estimate, I haven't measured it. I'll measure before we finalise. Saying it now so nobody plans around a number I made up.

Traces/day
Per year
Now (pilot)
500
~7 GB
Scaled
5,000
~120 GB
Full WIM
50,000
~1.2 TB
Want to start with 250 GB, with a clear way to grow.
More than pilot needs, I know. But the plan is for other WIM teams to deploy their own copy. Size for pilot and I'm back in a year.
Fine to start smaller — just tell me the process to expand.
Retention
Everything forever except jobs (12 months) and audit_log (whatever firm policy says).
Traces forever because that's the whole point. Evaluations forever because MRM can ask me to explain an 8-month-old result.
How it gets used
Writes — mostly inserts, rarely updates. Nothing gets edited in place. One thing to watch: a batch job can insert 200,000 documents at once.
Reads — about 70:30 read heavy normally, flips during batch runs.
Common queries:
Dashboard pulling latest scores — often, hits kpi_snapshots
Filter evaluations by verdict and date — often
One full trace with all its evaluations — medium
Trend over a window — medium
Golden dataset export — rare
Indexes I think I need:
traces: trace_id unique, fetched_at, environment
evaluations: trace_id, evaluator_name, compound on verdict + evaluated_at
kpi_snapshots: window_start + evaluator + environment
jobs: job_id unique, status
audit_log: timestamp, actor
Tell me if that's wrong.
Uptime and backup
99.5% business hours
RPO 24 hours — daily backup is enough
RTO 4 hours — service goes read-only, doesn't fully die
Encryption in transit and at rest
Security
Data classification — open, and I'm saying it upfront. It was raised in a review a few weeks back and nobody has picked it up. No owner yet. I'm chasing it separately. If it blocks provisioning I'd rather know now than halfway through.
Client data — traces can have client-related content. Account numbers redacted in prod, permanent. Ticket in progress to turn it off in non-prod only.
Redaction — the service will never try to undo a redacted value.
Credentials — all through Vault. Nothing in code, config or images.
Access — 4 roles. Viewer reads, SME Reviewer annotates and curates, Operator runs jobs, Admin configures. Prod access separate from non-prod.
Network — needs to reach it from OCP Garland 6.
My questions
Bit of a list. First 4 matter most.
Basics
Is MongoDB approved here for this kind of data? Which version?
Managed or self-hosted on OCP? Who runs it?
If it's not approved — what should I use? And if there's no document store at all, what do I do about the schema problem?
How long from approved request to something I can connect to?
Size and cost
5. What sizes are available? How do I grow later?
6. Charged back to the team? Provisioned or used?
7. Separate instances for lower region, UAT and prod, or can one work?
8. Connection limit? Problem when the app scales to multiple pods?
Backup
9. Standard backup schedule? Can I change it?
10. How long does restore take at this size? Tested?
11. Point-in-time recovery available?
12. Do TTL indexes work, or is archival separate?
13. Archive tier for old data? How do I get it back?
Security
14. Who manages encryption keys? Rotation?
15. What data classification approval do I need first? Who signs it?
16. How do I get a service account? How does it connect to Vault?
17. What audit logging do I get at the DB layer?
18. Restrictions on which environments can hold unredacted client data?
Running it
19. What monitoring is default? What do I instrument myself?
20. When do patches and upgrades happen? How much notice?
21. DB goes down at 2am — who gets the call, you or me?
22. Runbook for common failures?
Later
23. If other WIM teams deploy their own copy, self-service or a request each time?
24. Orchestra IDP path?
What you'll probably ask me
Data classification? Open, see above.
PII? Possibly inside trace content. Redaction permanent in prod.
How big, how fast growing? ~7 GB/year now, ~120 GB/year scaled. Asking 250 GB. Per-document size not measured yet.
Read or write heavy? Insert heavy with big batches. 70:30 read otherwise.
Uptime? 99.5% business hours. Goes read-only, doesn't die.
RPO RTO? 24 hours, 4 hours.
Who else accesses it? Only my service. Other teams go through my API, never the DB.
Which environments? Lower region, then UAT, then prod.
Why not an existing shared instance? Could work — that's question 7.
Replacing anything? No. Service is stateless today.
What if it's late? 5 requirements stop, including both confirmed product targets.
Next steps
Measure actual trace size on real traces — me
Confirm MongoDB is approved at this classification — you
Find an owner for data classification — escalating separately
Shared or dedicated instance — you
Agree size, backup, cost — both
Provision lower region — you
Happy to do a call if that's easier. Full detail is in the SRS, section 4.
