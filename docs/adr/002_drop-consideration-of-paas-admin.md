# Drop consideration of paas-admin as foundation for UI rebuild

Status: Accepted

## Context and problem statement

The Cloud.gov dashboard team needs to determine the tech stack with which the future dashboard will be built. We are evaluating several possibilities, including two open source solutions: the dashboard currently in use by Cloud.gov, Stratos, and `paas-admin`, a dashboard previously used by the UK's Government Digital Service.

## Decision drivers / forces

After the team decided to [drop consideration for Stratos](https://github.com/cloud-gov/cg-ui/blob/main/docs/adr/001_drop-consideration-of-stratos.md), we chose to investigate [paas-admin](https://github.com/alphagov/paas-admin) as an alternative foundation to build the cloud.gov dashboard on. GDS previously provided a PaaS service based on Cloud Foundry, the same underlying technology used by cloud.gov. Given the ongoing communication between the GDS and cloud.gov teams, many of the cloud.gov team members were already aware of `paas-admin` and the general consensus was that it was well received by those that had seen it in use. For those reasons the team felt it was worthy of additional research and investigation.

## Considered options
* Fork `paas-admin` and adapt it to be used as the foundation of the cloud.gov dashboard
* Drop consideration for `paas-admin` if sufficient evidence is found that is is not a good fit

## Decision outcome
We have chosen to drop consideration of `paas-admin`, and intend to use it as an inspiration for the cloud.gov dashboard, and where possible, re-use components of the project within our own codebase.

* `+` May already have lower-level components (like CF authentication) that we would need to build.
* `+` This was a previous solution used by real customers and shaped by substantial user research by the UK Government.
* `+` The `paas-admin` dashboard made use of info panels that would communicate the corresponding CF CLI commands to run which the team felt improves developer experience.
* `-` Overall, the GDS PaaS service being sunset and `paas-admin` being archived limited many of the benefits of potentially collaborating with and pulling in upstream changes from GDS's `paas-admin` implementation.
* `-` While the team appreciated the simplicity of the dashboard, as compared to Stratos it was quite limited on the functionality it provided, mostly basic user and app management.
* `-` `paas-admin` relies heavily on additional custom endpoints for accounts and billing which do not exist on cloud.gov, which would require refactoring of parts of the code architecture
* `-` Current maintainer recommended looking at the project for inspiration, but did not recommend using the code itself, as it was deemed out of date.
* `-` Previous 18F project teams who have made similar decisions to fork open source projects for their own greenfield uses ultimately recommend [not doing this](https://docs.google.com/document/d/1EIhM9OaZ53554QPqMTQmEK0ERoKJoCZ9n-bQJexw6EQ/). Instead, they prefer the flexibility that comes from building from scratch, while using previous projects as learning resources.
* `-` We’d have to contend with previous architecture decisions that may not exactly fit our needs.
  - For example, we’d need to change all styling from the UK’s to USWDS.

  In short, we can still benefit from their work without having to use their same codebase.