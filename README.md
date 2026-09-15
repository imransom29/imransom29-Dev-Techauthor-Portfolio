
Not yet — that is what the package would enable.

Today the Eval Service runs LLM-as-a-judge evaluators. The RIFAM tests are a separate set of Python files that RIFAM owns and MRM also uses.

Rather than each team maintaining its own version of that logic, the cleaner route is a common package published as a versioned artifact. Eval Service, MRM and RIFAM all import the same artifact, so a rule is updated once and everyone picks it up. Then we are running their evaluations properly rather than a snapshot of them.
