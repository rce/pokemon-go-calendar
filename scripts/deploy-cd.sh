#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
source "$( dirname "${BASH_SOURCE[0]}" )/lib/common-functions.sh"

function main {
  export ENV="prod"
  setup_aws
  init_nodejs

  # Run deployment
  cd "$repo"

  npm ci
  npx cdk bootstrap "aws://$AWS_ACCOUNT_ID/$AWS_REGION"
  npx cdk deploy --app "npx ts-node infra/ContinuousDelivery.ts" ContinuousDelivery
}

main "$@"
