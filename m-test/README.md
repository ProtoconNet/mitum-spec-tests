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

Clone the repository

```sh
$ git clone https://github.com/ProtoconNet/mitum-spec-tests
```

Install mitum SDK.

```sh
$ cd mitum-spec-tests 

$ git clone https://github.com/ProtoconNet/mitumjs

$ cd mitumjs

$ npm i

$ npm run build
```

Install the dependencies for m-test.
```
$ cd mitum-spec-tests/m-test

$ npm i
```
## Prerequisite

TPS testing generates a large volume of load, 

which necessitates thorough preparation and planning in advance. 

Firstly, it's essential to secure the required resources and bandwidth in the testing environment.

### Adjust UDP Buffer Sizes

For more details, visit [UDP Buffer Sizes](https://github.com/quic-go/quic-go/wiki/UDP-Buffer-Sizes).


### Modify MAX ITEM Size

Alter the Max item size value within the Mitum contract model.

### Update Node Configuration to Accommodate Large Messages

```
parameters:
  misc:
    max_message_size: 500000000
    object_cache_size: 500000000
```

## Run Test Script

After the execution of the first shell script(create-account.sh), 

the generated preliminary data is saved in a folder named after a timestamp value.

For subsequent shell script executions, use this timestamp value as the name of the data directory."

### Create account

Modify the variable in [create-account.sh](bash/create-account.sh)

```sh
MODE=""
NETWORK_ID=<"network id">
CURRENCY_ID=<"currency id to use">
ITEMS=<"max number of items for each operation">
GENESIS_ACCOUNT=<"genesis-address,genesis-private">
INTERVAL=<"interval between each create-account request">
```
Run shell script with option

```
$>bash bash/create-account.sh --api=<http://api.example.com> --account-num=<"number of new accounts"> --contract-num=<"number of new contract accounts">
```

### Create operations

Modify the variable in [create-operation.sh](bash/create-operations.sh).

```sh
NETWORK_ID=<"network id">
CURRENCY_ID=<"currency id to use">
ITEMS=<"max number of items for each operation">
```

Run shell script with option

```
$>bash bash/create-operations.sh --total=<"total loads"> --data=<"timestamp value"> --type=<"account | credential">
```

### Run jmeter

Modify the variable in [run-jmeter.sh](bash/run-jmeter.sh).

If it is not possible to run normally, modify {N} of `JVM_ARGS="-Xms{N}g -Xmx{N}g"` in the [test.js](tools/test.js).

```sh
MODE="api"
NETWORK_ID=<"network id">
```
Run shell script with option

```
$>bash bash/run-jmeter.sh --api=<"api url"> --period=<"jmeter ramp up period"> --data=<"dir path to operations">
```

### Get Result

To get results in api database, Run follow shell script.

```
$>bash bash/db-data.sh --host=<"mongodb host"> --db=<"database name">
```

To get the timestamp of last confirmed operation in api database, Run follow shell script.

```
$>bash bash/db-last-confirmed.sh --host=<"mongodb host"> --db=<"database name">
```

To get the timestamp of first sent operation in jtl.result, Run follow shell script.

```
$>bash bash/jmeter-first-send.sh --dir=<"dir path of folder which include jtl.result">
```
