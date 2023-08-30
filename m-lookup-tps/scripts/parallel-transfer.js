import { log, config, info } from "../log.js";
import { ParallelTransferM2 } from "../index.js";

const argvs = process.argv.map((val) => val);
const token = argvs[2];
const exec = argvs[3];
const id = argvs[4];
const url = argvs[5];

const run = () => {
    ParallelTransferM2(token, exec, id, url);
    log("parallel done");
};

info("================================== parallel-transfer.js");
log(`start; run parallel-transfer.js`);
config(`token; ${token}`);
config(`exec; ${exec}`);
config(`id; ${id}`);
config(`network client; ${url}`);
run();
