
On overlap with RISE: RISE shows us what the agent did. It can’t tell us what the agent should have done, because that needs knowledge of AI Teammate’s tools and GraphQL queries. We are adding an Expectation Generator. Before a test run, a separate model reads the agent’s tool registry and writes the expected tool calls and queries for each prompt. The Studio then compares the actual trace from Overwatch with that expectation. So RISE gives us the actual side, and we add the agent-specific expected side on top.

On adoption: the biggest effort in testing today is writing expected results by hand for every prompt. The generator removes that step. Teams only give prompts, and a developer or SME reviews the expectations instead of writing them.

On release tracking: every run saves a fingerprint of the system prompt, tool registry and model. If any of them change between two runs, we can see it. Once this runs in the pipeline, we will add the build ID too.

Still open: SSE through Apigee and where we store credentials. We will come back on those separately.
