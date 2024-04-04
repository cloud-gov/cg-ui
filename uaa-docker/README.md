# Cloud Foundry User Accounts and Authentication (UAA)

## What is UAA?

UAA, or the User Account and Authentication Server, is the identity management provider for Cloud Foundry. It can be used directly to store user accounts and related information. It can also be used to connect SSO (single-sign on) third party authentication. You've experienced UAA before if you have signed into cloud.gov when you are prompted to select an agency / method for signing in.

Behind the scenes, there are a couple extra things going on, but at the end of the day once a user is authenticated, UAA will provide the requesting application a user token. If you decode this token, you can read the information within it. For example, when the token expires and the user's "origin" (yours is probably gsa.gov).

Once an application has this token, it can now send requests to a matching Cloud Foundry Controller API (CAPI) to view and manage resources the user has access to. This API works together with the UAA API to ensure users are authenticated.

When running UAA locally, there is no matching CF API to connect to that will allow you to manage resources. However, running it locally gives you the ability to make sure that the authentication portion of your app is functioning similarly to how you would expect to connect to a "real" UAA server.

### Documentation

- [Overview in Cloud Foundry documentation](https://docs.cloudfoundry.org/concepts/architecture/uaa.html)
- [UAA API documentation](https://docs.cloudfoundry.org/api/uaa/version/77.1.0/index.html#overview)

## Running UAA locally

NOTE: this is a proof-of-concept and will likely need more attention before becoming useful for local development.

### Prerequisites

1. Docker is installed and running
2. The ability to disable ZScaler temporarily

### Build the images

Disable zscaler. It will only need to be off for a few minutes.

```bash
sudo launchctl unload /Library/LaunchDaemons/com.zscaler.service.plist /Library/LaunchDaemons/com.zscaler.tunnel.plist
```

Navigate to the `uaa-docker` subdirectory and build the images. Zscaler to be disabled while `Dockerfile-uaa` runs `wget` commands to obtain Tomcat and UAA.

```bash
docker-compose build
```

You may now reenable Zscaler.

```bash
sudo launchctl load /Library/LaunchDaemons/com.zscaler.service.plist /Library/LaunchDaemons/com.zscaler.tunnel.plist
```

### Use UAA with an application

```bash
docker-compose up
```

Give it just a minute, then check `localhost:9000` for your brand new UAA server.

Your application will need the following things in order to work with UAA:

- client id (found in `uaa.yml`)
- client secret (also found in `uaa.yml`)
- listening on `localhost:8000/auth/callback`

You can log in with the demo user emails / passwords found in `uaa.yml`.

Some endpoints that might be useful (see the UAA documentation for more information):

- `localhost:9000/oauth/authorize`
- `localhost:9000/oauth/token`
- `localhost:9000/logout.do`

### Shut down UAA

When you're done, you can stop the containers with ctrl + C and remove them with:

```bash
docker-compose down
```

Simply run `docker-compose up` when you'd like to restart UAA.

### Changing the UAA server configuration

UAA is configured with the `uaa.yml` file. If you would like to change your client id / secret, listen on a different port, add users, or otherwise alter the configuration, you will need to remove your images and rebuild them.

```bash
# list your images
docker images

# remove a specific image using the IMAGE ID or its name
docker rmi fd839271
```

Once the images are removed, use `docker-compose build` and `docker-compose up` to restart the UAA server.

## Debugging

### Inspecting requests

Limited logging is available. You can output it with the following command, swapping in the current date. It may take several seconds for it to display updates to the log file.

```bash
docker exec -it uaa-docker-uaa-1 tail -f /tomcat/logs/localhost_access_log.2024-03-11.txt
```

### Interact with container shell

```bash
docker exec -it uaa-docker-uaa-1 sh
```
