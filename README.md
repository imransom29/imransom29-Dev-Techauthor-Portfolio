STAGE 5 — Storage wrapper
The load-bearing piece. Not blocked on anything — start in parallel with Stage 3.
#
Task
Status
Notes
48
Define the Storage interface — write(key, data) → location, read(location) → data
⬜
Keep it this small
49
Implement LocalStorage backend
⬜
Rohan explicitly approved starting local
50
Make the backend config-driven so nothing above the wrapper knows which is active
⬜

51
Agree a path convention — traces/{run_id}/{trace_id}.json
⬜

52
Ask Sandhya / platform: GCS auth method — Workload Identity or service account key in Vault?
⬜
Two very different implementations
53
Ask: bucket name, GCP project, per-environment separation
⬜

54
Ask: network path from OCP Garland 6 to GCS — proxy or direct?
⬜
Bank egress is usually restricted
55
Ask: lifecycle rules on the bucket — any auto-delete?
⬜
Auto-delete would defeat the whole retention purpose
56
Ask: encryption — Google-managed keys or CMEK?
⬜

57
Implement GCSStorage backend
⬜
Roughly 20 lines once auth is settled
58
Swap backend by config and verify nothing above changed
⬜