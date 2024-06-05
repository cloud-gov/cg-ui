## Work quickly with CloudFoundry data

If you're somewhat comfortable with using the command line, here's a quick way to work with CloudFoundry data, using the CloudFoundry command line tool (cf-cli).


### 1. Install the CF CLI tool

If you're on a mac and using [homebrew](https://brew.sh/) to install packages, you can install cf-cli like this ([docs](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#pkg-mac)):
```
brew install cloudfoundry/tap/cf-cli@8
```

### 2. Log into a Cloudfoundry environment

To log into our developer environment:

```
cf login -a api.dev.us-gov-west-1.aws-us-gov.cloud.gov --sso
```

This will prompt you to go through the same Cloud.gov login process that you normally do through the web.

At the end, you'll see a temporary passcode. Copy that passcode and paste it into the cli to finish login.

To log into another environment, replace the url in the command above with the url of your desired environment.

### 3. Make CF API requests through CF CLI

cf-cli has a handy `curl` command, where you can make http requests similar to how our application fetches CloudFoundry data. The application uses CloudFoundry API version 3 ([docs](https://v3-apidocs.cloudfoundry.org/version/3.161.0/#roles)). Use the API endpoints from the docs in a `curl` command to retrieve data.

For example, here's how to fetch all users (that your authentication allows):

```
cf curl "/v3/users"
```

These requests will print the returning json to the command line. You can take that json and search through it in a variety of ways. The quickest way might be to pipe the json into a file, then open that file in a browser window:

```
cf curl "/v3/users" >> users.json
```

Then open `users.json` using a browser. Browsers like Chrome and Firefox have nice formatting capabilities for you to search through the data with ease.
