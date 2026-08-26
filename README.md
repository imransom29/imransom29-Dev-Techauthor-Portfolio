Story 1 — Integrate Model Testing Framework API into Supervisor Evaluation Service
Type: Story · Priority: High · Story Points: 5
Labels: ai-generated · Fix Version: NoCode_Q3_2026
Acceptance Criteria
1. Scenario: Successfully invoke the framework
Given the Model Testing Framework is deployed and reachable,
When the Supervisor Evaluation Service calls the framework's FastAPI endpoint with a valid dataset reference,
Then the framework accepts the request and returns a run identifier,
And the run identifier is persisted against the evaluation record.
2. Scenario: Handle framework unavailable
Given the framework endpoint is unreachable or returns 5xx,
When the service initiates a run,
Then an appropriate error is logged with the run context,
And the service returns a clear failure state to the caller without crashing.
3. Scenario: Authentication
Given the framework requires Tachyon Apigee token-based auth,
When the service invokes any framework endpoint,
Then a valid token is attached per request,
And expired tokens are refreshed transparently without failing the run.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval
Story 2 — Trigger and monitor framework test runs from the UI
Type: Story · Priority: High · Story Points: 5
Acceptance Criteria
1. Scenario: Kick off a run
Given a user has selected a dataset and one or more test types,
When the user submits the run from the UI,
Then the run is queued on the platform and the UI shows a run ID with status "Running",
And the user can navigate away without interrupting the run.
2. Scenario: Track run progress
Given a run is in progress,
When the user opens the run detail page,
Then the current phase is displayed (Pre / Traces / Post),
And progress is refreshed without a manual page reload.
3. Scenario: Handle a failed run
Given a run fails mid-execution,
When the failure occurs,
Then the run is marked "Failed" with the failing phase and reason surfaced in the UI,
And partial results already checkpointed are retained.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval
Story 3 — Persist framework test run results and manifests
Type: Story · Priority: High · Story Points: 3
Acceptance Criteria
1. Scenario: Successfully store run results
Given a framework test run has completed,
When the service stores the results,
Then the results are inserted into the configured collection,
And the stored document includes run ID, test type, session ID, query ID, scores, and timestamp.
2. Scenario: Store the reproducibility manifest
Given a run has completed,
When results are persisted,
Then the run manifest is stored alongside them,
And the manifest includes git SHA, commit timestamp, framework version, and run timestamp.
3. Scenario: Verify data integrity
Given run results have been stored,
When a query is performed by run ID or date range,
Then the retrieved data matches the original results,
And the schema is consistent across test types.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval
Story 4 — Compute and display KPI results across all evaluators
Type: Story · Priority: High · Story Points: 5
Acceptance Criteria
1. Scenario: KPIs computed after a run
Given a run has completed and results are stored,
When KPI computation is triggered,
Then all defined KPIs are calculated for that run,
And each KPI is stored with its computed value and the run ID.
2. Scenario: Thresholds applied
Given a KPI has defined pass and warn thresholds,
When the KPI value is computed,
Then the KPI is labelled Pass, Warn or Fail according to its threshold,
And the label is displayed against the KPI in the UI.
3. Scenario: KPI summary view
Given a user opens a completed run,
When the run detail page loads,
Then all KPIs are shown in a single summary view,
And the user can drill from any KPI into the underlying rows that produced it.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval
Story 5 — Dataset upload and management for framework runs
Type: Story · Priority: Medium · Story Points: 3
Acceptance Criteria
1. Scenario: Upload a test dataset
Given a user has a test dataset with session_id, query_id, query and entitlement columns,
When the user uploads it through the UI,
Then the schema is validated against the required columns,
And the dataset is stored and made selectable for future runs.
2. Scenario: Reject an invalid dataset
Given an uploaded dataset is missing required columns or has malformed rows,
When the upload is submitted,
Then the upload is rejected,
And the user is shown which columns or rows failed validation.
3. Scenario: Reuse an existing dataset
Given datasets have been uploaded previously,
When a user starts a new run,
Then previously uploaded datasets are available for selection,
And selecting one does not require re-upload.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval
Story 6 — Sensitivity and perturbation test support
Type: Story · Priority: Medium · Story Points: 5
Acceptance Criteria
1. Scenario: Generate perturbed queries
Given a base query in the selected dataset,
When a sensitivity test is run,
Then perturbed variants of the query are generated,
And each variant is executed against the agent with the same entitlement.
2. Scenario: Measure response drift
Given base and variant responses have been collected,
When the drift calculation is performed,
Then similarity metrics are computed between the base and each variant,
And the drift score is stored against the base query ID.
3. Scenario: Surface unstable queries
Given drift scores have been computed for a run,
When the user views the sensitivity results,
Then queries exceeding the drift threshold are flagged,
And the user can view the base response and each variant response side by side.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval
Story 7 — SME review and sign-off on evaluation results
Type: Story · Priority: Medium · Story Points: 5
Acceptance Criteria
1. Scenario: SME annotates a result
Given a completed run with evaluated rows,
When an SME opens a row and records their own label,
Then the SME label is stored against that row with the SME's identity and timestamp,
And the original machine score remains unchanged.
2. Scenario: Agreement computed
Given SME labels exist for a run,
When the agreement calculation is triggered,
Then human–machine agreement metrics are computed for the run,
And the agreement figures are displayed alongside the run's KPIs.
3. Scenario: Run sign-off
Given an SME has completed their review of a run,
When the SME signs off,
Then the run is marked as reviewed with the reviewer's identity and timestamp,
And a signed-off run cannot be silently modified.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval
Story 8 — Promote approved results into the golden dataset
Type: Story · Priority: Medium · Story Points: 3
Acceptance Criteria
1. Scenario: Promote an approved row
Given an SME has approved a row during review,
When the row is promoted,
Then the query, response and approved label are written to the golden dataset,
And the source run ID and trace ID are retained as provenance.
2. Scenario: Prevent duplicates
Given a query already exists in the golden dataset,
When the same query is promoted again,
Then the existing entry is updated rather than duplicated,
And the update history is preserved.
3. Scenario: Use the golden dataset in a run
Given the golden dataset contains approved entries,
When a user starts a new run,
Then the golden dataset is selectable as a test dataset,
And results are comparable against the approved labels it holds.
Sub-Tasks: Development · Code Review · Code Merge to Develop/Feature · Testing in Dev/SIT · Demo/Approval