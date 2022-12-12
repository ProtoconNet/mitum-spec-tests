import wait from "waait";
import { TPS, TPSdb } from "../index.js";
import { log, config, info } from "../log.js";

const argvs = process.argv.map((val) => val);
const token = argvs[2];
const network = argvs[3];
const delay = argvs[4];
const db = argvs.length > 5 ? argvs[5].split(",") : [];

const run = async () => {
	log(`wait ${delay}ms`);
	await wait(delay);

	if (db.length < 2) {
		log("run TPS");
		TPS(token, network).then((res) => console.log(res));
	} else {
		log("run TPSdb");
		TPSdb(token, { url: db[0], db: db[1]}).then((res) => console.log(res));
	}
};

info("================================== get-tps.js");
config(`start; run get-tps.js`);
config(`token; ${token}`);
config(`network; ${network}`);
config(`lookup delay; ${delay}`);
if (db) {
	config(`db: ${db[0]}, ${db[1]}`);
}
run();