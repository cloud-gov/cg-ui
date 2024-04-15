# Cloud Foundry User Accounts and Auth (UAA)

## What is UAA?

UAA, or the User Account and Authentication Server, is the identity management provider for Cloud Foundry. It store user accounts and related information and is an intermediary for agency specific SSO (single-sign on).

Cloud.gov users either have a "cloud.gov" account, through [Shibboleth](https://www.shibboleth.net/about-us/the-shibboleth-project/), or they authenticate via their agency's identity provider. Regardless, they will also have a user account in UAA.

When a user authenticates, UAA provides the requesting application with a [JWT](https://jwt.io/) token. This token includes information like the token's expiration and the user's "origin" (for example, gsa.gov). This token can now be used with the Cloud Foundry Controller API (CAPI) to view and manage Cloud Foundry resources.

### Context

Applications which connect to UAA can do so through a [service broker](https://github.com/cloud-gov/uaa-credentials-broker) or as a registered client application. Our app is a client because this allows us to [request more permissions](https://github.com/cloud-gov/cg-deploy-cf/blob/main/bosh/opsfiles/clients.yml#L161) (scopes) to manage users and resources.

#### Scopes

When a user logs in through a client app, [only those scopes which are available to that user and which have been requested by the client are granted](https://docs.cloudfoundry.org/uaa/uaa-concepts.html#scopes).

#### OAuth2

Our application uses OAuth2 to authenticate with UAA. See [middleware](../../middleware.js) for implementation details.

#### Local development

When authenticating with a [local UAA instance](../../uaa-docker), it will not generate tokens which are valid for cloud foundry instances and has limited utility for local development. However, running UAA locally gives us the ability to make sure that the authentication portion of the app is functioning similarly to a "real" UAA server.

## Further reading

### Overview

- [UAA documentation](https://docs.cloudfoundry.org/uaa/)
- [UAA API](https://docs.cloudfoundry.org/api/uaa/)

### Cloud.gov repositories related to UAA

- [UAA credential broker](https://github.com/cloud-gov/uaa-credentials-broker) : offers openid authentication for applications in Cloud.gov
- [cg-deploy-cf clients](https://github.com/cloud-gov/cg-deploy-cf/blob/main/bosh/opsfiles/clients.yml) : the clients recognized by Cloud's UAA instance
- [cg-uaa-extras](https://github.com/cloud-gov/cg-uaa-extras) : manages new user invites

### In this application

- [middleware.js implementation](../../middleware.js)
- [Run UAA locally](../../uaa-docker)
