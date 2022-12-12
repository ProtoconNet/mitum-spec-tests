import fs from "fs";
import axios from "axios";

const LookupNoLog = async (token, network) => {
	const facts = fs
		.readFileSync(
			`logging-inf/${token[0]}/${token[1]}/operations/transfers/operations.csv`,
			{
				encoding: "utf8",
			}
		)
		.split("\n")
		.filter((h) => h !== "");

	const lookup = async (hash) => {
		try {
			const res = await axios.get(`${network}/block/operation/${hash}`);
			return {
				hash,
				height: res.data._embedded.height,
				confirmed: new Date(res.data._embedded.confirmed_at).getTime(),
				inState: res.data._embedded.in_state,
			};
		} catch (_) {
			return {
				hash,
				height: -1,
				inState: false,
				confirmed: 0,
			};
		}
	};

	const result = [];
	for (let i = 0; i < facts.length; i++) {
		const res = await lookup(facts[i], i + 1);
		result.push(res);
	}

	return result;
};

export const TPSNoLog = async (token, network) => {
	const result = fs
		.readFileSync(`logging-inf/${token[0]}/${token[1]}/result.jtl`)
		.toString("utf8");

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
	const processed = await LookupNoLog(token, network)
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
			return {
				elapsed,
				blocks: [...new Set(res.map((r) => r.height))].filter(
					(el) => el >= 0
				),
				processed: (100 * num) / res.length + "%",
				tps: num / elapsed,
				error: "",
			};
		})
		.catch((e) => ({
			elapsed: "-1",
			blocks: [],
			processed: "0%",
			error: e.name + ": " + e.message,
			tps: 0,
		}));

	return processed;
};
