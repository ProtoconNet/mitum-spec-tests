# mitum-test

## Installation

__environments__

```sh
$ npm --version
8.19.1

$ node --version
v18.9.0
```

__installation__

Install __mitum-test__ first.

```sh
$ git clone https://github.com/ProtoconNet/mitum-test-tps

$ cd mitum-test-tps/m-test

$ npm i
```

Then locate [mitumjs](https://github.com/ProtoconNet/mitumjs) in mitum-spec-tests.

```sh
$ git clone https://github.com/ProtoconNet/mitumjs

$ cp -r ./mitumjs ./mitum-spec-tests

$ cd mitum-spec-tests/mitumjs

$ npm i

$ npm i tsc, typescript

$ npm run build
```

## Run

* v1: mitum1
* v2: mitum2 (mitumjs support only v2)

### create-account

Modify the variable in [create-account.sh](bash/create-account.sh) and run `bash bash/create-account.sh`.

```sh
V="mitum version; [v1 || v2]"
MODE="api; this means that the script will use digest api to create-account"
NETWORK="api address"
ID="network id"
CID="currency id to use"
MAX_ITEMS="max number of items for each operation"
GENESIS="genesis-address,genesis-private"
N="the number of accounts to create" 
INTERVAL="interval between each create-account request"
node tools/create-account.js $V $MODE $NETWORK $ID $CID $MAX_ITEMS $GENESIS $N $INTERVAL
```

### transfer

Modify the variable in [transfer.sh](bash/transfer.sh) and run `bash bash/transfer.sh`.

In this case, only the operation files are created.

```sh
V="mitum version; [v1 || v2]"
ID="network id"
CID="currency id to use"
GENESIS="genesis address"
N="the number of operations"
ACCOUNTS="file path of accounts.json file; you can create this file with bash/create-account.sh"
node tools/transfer.js $V $ID $CID $GENESIS $N $ACCOUNTS
```

### run jmeter

Modify the variable in [test.sh](bash/test.sh) and run `bash bash/test.sh`.

If it is not possible to run normally, modify {N} of `JVM_ARGS="-Xms{N}g -Xmx{N}g"` in the line 171 of [test.js](tools/test.js).

```sh
TOKEN="directory path of transfers operation; you can create this folder with bash/transfer.sh"
MODE="api; this means that the script will use digest api to test"
NETWORK="api network addresses; seperator: ','"
ID="network id"
N="the number of all transfer operations to request"
DURATION="rampup time in jmeter script"
node tools/test.js $TOKEN $MODE $NETWORK $ID $N $DURATION
```

### tps

Modify the variable in [tps.sh](bash/tps.sh) and run `bash bash/tps.sh`.

The tps measurement takes some time to complete.

```sh
TOKEN="directory path of transfers operation; you can create this folder with bash/transfer.sh; run test.sh first"
NETWORK="api network address to send lookup request"
MONGO="enter mongodb address if you want to lookup fact-hash by mongodb instead of digest api"
node tools/lookup.js $TOKEN $NETWORK $MONGO
```