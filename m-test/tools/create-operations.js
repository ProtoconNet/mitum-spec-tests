import { Mitum } from "../../mitumjs/cjs/index.js";
import { TimeStamp } from "../../mitumjs/cjs/types/time.js";
import { Amount } from "../../mitumjs/cjs/common/amount.js";
import { CreateAccountItem, CreateAccountFact } from "../../mitumjs/cjs/operation/currency/create-account.js";
import { AssignItem, AssignFact } from "../../mitumjs/cjs/operation/credential/assign.js";
import { Operation } from "../../mitumjs/cjs/operation/base/operation.js"
import { log, warning } from "../log.js";
import fs from "fs-extra";
import {Big} from "../../mitumjs/cjs/types/math.js";
import {Keys, PubKey} from "../../mitumjs/cjs/key/pub.js";
import assert from "assert";
import { execSync, spawn } from 'child_process';

const { ensureDirSync, readFileSync, writeFileSync } = fs;

export function createAccounts({
		networkID,
		cid,
		total,
		items,
		baseDir,
		subDir,
	    timestamp,
	    rampup,
}) {
	ensureDirSync(`${baseDir}/${subDir}/create-accounts/ops/`);
	// log(`folder ${baseDir}/${subDir}/create-accounts/ops created`);
	const ops = total/items

	let senderAccounts = [];
	try {
		senderAccounts = [
			...JSON.parse(readFileSync(`${baseDir}/setup/create-account/account-list.json`, { encoding: "utf8" }))["accounts"],
		];
		if (senderAccounts.length < ops) {
			throw new Error("insufficient senderAccounts");
		}
		// log(`get senderAccounts`);
	} catch (e) {
		warning(`failed to get data from file`);
		process.exit(-1);
	}

	// log(`creating operations in ${baseDir}/${subDir}/create-accounts/ops`);

	const mitum = new Mitum();
	let totalCount = total
	const testOperations = [];
	for (let i = 0; i < ops; i++) {
		const createAccountItems = [];
		for (let j=0; j < items; j++) {
			const amounts = [
				new Amount(
					cid,
					new Big(1).toString()
				),
			];
			let kp
			try {
				kp = mitum.account.key();
			} catch (err) {
				try {
                                	kp = mitum.account.key();
				} catch (err) {
                                	continue;
                        	}	
			}
			const keys = new Keys(
				[new PubKey(kp.publickey, 100)],
				100
			);
			const item = new CreateAccountItem(keys, amounts, "mitum");
			totalCount = totalCount - 1;
			if (totalCount < 0) {
				break
			}
			createAccountItems.push(item);
		}

		const fact = new CreateAccountFact(
			new TimeStamp().UTC(),
			senderAccounts[i].address,
			createAccountItems
		);
		const op = new Operation(networkID, fact);
		op.sign(senderAccounts[i].privatekey);
		testOperations.push(op.toHintedObject());
	}

	testOperations.forEach((op, idx) =>
		writeFileSync(
			`${baseDir}/${subDir}/create-accounts/ops/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		)
	);
	// log(`test operations files created in ${baseDir}/${subDir}/create-accounts/ops/`);

	writeFileSync(
		`${baseDir}/${subDir}/create-accounts/files.csv`,
		testOperations.map((op, idx) => `${idx}-${op.fact.hash}`).join("\n")
	);
	// log(`${baseDir}/${subDir}/create-accounts/files.csv created`);
	writeFileSync(
		`${baseDir}/${subDir}/create-accounts/facts.csv`,
		testOperations.map((op) => op.fact.hash).join("\n")
	);
	// log(`${baseDir}/${subDir}/create-accounts/facts.csv created`);
	log(`bash bash/run-jmeter.sh --data=${timestamp} --dir=${subDir}/create-accounts --period=${rampup}`);

	const subprocess = spawn('bash',
		['bash/run-jmeter.sh', `--data=${timestamp}`, `--dir=${subDir}/create-accounts`, `--period=${rampup}`],
		{ detached: false, stdio: 'inherit' });
	log("Exit create-operation.sh")
}

export function createCredentials({
	  networkID,
	  cid,
	  total,
	  items,
	  baseDir,
	  subDir,
	  timestamp,
	  rampup,
}) {
	ensureDirSync(`${baseDir}/${subDir}/assign-credential/ops/`);
	// log(`folder ${baseDir}/${subDir}/assign-credential/ops created`);
	const ops = total/items

	let credentialServices = [];
	try {
		credentialServices = [
			...JSON.parse(readFileSync(`${baseDir}/setup/credential-service/service-list.json`, { encoding: "utf8" }))["contracts"],
		];
		// if (credentialServices.length < ops) {
		// 	throw new Error("insufficient senderAccounts");
		// }
		// log(`get credentialServices`);
	} catch (e) {
		warning(`failed to get data from file`);
		process.exit(-1);
	}

	// log(`creating operations in ${baseDir}/${subDir}/assign-credential/ops/`);

	const testOperations = [];
	for (let i = 0; i < credentialServices.length; i++) {
		const AssignItems = [];
		for (let j=0; j < items; j++) {
			const item = new AssignItem(
				credentialServices[i].contract,
				credentialServices[i].owner.address,
				credentialServices[i].template,
				`${j}`,
				"test",
				100,
				200,
				`did${j}`,
				cid,
			);
			AssignItems.push(item);
		}
		const fact = new AssignFact(
			new TimeStamp().UTC(),
			credentialServices[i].owner.address,
			AssignItems,
		);
		const op = new Operation(networkID, fact);
		op.sign(credentialServices[i].owner.privatekey);
		testOperations.push(op.toHintedObject());
	}

	testOperations.forEach((op, idx) =>
		writeFileSync(
			`${baseDir}/${subDir}/assign-credential/ops/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		)
	);
	// log(`test operations files created in ${baseDir}/${subDir}/assign-credential/ops`);

	writeFileSync(
		`${baseDir}/${subDir}/assign-credential/files.csv`,
		testOperations.map((op, idx) => `${idx}-${op.fact.hash}`).join("\n")
	);
	// log(`${baseDir}/${subDir}/assign-credential/files.csv created`);
	writeFileSync(
		`${baseDir}/${subDir}/assign-credential/facts.csv`,
		testOperations.map((op) => op.fact.hash).join("\n")
	);
	// log(`${baseDir}/${subDir}/assign-credential/facts.csv created`);
	log(`bash bash/run-jmeter2.sh --data=${timestamp} --dir=${subDir}/assign-credential  --period=${rampup}`)

	const subprocess = spawn('bash',
		['bash/run-jmeter2.sh', `--data=${timestamp}`, `--dir=${subDir}/assign-credential`, `--period=${rampup}`],
		{ detached: false, stdio: 'inherit' });
	log("Exit create-operation.sh")
}

async function run() {
	const args = process.argv.map((val) => val);
	assert(args.length === 9)
	const networkID = args[2];
	const cid = args[3];
	const total = parseInt(args[4]);
	const items = parseInt(args[5]);
	const timestamp = args[6];
	const type = args[7]
	const rampup = args[8]

	const subTimestamp = new Date().getTime();
	const baseDir = `test/${timestamp}`
	const subDir = `subtest/${subTimestamp}`
	const arg = {
		networkID,
		cid,
		total,
		items,
		baseDir,
		subDir,
		timestamp,
		rampup,
	};

	if (type === "account") {
		createAccounts(arg);
	} else if (type === "credential") {
		createCredentials(arg)
	}
}

await run();
