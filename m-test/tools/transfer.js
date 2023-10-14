import { Mitum } from "../../mitumjs/cjs/index.js";
import { TimeStamp } from "../../mitumjs/cjs/types/time.js";
import { Amount } from "../../mitumjs/cjs/common/amount.js";
import { TransferItem, TransferFact } from "../../mitumjs/cjs/operation/currency/transfer.js";
import { Operation } from "../../mitumjs/cjs/operation/base/operation.js"

import { log, warning } from "../log.js";

import fs from "fs-extra";

const { ensureDirSync, readFileSync, writeFileSync } = fs;

async function run() {
	const argvs = process.argv.map((val) => val);
	const id = argvs[2];
	const cid = argvs[3];
	const total = parseInt(argvs[4]);
	const items = parseInt(argvs[5]);
	const senders = argvs[6];
	const receivers = argvs[7];
	const arg = {
		id,
		cid,
		total,
		items,
		senders,
		receivers,
	};
	createOperations(arg);
}

await run();

export function createOperations({ id, cid, total, items, senders, receivers }) {
	const token = new Date().getTime();
	ensureDirSync(`logging/transfer-${token}/operations/`);
	log(`dir logging/transfer-${token}/operations/ created`);
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

	let receiverAccounts = [];
	try {
		receiverAccounts = [
			...JSON.parse(readFileSync(receivers, { encoding: "utf8" }))["accounts"],
		];
		if (receiverAccounts.length < items) {
			throw new Error("insufficient senderAccounts");
		}
		log(`get receiverAccounts...`);
	} catch (e) {
		warning(`insufficient receiverAccounts or wrong file path`);
		process.exit(-1);
	}

	const mitum = new Mitum();

	log(
		`creating transfer operations in logging/transfer-${token}/operations/`
	);
	const transfers = [];
	for (let i = 0; i < ops; i++) {
		const transferItems = [];
		for (let j=0; j < items; j++) {
			const item = new TransferItem(receiverAccounts[j].address, [new Amount(cid, "1")]);
			transferItems.push(item);
		}
		const fact = new TransferFact(
			new TimeStamp().UTC(),
			senderAccounts[i].address,
			transferItems
		);
		const op = new Operation(id, fact);
		op.sign(senderAccounts[i].private);
		transfers.push(op.toHintedObject());
	}

	transfers.forEach((op, idx) =>
		writeFileSync(
			`logging/transfer-${token}/operations/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		)
	);
	log(`transfer files created in logging/transfer-${token}/operations/`);

	writeFileSync(
		`logging/transfer-${token}/files.csv`,
		transfers.map((op, idx) => `${idx}-${op.fact.hash}`).join("\n")
	);
	log(`logging/transfer-${token}/files.csv created`);
	writeFileSync(
		`logging/transfer-${token}/facts.csv`,
		transfers.map((op) => op.fact.hash).join("\n")
	);
	log(`logging/transfer-${token}/facts.csv created`);
}