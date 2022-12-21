# mitum-test

This package had been developed to test tps and lookup-tps of mitum.

Before the test, you must install jmeter and `beta` branch of [mitum-sdk-js](http://github.com/ProtoconNet/mitum-sdk-js).

## Directories

* m-lookup-test: the package to test tps of mitum. You can conduct the entire process from creating create-accoun and transfer operaitons to check tps by running for each script.

* m-test: What it does is totally same with m-lookup-test. However, you need to run each step of the process seperately.

* lookup: This folder contains a jmeter script to test lookup-tps.

* node-config: This folder contains node-config files that can be used to run nodes for testing.