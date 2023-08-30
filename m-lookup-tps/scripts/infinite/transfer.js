import {
	useId,
	Amount,
	Currency,
	Operation,
	TimeStamp,
} from "mitum-sdk";
import fsExtra from "fs-extra";
import fs from "fs";

export const TransfersNoLog = (v, token, options) => {
	const { n, id, address, cid, accounts } = options;

	useId(id);

	const transfers = [];
	const amounts = [new Amount(cid, "1")];
	for (let i = 0; i < n; i++) {
		const item = new Currency.TransfersItem(address, amounts);
		const fact = new Currency.TransfersFact(
			new TimeStamp().UTC(),
			accounts[i].addr,
			[item]
		);
		const op = new Operation(fact, "", []);
		if (v === "v2") {
			op.forceExtendedMessage = true;
		}
		op.sign(accounts[i].priv);

		transfers.push(op.toHintedObject());
	}

	fsExtra.ensureDirSync(`logging-inf/${token[0]}/${token[1]}/operations/transfers/`);

	transfers.forEach((op, i) => {
		fs.writeFileSync(
			`logging-inf/${token[0]}/${token[1]}/operations/transfers/${i}-${op.fact.hash}.json`,
			JSON.stringify(op, null, 4)
		);
	});

	const tfs = transfers.reduce(
		(curr, next) => curr + next.fact.hash + "\n",
		""
	);
	const tfsfiles = transfers
		.map((op, idx) => `${idx}-${op.fact.hash}`)
		.join("\n");

	fs.writeFileSync(
		`logging-inf/${token[0]}/${token[1]}/operations/transfers/operations.csv`,
		tfs
	);

	fs.writeFileSync(
		`logging-inf/${token[0]}/${token[1]}/operations/transfers/files.csv`,
		tfsfiles
	);

	return transfers;
};
