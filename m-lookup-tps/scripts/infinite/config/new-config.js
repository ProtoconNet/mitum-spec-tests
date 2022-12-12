import replace from "replace";
import { execSync } from "child_process";
import { ensureDirSync } from "fs-extra";

export const NewConfig = (token) => {
	const intervalInitBallot = Math.floor(Math.random() * 1001 + 500);
	const intervalProposal = Math.floor(Math.random() * 321 + 180);
	const waitAcceptBallot = Math.floor(Math.random() * 321 + 180);
	const intervalAcceptBallot = Math.floor(Math.random() * 321 + 180);

	ensureDirSync(`logging-inf/${token[0]}/${token[1]}`);
	execSync(
		`cp scripts/infinite/config/main.yml logging-inf/${token[0]}/${token[1]}/mitum.yml`
	);
	execSync(
		`cp bash/infinite/node-config.sh logging-inf/${token[0]}/${token[1]}/node-config.sh`
	);

	replace({
		regex: "TOKEN1",
		replacement: token[0],
		paths: [`logging-inf/${token[0]}/${token[1]}/node-config.sh`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "TOKEN2",
		replacement: token[1],
		paths: [`logging-inf/${token[0]}/${token[1]}/node-config.sh`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "INTERVAL_INIT_BALLOT",
		replacement: intervalInitBallot,
		paths: [`logging-inf/${token[0]}/${token[1]}/mitum.yml`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "INTERVAL_PROPOSAL",
		replacement: intervalProposal,
		paths: [`logging-inf/${token[0]}/${token[1]}/mitum.yml`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "WAIT_ACCEPT_BALLOT",
		replacement: waitAcceptBallot,
		paths: [`logging-inf/${token[0]}/${token[1]}/mitum.yml`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "INTERVAL_ACCEPT_BALLOT",
		replacement: intervalAcceptBallot,
		paths: [`logging-inf/${token[0]}/${token[1]}/mitum.yml`],
		recursive: true,
		silent: true,
	});
};
