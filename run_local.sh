#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
repo="$( cd "$( dirname "$0" )" && pwd )"

node_version="12"

function main {
  init_nodejs

  # Build lambda
  cd "$repo/src"
  npm install
  npx nodemon local.js
}

function init_nodejs {
  export NVM_DIR="${NVM_DIR:-$HOME/.cache/nvm}"
  if [ ! -f "$repo/nvm.sh" ]; then
    curl -o "$repo/nvm.sh" "https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/nvm.sh"
  fi
  source "$repo/nvm.sh"
  nvm use "$node_version" || nvm install "$node_version"
}

main "$@"
