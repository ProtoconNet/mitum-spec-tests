import { CreateAccountsAv } from "../index.js";
import { log, info, config } from "../log.js";

const argvs = process.argv.map((val) => val);
const v = argvs[2];
const token = argvs[3];
const n = parseInt(argvs[4]);
const network = argvs[5];
const id = argvs[6];

const gen = argvs[7].split(",");
const genesis = {
	address: gen[0],
	private: gen[1],
};
const cid = argvs[8];
const interval = parseInt(argvs[9]);
const maxItems = parseInt(argvs[10]);

const run = async () => {
	log(`run CreateAccountsAv`);
	const _ = await CreateAccountsAv(v, token, {
		n,
		network,
		id,
		interval,
		genesis,
		cid,
		maxItems,
	});
};

info("================================== create-accounts.js");
log(`start; run create-accounts.js`);
config(`v; ${v}`);
config(`token; ${token}`);
config(`number of accounts; ${n}`);
config(`network; ${network}`);
config(`network id; ${id}`);
config(`genesis address; ${genesis.address}`);
config(`genesis private key; ${genesis.private}`);
config(`currency id; ${cid}`);
config(`request interval; ${interval}`);
config(`max items; ${maxItems}`);
run();
