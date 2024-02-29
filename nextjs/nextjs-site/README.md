# NextJS demo site

This is a starter template for [Learn Next.js](https://nextjs.org/learn).

This demo requires Node version 18 or higher.

### A note on zscaler

If zscaler is active in your environment, you must make Node aware of your zscaler certificate by setting the `NODE_EXTRA_CA_CERTS` variable. This only needs to be done once.

First output the zscaler certificate in pem format:

```
security find-certificate -a -c zscaler -p > zscaler_root_ca.pem
```

After exporting that .pem, add `export NODE_EXTRA_CA_CERTS=path/to/zscaler_root_ca.pem` to your .zshrc / .bashrc / whatever. That will fix SSL issues during npm install.

### Development

In this directory, run this to install dependencies:
```
npm install
```

Then run the dev server:

```
npm run dev
```

See results at `http://localhost:3000`

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
