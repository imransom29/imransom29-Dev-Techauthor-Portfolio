<img width="546" height="174" alt="Screenshot 2026-07-31 at 8 38 40 PM" src="https://github.com/user-attachments/assets/7b02f582-3e7d-4d11-b313-987620fc0537" />


<img width="561" height="258" alt="Screenshot 2026-07-31 at 8 39 07 PM" src="https://github.com/user-attachments/assets/8211c43c-5e73-4c4a-b402-00a9dfe757e2" />



<img width="588" height="247" alt="Screenshot 2026-07-31 at 8 39 40 PM" src="https://github.com/user-attachments/assets/ce90f780-1891-4e82-9a70-6a03f04f73d3" />


<img width="605" height="344" alt="Screenshot 2026-07-31 at 8 39 58 PM" src="https://github.com/user-attachments/assets/e66e3330-e092-47db-9614-b1aacd0625f4" />



<img width="643" height="247" alt="Screenshot 2026-07-31 at 8 40 20 PM" src="https://github.com/user-attachments/assets/aaeb2d2e-1769-4313-8948-58a5810581c0" />

[Unified_Evaluation_Platform_v2 (1).pptx](https://github.com/user-attachments/files/30594481/Unified_Evaluation_Platform_v2.1.pptx)



Rohan, I went through their code — the orchestrator already produces a run manifest with artefact paths rather than inline results, and the agreement metrics come back as a flat scalar dict. So the shape varies by evaluator.

The part I cannot work out from the code is how we carry the file-based ones across an API boundary. Their paths are local to wherever the run happened, so we cannot use those directly.

Do we hand back a signed URL or a fetch endpoint, or do we assume both sides read from a shared store and just pass a reference?



Here's the message in simple English:

Rohan, wanted to clear one thing about the response shape.

For the simple evaluators it is straightforward. Hallucination gives a verdict and a score. Agreement metrics give four numbers. All of that fits in a JSON response easily.

But for something like sensitivity or performance, the result is a big table — could be 500 rows with full text in each. Their code today just writes it to an Excel file and returns the file path. That works locally, but over an API it will not, because the file sits on their machine and our service cannot read that path.

So for these bigger results, which way should we go?

Send the full data inline in the JSON response, which could get very large.

Or return a download URL that we fetch separately.

Or have both sides read from a shared store, and the response just carries a reference to it.
