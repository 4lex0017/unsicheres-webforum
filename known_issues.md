# Known issues
- XSS will fail if the text in the alert() is escaped with double quotes ("), single quotes (') however work fine.
This happens due to the way SQL injection from the 'body' was implemented in the backend.