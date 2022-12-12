source bash/config-single-parallel.sh
TOKEN=single-$(date +%s)
LEN=$(($THREAD / 2))
node scripts/parallel-create-account.js v2 $TOKEN $THREAD $NETWORK_CLIENT $NETWORK_ID $GADDR,$GPRIV $CURRENCY_ID $INTERVAL $EXEC
sleep $(($INTERVAL / 1000))
node scripts/transfers.js v2 $TOKEN $THREAD $NETWORK_ID $GADDR $CURRENCY_ID logging/$TOKEN/operations/create-accounts/accounts.json
node scripts/parallel-transfer.js $TOKEN $EXEC $NETWORK_ID $NETWORK_CLIENT
node scripts/get-tps.js $TOKEN $NETWORK0 $DELAY $DB