import { ensureDirSync } from "fs-extra";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, appendFileSync } from "fs";
import wait from "waait";

import { TransfersNoLog } from "./transfer.js";
import { TPSNoLog } from "./tps.js";
import { NewConfig } from "./config/new-config.js";

const argvs = process.argv.map((val) => val);
const v = argvs[2];
const network = argvs[3].split(",");
const id = argvs[4];
const cid = argvs[5];
const address = argvs[6];
const accounts = JSON.parse(readFileSync(argvs[7]))["accounts"];
const delay = argvs[8].split(",").map((d) => parseInt(d));
const duration = parseInt(argvs[9]);

const run = async () => {
	let fin = new Date();
	fin.setDate(fin.getDate() + duration);

	const token = new Date().getTime();

	ensureDirSync(`logging-inf/${token}`);
	writeFileSync(
		`logging-inf/${token}/results.csv`,
		"token,thread,blocks,processed,elapsed,tps,error\n"
	);

	let count = 0;
	while (new Date().getTime() < fin) {
		const n = Math.floor(Math.random() * 10001 + 10000);

		NewConfig([token + "", count + ""]);
		execSync(`bash logging-inf/${token}/${count}/node-config.sh`);

		await wait(delay[0]);

		const _ = TransfersNoLog(v, [token + "", count + ""], {
			n,
			id,
			address,
			cid,
			accounts,
		});

		const len = [0, 0, 0];
		len[0] = Math.floor(n / 3);
		len[1] = len[0];
		len[2] = n - len[0] - len[1];

		execSync(
			`node scripts/infinite/jmx.js ${token},${count} ${len[0]},${len[1]},${len[2]} ${network[0]},${network[1]},${network[2]}`
		);

		execSync(`bash logging-inf/${token}/${count}/run-jmx.sh`);
		await wait(delay[1]);

		await TPSNoLog([token + "", count + ""], network[0])
			.then((res) => {
				let result = `${count},${n},${res.blocks.map((b) => b + "&")},${
					res.processed
				},${res.elapsed},${res.tps},${res.error}\n\n`;

				appendFileSync(`logging-inf/${token}/results.csv`, result);
				writeFileSync(
					`logging-inf/${token}/${count}/tps.txt`,
					JSON.stringify(res, null, 4)
				);
			})
			.catch((e) => {

				let result = `${count},${n},,,,,${e.error}\n`;

				appendFileSync(`logging-inf/${token}/results.csv`, result);
				writeFileSync(
					`logging-inf/${token}/${count}/tps.txt`,
					Object.prototype.hasOwnProperty.call(e, "error")
						? JSON.stringify(e, null, 4)
						: `${e.name}: ${e.message}`
				);
			});
	
		count++;
	}
};

run();
