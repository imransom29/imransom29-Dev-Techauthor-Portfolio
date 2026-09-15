Deepak,

Not yet — that is what the package would enable.

Today the Eval Service runs LLM-as-a-judge evaluators. The RIFAM tests are a separate set of Python files that RIFAM owns and MRM also uses.

Rather than each team maintaining its own version of that logic, the cleaner route is a common package. One versioned repo that Eval Service, MRM and RIFAM all import, so a rule is updated once and everyone picks it up.

The service is built as a plug-in framework, so once the package exists these tests slot in as configuration rather than new code.

Thanks
Rahul
