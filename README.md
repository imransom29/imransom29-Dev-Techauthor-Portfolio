[Integration_Approaches_Supervisor_Evaluation_Service.docx](https://github.com/user-attachments/files/30574214/Integration_Approaches_Supervisor_Evaluation_Service.docx)



Email 1 — Bishal ko (UI feedback)

Subject: Supervisor Evaluation Service UI — noted your feedback

Hi Bishal,

Thank you for taking the time to go through the UI in detail today. Very useful feedback. I have noted everything down and wanted to confirm my understanding so I do not miss anything.

Things I will remove

Evaluator Visibility section, and the Rollout Telemetry section. You are right that the Rollout Telemetry numbers were also not matching with the graph above, the hallucination rate was showing 28.6 percent in one place and 0 percent in the other.

The Judge Model and Suggestion Model labels from the top bar, since the user does not need to see which model we are using in the background.

The API Connected and Healthy indicators, since both were showing the same thing.

The timer, and the latency card.

The charts for now, as discussed I will comment them out and we can revisit later.

I will also make sure the backend API link does not show up in the URL.

Things I will change

Push to Overwatch button will move from the top into each evaluation row. So when the user expands a row and reviews it, they can push only that one. This also fits better with our flow since the SME will review before pushing.

I will add a sidebar navigation similar to what Tachyon has. Home page will keep the live event stream, the run evaluation control and the benchmarking pipeline. Evaluation Results will move to its own page along with the push button.

Code changes

I understood your point about everything sitting in one file. I will break the components into a proper folder structure so that a state change in one part does not re render the whole page.

One thing I need to confirm

On deployment, you mentioned we need to check whether this goes as a separate UI or merges with the admin UI. I will check with Kaz and Deepak on this and come back to you. Once that is clear, I will need your help with the CD repo, the YAML file and the URL whitelisting as you mentioned.

I will start working on the above and will share once done. Please let me know if I have missed anything.

Thanks again for your time.

Regards,
Rahul

Email 2 — Rohan ko (cc Kaz, David) — architecture

Subject: Integration approach for Supervisor Evaluation Service — my understanding, please correct me

Hi Rohan,

Thank you for the detailed walkthrough the other day. I have tried to write down my understanding of what you explained, and I would like you to correct me wherever I have got it wrong.

What I understood from our conversation

The integration should happen at API level, not at file level. Both teams keep their own repositories and their own release cycles. What sits between us is a contract, not shared code.

The model team should expose their evaluators through a Swagger interface. That Swagger should be flexible on the input side, so it can take a file path, a NAS location, a MongoDB reference or the data directly. How they define their endpoints internally is their decision. Some may evaluate at prompt level, some at thread level, some over a time range. From our side we should not need to care about that, we just call the endpoint with a job identifier and the data.

On our side, the responsibility is extraction and integration. We pull traces from Overwatch at whichever level is needed, deliver them in whatever format the consumer wants, call their APIs, collect the results, and push everything forward to the dashboard, to Overwatch as annotations, and into GitHub workflows so a developer can see the metrics as part of their normal flow.

The main benefit of doing it this way is that both sides can grow independently. They can add new evaluators or change their scoring methodology without touching our service, and we can improve extraction and the platform without waiting on them.

Please tell me if I have understood this correctly, or if I have missed something important.

Attached document

I have also attached a document that records every integration approach we considered, in the order we considered them. For each one I have written what the idea was, why it looked good, and what actually blocked it.

We looked at Swagger first, then a shared library, then file exchange, then a Kafka based approach, then containerised evaluators, and finally OpenTelemetry as a way of storing results.

What came out of that exercise was that the first four all had the same underlying problem. Each of them asked the model team to deploy and run something they have never deployed before. Once we saw that, Swagger came back as the right target, but with the understanding that we should provide the scaffolding rather than expect them to build it from scratch.

The document also covers how we would handle slow evaluators without needing Kafka, and how we would handle failures and retries.

What I would like from you

Please review the document and tell me where my thinking is off. Specifically, I am unsure about two things. First, whether the interim container approach is a reasonable bridge or whether it creates more problems than it solves. Second, whether the retry and status table approach is enough for reliability or whether we are underestimating something there.

Once we are aligned, I will take this to the model team as part of the demo discussion.

Thanks,
Rahul
