#!/bin/bash

# default option value
OPERATION_DIR="" # path_to_sub_folder (e.g., subtest/1698825205140/create-accounts)
TIMESTAMP="" # # timestamp token in previous log : sample 1698797337011
RAMP_UP_PERIOD=1 # number of seconds for gradually starting all threads (e.g., 50)

# handle option value
for arg in "$@"; do
  case $arg in
    --data=*)
    TIMESTAMP="${arg#*=}"
    shift
    ;;
    --period=*)
    RAMP_UP_PERIOD="${arg#*=}"
    shift
    ;;
    --dir=*)
    OPERATION_DIR="${arg#*=}"
    shift
    ;;
    *)
    shift
    ;;
  esac
done

# check empty values
if [ -z "$TIMESTAMP" ]; then
  echo -e "\033[0;33m  Error: empty data. set with --data= \033[0m"
  exit 1
fi
if [ -z "$OPERATION_DIR" ]; then
  echo -e "\033[0;33m  Error: empty operation data director. set with --data= \033[0m"
  exit 1
fi

echo \"RAMP: $RAMP_UP_PERIOD\"

# variables
MODE="api"
NETWORK_ID=mitum
node tools/test2.js $OPERATION_DIR $MODE $TIMESTAMP $NETWORK_ID $RAMP_UP_PERIOD
