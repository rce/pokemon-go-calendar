#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
repo="$( cd "$( dirname "$0" )" && cd .. && pwd )"

node_version="14"

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

function init_nodejs {
  export NVM_DIR="${NVM_DIR:-$HOME/.cache/nvm}"
  if [ ! -f "$repo/scripts/lib/nvm.sh" ]; then
    curl -o "$repo/scripts/lib/nvm.sh" "https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/nvm.sh"
  fi
  source "$repo/scripts/lib/nvm.sh"
  nvm use "$node_version" || nvm install "$node_version"
}

function setup_aws {
  export AWS_CONFIG_FILE="${repo}/scripts/lib/aws_config"
  export AWS_PROFILE="pokemon-go-calendar-$ENV"
  export AWS_REGION="eu-west-1"
  export AWS_DEFAULT_REGION="$AWS_REGION"

  aws sts get-caller-identity
  AWS_ACCOUNT_ID="$( aws sts get-caller-identity --query Account --output text )"
  export AWS_ACCOUNT_ID
}

function aws {
  docker run \
    --env AWS_CONFIG_FILE=/root/aws_config \
    --env AWS_PROFILE \
    --env AWS_REGION \
    --env AWS_DEFAULT_REGION \
    --volume "${repo}/scripts/lib/aws_config:/root/aws_config" \
    --volume ~/.aws:/root/.aws \
    --volume "$( pwd )":/aws \
    --rm --interactive \
    amazon/aws-cli:2.0.6 "$@"
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
