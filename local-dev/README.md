# Local dev testing

Log into an actual cloud.gov endpoint:

```bash
# production
cf login -a api.fr.cloud.gov --sso
```

Start the application for local dev and pass in your CF token:

```bash
CF_USER_TOKEN=$(cf oauth-token) npm run local
```

Open the app at `localhost:8000` and you should see a short list of applications you have access to in CF, and their current state.

If you start to get authentication errors in the console, you may need to restart the server to get it the latest and greatest token.
