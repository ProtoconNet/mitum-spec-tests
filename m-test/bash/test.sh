# send operation by jmeter

# ex: test-1697293439729
OPERATION_FOLDER=
# mode =  api | network-client
MODE=api
API=http://protocon.asuscomm.com:54320
NETWORK_ID=mitum
TOTAL=20
DURATION=20
node tools/test.js $OPERATION_FOLDER $MODE $API $NETWORK_ID $TOTAL $DURATION