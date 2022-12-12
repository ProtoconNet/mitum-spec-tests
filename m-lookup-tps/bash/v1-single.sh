source bash/config-single.sh
TOKEN=single-$(date +%s)
LEN=$(($THREAD / 2))
node scripts/create-accounts.js v1 $TOKEN $THREAD $NETWORK0 $NETWORK_ID $GADDR,$GPRIV $CURRENCY_ID $INTERVAL $MAX_ITEMS
echo "wait..."
sleep $(($INTERVAL / 1000))
node scripts/transfers.js v1 $TOKEN $THREAD $NETWORK_ID $GADDR $CURRENCY_ID logging/$TOKEN/operations/create-accounts/accounts.json
node scripts/single-jmx.js $TOKEN $LEN $NETWORK0
JVM_ARGS="-Xms8192m -Xmx8192m" jmeter -n -t logging/$TOKEN/Transfers.jmx -l logging/$TOKEN/result.jtl -j logging/$TOKEN/jmeter.log
node scripts/get-tps.js $TOKEN $NETWORK0 $DELAY $DB
