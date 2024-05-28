# Bulk API requests

Status: proposed

## Context and problem statement

We need to display lists of information to users, such as a list of their applications, spaces, and users assigned to an org. This information should be easily browsable, sortable, and filterable. The Cloud Foundry API does not provide the sorting or filtering utilities we require, meaning that our application will need to gather the API reponse(s) and then sort / filter the response.

We need to determine how to request and manipulate information from the API in such a way that we do not overburden our application by requiring it to parse, sort, and filter, large datasets.

## Decision drivers / forces

We used organization users and their roles as a proof of concept for pulling and displaying bulk information. This required us to request all the `/roles` associated with an organization and the users associated with each role, then manipulate the response to rearrange the data for frontend consumption. The CF API supports pagination with a maximum per_page limit of 5000 results.

We learned that in the Cloud.gov production environment, the organizations with the largest number of roles and users are those with sandbox accounts (where every new user is given a space within a sandbox org). These accounts are largely automated, and moderators are unlikely to use the UI for management. Outside of these sandbox accounts, the largest number of roles for a production organization as of May 2024 was 150 roles.

## Considered options
* Option 1: Request 5000 results and parse them within our application
* Option 2: Explore bulk data request, storage, and manipulation options

## Decision outcome
* Chosen Option: request 5000 results and parse them within our application
* Justification: as our sampling of production data indicates there are unlikely to be more than a few hundred items returned in a given request, at this point we feel confident that our application can adequately process and manipulate the response. Using a single high per_page API request will help keep things simple as we build the application.
* Consequences: we will need to revisit this decision if production usage is more demanding than currently expected

### Success criteria

* Pages with lists of information load quickly
* Lists of information can be sorted and filtered on-the-fly with little delay
* API responses indicate the number of results is lower than 5000 (the per_page limit)

## Pros and cons of the options
### Option 1: request 5000 results

* `+` Simplicity: API request and response manipulation are straightforward and handled in-app
* `+` Fits current use case: sampling of production data indicates modest numbers likely
* `-` Sandbox accounts: these organizations tend to be large and pages may be slow to load if sandboxes are managed through the UI
* `-` Long term vision: this decision may need to be revisited in the future as cloud.gov usage grows

### Option 2: explore bulk data request, storage, and manipulation options
* `+` Robustness: preparing to process large datasets at this stage will make it possible for us to move more quickly in the future if encountering the need
* `-` Overengineering: as we do not currently perceive a need for additional tools or software, they would add unnecessarily complexity to our application
