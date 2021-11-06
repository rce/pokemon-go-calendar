#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
source "$( dirname "${BASH_SOURCE[0]}" )/lib/common-functions.sh"

function main {
  setup_aws
  init_nodejs

  # Build lambda
  cd "$repo/src"
  npm install

  # Run deployment
  cd "$repo"

  npm install
  npx cdk bootstrap "aws://$AWS_ACCOUNT_ID/$AWS_REGION"
  npx cdk deploy --app "npx ts-node infra/Infra.ts" Stack
}

function check_env {
  FILE_NAME=$(basename "$0")
  if echo "${FILE_NAME}" | grep -E -q 'deploy-(prod)\.sh'; then
    export ENV=$(echo "${FILE_NAME}" | sed -E -e 's|deploy-(prod)\.sh|\1|g')
    echo "Deploying to [${ENV}]"
  else
    echo >&2 "Don't call this script directly"
    exit 1
  fi
}

check_env
main "$@"
