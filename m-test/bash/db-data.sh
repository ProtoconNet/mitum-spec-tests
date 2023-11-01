#!/bin/bash

# default option value
HOST=localhost
export MITUM_DATABASE=mcredential

# handle option value
for arg in "$@"; do
  case $arg in
    --host=*)
    HOST="${arg#*=}"
    shift
    ;;
    --db=*)
    MITUM_DATABASE="${arg#*=}"
    shift
    ;;
    *)
    shift
    ;;
  esac
done

mongosh --authenticationDatabase admin --quiet --host $HOST tools/mongo-get-data.js