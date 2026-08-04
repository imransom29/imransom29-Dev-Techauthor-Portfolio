AI Teammate Evaluation Service — Alignment Discussion with Model Risk Management (Freddy Lecue)

Date: [add date]
Attendees: Rahul [surname], Freddy Lecue (Model Risk Management, Second Line)
Meeting type: 1:1 alignment / strategy
Status: Escalation pending

1. Discussion
1.1 Purpose of the meeting

Introductory alignment call following an internal referral (via David). Objective was to compare the AI Teammate evaluation service currently under development against existing capability within Model Risk Management (MRM), and to identify overlap.

1.2 Background on the MRM initiative
Freddy's team sits in the Second Line of Defence (risk), while our team sits in the First Line (product build).
Stated team mandate: evaluate and monitor every model across the firm — CIB, CCB, Wealth Management, and all other lines of business.
Sponsorship: Chief Risk Officer, reporting directly to Charlie Scharf (CEO).
The platform is a firm-wide capability with an established production timeline, not a line-of-business tool.
1.3 Demonstrations exchanged

Our side (Rahul):
Overview of the AI Teammate evaluation service — trace ingestion from Overwatch, hallucination detection, annotation write-back to Overwatch, live streaming view, and the demo previously given to Deepak.

MRM side (Freddy):
Live walkthrough within the Arize workspace covering:

Model selection across any onboarded model (two shown: a document analysis model and AI Teammate)
Custom metric creation, including preprocessing and parsing logic
LLM-as-judge configuration using any Tachyon model
Application of metrics across all traces
Hallucination risk trending over time
Drill-down into individual traces
MRM VelTest library — reusable Python functions for rapid onboarding of new models
1.4 Overlap assessment
Capability	Our service	MRM platform	Overlap
Trace source	Overwatch	Overwatch	Full
Evaluation method	LLM-as-judge	LLM-as-judge	Full
Live streaming	Yes	Yes	Full
Trace-level drill-down	Yes	Yes	Full
Trend charts / dashboards	Yes	Yes	Full
Metric configuration	Fixed (hallucination)	Fully customisable	MRM broader
Scope	AI Teammate only	Firm-wide, all models	MRM broader
Sponsorship	Kaz / Deepak	Chief Risk Officer	MRM higher

Freddy explicitly characterised the core evaluation loop as equivalent to his platform's real-time monitoring capability.

1.5 Differentiated capability in our service

The following were not present in the MRM demonstration and remain unique to our build:

Remediation suggestion generation — guidance produced against failed spans.
Annotation write-back to Overwatch — evaluation verdicts returned to the source system.
Judge benchmarking pipeline — the LLM judge is itself evaluated (currently 74% accuracy against an 85% trust gate). This is a governance control, not just a feature.
Model team integration — direct API integration with the 11 AI Teammate evaluators.
Purpose-built UI — noted positively by Deepak; the MRM platform uses the default Arize interface.

Caveat for the record: these are capabilities, not a platform. They could in principle be rebuilt on top of the MRM platform.

1.6 Governance question raised

Freddy asked three times, in varying forms, who the sponsor of our work is and who authorised the build. Responses given: CAS (Kaz), Deepak, David.

This line of questioning should be read as a governance and chartering check, and it is reasonable to assume it will be reported upward within the risk organisation.

1.7 MRM position and offer

Freddy's stated position:

Duplication of effort across the firm should be avoided on cost grounds.
Our work is likely to be subsumed by the broader platform.
Preferred path is that our team onboards onto the MRM platform rather than building in parallel.
Offer made: join the firm-wide effort, with contribution reaching hundreds of production models rather than AI Teammate alone.
He explicitly stated he is not the decision maker and that we may continue building for AI Teammate if that is the decision taken.
He requested that this be escalated to Kazian.
1.8 Note on engagement preference

Freddy declined an invitation to a technical demo call. He stated he wants a strategy discussion on ownership and direction with decision makers, not a mutual demo session.

This indicates MRM is treating this as an organisational / governance matter rather than a technical one.

2. Action Items
#	Action	Owner	Priority	Due	Status
1	Escalate call outcome to Kaz in writing — factual summary, no recommendation	Rahul	P0	Same day	Open
2	Brief Deepak on the overlap and MRM sponsorship level	Rahul	P0	Same day	Open
3	Inform David that the introduction has been actioned and outcome escalated	Rahul	P1	+1 day	Open
4	Produce a written capability comparison (our service vs MRM platform) for leadership	Rahul	P1	+3 days	Open
5	Document the four differentiated capabilities with evidence, incl. benchmarking results (74% vs 85% gate)	Rahul	P1	+3 days	Open
6	Await direction from Kaz / Deepak on build-vs-onboard before further roadmap commitment	Rahul	P1	Pending	Blocked
7	Request MRM VelTest library documentation and platform onboarding requirements (for optionality)	Rahul	P2	+5 days	Open
8	Facilitate a strategy discussion between Kaz, Deepak and Freddy — strategy only, no demo	Kaz / Deepak	P1	TBD	Open
Decision required from leadership

One of three paths must be selected:

Option	Description	Implication
A	Continue independent build, AI Teammate–specific	Duplication risk stands; requires justification to Second Line
B	Onboard fully onto the MRM platform	Existing IP contributes at firm scale; loses AI Teammate–specific control
C	Hybrid — MRM platform as base layer, our service as the AI Teammate–specific layer	Likely most defensible; requires integration scoping

Recommendation: Option C warrants evaluation first, but the decision sits with Kaz and Deepak, not with the build team.

Open questions
Is our current work formally chartered, and under whose budget?
What is the MRM platform's production timeline, and can AI Teammate be accommodated within it?
Can the MRM platform support annotation write-back to Overwatch and remediation suggestions, or would these need to be contributed?
Does MRM's judge benchmarking meet the same trust-gate standard we apply?
3. Appendix — Draft escalation message to Kaz

Hi Kaz,

I had a 1:1 with Freddy Lecue today. His team sits in the Second Line, with a firm-wide mandate to monitor every GenAI and agentic model in production. It is sponsored by the Chief Risk Officer and has an established production timeline.

He demonstrated their platform. There is substantial overlap with our core loop — Overwatch trace ingestion, LLM-as-judge, live streaming and trace drill-down. Their implementation is generic with fully customisable metrics; ours is AI Teammate–specific but includes annotation write-back, remediation suggestions and a judge benchmarking pipeline that theirs did not show.

His position is that duplicated effort should be avoided and that we should consider onboarding onto their platform. He asked repeatedly who is sponsoring our work, and asked me to escalate this to you, as the decision is not his to make.

He has declined a technical demo call and would like a strategy discussion on ownership and direction instead.

How would you like to proceed?

Two things worth flagging before you publish this:

Action item 1 is genuinely time-critical. If Freddy reports upward through the risk organisation before Kaz hears it from you, the framing is set by someone else. Send that message today.

Keep the Confluence page factual. I've written it without advocacy on purpose — the moment this page reads as a defence of your build, it becomes a political document rather than a record. Let the capability comparison speak, and let Kaz and Deepak reach the conclusion.

Want me to turn this into a proper .docx or .md file, or draft the capability comparison document from Action Item 4?
