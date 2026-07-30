partly yes. He showed a preprocessing and parsing function where you write Python to pull fields out of the trace. In his demo he pulled name, query and output. When I asked him about span level versus trace level, he said it is up to you, you can pick a span or a trace, and write a Python script to segment and preprocess based on what you want to evaluate. So basic field extraction is there and the level is configurable.

Aggregation of checks on attributes — no, I did not see that. What he showed was hallucination risk plotted over time, and then drilling into one trace to see its inputs, outputs and risk score. There was nothing about grouping or aggregating checks across attributes like theme, entitlement, thread ID or prompt ID. He also did not mention it as something coming later.

Shift left — not at all. The entire demo was framed as real time production monitoring. He never mentioned Dev or UAT even once. Everything was about watching models that are already live.

So on your point, I think the aggregation piece plus shift left is where we are actually different. The evals themselves are standard, he can do those. The attribute extraction is partly there but shallow. But aggregating model team checks across attributes, and doing that before production, was not part of what he showed.

One caveat — it was a short call and he was rushing to his next meeting, so I cannot say for sure it does not exist. I can only say it was not in the demo and did not come up in conversation.
