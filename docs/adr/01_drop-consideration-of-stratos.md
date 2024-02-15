# Drop consideration of Stratos as foundation for UI rebuild

Status: Proposed

## Context and problem statement

The Cloud.gov UI dashboard rebuild team needs to determine the tech stack with which the future dashboard will be built. We are evaluating several possibilities, including the dashboard currently in use by Cloud.gov, Stratos, and a dashboard previously under development by the UK's Government Digital Service, paas-admin.

## Decision drivers / forces

Our ideal dashboard will be user-centered and easy to use for people with different roles in an organization, not just developers. Beyond the end user, we also need a solution that’s easy to learn and maintainable by future developers. Cloud.gov commits to being responsible for a first-class web experience; the composition of the team that will develop and maintain the dashboard is yet undetermined.

## Considered options

1. Stratos
1. GDS's paas-admin
1. Build from scratch

## Decision outcome

- Ruled out: Stratos
- In the running: paas-admin and building from scratch

Justification: We will not pursue Stratos as a foundation for our future dashboard. We have determined that becoming familiar with the codebase is a hurdle for both our team and future teams unfamiliar with the technology, and it will require significant reworking in terms of API integration and frontend design.

Consequences: We will pursue more in-depth evaluation of paas-admin to determine if we would prefer to base an application off of it or begin from scratch.

## Pros and cons of the options

### Option 1: Stratos

The first option we explored was to reuse part or all of Stratos's codebase as the foundation for our future application. Although it seemed unlikely we would keep the Angular frontend, there was a possibility that we might find the Go layer that connects to the API, jetstream, valuable for us to reuse.

Pros

- Stratos is currently approved for use as part of Cloud.gov's FedRAMP moderate package. Reusing Stratos may reduce the time required to obtain approval for a new dashboard's use.
- Stratos is a functional piece of software with an interface familiar for current Cloud.gov users

Neutral

- In the past few years, Stratos has not been actively supported by its community. However, the Cloud Foundry community is beginning to talk about renewed efforts to upgrade and maintain Stratos.

Cons

- Users find it difficult to accomplish tasks like user management in Stratos. The UI is not user-centered, and requires knowledge of Cloud Foundry concepts to navigate.
- Stratos is built with a Go backend and an Angular frontend. While Cloud has developers with experience in Go, there are none with experience in Angular. Few developers at Cloud.gov are familiar with the Stratos codebase nor are comfortable making changes to it.
- Stratos is built around Cloud Foundry's v2 API, although there is a v3 API now available. We would need to take on the work to re-architect Stratos around the v3 API.
- Cloud.gov currently uses a subset of Stratos’ capabilities, and it’s unknown which exact features of Stratos are more valuable to current users than others.

### Option 2: paas-admin

GDS's paas-admin is another existing UI for cloud foundry functionality.

Pros

- paas-admin was designed based on user research. It may be more accessible for our user base than Stratos.
- paas-admin uses templates and a web design system which may make it easier for us to modify it for use with USWDS.
- It is built in React and Typescript, commonly used languages / frameworks for frontend user interfaces.
- paas-admin uses a combination of Cloud Foundry v2 and v3 API URLs, and may require less work to upgrade more functionality to v3 API
- At a glance there appears to be a good deal of tooling set up and tests for the code that already exists, this would likely save us time and effort.

Cons

- The application was not fully built-out. It has limited functionality and offers a small subset of the features that Stratos offers to users.
- Paas-admin relies on multiple custom APIs which are not applicable to cloud.gov.
- Much of paas-admin is built in Typescript. Typescript is not a language in use at Cloud.gov.

### Option 3: build from scratch

A final option available to us is to begin afresh in whatever technologies we find most suitable, and simply use Stratos and paas-admin as inspiration.

Pros

- We could create layouts / templates that make sense with the USWDS and design choices. These layouts could then be leveraged by Pages, authentication, and future products. We have the most freedom with this option to meet our end user needs.
- This option gives us an opportunity to choose a stack that will be most approachable for existing Cloud.gov staff and future hires.
- We can learn from existing codebase's architecture decisions without actually having to work with their code

Neutral

- Rolling our own app means the burden of all the decisions lies on this team, instead of relying on previous team's decisions and lessons learned. However, it also means we are not beholden to decisions that are not right for our goals.

Cons

- This option requires the most effort on our part just to get something off the ground. It may take substantial time to set up the initial development environments and integrations.
