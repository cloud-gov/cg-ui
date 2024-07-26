# Cloud Foundry CLI vs API

## What are the Cloud Foundry CLI and API?

Cloud Foundry provides users several ways to interact with resources outside of applications such as this one: the command line (CLI) and API. The CLI's behavior may be different from similar functionality in the API, and even different versions of the CLI and API may have variations in behavior.

### The versions you may come across

- API
  - /v2 -- deprecated, still in use by older software such as Stratos
  - /v3 -- same database as /v2 but very different patterns of access
- CLI
  - CLI 7 -- not deprecated but lacks some features of CLI 8
  - CLI 8 -- introduces async operations, updates to commands

Our application uses the /v3 API endpoints. We have no plans to use /v2 unless if functionality we require is not yet available in /v3.

### Context

The CLI tool often bundles multiple API calls together for user convenience. For example, let's compare removing a user's org role in the CLI and the API.

With the CLI, you can run:

`cf unset-org-role some-user@gsa.gov some-org-name BillingManager`

Behind the scenes, the CLI runs the following API commands (add `-v` to the end of the command above to inspect the API calls):

1. GET /v3/organizations?names=some-org-name -- looks up the specified org GUID
1. GET /v3/users?usernames=some-user@gsa.gov -- looks up the specified user GUID
1. GET /v3/roles?organization_guids=[orgGuid]&types=organization_billing_manager&user_guids=[userGuid] -- finds the role object that should be deleted
1. DELETE /v3/roles/[roleGuid] -- requests role deletion, receives back a job GUID
1. GET /v3/jobs/[jobGuid] -- repeatedly checks if the delete was successful or failed until the job is completed one way or another

In the above example, the outcome is the same: a user is no longer a billing manager for the organization. However, there are some cases where the outcome of a command and the API are _not_ the same. See the [roles](./roles.md) explainer for several examples of these types of discrepancies.

## Further reading

Add links to documentation or repositories with implementations that might be valuable for someone seeking further information.

* [API v3 latest documentation](https://v3-apidocs.cloudfoundry.org/)
* [API v2 documentation](https://v2-apidocs.cloudfoundry.org/) (largely deprecated)
* [Command line interface overview](https://docs.cloudfoundry.org/cf-cli/)
* [Command line interface documentation](https://cli.cloudfoundry.org/en-US/v8/)