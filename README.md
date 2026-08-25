STAGE 2 — Model testing framework integration
Wiring their framework in. Mostly done.
#
Task
Status
19
Agree HTTP adapter approach — no code merge, separate repos
✅
20
Build FrameworkAdapter — HTTP client to the framework
✅
21
Lock the port topology — UI 5500, Backend 8000, Framework 8001, Agent 8082
✅
22
Wire list_test_types() — surface all 11 test types in the UI dropdown
✅
23
Build dataset upload — drag and drop in the UI
✅
24
Wire run kickoff — generate model_test_run_id, receive framework_run_id
✅
25
Wire the PRE phase — framework loops dataset rows, calls the agent
✅
26
JobStore writing parquet and json artifacts
✅
27
Wire trace pull after PRE
✅
28
Poll run status from the UI
✅
29
Fix retrieval — wrong search endpoint mapping
✅
30
Fix startup — Python interpreter mismatch, uvicorn missing
✅
31
Roll back the prompt simplification, honour the no-system-prompt-change constraint
✅