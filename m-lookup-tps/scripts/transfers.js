import { Transfers } from "../index.js";
import { readFileSync } from "fs";
import { info, log, config } from "../log.js";

const argvs = process.argv.map((val) => val);
const v = argvs[2];
const token = argvs[3];
const n = parseInt(argvs[4]);
const id = argvs[5];
const address = argvs[6];
const cid = argvs[7];
const fp = argvs[8];

const run = () => {
	const accounts = JSON.parse(readFileSync(fp))["accounts"];
	log(`get accounts from ${fp}`);

	log(`run Transfer`);
	const _ = Transfers(v, token, { n, id, address, cid, accounts });
};

info("================================== transfers.js");
log(`start; run transfers.js`);
config(`v; ${v}`);
config(`token; ${token}`);
config(`number of operations; ${n}`);
config(`network id; ${id}`);
config(`genesis address; ${address}`);
config(`currency id; ${cid}`);
config(`accounts; ${fp}`);
run();
