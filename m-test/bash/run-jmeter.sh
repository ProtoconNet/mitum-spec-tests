#!/bin/bash

# default option value
API_ENDPOINTS="" # api_endpoints (e.g., http://localhost:54320, http://localhost:54321)
RAMP_UP_PERIOD=20 # number of seconds for gradually starting all threads (e.g., 50)
OPERATION_DIR="" # path_to_operation_folder (e.g., test/1698824690336/subtest/1698825205140/create-accounts)

# handle option value
for arg in "$@"; do
  case $arg in
    --api=*)
    API_ENDPOINTS="${arg#*=}"
    shift
    ;;
    --period=*)
    RAMP_UP_PERIOD="${arg#*=}"
    shift
    ;;
    --data=*)
    OPERATION_DIR="${arg#*=}"
    shift
    ;;
    *)
    shift
    ;;
  esac
done

# check empty values
if [ -z "$API_ENDPOINTS" ]; then
  echo -e "\033[0;33m  Error: empty api url. set with --api= \033[0m"
  exit 1
fi
if [ -z "$OPERATION_DIR" ]; then
  echo -e "\033[0;33m  Error: empty operation data director. set with --data= \033[0m"
  exit 1
fi

# variables
MODE="api"
NETWORK_ID=mitum
node tools/test.js $OPERATION_DIR $MODE $API_ENDPOINTS $NETWORK_ID $RAMP_UP_PERIOD