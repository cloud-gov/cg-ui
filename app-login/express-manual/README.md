# Example using the Cloud.gov identity provider service broker

You can leverage [cloud.gov’s identity hub](https://cloud.gov/docs/services/cloud-gov-identity-provider/) to reduce the burden of authenticating users from government agencies and partners in your app.

This example was adapted from the [cg-demos](https://github.com/cloud-gov/cg-demos/tree/master/cg-identity) repository.

## Deploy the application to Cloud.gov

__NOTE: DO NOT USE THIS APP IN PRODUCTION__

Run the `app.js` node application to authenticate real users. You'll need a [cloud.gov account](https://account.fr.cloud.gov/signup).

Log into Cloud.gov via command line. Change the path after `-a` if you wish to connect to a different cloud foundry instance.

```bash
cf login -a api.fr.cloud.gov --sso
```

If this is your first time setting up the app, create a service broker. Skip this step if you already have a service broker named `uaa-id-example`.

```bash
cf create-service cloud-gov-identity-provider oauth-client uaa-id-example
```

Now, look at the `vars.yml` file and change it as needed. For example, you may wish to change the application route.

Once you're happy with your vars, go ahead and push your app. You should choose a different name than `jvd-id-example` or we will have collisions with the URL. You may also specify a different `vars.yml` file entirely if desired.


```bash
cf push jvd-id-example --vars-file vars.yml
```

At this point you may visit your site with the URL listed in the output of `cf push`. Log in with your GSA credentials. That's pretty much all it does!

### A note about the service broker scope

The service broker only grants the "openid" scope to your user, which means that you can authenticate with UAA using this broker, but you may not use the token to manage resources in the Cloud Foundry API.

### Tearing down after you're done

This application should not remain in Cloud.gov after you are done experimenting. Make sure to remove the application and the service broker:

```
cf delete -f jvd-id-example
cf delete-service -f uaa-id-example
```

## Running the app against local UAA

You may use this application locally if you have Cloud Foundry's UAA (User Accounts and Authentication) server running on your machine.

If you are using the UAA docker example provided in this repository, you should not need to configure anything in this application to successfully connect.

```bash
npm start
```

### Troubleshooting problems with the UAA connection

If you are experiencing difficulty, check the following:

- Ensure that UAA is running locally on port 9000.
- Confirm in the `uaa.yml` file that the client redirect URI matches the port this application is using.
- Confirm that the client id and secret in `uaa.yml` are the same as the defaults in this application's `app.js` file.
- Make sure you are using the email and password for users specified in the `uaa.yml` file.
