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

The app is a web UI for Cloud Foundry data, and so the app's primary data source will be from an API.

Eventually, the app might need to talk to multiple external data sources, especially while other products are consolidated into it.

While we don't see an immediate need, it's possible that this new data store will need to communicate with other clients besides our app.

These factors lead us towards an API-first approach.

## Considered options
1. Use a database service with a tightly coupled API built into the dashboard application. This is similar to the approach used by [pages-core](https://github.com/cloud-gov/pages-core/blob/b3a1f6e3c55eba7555ba92007908b40b107886a0/docs/DEVELOPMENT.md#deployment)
1. Use a database service with a separately managed API, similar to [this approach](https://cloud.gov/pages/knowledge-base/website-api/)
1. Use a localized data source and switch to MVC (Model, View, Controller) architecture

## Decision outcome
* Chosen Option: *[tbd]*
* *[justification. e.g., only option, which meets KO criterion decision driver | which resolves force force | ... | comes out best (see below)]*
* *[consequences. e.g., negative impact on quality attribute, follow-up decisions required, ...]* <!-- optional -->

### Success criteria <!-- optional -->

- We can collect and store the data we need with ease
- We can add more data sources with ease
- The app has secure and compliant ways to communicate with its data sources


## Pros and cons of the options <!-- optional -->

### 1. Tightly coupled API

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### 2. Separately managed API

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### 3. MVC architecture
* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->
