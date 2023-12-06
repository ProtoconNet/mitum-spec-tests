#!/bin/bash

# default option value
API_ENDPOINTS="http://172.31.32.231:54320,http://172.31.44.160:54320,http://172.31.42.2:54320,http://172.31.36.129:54320" # api url : sample "http://localhost:54320"
ACCOUNTS_COUNT=200
CONTRACT_ACCOUNTS_COUNT=0
MONGO_HOST="172.31.2.159"
DATABASE="tps0"

# variables
MODE="api"
NETWORK_ID=mitum
CURRENCY_ID=PEN
ITEMS=500
GENESIS_ACCOUNT="Hwrw5wwhANUPSQNmkJ91Pnu57T4cK6HsLvZXKTJbQbERmca,EQmEPFeUTf6Asgs1aoHEdfYndFYkVMHrc5F1X4EcGZXympr"
INTERVAL=1

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
    --items=*)
    ITEMS="${arg#*=}"
    shift
    ;;
    --contract-num=*)
    CONTRACT_ACCOUNTS_COUNT="${arg#*=}"
    shift
    ;;
    --mongo=*)
    MONGO_HOST="${arg#*=}"
    shift
    ;;
    --db=*)
    DATABASE="${arg#*=}"
    shift
    ;;
    *)
    shift
    ;;
  esac
done

# check empty value
if [ -z "$API_ENDPOINTS" ]; then
  echo -e "\033[0;33m  Error: empty api url. set with --api= \033[0m"
  exit 1
fi
if [ -z "$MONGO_HOST" ]; then
  echo -e "\033[0;33m  Error: empty mongo host. set with --mongo= \033[0m"
  exit 1
fi
if [ -z "$DATABASE" ]; then
  echo -e "\033[0;33m  Error: empty mongo database. set with --db= \033[0m"
  exit 1
fi

echo "API Endpoints = $API_ENDPOINTS / MongoDB Host = $MONGO_HOST / Database Name = $DATABASE"

node tools/create-account.js $MODE $API_ENDPOINTS $NETWORK_ID $CURRENCY_ID $ITEMS $GENESIS_ACCOUNT $ACCOUNTS_COUNT $CONTRACT_ACCOUNTS_COUNT $INTERVAL $MONGO_HOST $DATABASE
