
Requirements — Storage Wrapper & Integration Contract
Build spec for the storage layer and the partner integration contract of the Supervisor Evaluation Service.
These requirements come from the integration review. The goal is to let partner teams (model team first, MRM later) run their own evaluations against data we extract, without us defining the shape of their results.
Context
The service extracts LLM traces from Tachyon Overwatch (Arize Phoenix). Overwatch clears traces after ~2 weeks, so extractions must be persisted in our own storage. Partner teams then run their evaluations against that stored data and hand results back to us. Their evaluation runs can take 2–3 hours, so the exchange must be asynchronous — nothing can be held on an open connection.
Requirement 1 — Storage wrapper (not a bucket)
Build a storage abstraction. The deliverable is a wrapper, not a specific backend. The underlying implementation must be swappable without changing any calling code.
Interface — the wrapper must expose these methods:
Python
Backends:
Implement a LocalStorage backend now — writes to a local system directory or file server.
The wrapper must be structured so a GCSStorage (Google Cloud Storage) backend can be added later behind the same interface. Do not build the GCS backend now; just make the abstraction clean enough that adding it is a config change, not a rewrite.
Selection: the active backend is chosen by configuration. No calling code should reference a filesystem path or a bucket directly — everything goes through the wrapper.
Acceptance:
Writing through the wrapper returns a location that can later be read back.
Nothing above the wrapper references the filesystem or a bucket directly.
Switching from LocalStorage to another backend touches only configuration.
Requirement 2 — Extraction into storage
The extractor pulls traces from Overwatch and writes them through the wrapper.
Store the complete raw trace JSON, unmodified. No field mapping or schema transformation at write time — the data shape changes over time as new agents and tools are added, and any mapping at extraction would break on those changes.
Write at fetch time, not lazily. The source expires, so an extraction that isn't persisted immediately is lost.
One JSON file per trace_id.
Generate a manifest per run listing the rows and their identifiers.
Stamp each stored blob with extracted_at and a schema version marker.
Acceptance:
A run produces a folder of raw trace JSONs plus a manifest.
A new field appearing upstream does not break extraction.
Requirement 3 — A small index over the storage
Storage holds the bulk content. Alongside it, maintain a small index that makes stored data findable without defining what's inside each blob. The index holds identifiers and pointers only — no trace content.
Fields to index per trace:
trace_id — one complete round
conversation_id / thread_id — the conversation it belongs to
run_id
prompt_id
timestamp
environment
storage_location — pointer to the raw blob
Also maintain a runs record: run_id, status, storage_location, row count, timestamps.
Acceptance:
Any stored trace can be found by run, trace, conversation, time, or environment.
The index contains pointers and keys only, never trace content.
Requirement 4 — Integration contract
The contract defines two things: where a partner reads the data from (entry), and where their output gets picked up (exit). It must be asynchronous.
Entry point — a partner is given:
A storage location holding the raw trace extractions for a run.
The run manifest listing rows and their identifiers.
Exit point — when a partner finishes, they write their results to a location and hand back a small payload. The payload is exactly these five fields:
Json
Everything inside result_location belongs to the partner. We do not read it at ingest time, and we do not validate its shape. We only store the pointer.
Ingestion endpoint — accepts the five-field payload above and records it in a result_index (pointer only, no content).
Asynchronous requirement — triggering a run returns immediately. The partner's evaluation runs on their own time (2–3 hours), writes to the exit location, and hands back the pointer. At no point is a connection held open for the duration of their run.
Signalling — support one of: we notify the partner when a run is ready, or the partner polls for readiness. (Which one is TBD with the partner — build so either can be wired.)
Acceptance:
A partner can be handed an entry location, read the data, evaluate on their own time, write results, and hand back the five-field payload.
No connection is held open for the length of a partner's evaluation.
We store pointers to partner results, never their content, and never redefine their output shape.
Explicitly out of scope for now
The GCS bucket implementation — local backend only for now, behind the same wrapper.
MRM onboarding — model team is the first partner; MRM comes later against the same contract.
Any enterprise / multi-LOB storage — scope is WIM only.
Design principles to hold
Don't define the structure, define the join. We control extraction and the exchange contract. We do not control what partners do with the data or the shape of their results. The only shared agreement is enough identifiers to correlate a result back to a row.
Extract whole, interpret late. Extraction is oblivious to data shape; interpretation happens at read time, where a failure is recoverable.
Storage is a handoff point, not a backup. It exists so multiple partner teams work off one shared copy of the same extraction.