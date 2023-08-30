import fs from "fs";
import fsExtra, { ensureDirSync } from "fs-extra";
import wait from "waait";
import axios from "axios";
import { MongoClient } from "mongodb";

import { log, success, warning, config } from "./log.js";

// import {
// 	useId,
// 	Amount,
// 	KPGen,
// 	PubKey,
// 	Keys,
// 	Currency,
// 	Operation,
// 	TimeStamp,
// } from "mitum-sdk";

import { Mitum } from "../../mitumjs/cjs/index.js";
import { TimeStamp } from "../../mitumjs/cjs/utils/time.js";
import { Amount } from "../../mitumjs/cjs/types/property.js";
import { CreateAccountsItem, CreateAccountsFact } from "../../mitumjs/cjs/account/create.js";
import { TransfersItem, TransfersFact } from "../../mitumjs/cjs/currency/transfer.js";
import { Keys, PubKey } from "../../mitumjs/cjs/account/publicKey.js"
import { OperationType } from "../../mitumjs/cjs/types/operation.js"

import { execSync } from "child_process";

export const CreateAccountsAv = async (v, token, options) => {
	const { n, network, id, cid, genesis, interval, maxItems } = options;

	useId(id);

	let remains = n;
	const accounts = [{ addr: genesis.address, priv: genesis.private }];
	const bigamounts = [new Amount(cid, "" + (10000000 * (parseInt(n / maxItems) + 1)))];
	const smallamounts = [new Amount(cid, "100000")];

	const createAccounts = [];

	let phase = 1;
	while (true) {
		log(`phase ${phase}`);
		const acclen = accounts.length;
		for (let i = 0; i < Math.min(acclen, maxItems); i++) {
			const items = [];
			for (let j = 0; j < maxItems; j++) {
				const kp = v === "v2" ? KPGen.schnorr.random() : KPGen.random();
				const key = new PubKey(kp.publicKey.toString(), 100);
				const keys = new Keys([key], 100);
				items.push(new CreateAccountsItem(keys, phase === 1 ? bigamounts : smallamounts));
				accounts.push({
					addr: keys.address.toString(),
					priv: kp.privateKey.toString(),
				});
				remains--;
				if (remains <= 0) {
					break;
				}
			}
			const fact = new CreateAccountsFact(
				new TimeStamp().UTC(),
				accounts[i].addr,
				items
			);
			const op = new Operation(fact, "", []);
			if (v === "v2") {
				op.forceExtendedMessage = true;
			}
			op.sign(accounts[i].priv);
			const dict = op.toHintedObject();
			createAccounts.push(dict);
			const res = await axios.post(`${network}/builder/send`, JSON.stringify(dict));
			log(`request; ${dict.fact.hash}`);
			if (res.status === 200) {
				success(`${createAccounts.length}:: OK ${dict.fact.hash}`);
			} else {
				warning(
					`${createAccounts.length}:: BAD request ${dict.fact.hash} failed; stop the process and retry`
				);
			}
			if (remains <= 0) {
				break;
			}
			await wait(1000);
		}
		if (remains <= 0) {
			break;
		}
		log(`wait interval; ${interval}...`);
		await wait(interval);
		phase++;
	}

	log(`make sure logging/${token}/operations/create-accounts/ exists`);
	fsExtra.ensureDirSync(`logging/${token}/operations/create-accounts/`);

	log(`creating operation files`);
	createAccounts.forEach((op, idx) => {
		fs.writeFileSync(
			`logging/${token}/operations/create-accounts/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		);
	});

	const cas = createAccounts.reduce(
		(curr, next) => curr + next.fact.hash + "\n",
		""
	);
	const casfiles = createAccounts
		.map((op, idx) => `${idx}-${op.fact.hash}`)
		.join("\n");

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/operations.csv`,
		cas
	);
	log(`logging/${token}/operations/create-accounts/opertions.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/files.csv`,
		casfiles
	);
	log(`logging/${token}/operations/create-accounts/files.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/accounts.json`,
		JSON.stringify({ accounts: accounts.slice(1) }, null, 4)
	);
	log(`logging/${token}/operations/create-accounts/accounts.json created`);
};

export const ParallelCreateAccounts = async (v, token, options) => {
	const { n, url, id, cid, genesis, interval, exe } = options;

	useId(id);

	if (n <= 0) {
		return;
	}

	const numOfAccount = [];
	let nn = n;
	while (nn) {
		if (nn >= 10000) {
			numOfAccount.push(10000);
			nn -= 10000;
		} else {
			numOfAccount.push(nn);
			nn = 0;
		}
	}
	log(`number of create-account operations; ${numOfAccount.length}`);

	const accounts = [];

	let amounts = [new Amount(cid, "100000")];

	const createAccounts = numOfAccount.map((m) => {
		const items = [];
		for (let i = 0; i < m; i++) {
			const kp = v === "v2" ? KPGen.schnorr.random() : KPGen.random();
			const key = new PubKey(kp.publicKey.toString(), 100);
			const keys = new Keys([key], 100);

			const item = new CreateAccountsItem(keys, amounts);
			items.push(item);

			accounts.push({
				addr: keys.address.toString(),
				priv: kp.privateKey.toString(),
			});
		}
		const fact = new CreateAccountsFact(
			new TimeStamp().UTC(),
			genesis.address,
			items
		);
		const op = new Operation(fact, "", []);
		if (v === "v2") {
			op.forceExtendedMessage = true;
		}
		op.sign(genesis.private);

		return op.toHintedObject();
	});

	log(`make sure logging/${token}/operations/create-accounts/ exists`);
	fsExtra.ensureDirSync(`logging/${token}/operations/create-accounts/`);

	log(`creating operation files`);
	createAccounts.forEach((op, idx) => {
		fs.writeFileSync(
			`logging/${token}/operations/create-accounts/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		);
	});

	const cas = createAccounts.reduce(
		(curr, next) => curr + next.fact.hash + "\n",
		""
	);
	const casfiles = createAccounts
		.map((op, idx) => `${idx}-${op.fact.hash}`)
		.join("\n");

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/operations.csv`,
		cas
	);
	log(`logging/${token}/operations/create-accounts/opertions.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/files.csv`,
		casfiles
	);
	log(`logging/${token}/operations/create-accounts/files.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/accounts.json`,
		JSON.stringify({ accounts }, null, 4)
	);
	log(`logging/${token}/operations/create-accounts/accounts.json created`);

	log(`start request`);

	let i = 0;
	while (i < createAccounts.length) {
		await wait(interval);
		execSync(
			`${exe} network client send-operation '${id}' ${url}#tls_insecure --body=logging/${token}/operations/create-accounts/${i}-${createAccounts[i].fact.hash}.json --log.level=fatal`
		);
		success(
			`(${i + 1}/${createAccounts.length}) ${
				createAccounts[i].fact.hash
			} sent by network-client`
		);
		i++;
	}

	while (i < createAccounts.length) {
		await wait(interval);
		execSync(
			`${exe} network client send-operation '${id}' ${url}#tls_insecure --body=logging/${token}/operations/create-accounts/${i}-${createAccounts[i].fact.hash}.json --log.level=fatal`
		);
		success(
			`(${i + 1}/${createAccounts.length}) ${
				createAccounts[i].fact.hash
			} sent by network-client`
		);
		i++;
	}
};

export const Transfers = (v, token, options) => {
	const { n, id, address, cid, accounts } = options;
	useId(id);

	const transfers = [];
	const amounts = [new Amount(cid, "1")];
	const item = new TransfersItem(address, amounts);
	for (let i = 0; i < n; i++) {
		const fact = new TransfersFact(
			new TimeStamp().UTC(),
			accounts[i].addr,
			[item]
		);
		const op = new Operation(fact, "", []);
		if (v === "v2") {
			op.forceExtendedMessage = true;
		}
		op.sign(accounts[i].priv);

		transfers.push(op.toHintedObject());
	}

	log(`make sure logging/${token}/operations/transfers/ exists`);
	fsExtra.ensureDirSync(`logging/${token}/operations/transfers/`);

	log(`creating operation files`);
	transfers.forEach((op, i) => {
		fs.writeFileSync(
			`logging/${token}/operations/transfers/${i}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		);
	});

	const tfs = transfers.reduce(
		(curr, next) => curr + next.fact.hash + "\n",
		""
	);
	const tfsfiles = transfers
		.map((op, idx) => `${idx}-${op.fact.hash}`)
		.join("\n");

	fs.writeFileSync(
		`logging/${token}/operations/transfers/operations.csv`,
		tfs
	);
	log(`logging/${token}/operations/transfers/operations.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/transfers/files.csv`,
		tfsfiles
	);
	log(`logging/${token}/operations/transfers/files.csv created`);

	return transfers;
};

export const CreateAccountsAvM2 = async (v, token, options) => {
	const { n, network, id, cid, genesis, interval, maxItems } = options;

	let remains = n;
	const accounts = [{ addr: genesis.address, priv: genesis.private }];
	const bigamounts = [new Amount(cid, "" + (10000000 * (parseInt(n / maxItems) + 1)))];
	const smallamounts = [new Amount(cid, "100000")];

	const createAccounts = [];

	const mitum = new Mitum();
	if (v === "v1") {
		console.error("v1 is unavailable with ../../mitumjs/");
		exit(-1);
	}

	let phase = 1;
	while (true) {
		log(`phase ${phase}`);
		const acclen = accounts.length;
		for (let i = 0; i < Math.min(acclen, maxItems); i++) {
			const items = [];
			for (let j = 0; j < maxItems; j++) {
				const kp = mitum.account.key();
				const key = new PubKey(kp.publickey, 100);
				const keys = new Keys([key], 100);
				items.push(new CreateAccountsItem(keys, phase === 1 ? bigamounts : smallamounts, "mitum"));
				accounts.push({
					addr: keys.address.toString(),
					priv: kp.privatekey,
				});
				remains--;
				if (remains <= 0) {
					break;
				}
			}
			const fact = new CreateAccountsFact(
				new TimeStamp().UTC(),
				accounts[i].addr,
				items
			);
			const op = new OperationType(id, fact);
			op.sign(accounts[i].priv);
			const dict = op.toHintedObject();
			createAccounts.push(dict);
			const res = await axios.post(`${network}/builder/send`, JSON.stringify(op.toHintedObject()));
			log(`request; ${dict.fact.hash}`);
			if (res.status === 200) {
				success(`${createAccounts.length}:: OK ${dict.fact.hash}`);
			} else {
				warning(
					`${createAccounts.length}:: BAD request ${dict.fact.hash} failed; stop the process and retry`
				);
			}
			if (remains <= 0) {
				break;
			}
			await wait(1000);
		}
		if (remains <= 0) {
			break;
		}
		log(`wait interval; ${interval}...`);
		await wait(interval);
		phase++;
	}

	log(`make sure logging/${token}/operations/create-accounts/ exists`);
	fsExtra.ensureDirSync(`logging/${token}/operations/create-accounts/`);

	log(`creating operation files`);
	createAccounts.forEach((op, idx) => {
		fs.writeFileSync(
			`logging/${token}/operations/create-accounts/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		);
	});

	const cas = createAccounts.reduce(
		(curr, next) => curr + next.fact.hash + "\n",
		""
	);
	const casfiles = createAccounts
		.map((op, idx) => `${idx}-${op.fact.hash}`)
		.join("\n");

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/operations.csv`,
		cas
	);
	log(`logging/${token}/operations/create-accounts/opertions.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/files.csv`,
		casfiles
	);
	log(`logging/${token}/operations/create-accounts/files.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/accounts.json`,
		JSON.stringify({ accounts: accounts.slice(1) }, null, 4)
	);
	log(`logging/${token}/operations/create-accounts/accounts.json created`);
};

export const ParallelCreateAccountsM2 = async (v, token, options) => {
	const { n, url, id, cid, genesis, interval, exe } = options;

	const mitum = new Mitum();
	if (v === "v1") {
		console.error("v1 is unavailable with ../../mitumjs/");
		exit(-1);
	}

	const numOfAccount = [];
	let nn = n;
	while (nn) {
		if (nn >= 10000) {
			numOfAccount.push(10000);
			nn -= 10000;
		} else {
			numOfAccount.push(nn);
			nn = 0;
		}
	}
	log(`number of create-account operations; ${numOfAccount.length}`);

	const accounts = [];

	let amounts = [new Amount(cid, "100000")];

	const createAccounts = numOfAccount.map((m) => {
		const items = [];
		for (let i = 0; i < m; i++) {
			const kp = mitum.account.Key();
			const key = new PubKey(kp.publickey, 100);
			const keys = new Keys([key], 100);

			const item = new CreateAccountsItem(keys, amounts);
			items.push(item);

			accounts.push({
				addr: keys.address.toString(),
				priv: kp.privatekey,
			});
		}
		const fact = new CreateAccountsFact(
			new TimeStamp().UTC(),
			genesis.address,
			items
		);
		const op = new OperationType(id, fact);
		p.sign(genesis.private);

		return op.toHintedObject();
	});

	log(`make sure logging/${token}/operations/create-accounts/ exists`);
	fsExtra.ensureDirSync(`logging/${token}/operations/create-accounts/`);

	log(`creating operation files`);
	createAccounts.forEach((op, idx) => {
		fs.writeFileSync(
			`logging/${token}/operations/create-accounts/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		);
	});

	const cas = createAccounts.reduce(
		(curr, next) => curr + next.fact.hash + "\n",
		""
	);
	const casfiles = createAccounts
		.map((op, idx) => `${idx}-${op.fact.hash}`)
		.join("\n");

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/operations.csv`,
		cas
	);
	log(`logging/${token}/operations/create-accounts/opertions.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/files.csv`,
		casfiles
	);
	log(`logging/${token}/operations/create-accounts/files.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/create-accounts/accounts.json`,
		JSON.stringify({ accounts }, null, 4)
	);
	log(`logging/${token}/operations/create-accounts/accounts.json created`);

	log(`start request`);

	let i = 0;
	while (i < createAccounts.length) {
		await wait(interval);
		execSync(
			`${exe} network client send-operation '${id}' ${url}#tls_insecure --body=logging/${token}/operations/create-accounts/${i}-${createAccounts[i].fact.hash}.json --log.level=fatal`
		);
		success(
			`(${i + 1}/${createAccounts.length}) ${
				createAccounts[i].fact.hash
			} sent by network-client`
		);
		i++;
	}

	while (i < createAccounts.length) {
		await wait(interval);
		execSync(
			`${exe} network client send-operation '${id}' ${url}#tls_insecure --body=logging/${token}/operations/create-accounts/${i}-${createAccounts[i].fact.hash}.json --log.level=fatal`
		);
		success(
			`(${i + 1}/${createAccounts.length}) ${
				createAccounts[i].fact.hash
			} sent by network-client`
		);
		i++;
	}
};

export const TransfersM2 = (v, token, options) => {
	const { n, id, address, cid, accounts } = options;
	
	const mitum = new Mitum();
	if (v === "v1") {
		console.error("v1 is unavailable with ../../mitumjs/");
		exit(-1);
	}

	const transfers = [];
	const amounts = [new Amount(cid, "1")];
	const item = new TransfersItem(address, amounts);
	for (let i = 0; i < n; i++) {
		const fact = new TransfersFact(
			new TimeStamp().UTC(),
			accounts[i].addr,
			[item]
		);
		const op = new OperationType(id, fact);
		op.sign(accounts[i].priv);

		transfers.push(op.toHintedObject());
	}

	log(`make sure logging/${token}/operations/transfers/ exists`);
	fsExtra.ensureDirSync(`logging/${token}/operations/transfers/`);

	log(`creating operation files`);
	transfers.forEach((op, i) => {
		fs.writeFileSync(
			`logging/${token}/operations/transfers/${i}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		);
	});

	const tfs = transfers.reduce(
		(curr, next) => curr + next.fact.hash + "\n",
		""
	);
	const tfsfiles = transfers
		.map((op, idx) => `${idx}-${op.fact.hash}`)
		.join("\n");

	fs.writeFileSync(
		`logging/${token}/operations/transfers/operations.csv`,
		tfs
	);
	log(`logging/${token}/operations/transfers/operations.csv created`);

	fs.writeFileSync(
		`logging/${token}/operations/transfers/files.csv`,
		tfsfiles
	);
	log(`logging/${token}/operations/transfers/files.csv created`);

	return transfers;
};


export const ParallelTransfer = (token, exe, id, url) => {
	const files = fs
		.readFileSync(`logging/${token}/operations/transfers/files.csv`, {
			encoding: "utf8",
		})
		.split("\n")
		.filter((h) => h !== "");
	log(`get file names from logging/${token}/operations/transfers/files.csv`);

	let parl = "parallel -u ::: ";
	ensureDirSync(`logging/${token}/operations/transfers/parallels`);
	files.forEach((fp) => {
		parl += `'bash logging/${token}/operations/transfers/parallels/parallel-${fp}.sh' `;
		fs.writeFileSync(
			`logging/${token}/operations/transfers/parallels/parallel-${fp}.sh`,
			`${exe} network client send-operation '${id}' ${url}#tls_insecure --body=logging/${token}/operations/transfers/${fp}.json --log.level=fatal`
		);
	});

	fs.writeFileSync(`logging/${token}/operations/transfers/parallel.sh`, parl);

	const d = new Date().getTime();
	let rs =
		"timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect\n";
	rs += `${d},0,0,0,0,0,0,0,,0,0,0,0,0,0,0,0\n`;
	fs.writeFileSync(`logging/${token}/result.jtl`, rs);

	execSync(`bash logging/${token}/operations/transfers/parallel.sh`);
};

export const Lookup = async (token, network) => {
	const facts = fs
		.readFileSync(`logging/${token}/operations/transfers/operations.csv`, {
			encoding: "utf8",
		})
		.split("\n")
		.filter((h) => h !== "");
	log(
		`get operations from logging/${token}/operations/transfers/operations.csv`
	);

	const lookup = async (hash, idx) => {
		return axios
			.get(`${network}/block/operation/${hash}`)
			.then((res) => {
				success(`(${idx}/${facts.length}) OK ${hash}`);
				return {
					hash,
					height: res.data._embedded.height,
					confirmed: new Date(
						res.data._embedded.confirmed_at
					).getTime(),
					inState: res.data._embedded.in_state,
				};
			})
			.catch((_) => {
				warning(`(${idx}/${facts.length}) BAD lookup failed; ${hash}`);
				return {
					hash,
					height: -1,
					inState: false,
					confirmed: 0,
				};
			});
	};

	const result = [];
	log(`start lookup ${facts.length} operations`);
	for (let i = 0; i < facts.length; i++) {
		const res = await lookup(facts[i], i + 1);
		result.push(res);
	}

	return result;
};

export const Lookupdb = async (token, mongo) => {
	const facts = fs
		.readFileSync(`logging/${token}/operations/transfers/operations.csv`, {
			encoding: "utf8",
		})
		.split("\n")
		.filter((h) => h !== "");
	log(
		`get operations from logging/${token}/operations/transfers/operations.csv`
	);

	const client = new MongoClient(mongo.url);
	await client.connect();
	log(`db connected`);
	const db = client.db(mongo.db);
	const collection = db.collection("digest_op");

	const lookup = async (hash, idx) => {
		return await collection
			.find({ fact: hash })
			.toArray()
			.then((res) => {
				res = res[0];
				const r = {
					hash,
					height: res.height,
					confirmed: new Date(res.d.confirmed_at).getTime(),
					inState: res.d.in_state,
				};
				success(`(${idx}/${facts.length}) OK ${hash}`);
				return r;
			})
			.catch((_) => {
				warning(`(${idx}/${facts.length}) BAD lookup failed; ${hash}`);
				return {
					hash,
					height: -1,
					inState: false,
					confirmed: 0,
				};
			});
	};

	const result = [];
	log(`start lookup ${facts.length} operations`);
	for (let i = 0; i < facts.length; i++) {
		const res = await lookup(facts[i], i + 1);
		result.push(res);
		if (i >= facts.length - 1) {
			client.close();
		}
	}
	return result;
};

export const TPS = async (token, network) => {
	const result = fs
		.readFileSync(`logging/${token}/result.jtl`)
		.toString("utf8");
	log(`get result from logging/${token}/result.jtl`);

	let spl = [];
	if (result.includes("\r\n")) {
		spl = result.split("\r\n");
	} else if (result.includes("\r")) {
		spl = result.split("\r");
	} else {
		spl = result.split("\n");
	}
	spl = spl.slice(1);

	spl = spl.map((sp) => parseInt(sp.split(",")[0]));
	spl.sort();

	const rs = new Date(spl[0]).getTime();
	config(`start time; ${rs}`);

	const processed = Lookup(token, network)
		.then((res) => {
			const latest = res
				.filter((fact) => fact.inState)
				.map((fact) => fact.confirmed)
				.sort();
			const num = latest.length;
			if (num < 1) {
				return { error: "none; maybe no operation is true", tps: 0 };
			}
			const elapsed = (latest[latest.length - 1] - rs) / 1000.0;
			config(`elapsed; ${latest[latest.length - 1] - rs}`);
			return {
				blocks: [...new Set(res.map((r) => r.height))].filter(
					(el) => el >= 0
				),
				processed: (100 * num) / res.length + "%",
				tps: num / elapsed,
			};
		})
		.catch((e) => ({
			error: e.name + ": " + e.message,
			tps: 0,
		}));

	return processed;
};

export const TPSdb = async (token, mongo) => {
	const result = fs
		.readFileSync(`logging/${token}/result.jtl`)
		.toString("utf8");
	log(`get result from logging/${token}/result.jtl`);

	let spl = [];
	if (result.includes("\r\n")) {
		spl = result.split("\r\n");
	} else if (result.includes("\r")) {
		spl = result.split("\r");
	} else {
		spl = result.split("\n");
	}
	spl = spl.slice(1);

	spl = spl.map((sp) => parseInt(sp.split(",")[0]));
	spl.sort();

	const rs = new Date(spl[0]).getTime();
	config(`start time; ${rs}`);

	const processed = Lookupdb(token, mongo)
		.then((res) => {
			const latest = res
				.filter((fact) => fact.inState)
				.map((fact) => fact.confirmed)
				.sort();
			const num = latest.length;
			if (num < 1) {
				return { error: "none; maybe no operation is true", tps: 0 };
			}
			const elapsed = (latest[latest.length - 1] - rs) / 1000.0;
			config(`elapsed; ${latest[latest.length - 1] - rs}`);
			return {
				blocks: [...new Set(res.map((r) => r.height))].filter(
					(el) => el >= 0
				),
				processed: (100 * num) / res.length + "%",
				tps: num / elapsed,
			};
		})
		.catch((e) => ({
			error: e.name + ": " + e.message,
			tps: 0,
		}));

	return processed;
};
