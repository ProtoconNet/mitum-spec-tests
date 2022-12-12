import axios from "axios";
import wait from "waait";
import { execSync } from "child_process";

import {
	Amount,
	Big,
	Keys,
	KPGen,
	PubKey,
	Currency,
	TimeStamp,
	Operation,
	useId,
} from "mitum-sdk";

import fs from "fs-extra";
import { log, success, warning } from "../log.js";

const { ensureDirSync, writeFileSync } = fs;

async function run() {
	const argvs = process.argv.map((val) => val);
	const v = argvs[2];
	const mode = argvs[3];
	const network = argvs[4];
	const id = argvs[5];
	const cid = argvs[6];
	const maxItems = argvs[7];
	const n = parseInt(argvs[9]);
	const interval = parseInt(argvs[10]);
	const gen = argvs[8].split(",");
	const arg = {
		v,
		mode,
		network,
		id,
		cid,
		maxItems,
		genesis: { address: gen[0], private: gen[1] },
		n,
		interval,
	};
	await createAccount(arg);
}

await run();

async function createAccount({
	v,
	mode,
	network,
	id,
	cid,
	maxItems,
	genesis,
	n,
	interval,
}) {
	const token = new Date().getTime();
	ensureDirSync(`logging/create-account-${token}/`);
	log(`dir logging/create-account-${token}/ created`);

	function totalPhase() {
		let len = 0,
			count = 0;
		while (len < n) {
			len += (len + 1) * maxItems;
			count++;
		}
		return count;
	}

	const createAccounts = [];
	let accounts = [
		{
			...genesis,
		},
	];

	useId(id);

	let phase = totalPhase() - 1;
	let count = 0;
	while (accounts.length <= n) {
		log(`remain phase ${phase}`);
		const accs = [];
		for (let i = 0; i < accounts.length; i++) {
			const items = [];
			for (let j = 0; j < maxItems; j++) {
				const amounts = [
					new Amount(
						cid,
						new Big(100000 * (phase * maxItems + 1)).toString()
					),
				];
				const kp = KPGen.random();
				const keys = new Keys(
					[new PubKey(kp.publicKey.toString(), 100)],
					100
				);
				accs.push({
					address: keys.address.toString(),
					private: kp.privateKey.toString(),
				});
				items.push(new Currency.CreateAccountsItem(keys, amounts));
				if (accounts.length + accs.length > n) {
					break;
				}
			}

			const fact = new Currency.CreateAccountsFact(
				new TimeStamp().UTC(),
				accounts[i].address,
				items
			);
			const op = new Operation(fact, "", []);
			if (v === "v2") {
				op.forceExtendedMessage = true;
			}
			op.sign(accounts[i].private);

			const d = op.dict();
			createAccounts.push(d);

			writeFileSync(
				`logging/create-account-${token}/${count}-${d.fact.hash}.json`,
				JSON.stringify(d, null, 4)
			);
			log(
				`logging/create-account-${token}/${count}-${d.fact.hash}.json created`
			);

			if (mode === "api") {
				await axios
					.post(`${network}/builder/send`, d)
					.then((_) => success(`${count}:: OK; ${d.fact.hash}`))
					.catch((_) => warning(`${count}:: BAD; ${d.fact.hash}`));
				await wait(1000);
			} else if (mode === "network-client") {
				ensureDirSync(
					`logging/create-account-${token}/network-client-log/`
				);
				log(
					`dir logging/create-account-${token}/network-client-log/ created`
				);
				execSync(
					`./m network client '{"_hint":"send-operation-header-v0.0.1"}' '${id}' ${network}#tls_insecure --body=logging/create-account-${token}/${count}-${d.fact.hash}.json --log.level=fatal > logging/create-account-${token}/network-client-log/${count}-${d.fact.hash}.json 2>&1`
				);
				success(`${count}:: ${d.fact.hash} sent by network-client`);
				await wait(1000);
			}
			count++;
			if (accounts.length + accs.length > n) {
				break;
			}
		}
		accounts = accounts.concat(...accs);
		console.log("wait...");
		await wait(interval);
		phase--;
	}

	writeFileSync(
		`logging/create-account-${token}/accounts.json`,
		JSON.stringify(
			{
				accounts: accounts.slice(1),
			},
			null,
			4
		)
	);
	log(`logging/create-account-${token}/accounts.json created`);
}
