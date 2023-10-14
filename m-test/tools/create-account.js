import axios from "axios";
import wait from "waait";
import { execSync } from "child_process";
import { Mitum } from "../../mitumjs/cjs/index.js";
import { Big } from "../../mitumjs/cjs/types/math.js";
import { TimeStamp } from "../../mitumjs/cjs/types/time.js";
import { Amount } from "../../mitumjs/cjs/common/amount.js";
import { CreateAccountItem, CreateAccountFact } from "../../mitumjs/cjs/operation/currency/create-account.js";
import { Keys, PubKey } from "../../mitumjs/cjs/key/pub.js"
import { Operation } from "../../mitumjs/cjs/operation/base/operation.js"
import fs from "fs-extra";
import { log, success, warning } from "../log.js";

const { ensureDirSync, writeFileSync } = fs;

async function run() {
	const argvs = process.argv.map((val) => val);
	const mode = argvs[2];
	const network = argvs[3];
	const id = argvs[4];
	const cid = argvs[5];
	const maxItems = argvs[6];
	const genesisInfo = argvs[7].split(",");
	const n = parseInt(argvs[8]);
	const interval = parseInt(argvs[9]);

	const arg = {
		mode,
		network,
		id,
		cid,
		maxItems,
		genesis: { address: genesisInfo[0], private: genesisInfo[1] },
		n,
		interval,
	};
	await createAccount(arg);
}

await run();

async function createAccount({
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

	const mitum = new Mitum();

	let phase = totalPhase() - 1;
	let count = 0;
    let base = 100000 * Math.pow(10, phase);

	while (accounts.length <= n) {
		log(`remain phase ${phase}`);
		const accs = [];
		for (const acc of accounts) {
			const items = [];
			for (let j = 0; j < maxItems; j++) {
				const amounts = [
					new Amount(
						cid,
						new Big(base * (phase * maxItems + 1)).toString()
					),
				];

				const kp = mitum.account.key();
				const keys = new Keys(
					[new PubKey(kp.publickey, 100)],
					100
				);
				accs.push({
					address: keys.address.toString(),
					private: kp.privatekey,
				});
				items.push(new CreateAccountItem(keys, amounts, "mitum"));
				if (accounts.length + accs.length > n) {
					break;
				}
			}
			const fact = new CreateAccountFact(
				new TimeStamp().UTC(),
				acc.address,
				items
			);
			const op = new Operation(id, fact);
			op.sign(acc.private);
			const d = op.toHintedObject();
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
					`./m network client send-operation '${id}' ${network}#tls_insecure --body=logging/create-account-${token}/${count}-${d.fact.hash}.json --log.level=fatal > logging/create-account-${token}/network-client-log/${count}-${d.fact.hash}.json 2>&1`
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
        base = parseInt(base / 10);
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