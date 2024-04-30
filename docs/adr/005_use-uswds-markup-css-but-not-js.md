# Use USWDS markup and styling, but not javascript

Status: Accepted

## Context and problem statement

As a federal government web application, we strive to use the [U.S. Web Design System](https://designsystem.digital.gov/) (USWDS) for our UI. USWDS is a design system that offers various UI components in the form of HTML markup, SASS modules, and Javascript that make it easier to build accessible, mobile-friendly websites.

We are working in a [NextJS](https://nextjs.org/) app framework that uses [React](https://react.dev/) for DOM elements and interactivity. We [chose this framework](./003_use-nextjs-for-web-framework.md) due to the higher levels of client-side interactivity that we anticipate for this product.

USWDS Javascript comes in two files that are meant to be imported globally and are totally separate from the NextJS/React interactivity pipeline. This causes conflicts in UI interactivity.

We want to use USWDS as much as possible while using only one paradigm for UI interactivity.

## Considered options
1) Use USWDS (HTML + CSS + JS) with USWDS components / use React for everything else
1) Don’t use USWDS JS / re-implement USWDS JS in React while still using USWDS HTML and CSS
1) Use an existing USWDS React component library
1) Don’t use USWDS directly / create our own custom components / take inspiration from USWDS

## Decision drivers / forces

### 1) It is still unknown how far our designs will stray from USWDS defaults

While designers are trying to use USWDS as much as possible as a basis for their designs, many components in our app will not directly correspond to USWDS components.

In terms of interactivity, it is unclear how many highly interactive USWDS components we will end up using.

### 2) Currently, there is no official/sanctioned React component library for USWDS

A few React USWDS component libraries exist, but they are not built or maintained by government entities. Additionally, using a third-party component library would create a nested dependency structure, where we would be beholden to whatever version of USWDS the component library uses. We would like to have more control over when we update USWDS.

### 3) Cloud.gov may want to reuse our UI components for their other products

This suggests that Cloud.gov would like more ownership over their component library, rather than using someone elses.

## Decision outcome

We will move forward with option #2

- We will convert USWDS HTML to JSX
- We will import USWDS SASS modules, and use them as the basis for any CSS customization
- We will not import uswds.js or uswds.init.js, and instead re-implement any needed interactivity in React

Risk: USWDS JS implements some accessibility functionality in addition to interactive functionality.

Mitigations:
- re-implement any accessibility functionality that might be taken away from removing USWDS JS
- have thorough testing (both automated and manual) to ensure accessibility standards are met

Risk: Re-implemented components may diverge from USWDS over time.

We see this as an evergreen risk not only with this approach, but with any approach to using USWDS.

### Success criteria <!-- optional -->

We'll know we've succeeded when a USWDS update is relatively minimal/painless and passes all tests.

## Pros and cons of the options <!-- optional -->

### 1) Use USWDS (HTML + CSS + JS) with USWDS components / use React for everything else

* `+` More "drop-in" approach to using USWDS (might make this the easiest of all options for updating USWDS)
* `-` still need to re-implement USWDS HTML in JSX
* `-` two ways of dealing with interactivity / JS conflicts

### 2) Don’t use USWDS JS / re-implement USWDS JS in React while still using USWDS HTML and CSS
* `+` just one way of dealing with interactivity (React)
* `+` easier to customize while using USWDS as a base
* `+` USWDS UI interactivity is relatively uncomplicated and CSS-forward (using JS for what CSS cannot accomplish)
* `-` USWDS JS accessibility functionality will need to be accounted for

### 3) Use an existing USWDS React component library
* `+` Already built!
* `-` There is no offical/sanctioned USWDS React component library; must use third parties
* `-` Hard to customize on top of
* `-` Creates a nested dependency to USWDS; makes it harder to keep USWDS up-to-date
* `-` USWDS might be building their own web component library soon, but details of how soon are unknown

### 4) Don’t use USWDS directly / create our own custom components / take inspiration from USWDS
* `+` Greatest control over design and implementation; easiest to customize
* `-` Most responsibility to maintain
* `-` Lose any benefits we get from using an existing UI design system
