#!/bin/bash

# default option value
TOTAL=30000
SENDER_ACCOUNTS_DIR=""  # timestamp token in previous log : sample 1698797337011
TYPE="" # type of new operation : sample "account" | "credential"

# handle option value
for arg in "$@"; do
  case $arg in
    --total=*)
    TOTAL="${arg#*=}"
    shift
    ;;
    --data=*)
    SENDER_ACCOUNTS_DIR="${arg#*=}"
    shift
    ;;
    --type=*)
    TYPE="${arg#*=}"
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
ITEMS=3000

# check empty values
if [ -z "$SENDER_ACCOUNTS_DIR" ]; then
  echo -e "\033[0;33m  Error: empty accounts data directory. set with --data= \033[0m"
  exit 1
fi
if [ -z "$TYPE" ]; then
  echo -e "\033[0;33m  Error: empty operation type. set with --type= \033[0m"
  exit 1
fi

node tools/create-operations.js $NETWORK_ID $CURRENCY_ID $TOTAL $ITEMS $SENDER_ACCOUNTS_DIR $TYPE
