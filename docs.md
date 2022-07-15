# Insecure Web Forum for Teaching - Documentation

Daniel Becker

Chris Reichel

## Filtering, Monitoring and the Scoreboard

### Supported vulnerabilities and settings

As this application is intended for a classroom setting, the administrator (usually a professor) can configure the difficulty of certain vulnerabilities to their liking.

The following vulnerabilities and difficulty settings are provided:

#### SQL Injection

As the backend uses an SQL database, it is possible for attackers to create requests exploiting the SQL syntax to execute arbitrary database queries.
As an example, if you were to request the user with the ID 1, the SQL statement would look something  like "SELECT * FROM  users WHERE id = 1".
Now if you request the user with the ID "1 OR 1=1", the statement's WHERE clause would suddenly read "WHERE id = 1 OR 1=1", and as that is always true, every user record is returned.

The different supported difficulty settings are covered in detail in the "Filtering" section.

#### Cross-Site-Scripting

As the forum contains user-generated content, an attacker can include HTML tags in the content they post to execute arbitrary code on the website.
For instance, they could choose a username like ``Albert<script>alert('Hello!')</script>``, which on an insecure website would create a pop-up with the text "Hello!" whenever their username is shown.

The different supported difficulty settings are covered in detail in the "Filtering" section.

#### Insecure File Upload

As users can upload profile pictures for their accounts, it is possible for an attacker to upload non-image files (such as malicious executable files) rather than images.

The different supported difficulty settings for this are covered in detail in the "Filtering" section.

#### Password Hashing

Passwords aren't (always) stored in plain text - for security reasons, most websites store encrypted("hashed") versions.
The administrator can choose between different algorithms, most of which are reversible by now.
These hashed passwords can then be extracted via other means, such as SQL injection.

##### Difficulties:

- 1: No hashing. Passwords are stored in plain text.
- 2: The Message-Digest 5 (MD5) hashing algorithm is used to hash the passwords.
- 3: The Salted Hash Algorithm 1 (SHA-1) hashing algorithm is used to hash the passwords.
- 4: The Salted Hash Algorithm 256 (SHA-256) hashing algorithm is used to hash the passwords. This algorithm is hard to reverse - especially in the classroom setting this web app is intended for.

#### User Enumeration

Attempting to find log-ins via brute force is easier when an attacker knows whether the account they are trying to log into exists,
as they might otherwise spend time and energy trying to brute force the password to a non-existent account.
Thus, the administrator can choose different ways of how attackers know about whether an account exists.

##### Difficulties:

- 1: Users are listed on the side of the website. Upon a failed login attempt, the user is informed whether the password they put in was wrong or the username doesn't exist.
- 2: Upon a failed login attempt, the user is informed whether the password they put in was wrong or the username doesn't exist.
- 3: Upon a failed login attempt, only a generic "Login Failed!" message is displayed.

#### Rate Limiting

Attempting to find log-ins via brute force is harder when the rate at which requests are sent to a server is limited.
The administrator can choose different levels of rate limiting - none of these should limit a legitimate user scrolling the site.

##### Difficulties:

- 1: Each user is allowed 10000 requests per minute. As this number is unrealistically high for the scale of this system, this can be considered infinite requests.
- 2: Each user is allowed 120 requests per minute.
- 3: Each user is allowed 60 requests per minute.

### Middleware

For the difficulty settings and scoreboard to work, all incoming requests need to be filtered and monitored for things like SQL keywords.

This is done using Laravel's middleware feature:
Each request is sent through a set of middlewares processing it before it is then passed on to the controllers, which do the actual database commands and such as explained in other parts of this document.

For filtering and monitoring, there are two middlewares: A dedicated filter and a dedicated monitor.
Each of them check for SQL Injection, Cross-Site-Scripting as well as checking uploaded profile pictures.

### Filtering of vulnerabilities

#### SQL Injection
SQL injection is filtered in two different ways - the filter and monitor check for "--" as an escape string as well as certain SQLite keywords, such as "or".

##### Difficulties:

- 1: No filtering at all.
- 2: The filter checks the request's body content and query parameters for the escape string "--" once. A request containing "----" instead is allowed to pass through.
- 3: The filter checks the request's body content and query parameters for the escape string "--" repeatedly. The request URI is checked for SQLite keywords such as "and" or "union" once - a request containing "anandd" would contain "and" in that place after filtering.
- 4: The filter checks the request's body content and query parameters for the escape string "--" repeatedly, the request URI is checked for SQLite keywords repeatedly.

#### Cross-Site-Scripting

Cross-Site-Scripting is filtered in two ways, filtering for both ``<script>``/``</script>`` tags specifically and < characters alone depending on difficulty.

There are three different XSS filters:
One checking the request body("stored XSS"),
one checking the query parameters("reflected XSS" - this only applies to the search function)
and one checking the request body, but in the front-end, so it could be circumvented via so-called Man-In-The-Middle attacks,
where requests are sent from a third-party client rather than the website itself.

##### Difficulties:

- 1: No filtering at all.
- 2: The filter checks for ``<script>`` and ``</script>`` tags once - a request containing ``<scr<script>ipt>`` would thus contain ``<script>`` after the filtering.
- 3: The filter checks for ``<script>`` and ``</script>`` tags repeatedly. However, other tags such as ``<button>`` are still ignored.
- 4: All ``<`` and ``>`` characters are filtered out. Additionally, the frontend prevents tags being injected into the website.

#### Insecure File Upload

Profile pictures are filtered in different ways, depending on the difficulty.
The monitor will always check the uploaded file's "magic bytes", which are the first few bytes of each file that define the actual file type,
to find out whether this vulnerability has been exploited.

If the filter detects an illegal file (i.e. a file that is neither a GIF, JPEG nor PNG image), an error is returned and the request is no longer processed.

##### Difficulties:

- 1: No filtering at all. Users are free to upload any file as their profile picture.
- 2: The filter checks for the data type of the encoded file using the file ending.
- 3: The filter checks the magic bytes (as explained above) of the encoded file.

### Monitoring of vulnerabilities

#### SQL Injection

When keywords that could break the database such as "DROP" (which would delete an entire database table) are detected,
points are awarded to the attacker, but the request isn't processed.

#### Blind SQL Injection

#### Cross-Site-Scripting

#### Insecure File Upload

#### Log-ins to pre-made users

#### Tracking attackers

As the front-end server uses a reverse proxy, which obfuscates an incoming request's sender IP address, a cookie is used to track attackers.
This cookie is generated when first accessing the website and entering a name. The name and cookie then show up on the scoreboard.

### Scoreboard

#### Identifying attackers

#### Storing found vulnerabilities

### Configuration

#### Retrieving current configuration

#### Setting configuration

Lukas Hein

Alexander Kern

Daniel Katzenberger

Peter Weiß

