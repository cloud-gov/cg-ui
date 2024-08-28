# Cloud Foundry User Accounts and Authentication (UAA)

## What is UAA?

UAA is the identity management provider for Cloud Foundry. See the [UAA explainer for more information](../docs/explainers/uaa-cloud-foundry-user-accounts).

## Running UAA locally

NOTE: this is a proof-of-concept and will likely need more attention before becoming useful for local development.

Though you can run UAA locally, it will not generate tokens which are valid for cloud foundry instances, and has limited utility for local development.

### Prerequisites

1. Docker is installed and running
2. The ability to disable ZScaler temporarily

### Build the images

Disable zscaler. It will only need to be off for a few minutes.

```bash
sudo launchctl unload /Library/LaunchDaemons/com.zscaler.service.plist /Library/LaunchDaemons/com.zscaler.tunnel.plist
```

Navigate to the `uaa-docker` subdirectory and build the images. Zscaler to be disabled while `Dockerfile-uaa` runs `wget` commands to obtain Tomcat and UAA. Note, the command may be `docker-compose` for older versions.

```bash
docker compose build
```

You may now reenable Zscaler.

```bash
sudo launchctl load /Library/LaunchDaemons/com.zscaler.service.plist /Library/LaunchDaemons/com.zscaler.tunnel.plist
```

### Use UAA with an application

```bash
docker compose up
```

Give it just a minute, then check `localhost:9001` for your brand new UAA server.

Your application will need the following things in order to work with UAA:

- client id (found in `uaa.yml`)
- client secret (also found in `uaa.yml`)
- listening on `localhost:8000/auth/callback`

You can log in with the demo user emails / passwords found in `uaa.yml`.

Some endpoints that might be useful (see the UAA documentation for more information):

- `localhost:9001/oauth/authorize`
- `localhost:9001/oauth/token`
- `localhost:9001/logout.do`

### Shut down UAA

When you're done, you can stop the containers with ctrl + C and remove them with:

```bash
docker compose down
```

Simply run `docker compose up` when you'd like to restart UAA.

### Changing the UAA server configuration

UAA is configured with the `uaa.yml` file. If you would like to change your client id / secret, listen on a different port, add users, or otherwise alter the configuration, you will need to remove your images and rebuild them.

```bash
docker rmi uaa-docker-uaa
docker rmi uaa-docker-db
```

Once the images are removed, use `docker compose build` and `docker compose up` to restart the UAA server.

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
