#!/bin/bash

# default option value
DIR=""

# handle option value
for arg in "$@"; do
  case $arg in
    --dir=*)
    DIR="${arg#*=}"
    shift
    ;;
    *)
    shift
    ;;
  esac
done

# check empty value
if [ -z "$DIR" ]; then
  echo -e "\033[0;33m  Error: empty test result directory. set with --dir= \033[0m"
  exit 1
fi

timestamp=$(sed -n '2p' "$DIR/result.jtl" | cut -d',' -f1)
#seconds=$((timestamp/1000))
#milliseconds=$((timestamp%1000))
#date_string=$(date -u -d @$seconds '+%Y-%m-%dT%H:%M:%S')
#echo "${date_string}.${milliseconds}Z"
echo "$timestamp"
