# Use TypeScript

Status: Accepted

## Context and problem statement

Our JavaScript web app will have maintainers with varying levels of JS experience. JavaScript is a dynamically typed language. Maintainers may have more experience in back-end languages where static typechecking is common.

Static type checking has been known to:

* catch lower-level bugs earlier in the development process
* enforce stricter contracts between code modules
* create more self-documenting code

Our hypothesis is that static type checking will help both JavaScript newcomers and experts write better, more maintainable code.

TypeScript is a static type-checker for JavaScript. TypeScript code converts to JavaScript and runs anywhere JavaScript runs. TypeScript has been gaining popularity in the JavaScript community, so much so that some would call it an emerging standard. The documentation for NextJS, our web app of choice, has TypeScript for their default code examples, which implies a preference for TypeScript over plain JavaScript. TypeScript can be gradually introduced to a codebase over time.

## Decision drivers / forces

* The need to keep the codebase as maintainable as possible
* The need to prevent unnecessary bugs from reaching the end user
* The need for more documentation of our code

## Considered options

* Keep using plain JavaScript
* Use TypeScript

## Decision outcome

We will use TypeScript by gradually introducing it to the codebase. We will build every new module in TypeScript. Eventually, we will use code linting to enforce TypeScript usage.


### Success criteria <!-- optional -->

We will know we've succeeded when we can recognize each of the TS benefits listed below during development.

We anticipate that the benefits of TypeScript will only increase as the app enters production and matures.

## Pros and cons of the options <!-- optional -->

### Keep using plain JavaScript

* `+` Quicker to write
* `-` Easier for lower level mistakes to slip through to the end user
* `-` Makes data types implicit (developer must keep these in their head while writing)

### Use TypeScript
* `+` Can increase confidence in our code quality
* `+` Can catch lower-level mistakes before they are committed
* `+` Can provide guardrails for proper JS usage
* `+` Makes the codebase more self-documenting
* `+` Can be introduced gradually into the codebase
* `-` Has a learning curve
* `-` Takes slightly longer to write
