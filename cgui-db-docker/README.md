# README

Creates a local database instance.

## Running the database

Make sure that docker is installed and running.

Navigate to the `cgui-db-docker` subdirectory.

Build the postgresql image. You may skip this step if you have already done this before. Note, the command may be `docker-compose` for older versions.

```bash
docker compose build
```

Now create or relaunch the containers.

```bash
docker compose up
```

Your database will be available on

```bash
postgresql://postgres:password@localhost:5434/cgui-test
```
## Interacting with your DB via CLI

Make sure your database is running with `docker compose up`. Then double check the name of your container:

```bash
docker ps
```

Now shell into the container (change the name to match the result from listing the container if different):

```bash
docker exec -it cgui-db-docker-db-1 bash
```

Log into psql and use psql commands as desired.

```
psql -U postgres

# connect to database
\c cgui-test
```

## Clean up docker

Remove the container and image.

```bash
docker rm cgui-db-docker-db-1
docker rmi cgui-db-docker-db
```

You may also remove the volume, although by leaving the volume you retain whatever data may be in it.

```bash
docker volume rm cgui-db-docker_db-data
```
