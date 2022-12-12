VERSION=v1
NETWORK=http://protocon.asuscomm.com:7785,,
NETWORK_ID=mitum
CURRENCY_ID=PEN
ADDRESS=8iRVFAPiHKaeznfN3CmNjtFtjYSPMPKLuL6qkaJz8RLumca
ACCOUNTS=logging/accounts/operations/create-accounts/accounts.json
DELAY="60000,10000"
DURATION=1
nohup node scripts/infinite/run.js $VERSION $NETWORK $NETWORK_ID $CURRENCY_ID $ADDRESS $ACCOUNTS $DELAY $DURATION &