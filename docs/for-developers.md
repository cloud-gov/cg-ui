# For developers

## Architecture and directory structure

Next.js has few opinions on how to structure application code, so our team has chosen the following conventions:

### Data-to-UI Application Layers

This convention follows an [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)-like pattern, with some Next.js specificities. Our priorities are:

- Keep business logic out of UI components
- Each layer has [one responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle)
- Each layer is easy to test

#### 1. Data Access Layer

- **Responsibility**: Talks to other data sources
  - In MVC terms, this is like the Model
- **Returns**: responses from those data sources
- **Example**: Cloud Foundry API requests
- **Where it lives**: `api/[data_source]/[model]`
  - Example: `api/cf/orgs.ts`

#### 2. Business logic / side effects layer

- **Responsibility**: performs all business logic and side effects for a user action
  - In MVC terms, this is like the Controller
- **Returns**: any errors that arise from the procedure; otherwise passes on any payload for the UI
- **Example**: removing a user from an organization requires multiple CF API calls, and will eventually require logging/telemetry
  - This layer may compose data access layer functions in various ways to achieve what it needs to
  - this layer Is modular and UI agnostic: it is built to be reused for various UI forms
- **Where it lives**: `/controllers`

#### 3. Form Actions layer

_Form Actions is a Next.js specific [term](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#behavior)_

- **Responsibility**: Interfaces with the UI; specific to that UI
  - Used by UI components
  - Calls a business logic layer function (ideally only calls one, but may call multiple)
  - Responsible for evaluating the success/error messages from the BL layer and wordsmithing them for that UI
  - Responsible for munging the returned payload into the format needed for that UI
- **Returns**: human-readable success/error messages; formatted payload for the UI
- **Example**: remove user from an org close button calls a form action
- **Where it lives**: inside `/app` routes, next to page files
  - Example: `app/orgs/[org_id]/actions.ts`

#### 4. UI Components

- **Responsibility**: UI visuals and interactive logic
  - In MVC terms, this is the View
  - Calls a form action on user submission
  - Avoid adding business logic to UI Component files
- **Returns**: Displays human-readable success/err messages returned from form action; updates displayed data accordingly
- **Where they live**:
  - Page-level components: inside `/app` routes
  - Lower-level, modular components: `/components`

### Component files
- For modular component files, we will use a [Direct File Naming approach](https://www.codevertiser.com/react-components-folder-structure-naming-patterns/#2-direct-file-naming-approach)
  - Example file path: `/components/OrgMembersList/OrgMembersList.tsx`
- For consistency throughout the codebase, we will prioritize [Named Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import) over Default Imports
- Any sub-components specific to that component will be under the same directory
  - Example file path for OrgMembersList sub-component: `/components/OrgMembersList/OrgMember.tsx`
- We will use [Pascal Case](https://en.wiktionary.org/wiki/Pascal_case) for component names and any directories named after components:
  - Incorrect: `orgMembersList`
  - Correct: `OrgMembersList`
