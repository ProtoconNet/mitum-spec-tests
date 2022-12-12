source bash/config-double-accounts.sh
TOKEN=double-accounts-$(date +%s)
LEN=$(($THREAD / 2))
node scripts/transfers.js v2 $TOKEN $THREAD $NETWORK_ID $GADDR $CURRENCY_ID logging/$ACCOUNTS/operations/create-accounts/accounts.json
node scripts/double-jmx.js $TOKEN $LEN $NETWORK0 $NETWORK1
JVM_ARGS="-Xms4096m -Xmx4096m" jmeter -n -t logging/$TOKEN/Transfers.jmx -l logging/$TOKEN/result.jtl -j logging/$TOKEN/jmeter.log
node scripts/get-tps.js $TOKEN $NETWORK0 $DELAY $DB
