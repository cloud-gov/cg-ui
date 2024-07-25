# Roles

## What are user roles?

The Cloud Foundry controller API, CAPI, uses "roles" to set user permissions for particular organizations and spaces. These are different but related to scopes granted by UAA to individual users. UAA scopes take priority -- if a user has a UAA "read only" cloud controller scope, they will be unable to use a CAPI role with writing privileges.

CAPI roles often have overlapping privileges. For example, if a user is a space manager, they can manage users and view applications within a space. If they are a space developer, they can also view applications but additionally can deploy and manage those applications. You can combine multiple roles for the same user and org / space in order to provide the permissions they need.

In the API, the endpoint `/roles` is used to connect users and orgs / spaces. Although there are a few helper endpoints like `/organizations/[orgGuid]/users` which list the users for an organization, the `/roles` endpoint provides CRUD operations and filtering functionality and is likely a better fit for most of your needs.

### Context

Here are some things we've come across that surprised us.

#### Space supporters and lack of support on CLI

The `space_supporter` role is relatively new, and as such is only available in the API and CLI 8. CLI 7 users will not be able to view or manage this role via CLI.

#### Organization and space interactions

While CAPI org and space roles are decoupled from each other in terms of permissions, we learned that a user MUST have a role in an organization in order to have a role with a space within that org. Previously, CAPI accommodated this behind the scenes by adding `organization_user` to anyone being added to an org or space. This is no longer the case in API `/v3`, although that org role still can be used.

When removing a user from an org, you must first remove all of their space roles within that org, THEN remove their org role.

#### The dangerous, invisible organization_user role

:red_circle: :red_circle: :red_circle:

In CLI 7 and 8, you can list organization users with `cf org-users [ORG]`, which will spit out something like this:

![Output of cf org-users which shows users and their roles in the org. Most are org managers, but three people have a role of org auditor. Organization user is not listed as a role.](/docs/doc-images/explainers/roles-cli.png)

However, if we use the API roles endpoint, we can see there are 10 users with a role of `organization_user` in addition to the roles listed in the CLI output!

```bash
% cf curl "/v3/roles?organization_guids=[orgGuid]" | grep 'organization_user' | wc -l
  10
```

The CLI not only can't see the `organization_user` role, but you cannot interact with them through the `cf unset-org-role` command, either. This means that when the `organization_user` role is assigned to a person, CLI-only users cannot remove them from an org, though it will appear as though that user is no longer in the org. __The user, however, still has read only access to the org and information like its user list!__

## Further reading

- [UAA cloud controller scopes](https://docs.cloudfoundry.org/concepts/architecture/uaa.html#cc-scopes)
- [CAPI roles](https://docs.cloudfoundry.org/concepts/roles.html)
