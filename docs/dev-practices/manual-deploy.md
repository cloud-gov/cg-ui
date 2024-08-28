# Manually deploying the application

This application is automatically deployed to the `cloud-gov` organization and `cg-ui` space using a Concourse CI pipeline. However, there are times when you may wish to manually push your version of the application, such as if you want to share a branch preview or test something before merging it into the main branch.

## Manual steps

### Step 1: Create a variables file

Copy the example cloud config. `.env.cloud.yml` should not be tracked with version control.

```bash
cp .env.cloud.example.yml .env.cloud.yml
```

### Step 2: Get the app's environment variables

Log into the development environment and target the org and space where the application is deployed:

```bash
cf login -a api.dev.us-gov-west-1.aws-us-gov.cloud.gov --sso

cf target -o cloud-gov -s cg-ui
```

We will need to get the environment variables our application needs in order to configure our manifest file. You can get these from the CF CLI (output is sensitive):

```bash
cf env cg-ui
```

### Step 3: Copy in the variables to your config

Copy the variables that appear under the `User-Provided` heading into your config file. If the `cf env` output has more variables than your config file, add them as well.

### Step 4: Push!

Now you're ready to deploy the application! Your `cf target` readout should still list `cloud-gov` and `cg-ui`. From the root of the application directory, run:

```bash
cf push --vars-file .env.cloud.yml
```

Open a new terminal window and watch the application's logs as the deployment proceeds. This will help you troubleshoot any problems that might arise:

```bash
cf logs cg-ui
```

## Recurring need for branch previews

If you find yourself repeatedly needing to preview a branch, you may wish to set up more application instances. You will need to alter the UAA client configuration for more deployed versions of the application to correctly authenticate with UAA.
