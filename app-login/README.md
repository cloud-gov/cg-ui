# Demonstrating the cloud.gov identity provider

You can leverage [cloud.gov’s identity hub](https://cloud.gov/docs/services/cloud-gov-identity-provider/) to reduce the burden of authenticating users from government agencies and partners in your app.

This demo has two parts: 
  1. [running an application in cloud.gov that uses the identiy provider](#1-run-an-application-in-cloudgov-that-uses-the-identity-provider)
  2. [running a local UAA server for local development](#2-run-a-local-uaa-server-for-local-development)

## 1. Run an application in cloud.gov that uses the identity provider

In this example you run the DO-NOT-USE-IN-PRODUCTION `id-example.js` node application 
to authenticate real users. You'll need a [cloud.gov account](https://account.fr.cloud.gov/signup), 
and you should already be logged-in (`cf login --sso`).

### Running the demonstration

First we'll `push` the id-example with a random route, and get that route name
for later use:

```bash
cf push -m 128M --no-start --random-route id-example
app_route=$(cf apps | grep '^id-example' | awk '{print $NF}')
echo $app_route
```

Then, create an identity provider service, and bind that service to our app with the correct callback URL:

```bash
cf create-service cloud-gov-identity-provider oauth-client uaa-id-example
sleep 15 # it takes a moment to provision the oauth-client
cf bind-service id-example uaa-id-example \
  -c '{"redirect_uri": ["https://'$app_route'/auth/callback"]}'
```

Pass the environment variables for the UAA URLs to the application, and start the app:

```bash
cf set-env id-example UAA_AUTH_URL https://login.fr.cloud.gov/oauth/authorize
cf set-env id-example UAA_LOGOUT_URL https://login.fr.cloud.gov/logout.do
cf set-env id-example UAA_TOKEN_URL https://uaa.fr.cloud.gov/oauth/token
cf start id-example
```

At this point you can visit `https://$app_route` and you'll be prompted to log in. 
If you complete that, you'll get a welcome page similar to:

```
Hello fname.lname@agency.gov!

Your access token lasts for another 598 seconds, but will be renewed automatically.

You can also logout.
```

The `logout` link will clear the session in your app, and also redirect you to the cloud.gov `/logout.do` to clear your sessions in UAA.

### Cleaning Up the Example Client

```
cf delete -f id-example
cf delete-service -f uaa-id-example
```

## 2. Run a local UAA server for local development

During application development, you may want to authenticate against a local UAA server
so you can test as multiple users, skip 2-factor authentication, and view UAA logs. 

The most consistent way to run UAA locally is with a Docker container, such as the one from [HortonWorks](https://github.com/hortonworks/docker-cloudbreak-uaa), which one can start up the following command:

```
docker run -d --name uaa-uaa -p 8080:8080 \
  -e UAA_CONFIG_URL=https://raw.githubusercontent.com/18F/cg-demos/master/cg-identity/uaa.yml \
 hortonworks/cloudbreak-uaa:3.6.3
 ```

> You can use your own `uaa.yml` by copying it to, say, `/tmp/uaa/uaa.yml` and running instead: `docker run -d --name uaa-uaa -p 8080:8080 -v /tmp/uaa:/uaa:rw hortonworks/cloudbreak-uaa:3.6.3`

To view the logs, you can use `docker exec uaa-uaa /usr/bin/tail -f /tomcat/logs/uaa.log`

You can then test the local UAA with the included `id-example.js` by running:

 ```
 npm install
 npm start
 ```

 And in a browser going to, http://localhost:8000, clicking on the login link, then using the username `paul`, password `wombat`.
