source bash/config-triple.sh
TOKEN=triple-$(date +%s)
L=$(($THREAD / 3))
LEN=$L,$L,$(($THREAD - $L - $L))
node scripts/create-accounts.js v1 $TOKEN $THREAD $NETWORK0 $NETWORK_ID $GADDR,$GPRIV $CURRENCY_ID $INTERVAL $MAX_ITEMS
echo "wait..."
sleep $(($INTERVAL / 1000))
node scripts/transfers.js v1 $TOKEN $THREAD $NETWORK_ID $GADDR $CURRENCY_ID logging/$TOKEN/operations/create-accounts/accounts.json
node scripts/triple-jmx.js $TOKEN $LEN $NETWORK0 $NETWORK1 $NETWORK2
JVM_ARGS="-Xms4096m -Xmx4096m" jmeter -n -t logging/$TOKEN/Transfers.jmx -l logging/$TOKEN/result.jtl -j logging/$TOKEN/jmeter.log
node scripts/get-tps.js $TOKEN $NETWORK0 $DELAY $DB
