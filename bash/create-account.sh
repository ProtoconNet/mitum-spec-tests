V="v2"
MODE="api"
NETWORK=http://127.0.0.1:54320
ID=mitum
CID=MCC
MAX_ITEMS=1000
GENESIS="2E5qNuz9HsXydeTTdG1a3SZtj1iBWNUyVyfHYNcs4gSgmca,D4QPRNSTgYmgRymYVS1mLgyGtCbzeAPYhd5r4jNQahwampr"
N=10000
INTERVAL=30000
node tools/create-account.js $V $MODE $NETWORK $ID $CID $MAX_ITEMS $GENESIS $N $INTERVAL