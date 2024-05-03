#!/usr/bin/env bash
set -euo pipefail

cd app

npm test; status=$?

exit $status