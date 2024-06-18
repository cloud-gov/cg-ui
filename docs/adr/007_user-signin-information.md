# User sign in and expiration information

Status: Proposed

## Context and problem statement

The dashboard application needs to obtain information about a user's last login and account status to display to org and space managers who are responsible for managing users. This information is not available through the Cloud Controller API (CAPI). It is available through the UAA API, but only for platform operators.

## Decision drivers / forces

We want to reduce friction for individual users and org / space managers of Cloud.gov, who do not currently have insight into which users are about to lose account access or why an account may be disabled. This friction is then passed to Cloud.gov support staff who help diagnose and reenable access.

## Considered options
1. Store when a user logs into our application
1. Query the UAA API with a client token
1. Store user information as CAPI user object annotations
1. Shared datastore
1. Pull user information from the uaa-bot s3 bucket

## Decision outcome

Option 5: Pull user information from the uaa-bot s3 bucket.

If this does not work, we will explore option 2: querying the UAA API with a client token

Justification:

The uaa-bot currently writes information about upcoming user expirations to an s3 bucket. The Cloud.gov compliance team is wary of sharing the date and time of user access, but comfortable with information like "access expires in 10 days." This s3 bucket could be made available to our application for use with minimal work on the Cloud.gov platform side.

Consequences:

We will not have the amount of information we original envisioned, but we would be able to accomplish our goal of warning managers when users are expiring and giving them the ability to evaluate how to (re)enable access. There is no development version of the s3 bucket, so we will have to imitate the JSON response for the immediate term. We will not move Cloud.gov towards a shared datastore that could be used for billing information.

### Success criteria

Our application is able to pull up-to-date and accurate information about when a user is expiring and display that to org and space managers.

## Pros and cons of the options
### 1. Store when a user logs into our application

* `+` Easy to implement without involving any other system
* `+` Imitates a pattern used by Cloud.gov Pages
* `-` Data is inaccurate, does not reflect logins to CLI, Pages, Stratos, etc
* `-` Confusing for users if our app says someone is expired when they are not

### 2. Query UAA API with a client token
* `+` Gets latest data directly from the source
* `-` Requires us to figure out how to obtain and use a client token

### 3. CAPI Annotations
* `+` Takes advantage of existing uaa-bot to update CAPI user object annotations
* `+` User annotations access is scoped to only those who can access the user object
* `+` UAA, CAPI, and uaa-bot are all within the same security boundary
* `-` Reveals exact dates and times of user logins to those who do not currently have access
* `-` Requires cloud.gov dev time to make alterations to the uaa-bot

### 4. Shared datastore
* `+` Forges a path for future centralized data such as billing information
* `+` Could be used by multiple applications, services at Cloud.gov
* `-` Would require significant time to investigate, design, and implement
* `-` Shifts management of access permissions from UAA or CAPI to our application or datastore

### 5. uaa-bot s3 bucket
* `+` No changes or minor changes to current uaa-bot behavior and data storage
* `+` Provides app with relatively up-to-date information about user expiration and status
* `+` Only requires access to s3 bucket to begin using data
* `-` App will be required to parse JSON searching for user guids
* `-` No development version of uaa-bot or bucket means we will have to mock data until use in production
