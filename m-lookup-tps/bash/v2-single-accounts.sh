source bash/config-single-accounts.sh
TOKEN=single-accounts-$(date +%s)
LEN=$(($THREAD / 2))
node scripts/transfers.js v2 $TOKEN $THREAD $NETWORK_ID $GADDR $CURRENCY_ID logging/$ACCOUNTS/operations/create-accounts/accounts.json
node scripts/single-jmx.js $TOKEN $LEN $NETWORK0
JVM_ARGS="-Xms4096m -Xmx4096m" jmeter -n -t logging/$TOKEN/Transfers.jmx -l logging/$TOKEN/result.jtl -j logging/$TOKEN/jmeter.log
node scripts/get-tps.js $TOKEN $NETWORK0 $DELAY $DB
