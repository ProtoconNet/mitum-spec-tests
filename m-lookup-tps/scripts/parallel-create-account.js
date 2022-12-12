import { ParallelCreateAccounts } from "../index.js";
import { log, config, info } from "../log.js";

const argvs = process.argv.map((val) => val);
const v = argvs[2];
const token = argvs[3];
const n = parseInt(argvs[4]);
const url = argvs[5];
const id = argvs[6];

const gen = argvs[7].split(",");
const genesis = {
	address: gen[0],
	private: gen[1],
};
const cid = argvs[8];
const interval = parseInt(argvs[9]);
const exe = argvs[10];
const db = argvs.length > 11 ? argvs[11].split(",") : [];

const options = {
	n,
	url,
	id,
	cid,
	genesis,
	interval,
	exe,
	mongo: { url: db[0], db: db[1] },
};

const run = () => {
	ParallelCreateAccounts(v, token, options);
};

info("================================== parallel-create-account.js");
log(`start; run parallel-create-account.js`);
config(`v; ${v}`);
config(`token; ${token}`);
config(`number of accounts; ${n}`);
config(`network client; ${url}`);
config(`network id; ${id}`);
config(`genesis address; ${genesis.address}`);
config(`genesis private key; ${genesis.private}`);
config(`currency id; ${cid}`);
config(`request interval; ${interval}`);
config(`exec; ${exe}`);
config(`db; ${db[0]}, ${db[1]}`);
run();
