# mitum-lookup-tps

## Installation

__environments__

```sh
$ npm --version
8.19.1

$ node --version
v18.9.0
```

__installation__

Before installation, install [mitum-sdkjs](https://github.com/ProtoconNet/mitum-sdkjs) first.

```sh
$ git clone https://github.com/ProtoconNet/mitum-sdkjs

$ cd mitum-sdkjs

$ npm -i g
```

Then, install __mitum-lookup-tps__.

```sh
$ git clone https://github.com/ProtoconNet/mitum-lookup-tps

$ cd mitum-lookup-tps

$ npm i

$ npm link mitum-sdk
```

## Run

* v1: mitum1
* v2: mitum2 (schnorr)

### prepare

Set as follows before executing the shell script:

(1) common

- `THREAD`: the number operations to request simultaneously
- `NETWORK0`: blockchain network address
- `NETWORK_ID`: blockchain network id
- `GADDR`: genesis account address (or an single-sig account with a sufficient balance)
- `CURRENCY_ID`: currency id that `GADDR` has
- `DELAY`: delay before 'operation lookup' starts
- `DB`: mongodb url and db name to lookup; (set "" if you use digest api instead of mongodb)

(2) without accounts file (requests create-account operations before requesting transfer operations)

- `GPRIV`: private key of `GADDR`
- `INTERVAL`: interval for each create-account request

(3) with accounts file

- `ACCOUNTS`: the __token__ which has the accounts.json (ref. logging/<token>/operations/create-accounts/accounts.json)

(4) double, triple api

- `NETWORK1`: the second network address
- `NETWORK2`: the third network address

### single api & without accounts file

1. set variables in [bash/config-single.sh](bash/config-single.sh)
2. run `bash bash/v1-single.sh` or `bash bash/v2-single.sh`

### single api & with accounts file

1. set variables in [bash/config-single-accounts.sh](bash/config-single-accounts.sh)
2. run `bash bash/v1-single-accounts.sh` or `bash bash/v2-single-accounts.sh`

### double api & without accounts file

1. set variables in [bash/config-double.sh](bash/config-double.sh)
2. run `bash bash/v1-double.sh` or `bash bash/v2-double.sh`

### double api & with accounts file

1. set variables in [bash/config-double-accounts.sh](bash/config-double-accounts.sh)
2. run `bash bash/v1-double-accounts.sh` or `bash bash/v2-double-accounts.sh`

### triple api & without accounts file

1. set variables in [bash/config-triple.sh](bash/config-triple.sh)
2. run `bash bash/v1-triple.sh` or `bash bash/v2-triple.sh`

### triple api & with accounts file

1. set variables in [bash/config-triple-accounts.sh](bash/config-triple-accounts.sh)
2. run `bash bash/v1-triple-accounts.sh` or `bash bash/v2-triple-accounts.sh`

### result

For example, `bash bash/v1-single.sh` with [bash/config-single.sh](bash/config-single.sh) shows:

```sh
$ bash bash/v1-single.sh
================================== create-accounts.js
2022-11-15T09:16:09.063Z: start; run create-accounts.js
---- token; single-1668503768
---- number of accounts; 100
---- network; http://127.0.0.1:54320
---- network id; mitum
---- genesis address; DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca
---- genesis private key; KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr
---- currency id; MCC
---- request interval; 4000
2022-11-15T09:16:09.064Z: run CreateAccountsV1
2022-11-15T09:16:09.064Z: number of create-account operations; 10
2022-11-15T09:16:09.157Z: make sure logging/single-1668503768/operations/create-accounts/ exists
2022-11-15T09:16:09.157Z: creating operation files
2022-11-15T09:16:09.159Z: logging/single-1668503768/operations/create-accounts/opertions.csv created
2022-11-15T09:16:09.159Z: logging/single-1668503768/operations/create-accounts/files.csv created
2022-11-15T09:16:09.159Z: creating logging/single-1668503768/operations/create-accounts/accounts.json
2022-11-15T09:16:13.183Z: OK mTXCwDqQeYWuP6jNpoLpcv3cqm2TaikNQqGahgL5Rah
2022-11-15T09:16:17.191Z: OK 7eQ7Huu2YyCeBjGTYRqrwhBDtj2UQgEXbiFwAC94YQyi
2022-11-15T09:16:21.203Z: OK 38rWFSD3yL4MagppmAktPVhvi4ZyFTgeHFpP2kgsv8g9
2022-11-15T09:16:25.212Z: OK Ctkji7A8fSJurtHgTmEKLuaSeG7QiaSQ2jT7iz6KcxqV
2022-11-15T09:16:29.214Z: OK 3v5EXDXWsmydz1KCi52xNdLwchju7rXfq89XmVfPzRE2
2022-11-15T09:16:33.231Z: OK AH2T3M6WUpfebwurqnBbDpcPWxDgr7xykEJLjPdpXNND
2022-11-15T09:16:37.230Z: OK DECwR3nUfzSiv6MoSeCMGas2tRfKEqyYM19adf1Kf7Vs
2022-11-15T09:16:41.234Z: OK E7vfM3XPTN5Ugv4RrXu3wpe7ooLsdJ32UpRzRJTdwPK4
2022-11-15T09:16:45.236Z: OK 58HffXZcudBY755u3tQvSNkzYB3dyf9ciCCykGCFR83A
2022-11-15T09:16:49.229Z: OK 4rnkRivv3pF1HKFDsH33Xyj7cUpKVpzf2bjoesKQKFrY
================================== transfers.js
2022-11-15T09:16:49.338Z: start; run transfers.js
---- token; single-1668503768
---- number of operations; 100
---- network id; mitum
---- genesis address; DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca
---- currency id; MCC
---- accounts; logging/single-1668503768/operations/create-accounts/accounts.json
2022-11-15T09:16:49.339Z: get accounts from logging/single-1668503768/operations/create-accounts/accounts.json
2022-11-15T09:16:49.339Z: run TransferV1
2022-11-15T09:16:49.480Z: make sure logging/single-1668503768/operations/transfers/ exists
2022-11-15T09:16:49.481Z: creating operation files
2022-11-15T09:16:49.484Z: logging/single-1668503768/operations/transfers/operations.csv created
2022-11-15T09:16:49.484Z: logging/single-1668503768/operations/transfers/files.csv created
================================== single-jmx.js
2022-11-15T09:16:49.551Z: start; run single-jmx.js
---- token; single-1668503768
---- thread per thread group; 50
---- network; http://127.0.0.1:54320
2022-11-15T09:16:49.557Z: jmx copied
2022-11-15T09:16:49.563Z: jmx options replaced
WARNING: package sun.awt.X11 not in java.desktop
Creating summariser <summary>
Created the tree successfully using logging/single-1668503768/Transfers.jmx
Starting standalone test @ 2022 Nov 15 18:16:50 KST (1668503810158)
Waiting for possible Shutdown/StopTestNow/HeapDump/ThreadDump message on port 4445
summary =    100 in 00:00:01 =   97.1/s Avg:     7 Min:     4 Max:    34 Err:     0 (0.00%)
Tidying up ...    @ 2022 Nov 15 18:16:51 KST (1668503811245)
... end of run
================================== get-tps.js
---- start; run get-tps.js
---- token; single-1668503768
---- network; http://127.0.0.1:54320
---- lookup delay; 30000
2022-11-15T09:16:51.761Z: wait 30000ms
2022-11-15T09:17:21.764Z: run TPS
2022-11-15T09:17:21.766Z: get result from logging/single-1668503768/result.jtl
---- start time; 1668503810297
2022-11-15T09:17:21.768Z: get operations from logging/single-1668503768/operations/transfers/operations.csv
2022-11-15T09:17:21.768Z: start lookup 100 operations
2022-11-15T09:17:21.810Z: OK 9f8o9X2BnSnyjN3LBq5dtXmoD7JgnTtRLzos1eNfd3Bd
2022-11-15T09:17:21.816Z: OK Ed69THvkndJdRvg8NFvoo9PRmENP76wwAvsppVcAFWoL
2022-11-15T09:17:21.820Z: OK 8ep5MKoJYc5sUPSTygkaN2qab7xv9ricuE9jdV8a6S6b
2022-11-15T09:17:21.825Z: OK 7CpZ57E7qsNBBPkKoMShqXyqcYS4B63HM1frTV5njxv1
2022-11-15T09:17:21.830Z: OK 6GDg7vrm895Axf7BKA9tiabd2FNL5KTkQBu6N5su9Dz3
2022-11-15T09:17:21.834Z: OK J61kGkm9v3kNPUB3dapcTDgGdiktgg4Ny5n95QNLPKkK
2022-11-15T09:17:21.843Z: OK AWdfKC4XTLpZ7ytLQEZi7rnkDnVVp9GoLaeUfFEJgYCX
2022-11-15T09:17:21.848Z: OK EgSheDtMhhTzgTYqTUs5yct2cQt2iprLESFjMLYLz4Ch
2022-11-15T09:17:21.853Z: OK CeQfxd9frhRnbbqeHd925LGPf4sxvD32p3msDDYzHS5m
2022-11-15T09:17:21.862Z: OK 78nAU7KiGx5tGXHvXSf94bGKZzq785jiy88zkEBKPsNM
2022-11-15T09:17:21.868Z: OK AWgSBFkPx9gDCQUhtaCNJvaVCfmCubRrJ24rgdvCZX4k
2022-11-15T09:17:21.873Z: OK 59YnzfXe52vTuzX1wdDhj2E2iYKPBnextZD1Fxi3k7M4
2022-11-15T09:17:21.878Z: OK 6noCxqVXKBmXngGpYXzNUVzwmSpJuC9A5LX4VPGhj55h
2022-11-15T09:17:21.883Z: OK 5a1CXAGJy54PPBdRhSeKs5QNfG2J4UjQLuvcpjdihUq6
2022-11-15T09:17:21.888Z: OK Fwa15Fun3t2FECs5QMVXTaGMtRJVhR6WznVdcdut3rMU
2022-11-15T09:17:21.893Z: OK EKLkb66dSwo6pZ9ZE13Y7rfMjFzPK1JzXPd8h6KGASY7
2022-11-15T09:17:21.898Z: OK BynWvmWiYeuX592rMHGPNpw3yDi7A3NWuM3MXwU3P7Xn
2022-11-15T09:17:21.907Z: OK C9yfbE3jeq1ALBQA8RrLDGDCEu9vUwiNGoGZwE6dhgj9
2022-11-15T09:17:21.912Z: OK 6astQUWWyAtc9MNqrt5TTV8Wu3YfPv8cTr4SBsseLSKk
2022-11-15T09:17:21.917Z: OK 64iSwwiBW14HEGS1kJ2pkEX8C6cKk32ZFqNo7poq2yvV
2022-11-15T09:17:21.921Z: OK 6fwZeUe2WionnLmCNTq7mJTKttddTMCDhYEBxhtanKHx
2022-11-15T09:17:21.926Z: OK HDGkBfRYicLV1jaCvgeq4yG2RzRyAnCf6nRGDJ2jW4pd
2022-11-15T09:17:21.931Z: OK 7rEkb6gtE3XDsAStGkBPtGoozEujPE8PNk7JauQ417g
2022-11-15T09:17:21.937Z: OK 9Ddm4niNxtuHbAQQxw4eEaReo1krWk6tuLQJAP3CSHbz
2022-11-15T09:17:21.942Z: OK AHhGQ1MqSQpEiJmuPwfvYSH4nekRtC4KQLFMqXgpDWWV
2022-11-15T09:17:21.946Z: OK 7YYFUFvVtx5qYbgssKmoWwScxL4Dr2ErnYvooWLa3cw9
2022-11-15T09:17:21.950Z: OK 9p9jcqmUpv6TKnqTGxKzgtZCUKykJYFHyzTSJwpiKM54
2022-11-15T09:17:21.954Z: OK 8hkYWNbKGenpJmrGPaDpNX4PoGkkKh8dTRZNL8WjTB2
2022-11-15T09:17:21.958Z: OK H8VBr1woi1duhArxerm9BhWsn1jLyAte5mQv8osirck
2022-11-15T09:17:21.962Z: OK 5DGi57sr36NYG5MYhdYprbHNuAPYfeLQVtiDohNgwPg4
2022-11-15T09:17:21.966Z: OK 7Gnsd1Pv1QkvsFsRZMWYApcrHjphJ15ev51n5Ybh6cvo
2022-11-15T09:17:21.970Z: OK BA287CUEbkvfRaNJzAh2WtRiqJAraJ3eu5W1pa5vWb3
2022-11-15T09:17:21.974Z: OK DdwKFJK3mGWtK98PBwcDrfTiK4oHnV8SY5ETuPfBScb5
2022-11-15T09:17:21.978Z: OK 6hKFR9qGE8rehbNS7vpbjcL9xkiE2Zabo2uzFkvyav1V
2022-11-15T09:17:21.983Z: OK 6LGXS8pLdjmLYmYjhcV6erZFkHySmh7xDAV4JP44V7KM
2022-11-15T09:17:21.986Z: OK CDcC2qjMpJz5Ffqz5TgoHtJkYy7u8xcizsQpNbkRDzHi
2022-11-15T09:17:21.990Z: OK ENuruMB9Q4LCmDsLqABbbvmEnEdwgmuyLcYsxrNjYWqz
2022-11-15T09:17:21.994Z: OK GX7JzshL3jjAhb4R6Y4rSp4YEtWVrJSREkbg5bWBcxyw
2022-11-15T09:17:21.998Z: OK Atj4tq1a2HMMxbhdfsmPCGgd34dcUJtbQNBW58BCt5Zq
2022-11-15T09:17:22.002Z: OK 4PEA81r3yCT8durRAYwoscs9QFYJXJD5xpm4TNZ65YJd
2022-11-15T09:17:22.006Z: OK C8fSV1KRZJG6ho6zjLg8BAABpFaxNE666VPRXBk2prjh
2022-11-15T09:17:22.010Z: OK 8TyDYhn5WCPecieum1vEZtc4cx2CyqFDfE4uh29PzYrM
2022-11-15T09:17:22.013Z: OK EMq1o2WjqcRQKfZ6qrdEKps6jU6ejnTJ3sSSZpg3KkXk
2022-11-15T09:17:22.017Z: OK BZy7HB1NN4uTsGH8UmWsuu9NXH1h6VeBTfMsDx6VQNAS
2022-11-15T09:17:22.020Z: OK 8cz8VcP8TpN3xhESwBXEJW6njaP94o8cJzr6LL5gjvqv
2022-11-15T09:17:22.024Z: OK A7mngALp73vGHed35JHDv3trxjyvo8xrZqBhYeTKry1P
2022-11-15T09:17:22.027Z: OK 7gimQprYD7TyRtAroQZBJyqPYeDH5LdHUkgkhbhFqUew
2022-11-15T09:17:22.030Z: OK Hk2BaFdZGrfZ8ooFonqrRCkyVVh2vLQcS3NW16dreUrp
2022-11-15T09:17:22.035Z: OK AtMKiK7vY1YWG47zE85Sq6v4kyyy3Lugh8auof9cYA1c
2022-11-15T09:17:22.038Z: OK qSKWfP4qZbhxstwh3Aqxb7PmTUQJbV3STYvF3jeKoPR
2022-11-15T09:17:22.042Z: OK J6FQRZtWAyBMicvxFFjm1zaJSHEaNniy31yUfMcUTbcb
2022-11-15T09:17:22.045Z: OK 4sG2egHFsUcCinToiA13aMo2496DzQEhoaj6pTcFt3z1
2022-11-15T09:17:22.048Z: OK 2SGJwzSmC4BFQWeRV5ZKNLbEoZMUMNWiDuRjhHquNcj7
2022-11-15T09:17:22.052Z: OK Ejy4cpfbpWj8QTtzmsPdomrg5YoMMkktJidZ3uvKWAvo
2022-11-15T09:17:22.055Z: OK HTk9CYiQco5CHudU8Q2PNExXqgPWW6bYRxXyMsD3PNRR
2022-11-15T09:17:22.059Z: OK 5sYPmGe4VbRKY3XuYXYLse8GCdRhHES9gFPcPUKY3VSr
2022-11-15T09:17:22.062Z: OK 3SRR8zxZ9y27NLnXeweMa7Zs4rUj68gM84qeDNYtCLfu
2022-11-15T09:17:22.065Z: OK DEUFnR4kbzoxpfinfBwZUerbe1sGU6v9M1z2aHa85RH8
2022-11-15T09:17:22.069Z: OK DbDBDbhN9ZxN1dBSzGUV4auAqHk55tsKkBfDUs2hJ8gR
2022-11-15T09:17:22.072Z: OK Fm9CHtcqZLXV1WYvbVjKkeRxv82yjmeGEXS2NGvgkWvp
2022-11-15T09:17:22.075Z: OK h2KrVefvYwp5RhHwYejVN92frNCFzy4nzLkBDy7KHPb
2022-11-15T09:17:22.078Z: OK Bpgup5uc2LJKk6DsG6VvkMkRafDZitTCDcSciscXYk3o
2022-11-15T09:17:22.082Z: OK Frw9suA12R6P6uL8VpWJTiNZxWMWiL9G8J4jTFdXHdAi
2022-11-15T09:17:22.085Z: OK 5GxWxkJXenZspq1di7pRwcxzf8N9uQQGNxVdEmMdPFeF
2022-11-15T09:17:22.089Z: OK BLjBEjFFwQhVD4SR3gE34cfE11chXPZTzQhZJVuzGaVD
2022-11-15T09:17:22.092Z: OK JE5yHcygLFCeFVxpJpZnmY9Exx26GSv5gnFtQx9kjGom
2022-11-15T09:17:22.096Z: OK 6B9aCkgGZgbYfEy9gDinCHcSs482jzvsArEBbLp3L6ty
2022-11-15T09:17:22.100Z: OK 9Zna8fztMoyErq7Xje2b65ds5JtMj8PK4SpAGwyiGcry
2022-11-15T09:17:22.103Z: OK 3Hj1D5ypn2eNUDHuoWL3YcNfV3BYjHBMtP8KKLUGM5db
2022-11-15T09:17:22.106Z: OK 7eYfY1Gjg1tFwMY6WcqNuUrzhkwZbnS7swYzN59yksUA
2022-11-15T09:17:22.110Z: OK AVR6pRhg4ufPxcYttTczfBTBJVeJwqYYesiB2R4FBBWj
2022-11-15T09:17:22.113Z: OK GNeGzo2Z4tMWYAqsyLDYkwue2aZXEAaL78UEEPPeZZxz
2022-11-15T09:17:22.117Z: OK 3u5hhXsLqmFUoWsFz8mYCWgLe9dDtc3BvXRepSYWeFSg
2022-11-15T09:17:22.120Z: OK EEoefDJhcCFoxpYw9W8XcNTNpMxHwYa3QAycPzHEGW18
2022-11-15T09:17:22.123Z: OK CRa1vgpqmyFQBthRVaRNWrAZLWgGwgYVMFJH8sknXU5m
2022-11-15T09:17:22.126Z: OK 51X9k3S8ycRGdZbaobxJXmJwjZ5ZEXKJUp5nGV8tCcM6
2022-11-15T09:17:22.129Z: OK CFFu5XRpWKkMwnhU8gU5bUBcVzw3Xod2FjDW7BCt79XC
2022-11-15T09:17:22.133Z: OK 75M8e6NrqvjcNrHUnHxxcecGrufkgy5Rk7PKViBWQ4jn
2022-11-15T09:17:22.136Z: OK BEJRJYMvqkjvTP2Zd25JaY2Uy82YoSwuQkVbQb54u9B2
2022-11-15T09:17:22.139Z: OK Hv6jaePCdrc9LYQiHWRekMcEnmnntYLxMt5SvoxKdUG6
2022-11-15T09:17:22.143Z: OK C87MLgu6bUhedChRqw8DbTvVvNKWaLWDdyTYqMC9GjoK
2022-11-15T09:17:22.147Z: OK 779cu9hkuWt33wPuSBvLBza8uWZ4Qt2E36iEm28Eoiig
2022-11-15T09:17:22.151Z: OK 6xyFBeAhW3NUoizALiRnFf7gGK76XtftXM59Z8LwwuAL
2022-11-15T09:17:22.154Z: OK 375Vpz2Q6uXw29xiK4c1B6pARe3jn5URPvetGm3hJhzy
2022-11-15T09:17:22.157Z: OK GZNLPdoWDYSoGhANXFabxBc7JKdkW6NerwNwxMedMNUV
2022-11-15T09:17:22.160Z: OK 5wgKWf8iuzna1r373UgogznXDb4hojPpL8w3rTF6msmb
2022-11-15T09:17:22.163Z: OK H2xPVTyrxqEN4ZiJoD8rTXCXN8jKAbUUHN7eu9x2Qws8
2022-11-15T09:17:22.167Z: OK A9dX9aBCLBepRZj9UDe7LaujWGAfL9LghpdfJmVFPX9N
2022-11-15T09:17:22.170Z: OK 6XNZ68WAhwxJ9yzBS1iGZLkSyA39nauucikQFXGnDMwx
2022-11-15T09:17:22.174Z: OK 3rscro6xQ2JLep6HyTWUpDhwJHJeNB4S5yk24dZFxbjt
2022-11-15T09:17:22.177Z: OK 4em6ZwXkEqrqEjM3Dw3xX6gJ3nLPR28wJnuWh6ayJGRM
2022-11-15T09:17:22.180Z: OK FqC19GaBK95Sfr9q111uvJNVB7Xq38YkP1rSsQqaDPMN
2022-11-15T09:17:22.185Z: OK C9XpnavxHxV7FHZrZXndpTkGd8a69BP1RAu2Kz8sHDNB
2022-11-15T09:17:22.188Z: OK FzNqgNpTVwrz87FAT3M9iutFepmF5YQEZocycjzBh4EU
2022-11-15T09:17:22.192Z: OK CZEYssQuhqWgo4Q39EYWQNDYET6sf3cCk37B9E57t9CP
2022-11-15T09:17:22.195Z: OK 5GE9jaAdK8Ndcctt38h2MmumcyvHFXKuKQb4L4EEE1H1
2022-11-15T09:17:22.198Z: OK HBYc8SYsvT5J67SbuJKZwcXpLZJkthnmzqsTHxXQp8pa
2022-11-15T09:17:22.202Z: OK FSH7ftSa5N4CvnnjTTiAGDbhus71tPdE2jSXmtThfW4Q
2022-11-15T09:17:22.205Z: OK 9SChXiKkybqq8sVxowg6rZ2SeqC8b7MecLkWJnGJ9UzT
2022-11-15T09:17:22.209Z: OK FfzaPoAWDnTgFbFXctinAnfAvRxi5EuDcBoEySQ6x2fq
---- elapsed; 1540
{ blocks: [ 27516, 27517 ], processed: '100%', tps: 64.93506493506493 }