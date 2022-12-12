import replace from "replace";

import { execSync } from "child_process";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argvs = process.argv.map((val) => val);
const token = argvs[2].split(",");
const len = argvs[3].split(",");
const networks = argvs[4].split(",");
const network0 = networks[0];
const network1 = networks[1];
const network2 = networks[2];

const run = () => {
	const protocol0 = network0.split("://")[0];
	const address0 = network0.split("://")[1];
	const port0 = network0.split("://")[1].split(":")[1] || "";

	const protocol1 = network1 ? network1.split("://")[0] : protocol0;
	const address1 = network1 ? network1.split("://")[1] : address0;
	const port1 = network1
		? network1.split("://")[1].split(":")[1] || ""
		: port0;

	const protocol2 = network2 ? network2.split("://")[0] : protocol0;
	const address2 = network2 ? network2.split("://")[1] : address0;
	const port2 = network2
		? network2.split("://")[1].split(":")[1] || ""
		: port0;

	execSync(`cp jmeter/Transfers.jmx logging-inf/${token[0]}/${token[1]}/`);
	execSync(`cp bash/infinite/run-jmx.sh logging-inf/${token[0]}/${token[1]}/`);

	replace({
		regex: "TOKEN1",
		replacement: token[0],
		paths: [`logging-inf/${token[0]}/${token[1]}/run-jmx.sh`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "TOKEN2",
		replacement: token[1],
		paths: [`logging-inf/${token[0]}/${token[1]}/run-jmx.sh`],
		recursive: true,
		silent: true,
	});

	replace({
		regex: "TRIPLE_ENABLE",
		replacement: "true",
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "NUM_THREADS0",
		replacement: "" + len[0],
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "NUM_THREADS1",
		replacement: "" + len[1],
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "NUM_THREADS2",
		replacement: "" + len[2],
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});

	const fp = __dirname.replace(/\/scripts\/infinite/, "");
	replace({
		regex: "FILE_PATH",
		replacement: `${fp}/logging-inf/${token[0]}/${token[1]}`,
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "ADDRESS0",
		replacement: address0.split(":")[0],
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PORT0",
		replacement: port0,
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PROTOCOL0",
		replacement: protocol0,
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "ADDRESS1",
		replacement: address1.split(":")[0],
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PORT1",
		replacement: port1,
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PROTOCOL1",
		replacement: protocol1,
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "ADDRESS2",
		replacement: address2.split(":")[0],
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PORT2",
		replacement: port2,
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "PROTOCOL2",
		replacement: protocol2,
		paths: [`logging-inf/${token[0]}/${token[1]}/Transfers.jmx`],
		recursive: true,
		silent: true,
	});
};

run();
