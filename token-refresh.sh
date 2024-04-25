#! /usr/bin/env bash

# Quick script that obtains the token from cloud foundry
# and adds it to the user's local environment variables
#
# Note: you must be logged into the cloud foundry CLI
# for this script to work

file=".env.local"

cf_res=$(cf oauth-token)
token=${cf_res#* }

if [ "$token" == "FAILED" ]; then
  exit 1
else
  sed -i '' -e "s/CF_API_TOKEN=.*/CF_API_TOKEN=${token}/" $file
  echo "Added token to ${file}"
fi
