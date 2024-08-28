# Cloud.gov UI prototype

This is a prototype for a future Cloud.gov user interface.

The repository is based on a starter template for [Learn Next.js](https://nextjs.org/learn).

It requires Node version 20 or higher.

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
CF_API_TOKEN=[your Cloud Foundry oauth token, excluding the "bearer" prefix]
```

For CAPI requests to work, the url and token must be compatible. For example, you cannot use a development url and a production token together.

Also note that depending on your user's permissions, you may not be able to access all Cloud Foundry endpoints.

For storing local environment variables, create a `.env.local` file in the project root. Do not check this file into source control. For more info, see [NextJS docs: Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables).

### Running locally

In this directory, run this to install dependencies:

```bash
npm install
```

#### Configure your CF API access

Copy `.env.example.local` to `.env.local`. Adjust or fill in values as needed.

To obtain your token, first log into the correct environment in your CLI:

```
cf login -a [your cf domain] --sso
```

You can view your token at `cf oauth-token` and manually copy everything after "bearer" into `CF_API_TOKEN`, or you can run a script to do this for you:

```
./token-refresh.sh
```

This command will be run automatically when you start your application if you use `npm run dev-cf`.

Note that oauth tokens expire frequently. To obtain a new token, just run `cf oauth-token` again and replace your previous variable value with the new one.

Start the database Docker container:

```bash
cd cgui-db-docker
docker-compose build
docker-compose up
```

Start the user accounts and authentication (UAA) container. Follow the README in `uaa-docker` if this is the first time you're starting it.

```bash
cd uaa-docker
# follow instructions to build before running up
docker-compose up
```

Then run the dev server:

```bash
# to run with a valid cloud foundry token
npm run dev-cf

# to run without accessing cloud foundry resources
npm run dev
```

See results at `http://localhost:3000`

#### Optionally configure s3 access

This application relies on an s3 bucket to pull information about a user's last access date and their account status (active vs inactive). This bucket is populated by the [uaa-bot](https://github.com/cloud-gov/uaa-bot).

If you wish to pull this information for local development, you may optionally set up access to ths s3 bucket.

Create a new service key for your targeted org and environment:

```
cf create-service-key cg-ui-storage [name-of-your-key]
```

Pull down the key (this contains sensitive information):

```
cf service-key cg-ui-storage [name-of-your-key]
```

You are interested in these parts of the key:

```
{
  "access_key_id": "...",
  "bucket": "...",
  "region": "...",
  "secret_access_key": "..."
}
```

Copy the values into your `.env.local` file for the variables `S3_ACCESS_KEY_ID`, `S3_ACCESS_KEY_SECRET`, `S3_BUCKET`, AND `S3_REGION`.

When you finish doing what you need to do locally, make sure to delete the service key:

```
cf delete-service-key cg-ui-storage [name-of-your-key]
```

### Testing

Start your docker database container. You will need this running for tests which manipulate the database:

```
cd cgui-db-docker
docker-compose up
```

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

### Authentication (development)

Authentication functionality relies on the app talking to a UAA server. See the [README](../../uaa-docker/README.md) in the `uaa-docker` directory for instructions on how to run this server locally with Docker.

Authentication also relies on certain environment variables. Locally, these will be set in your `.env.local` file. Examples can be found in [.env.test](./.env.test), or talk to a team member to obtain them.

Authentication business logic is found in NextJS [middleware](./middleware.js).

## Working with USWDS

In order to control when we upgrade USWDS, the `@uswds/uswds` npm package has been installed using the `--save-exact` flag.

### SASS

By default, NextJS has a way of compiling SASS, as well as Autoprefixer. This eliminates the need to use tools like uswds-compile or Gulp.

SASS compilation configs can be found in [next.config.js](./next.config.js)

The global SASS entrypoint is [assets/stylesheets/styles.scss](./assets/stylesheets/styles.scss). USWDS theme settings are configured at the top of that file.

Our team keeps custom CSS/SASS to a minimum and takes a [utilities-first](https://designsystem.digital.gov/utilities/) approach.

When adding styles, work through this order:

1. Can [USWDS utilities](https://designsystem.digital.gov/utilities/) be used?
1. If not, can [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/) be used?
1. If not, then add custom CSS/SASS

### Images

Nextjs has a top-level [public folder](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets) where static assets can be stored. Assets stored here can be used as `src` urls by removing the `/public` prefix.

#### Examples:

```
// Folder: /public/img/uswds/icon.png

<img src="/img/uswds/icon.png" />

// Folder: /public/js/uswds/uswds.min.js

<Script src="/js/uswds/uswds.min.js" />
```

After a USWDS npm package update, copy the following files from `node_modules/@uswds/uswds/dist/` to `/public`:

```
/public
  /img
    /uswds
      - [any images from uswds that you need]
```

For ease of updating, use the same file names. (This process could be converted to a script down the road.)

### JavaScript

Because interactivity will be handled through React, USWDS JavaScript will not be used.

## Deployment

This application is deployed to the cloud.gov development environment using a concourse pipeline (see the `ci` directory), and is registered as a client for the CF UAA authentication service.

As you will not have access to any Cloud Foundry functionality without UAA authentication, we recommend you contact the cloud.gov team to request an additional deployment pipeline be set up for you, rather than using a manual process to deploy.

## Updating dependencies

### Updating Node

The Node version should be updated in the following places:

1. [.nvmrc](./.nvmrc) which controls the version for cloud builds
1. [Github workflow containers](./.github/workflows/pull-request.yml) `NODE_VERSION` which controls the version in Github action containers
1. [package.json](./package.json) under `engines` to specify which version(s) our app works with
1. [Concourse docker-compose](./ci/docker/docker-compose.yml) and [pipeline](./ci/pipeline.yml)

## Further reading

- [More developer documentation](./docs/for-developers.md)
- [Architecture decision records](./docs/adr)
