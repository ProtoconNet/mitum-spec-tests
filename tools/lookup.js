import fs from "fs-extra";
import axios from "axios";
import { MongoClient } from "mongodb";
import { log, warning, success, config } from "../log.js";

const { readFileSync } = fs;

async function run() {
	const argvs = process.argv.map((val) => val);
	const token = argvs[2];
	const network = argvs[3];
	const mongo =
		argvs.length > 4 ? argvs[4].split(",").filter((m) => m !== "") : [];
	const arg = {
		token,
		network,
		mongo:
			mongo.length >= 2
				? {
						url: mongo[0],
						db: mongo[1],
				  }
				: null,
	};
	await lookup(arg);
}

await run();

export async function lookup({ token, network, mongo }) {
	const result = readFileSync(
		`logging/${token}/test-result/result.jtl`
	).toString("utf8");
	log(`get result from logging/${token}/test-result/result.jtl`);

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

	const res = mongo ? await fdb(token) : await lu(token, network);
	try {
		const latest = res
			.filter((fact) => fact.inState)
			.map((fact) => fact.confirmed)
			.sort();
		const num = latest.length;
		if (num < 1) {
			warning(
				JSON.stringify({
					error: "none; maybe no operation is true",
					tps: 0,
				})
			);
		}
		const elapsed = (latest[latest.length - 1] - rs) / 1000.0;
		config(`elapsed; ${latest[latest.length - 1] - rs}`);
		success(
			JSON.stringify({
				blocks: [...new Set(res.map((r) => r.height))].filter(
					(el) => el >= 0
				),
				processed: (100 * num) / res.length + "%",
				tps: num / elapsed,
			})
		);
	} catch (e) {
		warning(
			JSON.stringify({
				error: e.name + ": " + e.message,
				tps: 0,
			})
		);
	}
}

async function lu(token, network) {
	const facts = readFileSync(`logging/${token}/facts.csv`, {
		encoding: "utf8",
	})
		.split("\n")
		.filter((h) => h !== "");
	log(`get facts...`);

	const luk = async (hash, idx) => {
		return axios
			.get(`${network}/block/operation/${hash}`)
			.then((res) => {
				success(`${idx}:: OK; ${hash}`);
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
				warning(`${idx}:: BAD; ${hash}`);
				return {
					hash,
					height: -1,
					inState: false,
					confirmed: 0,
				};
			});
	};

	const result = [];
	for (let i = 0; i < facts.length; i++) {
		const res = await luk(facts[i], i + 1);
		result.push(res);
	}
	return result;
}

async function fdb(token, mongo) {
	const facts = readFileSync(
		`logging/${token}/operations/transfers/facts.csv`,
		{
			encoding: "utf8",
		}
	)
		.split("\n")
		.filter((h) => h !== "");
	log(`get facts...`);

	const client = new MongoClient(mongo.url);
	await client.connect();
	log(`db connected`);
	const db = client.db(mongo.db);
	const collection = db.collection("digest_op");

	const luk = async (hash) => {
		return await collection
			.find({ fact: hash })
			.toArray()
			.then((res, idx) => {
				res = res[0];
				success(`${idx}:: found; ${hash}`);
				const r = {
					hash,
					height: res.height,
					confirmed: new Date(res.d.confirmed_at).getTime(),
					inState: res.d.in_state,
				};
				return r;
			})
			.catch((_) => {
				warning(`${idx}:: not found; ${hash}`);
				return {
					hash,
					height: -1,
					inState: false,
					confirmed: 0,
				};
			});
	};

	const result = [];
	for (let i = 0; i < facts.length; i++) {
		const res = await luk(facts[i], i + 1);
		result.push(res);
		if (i >= facts.length - 1) {
			client.close();
		}
	}
	return result;
}
