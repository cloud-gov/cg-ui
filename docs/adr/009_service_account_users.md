# Distinguish human users from service account users

Status: Proposed

## Context and problem statement

Cloud.gov provides a broker that allows users to create service accounts which can be used to manage or monitor applications programmatically. This service broker, the [UAA Credentials Broker](https://github.com/cloud-gov/uaa-credentials-broker), creates both a UAA and associated CAPI user for each service account key using a GUID for a username.

These service account users are interspersed with human users in query results which can be confusing for humans tasked with managing or auditing users. We want to be able to mark service account users as being non-humans and help users understand an individual service account user's purpose and usage.

## Decision drivers / forces

User research into an early prototype of the user management page uncovered that Cloud.gov users would like to quickly discern which users are humans versus which are service accounts and how they are being used.

Although there are potentially other non-human accounts in Cloud.gov which were created outside of the service broker, these are likely edge cases and are not the focus of our work.

## Considered options
1. Mark accounts in CAPI on creation
1. Pull additional details from UAA about users via uaa-bot
1. Make assumptions about users based on CAPI features
1. Allow users to mark and rename users

## Decision outcome

Option 3: make assumptions about users based on CAPI features

In the future as our application nears production, we should reinvestigate option 1 (marking accounts in CAPI) for a more robust solution.

__Justification__ : determining if a username matches against a service credential binding is an additional API call, but this is the lightest lift that accomplishes our goal at this moment

__Consequences__ : any interface that displays a username will now need to check if they are likely to be a non-human and if so, send another API call. Additionally there may be complications displaying a service key name in place of a username, such as to client side sorting / filtering / searching.

### Success criteria

- We can reliably mark users as human or service account related
- We can display the service account key name to provide context about the purpose of the non-human user

## Pros and cons of the options

### Option 1: Mark accounts in CAPI on creation

Alter the service broker code to add an annotation or label on a user marking them as service account related. Change either the username or presentation name from a GUID to the service account key name. This could be only for accounts moving forward or could involve bulk updating existing service account users.

* `+` Simple change in service broker if only accommodating future accounts
* `+` Reduces any ambiguity about source, no additional API calls required
* `-` Requires Cloud.gov to update a service broker with few recent changes
* `-` Bulk updates to previously created service brokers could have unintended consequences

### Option 2: Pull additional details from UAA about users via uaa-bot

UAA offers a few clues that help distinguish a human user from a non-human user. For example,non-humans don't have MFA enforcement. The amount of distinguishing features available in UAA that are not available in CAPI is relatively small.

* `+` We already have a method of getting information from UAA to our application set up
* `-` UAA does not offer much more information than we already have in CAPI
* `-` Requires a call to s3 and parsing JSON

### Option 3: Make assumptions about users based on CAPI features

Users with a GUID username and an origin of UAA are more than likely not human users. Matching their username against a credential binding confirms if the user is, in fact, related to a service account.

* `+` Matching against a binding is a reliable way of confirming service account users
* `+` We already have access to the endpoints and information we need
* `-` Each time a username is displayed we need to evaluate if it might be non-human and send an additional API request to confirm

### Option 4: Allow users to mark and rename users

We could shift the burden of discerning human from non-human users to the people who are creating and managing service accounts by giving them the ability to tag or rename the resulting users. The average user of Cloud.gov does not have sufficient CAPI permissions to alter user objects, so this would require us to store any customizations to users separately from CAPI, such as in a database.

* `+` Provides a mechanism for users to describe service account user functionality
* `-` Increases labor required for people to manage users, potentially confusing
* `-` Requires storing this information outside of CAPI and looking it up each time any user is displayed
* `-` Our app would need to manage permissions to edit user display names / tags instead of relying on CAPI
