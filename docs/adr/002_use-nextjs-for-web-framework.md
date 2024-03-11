# Use NextJS for our web app framework

Status: Proposed

## Context and problem statement

We need to replace a web user interface that communicates with a CloudFoundry API.

The existing solution, [Stratos](https://stratos.app/), is an open source project that is no longer maintained. (You can read our [previous decision](https://github.com/cloud-gov/cg-ui/blob/main/docs/adr/01_drop-consideration-of-stratos.md) not to continue with Stratos.)

The UK Government recently [decommissioned](https://gds.blog.gov.uk/2022/07/12/why-weve-decided-to-decommission-gov-uk-paas-platform-as-a-service/) their version of a similar tool named [PaaS Admin](https://github.com/alphagov/paas-admin/), which is also open source.

Other than these two products, no other production-level open source products exist for this problem space.

## Decision drivers / forces

This led us to explore a custom-built solution using a web app framework.

We’re not sure what exact level of client-side interactivity we’re going to need, but we know that it’s more than static website and less than Single Page App (SPA).

The fact that the app will rely on API’s for its data leans us towards anticipating  more client-side interactivity than less. At minimum, it will need loading indicators, progress indicators, and multi-step forms. We also know we’ll need live logging.

At this stage, we want to pick tools that we can quickly iterate with, while leaving open the possibility of tech stack changes.

We also bias towards "[boring](https://boringtechnology.club/)" technology where the production-grade qualities have been proven and there’s a large and growing community of support.

We also want to try choosing languages and tools that other people at Cloud.gov have used or are familiar with.

These reasons led us to explore modern Javascript/Node frameworks.

## Considered options

1. Build on the current Stratos architecture (decided in [ADR 001](https://github.com/cloud-gov/cg-ui/blob/main/docs/adr/01_drop-consideration-of-stratos.md))
1. Build on a fork of UK Gov paas-admin
1. Build on CG Pages
1. Build new server-side app and use HTMX for frontend interactivity

## Decision outcome

We will use NextJS as our web app framework.

Of the Javascript frameworks that exist, we selected [NextJS](https://nextjs.org/) for the following reasons:

- `+` NextJS moves towards convention over configuration for Node apps.
  - Offers lots of tooling OOTB that we’d need anyway. For example, it makes CRUD routing easy / OOTB.
- `+` NextJS does server-side rendering OOTB, so we have the flexibility to render server-side when we can and client-side when we must. We’ll be able to freely switch between the two in order to quickly find the right balance.
- `+` For asynchronous requests, NextJS and React have built-in [Suspense and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) capabilities for progressive page loading.
- `+` At this point, we consider React and its related Node-based tools to be "boring" technology. As all tools are, they’re imperfect, but they’re imperfect in ways that we know well and know how to mitigate.

It’s no secret that the frontend space has changed a lot in the last decade. There’s a risk that we’re choosing _yet another_ shiny new frontend framework.

Our [assessment](https://github.com/cloud-gov/cg-ui/blob/main/nextjs/nextjs-site/_docs/assessment.md) is that NextJS is a good culmination of what the Javascript world has learned during this period of rapid change, and models the best practices that have emerged. We don’t have to be so afraid of Javascript frameworks anymore.

### Success criteria <!-- optional -->

- We can move quickly while keeping our code maintainable
- Framework does not pose unusual barriers to compliance

## Pros and cons of the options <!-- optional -->

### Option 2: Build on a fork of UK Gov paas-admin

- `+` May already have lower-level components (like CF authentication) that we would need to build.
- `+` This was a previous solution used by real customers and shaped by substantial user research by the UK Government.
- `-` Current maintainer recommended looking at the project for inspiration, but did not recommend using the code itself, as it was deemed out of date.
- `-` Previous 18F project teams who have made similar decisions to fork open source projects for their own greenfield uses ultimately recommend [not doing this](https://docs.google.com/document/d/1EIhM9OaZ53554QPqMTQmEK0ERoKJoCZ9n-bQJexw6EQ/). Instead, they prefer the flexibility that comes from building from scratch, while using previous projects as learning resources.
- `-` We’d have to contend with previous architecture decisions that may not exactly fit our needs.
  - For example, we’d need to change all styling from the UK’s to USWDS.

In short, we can still benefit from their work without having to use their same codebase.

### Option 3: Build on CG Pages

TK

### Option 4: Build new server-side app and use HTMX for frontend interactivity

- `+` It's the suggested solution for maintainers with backend expertise.
- `+` Server-rendered components have potential to remove complexity from the frontend.
  - NextJS’s server-rendering capabilities have this same potential.
- `-` A server-based solution is odd, since we have no immediate need for a localized database.
- `-` While familiar with the concept, no one on the team has used HTMX in practice, and so it seems overly risky to use it on such a fundamental piece of architecture
    - If HTMX is insufficient and it turns out we need to add Javascript anyway, we’ll end up with a bifurcated architecture similar to Stratos.
