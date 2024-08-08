# Service accounts and non-human users

## What is a service account?

Cloud.gov allows you to create [service accounts](https://cloud.gov/docs/services/cloud-gov-service-account/) with permission to deploy or monitor applications for use with automations like CI / CD.

### Context

When you create a service account key via the cloud.gov [credentials broker](https://github.com/cloud-gov/uaa-credentials-broker), a new user will be created. This user is created in both UAA and the CF controller API (CAPI). A new user will be created for every service account key that you create.

Service account users are treated by CAPI the same as human users. For this reason, it is difficult to separate out service account users from human users in interfaces except for a couple clues:

- their origin is always uaa (although humans also have this origin until they have logged in)
- service account users have a GUID for a username, and this username matches the GUID for a service credential binding object

#### Pulling information about service account keys

You can look up your service keys via CLI or API, although keep in mind that not all of these keys may be related to service accounts.

```bash
cf service-keys [your-service-name]

Getting keys for service instance test-service-account as username@gsa.gov...

name
test-service-account-key
test-service-account-key2
```

While the cf CLI uses /v2 endpoints behind the scenes, it should yield similar results as the following /v3 API request:

```bash
cf curl "/v3/service_credential_bindings?type=key&service_instance_names=[your-service-name]"
```
