import { Mitum } from "../../mitumjs/cjs/index.js";
import { TimeStamp } from "../../mitumjs/cjs/types/time.js";
import { Amount } from "../../mitumjs/cjs/common/amount.js";
import { CreateAccountItem, CreateAccountFact } from "../../mitumjs/cjs/operation/currency/create-account.js";
import { Operation } from "../../mitumjs/cjs/operation/base/operation.js"
import { log, warning } from "../log.js";
import fs from "fs-extra";
import {Big} from "../../mitumjs/cjs/types/math.js";
import {Keys, PubKey} from "../../mitumjs/cjs/key/pub.js";

const { ensureDirSync, readFileSync, writeFileSync } = fs;

async function run() {
	const argvs = process.argv.map((val) => val);
	const id = argvs[2];
	const cid = argvs[3];
	const total = parseInt(argvs[4]);
	const items = parseInt(argvs[5]);
	const senders = argvs[6];
	const arg = {
		id,
		cid,
		total,
		items,
		senders,
	};

	createOperations(arg);
}

await run();

export function createOperations({ id, cid, total, items, senders }) {
	const token = new Date().getTime();
	ensureDirSync(`logging/test-${token}/operations/`);
	log(`dir logging/test-${token}/operations/ created`);
	const ops = total/items

	let senderAccounts = [];
	try {
		senderAccounts = [
			...JSON.parse(readFileSync(senders, { encoding: "utf8" }))["accounts"],
		];
		if (senderAccounts.length < ops) {
			throw new Error("insufficient senderAccounts");
		}
		log(`get senderAccounts...`);
	} catch (e) {
		warning(`insufficient senderAccounts or wrong file path`);
		process.exit(-1);
	}

	log(
		`creating operations in logging/test-${token}/operations/`
	);

	const mitum = new Mitum();

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
			const kp = mitum.account.key();
			const keys = new Keys(
				[new PubKey(kp.publickey, 100)],
				100
			);
			const item = new CreateAccountItem(keys, amounts, "mitum");
			createAccountItems.push(item);
		}
		const fact = new CreateAccountFact(
			new TimeStamp().UTC(),
			senderAccounts[i].address,
			createAccountItems
		);
		const op = new Operation(id, fact);
		op.sign(senderAccounts[i].private);
		testOperations.push(op.toHintedObject());
	}

	testOperations.forEach((op, idx) =>
		writeFileSync(
			`logging/test-${token}/operations/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		)
	);
	log(`test operations files created in logging/test-${token}/operations/`);

	writeFileSync(
		`logging/test-${token}/files.csv`,
		testOperations.map((op, idx) => `${idx}-${op.fact.hash}`).join("\n")
	);
	log(`logging/test-${token}/files.csv created`);
	writeFileSync(
		`logging/test-${token}/facts.csv`,
		testOperations.map((op) => op.fact.hash).join("\n")
	);
	log(`logging/test-${token}/facts.csv created`);
}