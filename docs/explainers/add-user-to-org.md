# Add a user to an organization

## How are users added to an org?

Organizations allow multiple users to interact with applications that fall within the scope of that organization. Users have [different roles within each organization](https://docs.cloudfoundry.org/concepts/roles.html#permissions), such as an org manager or an org user.

Org managers have the ability to add a user and assign their roles within an organization. We have identified the following scenarios:

1. Org manager invites a new user who has never logged into Cloud.gov
1. Org manager invites an existing Cloud.gov user with an active account
1. Org manager invites an existing user with expired Cloud.gov access

This explainer will focus on the 2nd scenario.

### An existing user with an active account

In order to alter the organization roles, our application first needs to know the organization's identifier, or GUID.

1. __Application__: [Send a request to CAPI](https://v3-apidocs.cloudfoundry.org/version/3.161.0/#list-organizations) to obtain the organization's GUID, if it is not already known `/v3/organizations?names=orgname`
1. __CAPI__: Returns a list of organizations filtered by name

The org manager navigates to a form in the UI to add users to start the process.

1. __Org manager__: The org manager enters the user's email address in the app and selects their role(s)
2. __Application__: [Send a request to CAPI](https://v3-apidocs.cloudfoundry.org/version/3.161.0/#list-users) to find the user `/v3/users?usernames=user.email`
3. __CAPI__: Returns a list of users to the app, filtered by email
4. __Application__: Search through the returned list to select the appropriate user and their GUID
5. __Application__: [POST to CAPI to create a role](https://v3-apidocs.cloudfoundry.org/version/3.161.0/#create-a-role) associating the org and user, `/v3/roles`
  - type (organization_user, etc)
  - relationships.user GUID
  - relationships.organization GUID
  - relationships.space if relevant
6. __CAPI__: Returns the created role or a message saying the user already has that role within the organization
7. __Application__: Displays a message to the org manager indicating that the user has been added

In the future we may which to explore sending an email to the added user prompting them to log in and view the org.

## Further reading

* [User role permissions table](https://docs.cloudfoundry.org/concepts/roles.html#permissions)
* [Internal team notes](https://docs.google.com/document/d/1E4yiTY4wZSWqE7QrKlrsG4L6kY2NigudKCrA4iixcU0/edit#heading=h.yyyksx8wl3d9) :closed_lock_with_key:

### API resources

* [CAPI organizations](https://v3-apidocs.cloudfoundry.org/version/3.161.0/index.html#organizations)
* [CAPI users](https://v3-apidocs.cloudfoundry.org/version/3.161.0/index.html#users)
* [CAPI roles](https://v3-apidocs.cloudfoundry.org/version/3.161.0/index.html#roles)
