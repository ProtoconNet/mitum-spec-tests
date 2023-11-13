#!/bin/bash

# default option value
HOST=""
DATABASE=""

# handle option value
for arg in "$@"; do
  case $arg in
    --host=*)
    HOST="${arg#*=}"
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

# check empty values
if [ -z "$HOST" ]; then
  echo -e "\033[0;33m  Error: empty accounts data directory. set with --host= \033[0m"
  exit 1
fi
if [ -z "$DATABASE" ]; then
  echo -e "\033[0;33m  Error: empty accounts data directory. set with --db= \033[0m"
  exit 1
fi

export MITUM_DATABASE=$DATABASE
mongosh --authenticationDatabase admin --quiet --host=$HOST tools/mongo-get-confirmed.js