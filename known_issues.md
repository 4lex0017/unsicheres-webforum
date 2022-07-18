# Known issues

- XSS will fail if the text in the alert() is escaped with double quotes ("), single quotes (') however work fine.
This happens due to the way SQL injection from the 'body' was implemented in the backend.
- Whitespaces are generally not filtered from the backend, this is actually intended to show bad design.
- You can give yourself any Group without Validation including 'Admin', this is intended to show bad design.
- As Admin you can change the Author of a thread or Post, this is intended to show bad design.
