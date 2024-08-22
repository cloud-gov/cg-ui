# File conventions

For consistency throughout the codebase, we will prioritize [Named Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import) over Default Imports

## JS vs TS

Next.js is flexible about which files are TypeScript and which are JavaScript. We would like application files to be TypeScript where possible. Specify where those files are using "JavaScript XML":

```
.ts
.tsx
```

The majority of our tests are JavaScript and use `.js` extensions

## Components

For modular component files, we will use a [Direct File Naming approach](https://www.codevertiser.com/react-components-folder-structure-naming-patterns/#2-direct-file-naming-approach).

We use [Pascal Case](https://en.wiktionary.org/wiki/Pascal_case) for component names and any directories named after components:
  - Incorrect: `orgMembersList`
  - Correct: `OrgMembersList`

Any sub-components specific to a component are located in the same directory. Example of a component and subcomponent file:

```
/components/
     |-- OrgMembersList/
           |-- OrgMembersList.tsx
           |-- OrgMemberListItem.tsx
```


