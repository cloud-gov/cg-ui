#! /usr/bin/env bash

# Quick script that obtains the token from cloud foundry
# and adds it to the user's local environment variables
#
# Note: you must be logged into the cloud foundry CLI
# for this script to work


refresh_token() {
    file=".env.local"
    cf_res=$(cf oauth-token)
    token=${cf_res#* }
    if [ "$token" == "FAILED" ]; then
        echo "Failed to obtain token"
        return 1
    else
        sed -i '' -e "s/CF_API_TOKEN=.*/CF_API_TOKEN=${token}/" $file
        echo "$(date): Updated token in ${file}"
    fi
}

# Function to cleanup background process
cleanup() {
    echo "Cleaning up token refresh process..."
    if [ -f .token-refresh.pid ]; then
        kill $(cat .token-refresh.pid)
        rm .token-refresh.pid
    fi
    exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Initial token refresh
refresh_token

# Start token refresh loop in background
(
    while true; do
        sleep 870  # 14.5 minutes in seconds
        refresh_token
    done
) &

# Store the background process ID
echo $! > .token-refresh.pid
