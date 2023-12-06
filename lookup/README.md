# lookup.jmx

This script is used to test 'lookup' performance(tps) by digest api of mitum.

If you run the script, it sends `thread` requests for `duration` seconds to your mitum digest api.

See what `thread` and `duration` mean in the next part.

Before use, you have to install jmeter.

## Run

First, replace fact-hash in the [script](lookup.jmx) with your hash value.

```html
<stringProp name="HTTPSampler.path">/block/operation/{hash}</stringProp>
```

Check the number of thread you want to send.

```html
 <stringProp name="ThreadGroup.num_threads">1500</stringProp>
```

`duration` means the duration of the test.

```html
<stringProp name="ThreadGroup.duration">60</stringProp>
```

Then run the script.

```sh
$ `JVM_ARGS="-Xms{heap_size} -Xmx{heap_size}"` jmeter -n -t lookup.jmx -l result.jtl -j jmeter.log
```
or

```sh
$ jmeter -n -t lookup_account.jmx -l results.jtl -e -o ./account_test_trial1
```