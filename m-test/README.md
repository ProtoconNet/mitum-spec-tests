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

Before installation, install [mitum-sdk-js](https://github.com/ProtoconNet/mitum-sdk-js) first.

```sh
$ git clone https://github.com/ProtoconNet/mitum-sdk-js

$ cd mitum-sdk-js

$ npm -i g
```

Then, install __mitum-test__.

```sh
$ git clone https://github.com/ProtoconNet/mitum-test-tps

$ cd mitum-test/m-test

$ npm i

$ npm link mitum-sdk
```

## Run

* v1: mitum1
* v2: mitum2 (schnorr)

### create-account

Modify the variable in [create-account.sh](bash/create-account.sh) and run `bash bash/create-account.sh`.

### transfer

Modify the variable in [transfer.sh](bash/transfer.sh) and run `bash bash/transfer.sh`.

In this case, only the operation files are created.

### run jmeter

Modify the variable in [test.sh](bash/test.sh) and run `bash bash/test.sh`.

If it is not possible to run normally, modify {N} of `JVM_ARGS="-Xms{N}g -Xmx{N}g"` in the line 171 of [test.js](tools/test.js).

### tps

Modify the variable in [tps.sh](bash/tps.sh) and run `bash bash/tps.sh`.

The tps measurement takes some time to complete.