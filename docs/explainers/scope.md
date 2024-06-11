# Scopes

## What is a scope?

When a user logs in, the UAA (authentication server) sends back a list of scopes that describe the privileges that user has. Some of these scopes apply to Cloud Foundry resources, like whether a user can view only or edit resources. Other scopes are for managing user accounts, like sending invites or viewing information about other users.

When using a client to act on behalf of the user, for example, what this application is doing, the client needs to be registered with the scopes it needs for user actions. However, the scope a user receives through the client never exceeds their normal privileges.  For example:
- __User has more privileges than client__:
  - a user has admin and write privileges
  - the client application is granted write scope
  - therefore the user only receives write scope and cannot act as an admin through the client
- __User has fewer privileges than client__:
  - a user has write privileges only
  - the client can be granted admin and write scopes
  - when the user logs in, they only receive write privileges

### Context

Our client application needs to request those scopes which will allow users to complete their work through the application. As of this explainer's creation, we are using the following scopes ([see client file](https://github.com/cloud-gov/cg-deploy-cf/blob/main/bosh/opsfiles/clients.yml#L174)):

| Scope | Purpose |
| ----- | ------- |
| openid | Access to one's own /userinfo endpoint |
| uaa.user | Identifies as a UAA user, required to log in with OAuth2 |
| cloud_controller.read | Read access to the user's CF resources |
| cloud_controller.write | Write access to the user's CF resources |
| cloud_controller.admin | Full permissions to CF resources |

This may not be a complete list of the scopes that our application will require as we add features. For example, we may need `password.write` scope to allow a user to change their password through the application.

For reference, here are [the scopes granted as of the time of writing to the previous dashboard](https://github.com/cloud-gov/cg-deploy-cf/blob/3681649f06126547f11d344b6701cb2dd046179e/bosh/opsfiles/clients.yml#L147), Stratos.


## Further reading

Add links to documentation or repositories with implementations that might be valuable for someone seeking further information.

* [UAA Scope definitions](https://docs.cloudfoundry.org/concepts/architecture/uaa.html#scopes)
* [Team notes on available scopes for dev users](https://docs.google.com/document/d/1E4yiTY4wZSWqE7QrKlrsG4L6kY2NigudKCrA4iixcU0/edit#heading=h.ol153c37577b)
* [cg-ui app scopes](https://github.com/cloud-gov/cg-deploy-cf/blob/main/bosh/opsfiles/clients.yml#L174)
