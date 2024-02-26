# NextJS demo site

This is a starter template for [Learn Next.js](https://nextjs.org/learn).

This demo requires Node version 18 or higher.

In this directory, run:
```
npm install
```

To install dependencies, then:

```
npm run dev
```

To run the dev server.

See results at `http://localhost:3000`.

## Testing

To run the entire test suite:

```
npm test
```

To run test files matching certain text (one example):
```
npm test -- serverside
```

## Linting

To run eslint and prettier:
```
npm run lint
```

Eslint configurations are found in [.eslintrc.json](./.eslintrc.json).

Prettier configurations are found in [.prettierrc.json](./.prettierrc.json).

By default, NextJS [runs linting](https://nextjs.org/docs/app/building-your-application/configuring/eslint#linting-custom-directories-and-files) on the `pages/`, `app/`, `components/`, `lib/`, and `src/` directories. To change which directories are included in linting, go to [next.config.js](./next.config.js).
