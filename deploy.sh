#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
repo="$( cd "$( dirname "$0" )" && pwd )"

node_version="12"

function main {
  export AWS_PROFILE="pokemon-go-calendar-$ENV"
  export AWS_REGION="eu-west-1"
  export AWS_DEFAULT_REGION="$AWS_REGION"
  AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"

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

function init_nodejs {
  export NVM_DIR="${NVM_DIR:-$HOME/.cache/nvm}"
  if [ ! -f "$repo/nvm.sh" ]; then
    curl -o "$repo/nvm.sh" "https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/nvm.sh"
  fi
  source "$repo/nvm.sh"
  nvm use "$node_version" || nvm install "$node_version"
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
