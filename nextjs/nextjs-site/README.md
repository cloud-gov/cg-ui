# NextJS demo site

This is a starter template for [Learn Next.js](https://nextjs.org/learn).

This demo requires Node version 18 or higher.

## Development

### A note on zscaler

If zscaler is active in your environment, you must make Node aware of your zscaler certificate by setting the `NODE_EXTRA_CA_CERTS` variable. This only needs to be done once.

First output the zscaler certificate in pem format:

```
security find-certificate -a -c zscaler -p > zscaler_root_ca.pem
```

After exporting that .pem, add `export NODE_EXTRA_CA_CERTS=path/to/zscaler_root_ca.pem` to your .zshrc / .bashrc / whatever. That will fix SSL issues during npm install.

### Prerequisites

To access Cloud Foundry data, you must set the following environment variables:

```
CF_API_URL=[your Cloud foundry api url, including https:// and /v version]
CF_API_TOKEN=[your Cloud Foundry oauth token, including the "bearer" prefix]
```

For CAPI requests to work, the url and token must be compatible. For example, you cannot use a development url and a production token together.

To obtain your token, first log into the correct environment in your CLI:

```
cf login -a [your cf domain] --sso
```

Then run:

```
cf oauth-token
```

Copy this token and set it as your `CF_API_TOKEN` variable.

Note that oauth tokens expire frequently. To obtain a new token, just run `cf oauth-token` again and replace your previous variable value with the new one.

Also note that depending on your role, you may not be able to access all Cloud Foundry endpoints.

For storing local environment variables, create a `.env.local` file in the project root. Do not check this file into source control. For more info, see [NextJS docs: Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables).

### Running locally

In this directory, run this to install dependencies:
```
npm install
```

Then run the dev server:

```
npm run dev
```

See results at `http://localhost:3000`

### Testing

To run the entire test suite:

```
npm test
```

To run test files matching certain text (one example):
```
npm test -- serverside
```

### Linting

To run eslint and prettier:
```
npm run lint
```

Eslint configurations are found in [.eslintrc.json](./.eslintrc.json).

Prettier configurations are found in [.prettierrc.json](./.prettierrc.json).

By default, NextJS [runs linting](https://nextjs.org/docs/app/building-your-application/configuring/eslint#linting-custom-directories-and-files) on the `pages/`, `app/`, `components/`, `lib/`, and `src/` directories. To change which directories are included in linting, go to [next.config.js](./next.config.js).

## Assessment

Our assessment of this prototype can be found in [./docs/assessment.md](./docs/assessment.md).
