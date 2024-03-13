# Add a separate data store to app

Status: <!-- pick one -->

Draft

## Context and problem statement

It's likely that our web app will need a data store in addition to what Cloud Foundry provides. Anticipated uses of this data store include:

- session management
- user metrics like used platforms, browsers, etc.
- allowing users to set preferences that can persist
- tailoring the experience based on user roles/attributes

## Decision drivers / forces

The app is a web UI for Cloud Foundry data, and so the app's primary data source will be from an API.

Eventually, the app might need to talk to multiple external data sources, especially while other products are consolidated into it.

While we don't see an immediate need, it's possible that this new data store will need to communicate with other clients besides our app.

These factors lead us towards an API-first approach.

## Considered options
1. Use a Cloud.gov RDS (Relational data Base) service with an API, similar to [this approach](https://cloud.gov/pages/knowledge-base/website-api/) or the approach used in [pages-core](https://github.com/cloud-gov/pages-core/blob/b3a1f6e3c55eba7555ba92007908b40b107886a0/docs/DEVELOPMENT.md#deployment)
1. Use a localized data source and switch to MVC (Model, View, Controller) architecture

## Decision outcome
* Chosen Option: *[option 1]*
* *[justification. e.g., only option, which meets KO criterion decision driver | which resolves force force | ... | comes out best (see below)]*
* *[consequences. e.g., negative impact on quality attribute, follow-up decisions required, ...]* <!-- optional -->

### Success criteria <!-- optional -->

- We can collect and store the data we need with ease
- We can add more data sources with ease
- The app has secure and compliant ways to communicate with its data sources


## Pros and cons of the options <!-- optional -->

### 1. Use a Cloud.gov RDS service with an API

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### 2. Use a localized data store with MVC architecture
* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->
