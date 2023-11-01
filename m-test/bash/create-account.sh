#!/bin/bash

# default option value
API_ENDPOINTS="" # api url : sample "http://localhost:54320"
ACCOUNTS_COUNT=10
CONTRACT_ACCOUNTS_COUNT=10

# handle option value
for arg in "$@"; do
  case $arg in
    --api=*)
    API_ENDPOINTS="${arg#*=}"
    shift
    ;;
    --account-num=*)
    ACCOUNTS_COUNT="${arg#*=}"
    shift
    ;;
    --contract-num=*)
    CONTRACT_ACCOUNTS_COUNT="${arg#*=}"
    shift
    ;;
    *)
    shift
    ;;
  esac
done

# variables
MODE="api"
NETWORK_ID=mitum
CURRENCY_ID=PEN
ITEMS=3000
GENESIS_ACCOUNT=<"address, privatekey">
INTERVAL=5

# check empty value
if [ -z "$API_ENDPOINTS" ]; then
  echo -e "\033[0;33m  Error: empty api url. set with --api= \033[0m"
  exit 1
fi

node tools/create-account.js $MODE $API_ENDPOINTS $NETWORK_ID $CURRENCY_ID $ITEMS $GENESIS_ACCOUNT $ACCOUNTS_COUNT $CONTRACT_ACCOUNTS_COUNT $INTERVAL
