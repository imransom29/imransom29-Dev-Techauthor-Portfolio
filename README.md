STAGE 4 — Stop parsing the stream
Kaz's steer. Removes a large amount of work.
#
Task
Status
Notes
41
Remove any stream-parsing logic — do not process the AG-UI response
⬜
Parsing it means re-implementing the AI Teammate UI
42
Generate a prompt_id per dataset row at submission
⬜

43
Carry session_id / conversation_id through the request
⬜

44
Fire the prompt, take only the completion acknowledgment
⬜

45
Look up the actual answer by prompt_id after completion
⬜
Source: MongoDB message_records or Overwatch
46
Confirm access to the AI Teammate MongoDB message_records collection
⬜
Or agree Overwatch is the source instead
47
Verify correlation works — prompt, expected answer and actual answer land together
⬜