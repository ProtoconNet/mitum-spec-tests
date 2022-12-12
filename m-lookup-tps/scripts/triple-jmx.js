import replace from "replace";
import { log, config, info } from "../log.js";

import { execSync } from "child_process";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argvs = process.argv.map((val) => val);
const token = argvs[2];
const len = argvs[3].split(",");
const network0 = argvs[4];
const network1 = argvs[5];
const network2 = argvs[6];

const run = () => {
	const protocol0 = network0.split("://")[0];
	const address0 = network0.split("://")[1];
	const port0 = network0.split("://")[1].split(":")[1] || "";

	const protocol1 = network1.split("://")[0];
	const address1 = network1.split("://")[1];
	const port1 = network1.split("://")[1].split(":")[1] || "";

	const protocol2 = network2.split("://")[0];
	const address2 = network2.split("://")[1];
	const port2 = network2.split("://")[1].split(":")[1] || "";

	execSync(`cp jmeter/Transfers.jmx logging/${token}/`);
	log(`jmx copied`);

	const fp = __dirname.replace(/\/scripts/, "");
	replace({
		regex: "TRIPLE_ENABLE",
		replacement: "true",
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "NUM_THREADS0",
		replacement: "" + len[0],
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "NUM_THREADS1",
		replacement: "" + len[1],
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "NUM_THREADS2",
		replacement: "" + len[2],
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
		replacement: address1.split(":")[0],
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PORT1",
		replacement: port1,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PROTOCOL1",
		replacement: protocol1,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "ADDRESS2",
		replacement: address2.split(":")[0],
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PORT2",
		replacement: port2,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PROTOCOL2",
		replacement: protocol2,
		paths: [`logging/${token}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	log(`jmx options replaced`);
};

info("================================== triple-jmx.js");
log(`start; run triple-jmx.js`);
config(`token; ${token}`);
config(`thread per thread group; ${len}`);
config(`network0; ${network0}`);
config(`network1; ${network1}`);
config(`network2; ${network2}`);
run();
