# lookup.jmx

This script is used to test lookup-tps of mitum.

Before use, you have to install jmeter.

## Run

First, replace fact-hash in the [script](lookup.jmx) with your hash value.

```html
<stringProp name="HTTPSampler.path">/block/operation/{hash}</stringProp>
```

Then run the script.

```sh
$ `JVM_ARGS="-Xms{heap_size} -Xmx{heap_size}"` jmeter -n -t lookup.jmx -l result.jtl -j jmeter.log
```