STAGE 3 — Unblock
Nothing downstream works properly until these clear. Start here.
#
Task
Status
Notes
32
Fix Model Armor TAC016 — rephrase the prompt-injection defence wording in prompts.py, keep the defence meaning intact
⛔
Agent team. Do NOT strip the defence — that would mean testing a different agent than production
33
Re-run PRE and confirm rows come back with real answers, not the generic error
⬜
Depends on 32
34
Confirm search_infomax retrieval returns chunks once the agent is unblocked
⬜
Depends on 32
35
Implement Ping authentication in the evaluation UI
🔄
The service is currently unauthenticated — anyone can use it
36
Handle the token chain — access token → OPA → backend → JWT
⬜
Depends on 35
37
Implement token refresh — JWT ~5 min, access token ~1 hr, refresh token ~8 hrs
⬜
Depends on 36
38
Adopt the AI Teammate request schema as-is rather than inventing validation
⬜
Kaz was explicit on this
39
Confirm the non-prod retention window in Overwatch — same two weeks as prod, or shorter?
⬜
Platform team
40
Escalate data classification — no owner assigned, gates production