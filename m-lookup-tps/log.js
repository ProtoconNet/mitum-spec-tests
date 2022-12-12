import clc from "cli-color";

export const info = (msg) => {
	console.log(clc.whiteBright(msg));
};

export const config = (msg) => {
	console.log(clc.white("---- " + msg));
};

export const log = (msg) => {
	console.log(clc.white(new Date().toISOString() + ": ") + clc.yellow(msg));
};

export const success = (msg) => {
	console.log(
		clc.white(new Date().toISOString() + ": ") + clc.greenBright(msg)
	);
};

export const warning = (msg) => {
	console.log(clc.white(new Date().toISOString() + ": ") + clc.red(msg));
};
