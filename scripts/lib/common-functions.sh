repo="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ../.. && pwd )"

node_version="14"

function init_nodejs {
  export NVM_DIR="${NVM_DIR:-$HOME/.cache/nvm}"
  if [ ! -f "$repo/scripts/lib/nvm.sh" ]; then
    curl -o "$repo/scripts/lib/nvm.sh" "https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/nvm.sh"
  fi
  source "$repo/scripts/lib/nvm.sh"
  nvm use "$node_version" || nvm install "$node_version"
}

function setup_aws {
  if ! running_on_github_actions; then
    export AWS_CONFIG_FILE="${repo}/scripts/lib/aws_config"
    export AWS_PROFILE="pokemon-go-calendar-$ENV"
  fi
  export AWS_REGION="eu-west-1"
  export AWS_DEFAULT_REGION="$AWS_REGION"

  aws sts get-caller-identity
  AWS_ACCOUNT_ID="$( aws sts get-caller-identity --query Account --output text )"
  export AWS_ACCOUNT_ID
}

function running_on_github_actions {
  [ "${GITHUB_ACTION:-}" != "" ]
}

function aws {
  docker run \
    --env AWS_CONFIG_FILE=/root/aws_config \
    --env AWS_ACCESS_KEY_ID --env AWS_SECRET_ACCESS_KEY --env AWS_SESSION_TOKEN \
    --env AWS_PROFILE \
    --env AWS_REGION --env AWS_DEFAULT_REGION \
    --volume "${repo}/scripts/lib/aws_config:/root/aws_config" \
    --volume ~/.aws:/root/.aws \
    --volume "$( pwd )":/aws \
    --rm --interactive \
    amazon/aws-cli:2.0.6 "$@"
}
