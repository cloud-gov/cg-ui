# Assessment

## Intro

This describes our results from experimenting with NextJS.

### Why explore this framework over others?

#### 1) Asynchronicity will be the core of this app

The entire app is a web interface for an API that we do not fully control.

#### 2) Javascript is unavoidable

Because of the asynchronous nature of this app, we know we'll need stateful UI interactions, like loading indicators, progress indicators, and live logging.

Regarding maintenance, at minimum we will need a maintainer that's knowledgeable in Javascript.

Regarding deployment, using only Node will allow us to deploy with a single language/runtime/environment over multiple.

#### 3) There is prior JS/React knowledge at Cloud

The current Cloud Pages team uses React, and Brian and Sarah have used React.

#### 4) NextJS was recommended by others

The current maintainer of UK Gov's paas-admin recommended not reusing the code itself, but instead using paas-admin for inspiration, and also recommended looking into newer frameworks like NextJS.

NextJS is the first production-grade React framework [recommended](https://react.dev/learn/start-a-new-react-project#production-grade-react-frameworks) by the React team.

#### 5) NextJS has server-side capabilities that other JS frameworks don't

By default, NextJS [renders components server-side](https://nextjs.org/docs/app/building-your-application/rendering/server-components#using-server-components-in-nextjs). NextJS’s server rendering capabilities allow us to avoid the dreaded "full SPA" approach. We can prevent having to manage data fetching and validation in completely different client and server environments by writing code entirely in Node.

Additionally, this will allow us to move between server and client approaches with ease, instead of having to draw a hard line at the beginning on what tasks should be client-side vs. server-side.

## Assessed elements

Through building this prototype, we assessed NextJS on the following:

| Element | initial questions |
| --- | --- |
| **Working with API data** | Is it performant? Can we test it? How hard is caching? |
| **Routing** | Is dynamic routing possible/easy? |
| **Middleware** | does it have it? How hard is it? |
| **Testing** | Are there robust testing tools available? |
| **Accessibility** | Is there friction to keeping the UI accessible while building? How do we test accessibility? |
| **Security** | What are the known security issues with this framework? How can we mitigate them? |
| **Telemetry** | What tools are available? |
| **Deployment** | How do we deploy a NextJS app to Cloud? |

## Working with API data

### Prototyped
- Created API modules as separate [data access layers](https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer)
- Wrote tests for the API modules

### Observations
- many Node-based solutions exist for fetching API data
- NextJS comes with `fetch` OOTB
- For testing, you'll need a mock of `fetch` in both node and browser contexts
- Next caches by default; has powerful built-in caching capabilities that I haven't fully explored

### Resources
- [NextJS docs: fetch API reference](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [NextJS docs: caching](https://nextjs.org/docs/app/building-your-application/caching)
- [NextJS blog: data access layers](https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer)

### Assessment
- `+` fetch is relatively easy to use compared to other HttpRequest patterns
- caching capabilities have yet to be explored

### Summary
Default caching is nice, but still a bit mysterious. Will need to work with more realistic data sources before we can fully assess it's capabilities and pitfalls. It's something to be aware of while we're building.

## Routing

### Prototyped
- client-rendered components
- server-rendered components
- dynamic routes using data from an external API

### Observations
- There are two routing approaches in NextJS v14: app router and pages router (the NextJS docs change depending on what router you use). Pages router is the older of the two and is being kept around in parallel with app router, so that projects can move to app router gradually. Since this is a brand new project, we would have no need for pages router.
- App routing relies on file/directory naming conventions: all pages are named `page.js` and the directory name is what sets the route name. For example, a `/users` web page would have the file structure `/app/users/page.js`.
- Dynamic routing is possible, and is also handled through file/directory naming conventions. For example, a `/users/123` web page for a single user would have the file structure `/app/users/[id]/page.js`. The `id` param can be called whatever we want, and set to whatever data we want.
- Components under app router are server rendered by default, unless specified otherwise.
- Next comes with a `Link` component for hyperlinks.
- From an a11y standpoint, as of NextJS v10.2, route changes are announced in screen readers.

### Resources
- [NextJS docs: routing fundamentals (app router)](https://nextjs.org/docs/app/building-your-application/routing)
- [NextJS docs: Dynamic routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

### Assessment
- `+` Naming conventions make routing easy to read
- `+` Server-rendered by default
- `+` Dynamic routing is straightforward
- `-` Every page named `page.js` makes development a bit awkward, especially when having multiple pages open at once.

### Summary
It's nice that Next handles routing for us (while exposing routing internals should we need them) using a convention-over-configuration approach.

## Middleware

### Prototyped
- adding a basic middleware function and seeing how it worked by making page requests

### Observations
- NextJS has a Middleware feature
- Middleware runs on every request that matches your selector, even asset requests. This means that your middleware function can easily run multiple times for one page load.
- route matching can use regex through the path-to-regexp tool.

### Resources
- [NextJS docs on middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [path-to-regexp docs](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1)

### Assessment
- `-` You need to really lock down your middleware route selector if you only want your function to run once per page load.
- `-` This means that middleware functions should be idempotent at minimum, but this is hard to catch.

### Summary
Middleware is easy to add in NextJS, but it's a little more finnecky that I'd prefer. We'll need to ensure middleware functions are idempotent and that we're being really specific with our route matchers.

## Testing

### Prototyped
- API testing
- Component testing
- Mocking functions (like `fetch`)
- Adding code linting
- Incorporating testing and linting into CI/GH Actions

Prototype uses the following tools for testing:

- `jest` as the test runner
- `jest-environment-jsdom` provides the DOM environment for testing frontend components
- `@testing-library/jest-dom` provides custom DOM element matchers for jest
- `@testing-library/react` (AKA React Testing Library) for rendering react components in a test DOM
- `nock` for mocking fetch (used in API requests)
- `eslint-` packages for code linting

### Observations
- I settled on Jest as the test runner after reading discussion threads and blog posts on what to choose. Here are some things I like about it:
  - Well-maintained, with a large and growing community of users
  - Very light lift to set up with NextJS, as compared to other runners
  - Parallel test runs make it more performant (allegedly)
  - Includes code coverage reporting
  - While I don’t think it’s needed soon, I like having snapshot testing as an option down the road.
- Jest doesn’t implement a mock of `fetch` by default, so you must mock it yourself. There are many tools to choose from. After using a few (msw, whatwg-fetch) and running into roadblocks, I landed on nock, which I noticed pages-core also uses. I used nock to disable all network requests in the test suite.
  - Note: Stable version of nock [doesn’t work with Node v18](https://github.com/nock/nock/issues/2397#issuecomment-1925478357), so need to use nock@beta
- There are different Jest environments: `node` and `jsdom`. Node is the default (set in `jest.config.js`) which is fine for testing things like the API. But for any tests that need a browser, I override the jest environment to be jsdom at the top of the test file.
- React Testing Library's guiding principle is: "The more your tests resemble the way your software is used, the more confidence they can give you. So rather than dealing with instances of rendered React components, your tests will work with actual DOM nodes."
- RTL has a synchronous way of querying HTML output (any query with `get`) and an async way (any query with `find`). The synchronous way will not call react hooks like useEffect, whereas the async functions will.

### Resources
- [NextJS docs on testing](https://nextjs.org/docs/app/building-your-application/testing)
- [Comparing Node JS testing frameworks](https://blog.logrocket.com/comparing-best-node-js-unit-testing-frameworks/) (the comparison chart at the bottom is helpful)
- [Thread on whether to keep using Jest](https://www.reddit.com/r/node/comments/xhb4bi/best_test_framework_for_node_in_2022/)

### Assessment
- `+` RTL is straightforward to use when the user initiates the action that updates React component state, like a "click" or a "submit."
- `-` I like RTL's guiding principle in theory, but it makes testing React components a bit awkward in practice, especially when React hooks are involved (that client-rendered components would use).
- `-` For components that update state on page load (a very common pattern in React apps), there is no explicit user action, and so tests end up looking a little magical.
- `-` The upside to RTL being really lightweight is that testing server-rendered components (or any component that just uses props) is very simple. Just pass the props you want to the component, and test away.

### Summary
Testing in NextJS is no more or less complex than in any Javascript environment. You use the same tools that you would for any node/react app.

## Accessibility

### Prototyped
- Ran Google's Lighthouse tool on the initial app; will need to incorporate this into CI
- Implemented different kinds of Link components to evaluate [these concerns](https://github.com/vercel/next.js/discussions/13125) (tabbing through links worked, even when `a` tags were wrapping other elements).
- TODO: add USWDS styling to the asset pipeline

### Observations
- By default, Next.js includes the `eslint-plugin-jsx-a11y` plugin to help catch accessibility issues early
- React Testing Library encourages finding elements by `role` instead of by text, which encourages a11y by adding roles to elements

### Resources
- [NextJS statement on accessibility](https://nextjs.org/docs/architecture/accessibility)
- [How to implement many a11y elements in NextJS](https://prismic.io/blog/nextjs-accessibility)
- [React Testing Library's ByRole queries](https://testing-library.com/docs/queries/byrole/)

### Assessment
- `+` Routing changes are announced to screen readers

### Summary
I don't see issues in NextJS that would prevent us from complying with section 508. Ensuring accessibilty seems the same level of effort as any other web framework.

## Security

### Prototyped
- Tried adding the `server-only` import on the data access layers and got the expected error when trying to call that API function from a client-side component.
  - TODO: add a permanent example of this in action to the prototype

### Observations
- I found content on security best practices around the NPM ecosystem as a whole, but didn't really find any issues pertaining to NextJS specifically.

### Resources
- [NextJS blog: How to think about security](https://nextjs.org/blog/security-nextjs-server-components-actions)
- [NextJS docs: Authentication](https://nextjs.org/docs/pages/building-your-application/authentication)
- [NextJS docs: Content Security Policy](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)

### Assessment
- `-` While you're developing, the line between server and client is less clear that it would be with a separate server framework. But there are mitigations for this, like the 'client-only' and 'server-only' directives.
- `-` Configuring a content security policy (CSP) requires using middleware

### Summary


## Telemetry

### Prototyped

### Observations
- Next.js recommends using OpenTelemetry (OTel) and supports its instrumentation OOTB.
- CloudFoundry's OpenTelemetry Collector is an experimental feature that's not ready for production systems yet.
- Current Cloud team uses Prometheus, the current metrics of which are not OTel compatible. Prometheus is moving to support ingesting OTel metrics, but OTel Metrics do not align with Prometheus Metrics.

### Resources
- [NextJS docs: OpenTelemetry](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)
- [CloudFoundry docs: OpenTelemetry](https://docs.cloudfoundry.org/loggregator/opentelemetry.html)

### Assessment

### Summary


## Deployment

### Prototyped
- Deployed the app via `cf push`

### Observations

### Resources

### Assessment

### Summary
