<img width="395" height="675" alt="Screenshot 2026-07-03 at 12 15 00 PM" src="https://github.com/user-attachments/assets/f6b26b43-46e3-4d31-8c28-63d2bcf0ead5" />


Subject: Need Assistance — Snapshot Workflow Failing Due to JFrog 409 Error (supervisor-evaluation-service)

Hi David,

Hope you're doing well.

I'm reaching out regarding an issue I've been facing with the Snapshot Workflow for the supervisor-evaluation-service. The pipeline is failing at the Pre Publish & Publish stage with a 409 error from JFrog Artifactory.

Here's a quick summary of the problem:

The repository pypi-isolck-local is rejecting our .whl artifact (wellsfargo_isolck_supervisor_evaluation_service-2026.7.381.dev0-py3-none-any.whl) due to its include/exclude pattern settings. The build and unit tests pass successfully, but the artifact upload gets blocked, which in turn prevents the entire downstream pipeline — image creation, Harness deployment, and OCP pod setup — from proceeding.

The issue appears to be a configuration mismatch on the JFrog repository side (pattern rules not allowing our artifact's naming convention), rather than a code-level bug.

I have already raised a ticket for this. Would really appreciate your help in getting this looked at or pointing me to the right team who can review the include/exclude patterns on the pypi-1solck-local repository.

Happy to hop on a quick call or share additional logs if that would be helpful.

Thanks a lot, David.

Best regards,
Rahul Vinayak


