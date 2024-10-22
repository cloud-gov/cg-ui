# Add a separate data store to app

Status: Draft

## Context and problem statement

It's likely that our web app will need a data store in addition to what Cloud Foundry provides. Anticipated uses of this data store include:

- users
  - session management
  - metrics like used platforms, browsers, etc.
  - preferences that can persist
  - tailoring the experience based on user roles/attributes
- orgs / agencies
  - billing and agreements
  - correlating the same person across multiple origins
- compliance
  - scan artifacts
  - compliance status and ATO information
- external connections such as GitHub tokens

## Decision drivers / forces

The dashboard app is a web UI for Cloud Foundry data, and the app's primary data source will be from an API.

Eventually, the app might need to talk to multiple external data sources, especially while other products are consolidated into it.

While we don't see an immediate need for a datastore to communicate with other clients besides our application, it is a future possibility.

These factors lead us towards an API-first approach.

## Considered options
1. Use a database service with a tightly coupled API built into the dashboard application. This is similar to the approach used by [pages-core](https://github.com/cloud-gov/pages-core/blob/b3a1f6e3c55eba7555ba92007908b40b107886a0/docs/DEVELOPMENT.md#deployment)
1. Use a database service with a separately managed API, similar to [this approach](https://cloud.gov/pages/knowledge-base/website-api/)
1. Use a localized data source and switch to MVC (Model, View, Controller) architecture

## Decision outcome
* Chosen Option: *[tbd]*
* *[justification. e.g., only option, which meets KO criterion decision driver | which resolves force force | ... | comes out best (see below)]*
* *[consequences. e.g., negative impact on quality attribute, follow-up decisions required, ...]* <!-- optional -->

### Success criteria

- We can collect and store the data we need with ease
- We can add more data sources with ease
- The app has secure and compliant ways to communicate with its data sources


## Pros and cons of the options

### 1. Tightly coupled API

* `+` Managing the API alongside the same application / repository means less overhead for development and deployment
* `+` Builds for our current needs rather than theoretical futures
* `-` The API would be in the same stack as our app, NextJS, which does not come out of the box with support for models, migrations, database-related tests, nor object relationship mapping (ORM). We would need to invest in additional work to implement these
* `-` We risk storing and managing data that would be better off pulled into our app rather than being owned by it
* `-` Out of the box software for an "admin" view would likely be distinct from the rest of the application and lead to two separate applications in the same repo

### 2. Separately managed API

* `+` Anticipates a potential future where our application pulls in data from multiple APIs / sources, and where the datastore serves multiple applications
* `+` Allows for selection of technology / framework specifically for an API with database backend
* `-` More overhead for our current team to support: two applications, separate authentication flow, deployment, maintenance, security scanning, etc.

### 3. MVC architecture
* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->
