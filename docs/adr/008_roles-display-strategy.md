# Roles display strategy

Status: Draft

## Context and problem statement

We have anecdotal evidence and user research that the various organization and space roles that ship with Cloud Foundry can be confusing and it's not always obvious what permissions are associated with each role. Making these roles more generic also has the benefit of separating the customer's experience from the underlying technology, so in the future as underlying technologies change the customer's experience remains consistent.

We need to simplify user and space roles so they are more intuitive, user friendly, and less vendor specific.

## Decision drivers / forces

The current dashboard, Stratos, was created by the Cloud Foundry community and is tailored specifically to the underlying Cloudy Foundry services. This made it difficult to move in a more general direction, but with our new dashboard being custom built it gives us an opportunity to think about ways to simplify roles given we have greater control over the experience.

## Considered options
1. Create our own abstraction of roles and permissions in the dashboard for a simplified experience
1. Display roles as they appear in Cloud Foundry

## Decision outcome
* Chosen Option: *Display roles as they appear in Cloud Foundry*
* *Justification:* While there are benefits to be gained from simplifying roles and permissions, we believe more formal research is needed in order to understand the techincal implications, and in order to ensure that the various ways of managing roles (Cloud Foundry CLI, CAPI, Terraform, etc) continue to work in harmony.
* *Consequences:* We will optimize for displaying roles in a way that is familiar to current cloud.gov customers, and look to use content and design to communicate more information about the various roles and permissions.

## Pros and cons of the options <!-- optional -->
### *Create our own abstraction of roles and permissions*

* `+` Allows cloud.gov to provide pre-defined groupings of roles/permissions for common use cases 
* `+` Moves cloud.gov away from Cloud Foundry specific language like `space developer`
* `+` Allows for a less complex user interface that is more intuitive
* `-` Creates opportunities for expected roles/permissions to become out of sync when changes are made using other methods like the API or CLI
* `-` Simplified UI may not be able to support all combinations of roles/permissions provided by the API or CLI

### *Display roles as they appear in Cloud Foundry*
* `+` Conforms with Cloud Foundry and cloud.gov's documentation
* `+` Is consistent with the roles output of other methods such as the API or CLI
* `-` Does not move us towards simplifying roles to address user feedback
* `-` Does not move cloud.gov towards a more generic, tech-agnostic user management approach
