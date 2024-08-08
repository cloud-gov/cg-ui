# Service related API endpoints

## What are the service related API endpoints?

There are a lot of service related endpoints in the Cloud Foundry controller API (CAPI), which describe everything from registered brokers to service related events. Many of these endpoints are root level, like `/services`, while other times they are embedded in the documentation as paths underneath organizations and applications.

Here is a high level summary of service related concepts and endpoints you may come across in CAPI.

### Service brokers

A service broker is a translation piece that makes it possible for your application to use tools like AWS services, certificate managers, and more. Cloud.gov manages service brokers that it makes available to its users, or users can [create their own brokers](https://cloud.gov/docs/services/intro/#extending-the-marketplace) using the [Open Service Broker API](https://www.openservicebrokerapi.org/).

### Service offering

Service offerings are the product that service brokers are making available. For example, an AWS broker might provide the ability to interact with AWS S3, RDS, and Elasticsearch as distinct service offerings.

The service offering endpoint has information about individual service offerings, like the types of permissions a user would need to operate the service, if the service can be bound to an application, and more.

### Service plan

Service plans are different breakdowns of a service offering and may include information about the cost of operation. For example, a service offering might be "AWS RDS," but within that offering there are different service plans such as "micro-psql" or "medium-mysql."

### Service instance

A service instance is a particular instance of a service plan, typically the thing that's bound to your application. For example, if you attach a database to your application called "user-info," that's a service instance. When service offerings are defined, they may allow you to [query whatever arbitrary parameters about an instance](https://v3-apidocs.cloudfoundry.org/version/3.163.0/#get-parameters-for-a-managed-service-instance) the service offering grants.

The information the API sends back varies depending on whether this is a managed (aka: Cloug.gov created) service, or a user-provided service, but you can expect to find information like the log location, version, and last operation.

### Service credential binding

Service credential bindings give you the credentials you need to connect to a service instance. There are two types: app and key bindings. App bindings are linked to a specific application and the credential information is made available to the app with the VCAP_SERVICES variable.

You may come across a key binding if you are working with a [service account](https://cloud.gov/docs/services/cloud-gov-service-account/). Cloud.gov allows you to create an account with permission to deploy or monitor applications for use with automations like CI / CD. When you create a service account key with the cloud.gov [credentials broker](https://github.com/cloud-gov/uaa-credentials-broker), a new user will be created whose username matches the GUID of a service credential binding. See [the service accounts explainer](./service-accounts-as-users.md) for more info.

## Further reading

- [Open Service Broker API](https://www.openservicebrokerapi.org/)
- [Cloud documentation for services and user-provided service instances](https://cloud.gov/docs/services/intro/)
- [Service instance parameters](https://v3-apidocs.cloudfoundry.org/version/3.163.0/#get-parameters-for-a-managed-service-instance)
- [Cloud.gov service account](https://cloud.gov/docs/services/cloud-gov-service-account/)
- [Cloud.gov UAA credentials broker](https://github.com/cloud-gov/uaa-credentials-broker)
