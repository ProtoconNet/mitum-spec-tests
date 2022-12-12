import replace from "replace";
import { log, config, info } from "../log.js";

import { execSync } from "child_process";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argvs = process.argv.map((val) => val);
const token = argvs[2];
const len = argvs[3];
const network0 = argvs[4];

const run = () => {
	const protocol0 = network0.split("://")[0];
	const address0 = network0.split("://")[1];
	const port0 = network0.split("://")[1].split(":")[1] || "";

	execSync(`cp jmeter/Transfers.jmx logging/${token}/`);
	log(`jmx copied`);

	const fp = __dirname.replace(/\/scripts/, "");
	replace({
		regex: "NUM_THREADS0",
		replacement: "" + len,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "NUM_THREADS1",
		replacement: "" + len,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "FILE_PATH",
		replacement: `${fp}/logging/${token}`,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "ADDRESS0",
		replacement: address0.split(":")[0],
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PORT0",
		replacement: port0,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PROTOCOL0",
		replacement: protocol0,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "ADDRESS1",
		replacement: address0.split(":")[0],
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PORT1",
		replacement: port0,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PROTOCOL1",
		replacement: protocol0,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	log(`jmx options replaced`);
};

info("================================== single-jmx.js");
log(`start; run single-jmx.js`);
config(`token; ${token}`);
config(`thread per thread group; ${len}`);
config(`network; ${network0}`);
run();
