# create accounts

# mode =  api | network-client
MODE=
# api server url
API=
NETWORK_ID=
CURRENCY_ID=
MAX_ITEMS=
GENESIS_ACCOUNT=
ACCOUNTS_COUNT=
# interval between phase
INTERVAL=

node tools/create-account.js $MODE $API $NETWORK_ID $CURRENCY_ID $MAX_ITEMS $GENESIS_ACCOUNT $ACCOUNTS_COUNT $INTERVAL