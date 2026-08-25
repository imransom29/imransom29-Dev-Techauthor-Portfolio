STAGE 6 — Extraction
Write it down before it expires.
#
Task
Status
Notes
59
Rewrite the extractor to store the complete raw JSON, unmodified
⬜
No field mapping at extraction time
60
Write at fetch time, never lazily
⬜
The source expires — there is no second chance
61
One JSON file per trace_id
⬜
Rohan's granularity
62
Generate a manifest per run listing rows and their identifiers
⬜

63
Add extracted_at and a schema version marker to each blob
⬜
So future reads know which format they're looking at
64
Make all reading defensive — .get() everywhere, one missing field degrades one row not the run
⬜