import axios from "axios";
import wait from "waait";
import { Mitum } from "../../mitumjs/cjs/index.js";
import { Big } from "../../mitumjs/cjs/types/math.js";
import { TimeStamp } from "../../mitumjs/cjs/types/time.js";
import { Amount } from "../../mitumjs/cjs/common/amount.js";
import { CreateAccountItem, CreateAccountFact } from "../../mitumjs/cjs/operation/currency/create-account.js";
import { CreateContractAccountItem, CreateContractAccountFact } from "../../mitumjs/cjs/operation/currency/create-contract-account.js";
import { CreateServiceFact } from "../../mitumjs/cjs/operation/credential/create-service.js";
import { AddTemplateFact } from "../../mitumjs/cjs/operation/credential/add-template.js";
import { Keys, PubKey } from "../../mitumjs/cjs/key/pub.js"
import { Operation } from "../../mitumjs/cjs/operation/base/operation.js"
import fs from "fs-extra";
import { log, success, warning } from "../log.js";
import assert from 'assert';
// import {Bool, ShortDate} from "../../mitumjs/src/types/index.js";
// import {Address} from "../../mitumjs/src/key/index.js";
// import {CurrencyID} from "../../mitumjs/src/common/index.js";

const { ensureDirSync, writeFileSync } = fs;

const senderAccounts =[]
const contractAccounts = [];
const credentialService = []
let apiUrl = ""

async function createAccount({
	mode,
	networkID,
	cid,
	maxItems,
	genesis,
	accN,
    contractN,
	interval,
	baseDir,
}) {
	ensureDirSync(baseDir);
	log(`folder ${baseDir} created`);

	function totalPhase() {
		let len = 0,
			count = 0;
		while (len < accN) {
			len += (len + 1) * maxItems;
			count++;
		}
		return count;
	}

	// const createAccounts = [];
	let accounts = [
		{
			...genesis,
		},
	];

	const mitum = new Mitum();

	let phase = totalPhase() - 1;
	let count = 0;
	let base = 100000 * Math.pow(10, phase);

	// create accounts
	ensureDirSync(`${baseDir}/create-account/ops/`);
	while (accounts.length <= accN) {
		log(`remain phase ${phase}`);
		const accs = [];
		for (const acc of accounts) {
			const items = [];
			for (let j = 0; j < maxItems; j++) {
				const amounts = [
					new Amount(
						cid,
						new Big(base * (phase * maxItems + 100)).toString()
					),
				];

				const kp = mitum.account.key();
				const keys = new Keys(
					[new PubKey(kp.publickey, 100)],
					100
				);
				accs.push({
					address: keys.address.toString(),
					privatekey: kp.privatekey,
				});
				items.push(new CreateAccountItem(keys, amounts, "mitum"));
				if (accounts.length + accs.length > accN) {
					break;
				}
			}
			const fact = new CreateAccountFact(
				new TimeStamp().UTC(),
				acc.address,
				items
			);
			const op = new Operation(networkID, fact);
			op.sign(acc.privatekey);
			const d = op.toHintedObject();
			// createAccounts.push(d);
			writeFileSync(
				`${baseDir}/create-account/ops/${count}-${d.fact.hash}.json`,
				JSON.stringify(d, null, 4)
			);
			log(
				`${baseDir}/create-account/ops/${count}-${d.fact.hash}.json created`
			);

			if (mode === "api") {
				console.log(apiUrl)
				await axios
					.post(`${apiUrl}`, d)
					.then((_) => success(`phase ${count}:: OK; ${d.fact.hash}`))
					.catch((_) => warning(`phase ${count}:: BAD; ${d.fact.hash}`));
				await wait(1000);
			} else if (mode === "network-client") {
				// 	TODO
			}
			count++;
			if (accounts.length + accs.length > accN) {
				break;
			}
		}
		accounts = accounts.concat(...accs);
		await pause(interval);
		phase--;
		base = parseInt(base / 10);
	}
	senderAccounts.push(...accounts.slice(1));

	// write created accounts info
	writeFileSync(
		`${baseDir}/create-account/account-list.json`,
		JSON.stringify(
			{
				accounts: accounts.slice(1),
			},
			null,
			4
		)
	);
	log(`${baseDir}/create-account/account-list.json created`);
}

async function createContractAccount({
								 mode,
								 networkID,
								 cid,
								 maxItems,
								 genesis,
								 accN,
								 contractN,
								 interval,
								 baseDir,
							 }) {
	// write create contract operations
	// create contract accounts
	//
	assert(senderAccounts.length > 0 )

	ensureDirSync(`${baseDir}/contract-account/`);

	const mitum = new Mitum();

	const createContractAccountsOperations = [];
	for (let i = 0; i < accN; i++) {
		const createContractAccountItems = [];
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
		const item = new CreateContractAccountItem(keys, amounts, "mitum");
		createContractAccountItems.push(item);
		contractAccounts.push({owner: senderAccounts[i], address: keys.address.toString()})

		const fact = new CreateContractAccountFact(
			new TimeStamp().UTC(),
			senderAccounts[i].address,
			createContractAccountItems
		);
		const op = new Operation(networkID, fact);
		op.sign(senderAccounts[i].privatekey);
		await axios
			.post(`${apiUrl}`, op.toHintedObject())
			.then((_) => success(`contract-account:: OK; ${op.toHintedObject().fact.hash}`))
			.catch((_) => warning(`contract-account:: BAD; ${op.toHintedObject().fact.hash}`));
		await wait(1)
		createContractAccountsOperations.push(op.toHintedObject());
	}

	// write created contract accounts info
	writeFileSync(
		`${baseDir}/contract-account/account-list.json`,
		JSON.stringify(
			{
				contracts: contractAccounts,
			},
			null,
			4
		)
	);

	ensureDirSync(`${baseDir}/contract-account/ops/`);
	createContractAccountsOperations.forEach((op, idx) =>
		writeFileSync(
			`${baseDir}/contract-account/ops/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		)
	);
	log(`create-contract-account operation files created in ${baseDir}/contract-account/ops/`);
}

async function createCredentialService({
										 mode,
										 networkID,
										 cid,
										 maxItems,
										 genesis,
										 accN,
										 contractN,
										 interval,
										 baseDir,
									 }) {
	// create credential service
	assert(contractAccounts.length > 0 )

	const createCredentialServiceOperations = [];
	for (const contract of contractAccounts) {
		const fact = new CreateServiceFact(
			new TimeStamp().UTC(),
			contract.owner.address,
			contract.address,
			cid,
		);
		const op = new Operation(networkID, fact);
		op.sign(contract.owner.privatekey);
		await axios
			.post(`${apiUrl}`, op.toHintedObject())
			.then((_) => success(`create-service:: OK; ${op.toHintedObject().fact.hash}`))
			.catch((_) => warning(`create-service:: BAD; ${op.toHintedObject().fact.hash}`));
		await wait(1)
		createCredentialServiceOperations.push(op.toHintedObject());
	}

	// write create service operations
	ensureDirSync(`${baseDir}/credential-service/ops/`);
	createCredentialServiceOperations.forEach((op, idx) =>
		writeFileSync(
			`${baseDir}/credential-service/ops/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		)
	);
	log(`create-credential-service operation files created in ${baseDir}/credential-service/ops/`);
}

async function AddTemplate({
										 mode,
										 networkID,
										 cid,
										 maxItems,
										 genesis,
										 accN,
										 contractN,
										 interval,
							   			 baseDir,
									 }) {
	// add credential template
	assert(contractAccounts.length > 0)

	const addTemplateOperations = [];
	for (const contract of contractAccounts) {
		const fact = new AddTemplateFact(
			new TimeStamp().UTC(),
			contract.owner.address,
			contract.address,
			"tid0",
			"test",
			"2023-11-14",
			"2023-11-15",
			false,
			false,
			"test",
			"test",
			"test",
			contract.owner.address,
			cid,
		);
		credentialService.push({owner:contract.owner, contract:contract.address, template:"tid0"})
		const op = new Operation(networkID, fact);
		op.sign(contract.owner.privatekey);
		await axios
			.post(`${apiUrl}`, op.toHintedObject())
			.then((_) => success(`add-template:: OK; ${op.toHintedObject().fact.hash}`))
			.catch((_) => warning(`add-template:: BAD; ${op.toHintedObject().fact.hash}`));
		await wait(1)
		addTemplateOperations.push(op.toHintedObject());
	}

	// write add template operations
	ensureDirSync(`${baseDir}/credential-template/ops/`);
	addTemplateOperations.forEach((op, idx) =>
		writeFileSync(
			`${baseDir}/credential-template/ops/${idx}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		)
	);
	log(`add-template operation files created in ${baseDir}/credential-template/ops/`);

	// write created credential service info
	writeFileSync(
		`${baseDir}/credential-service/service-list.json`,
		JSON.stringify(
			{
				contracts: credentialService,
			},
			null,
			4
		)
	);
	log(`credential service list created in ${baseDir}/credential-service/service-list.json`);
}

async function pause(duration) {
	for (let i = 0;i <= duration; i++){
		await wait(1000);
		process.stdout.write('\r' + `Wait for ${duration-i} seconds`)
	}
	console.log("")
}

async function run() {
	const args = process.argv.map((val) => val);
	assert(args.length === 13)
	const mode = args[2];
	const endpoint = args[3];
	const networkID = args[4];
	const cid = args[5];
	const maxItems = args[6];
	const genesisAcc = args[7].split(",");
	const accN = parseInt(args[8]);
	const contractN = parseInt(args[9]);
	const interval = parseInt(args[10]);
	const mongo = args[11]
	const db = args[12]

	const timestamp = new Date().getTime();
	const baseDir = `test/${timestamp}/setup`
	apiUrl = `${endpoint}/builder/send/queue`
	console.log(apiUrl)
	const arg = {
		mode,
		networkID,
		cid,
		maxItems,
		genesis: { address: genesisAcc[0], privatekey: genesisAcc[1] },
		accN,
		contractN,
		interval,
		baseDir,
	};

	await createAccount(arg);

	if (contractN > 0) {
		await createContractAccount(arg);
		await pause(10);
		await createCredentialService(arg);
		await pause(10);
		await AddTemplate(arg)
	}

	if (contractN < 1) {
		console.log(`To see result and to make new account`);
		console.log(`bash bash/db-data.sh --host=${mongo} --db=${db}`);
		console.log(`bash bash/create-operations.sh --data=${timestamp} --type=account`);
	} else {
		console.log(`To see result and to make new credential`);
		console.log(`bash bash/db-data.sh --host=${mongo} --db=${db}`);
		console.log(`bash bash/create-operations.sh --data=${timestamp} --type=credential`);
	}

	writeFileSync(
		`${baseDir}/api.json`,
		JSON.stringify({
			url : `${endpoint}`,
			mongo : `${mongo}`,
			db : `${db}`,
		}, null, 4)
	)
}

await run();