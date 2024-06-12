#! /usr/bin/env bash

# Script that resets the users and roles for the development environment's
# development org for user testing.
#
# Requirements:
#   1. You must be logged into a CF CLI
#   2. Set the values in `script.env` (users must be existing Cloud.gov users for specified environment)

# load in variables ORG_NAME, ORG_MANAGERS, and ORG_AUDITORS
directory_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$directory_path"
source script.env

echo "Resetting the users for ${ORG_NAME}"

for i in "${ORG_MANAGERS[@]}"
do
  cf set-org-role "$i" "$ORG_NAME" OrgManager
done

for i in "${ORG_AUDITORS[@]}"
do
  cf set-org-role "$i" "$ORG_NAME" OrgAuditor
done
