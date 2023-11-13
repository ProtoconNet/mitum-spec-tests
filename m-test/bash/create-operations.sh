#!/bin/bash

# default option value
TOTAL=33000
ITEM=3000
TIMESTAMP=""  # timestamp token in previous log : sample 1698797337011
TYPE="" # type of new operation : sample "account" | "credential"
RAMPUP=5

# handle option value
for arg in "$@"; do
  case $arg in
    --total=*)
    TOTAL="${arg#*=}"
    shift
    ;;
    --item=*)
    ITEM="${arg#*=}"
    shift
    ;;
    --data=*)
    TIMESTAMP="${arg#*=}"
    shift
    ;;
    --type=*)
    TYPE="${arg#*=}"
    shift
    ;;
    --period=*)
    RAMPUP="${arg#*=}"
    shift
    ;;
    *)
    shift
    ;;
  esac
done

# variables
NETWORK_ID=mitum
CURRENCY_ID=PEN

# check empty values
if [ -z "$TIMESTAMP" ]; then
  echo -e "\033[0;33m  Error: empty accounts data directory. set with --data= \033[0m"
  exit 1
fi
if [ -z "$TYPE" ]; then
  echo -e "\033[0;33m  Error: empty operation type. set with --type= \033[0m"
  exit 1
fi

echo "Type = $TYPE / Total Load = $TOTAL / Items Count = $ITEM / RampUp Period = $RAMPUP"

node tools/create-operations.js $NETWORK_ID $CURRENCY_ID $TOTAL $ITEM $TIMESTAMP $TYPE $RAMPUP
