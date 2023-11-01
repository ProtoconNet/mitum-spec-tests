import { execSync } from "child_process";
import { log } from "../log.js";
import wait from "waait";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { promises as file } from 'fs';

const { ensureDirSync, writeFileSync, readFileSync } = fs;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
	const argvs = process.argv.map((val) => val);
	const operationDIR = argvs[2];
	const mode = argvs[3];
	const apiEndpoints = argvs[4].split(",").filter((net) => net !== "");
	const networkID = argvs[5];
	const rampUpPeriod = parseInt(argvs[6]);
	const n = await countFilesInDirectory(`${operationDIR}/ops`)

	const arg = {
		operationDIR,
		mode,
		apiEndpoints,
		networkID,
		rampUpPeriod,
		n,
	};
	await test(arg);
}

await run();

export async function countFilesInDirectory(directoryPath) {
	const items = await file.readdir(directoryPath, { withFileTypes: true });
	const fileCount = items.filter(item => item.isFile()).length;
	return fileCount;
}

export async function test({ operationDIR, mode,  apiEndpoints, networkID, rampUpPeriod, n }) {
	ensureDirSync(`${operationDIR}/test-result/`);
	log(`dir ${operationDIR}/test-result/ created`);

	if (mode === "api") {
		const parsedNet = apiEndpoints.map((net) => {
			const protocol = net.split("://")[0];
			const address = net.split("://")[1].split(":")[0];
			const port = net.split("://")[1].split(":")[1] || "";
			return {
				protocol,
				address,
				port,
			};
		});

		const threadPerNet = n / apiEndpoints.length;
		const threads = [];
		const netLen = apiEndpoints.length;
		for (let i = 0; i < netLen; i++) {
			threads.push(threadPerNet);
		}
		threads[threads.length - 1] += n - threads.reduce((x, y) => x + y, 0);

		const fp = __dirname.replace(/\/tools/, "");
		const css = threads.map((thread, idx) => {
			return ` 
    <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="transfer${idx}" enabled="true">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
        	<boolProp name="LoopController.continue_forever">false</boolProp>
        	<stringProp name="LoopController.loops">1</stringProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">${thread}</stringProp>
        <stringProp name="ThreadGroup.ramp_time">${rampUpPeriod}</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration"></stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
    </ThreadGroup>
    <hashTree>
        <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
            <collectionProp name="HeaderManager.headers">
				<elementProp name="" elementType="Header">
					<stringProp name="Header.name">Content-Type</stringProp>
					<stringProp name="Header.value">application/json</stringProp>
				</elementProp>
				<elementProp name="" elementType="Header">
					<stringProp name="Header.name">Accept</stringProp>
					<stringProp name="Header.value">application/json</stringProp>
				</elementProp>
				<elementProp name="" elementType="Header">
					<stringProp name="Header.name">Content-Encoding</stringProp>
					<stringProp name="Header.value">utf-8</stringProp>
				</elementProp>
        	</collectionProp>
        </HeaderManager>
    	<hashTree/>
   		<CookieManager guiclass="CookiePanel" testclass="CookieManager" testname="HTTP Cookie Manager" enabled="true">
        	<collectionProp name="CookieManager.cookies"/>
        	<boolProp name="CookieManager.clearEachIteration">true</boolProp>
        	<boolProp name="CookieManager.controlledByThreadGroup">false</boolProp>
    	</CookieManager>
		<hashTree/>
        <CacheManager guiclass="CacheManagerGui" testclass="CacheManager" testname="HTTP Cache Manager" enabled="true">
            <boolProp name="clearEachIteration">true</boolProp>
            <boolProp name="useExpires">true</boolProp>
            <boolProp name="CacheManager.controlledByThread">false</boolProp>
            <intProp name="maxSize">100000</intProp>
        </CacheManager>
        <hashTree/>
        <CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV Data Set Config" enabled="true">
            <stringProp name="delimiter"></stringProp>
            <stringProp name="fileEncoding">UTF-8</stringProp>
            <stringProp name="filename">${fp}/${operationDIR}/files.csv</stringProp>
            <boolProp name="ignoreFirstLine">false</boolProp>
            <boolProp name="quotedData">false</boolProp>
            <boolProp name="recycle">true</boolProp>
            <stringProp name="shareMode">shareMode.all</stringProp>
            <boolProp name="stopThread">false</boolProp>
            <stringProp name="variableNames">TF</stringProp>
        </CSVDataSet>
        <hashTree/>
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="\${TF}" enabled="true">
            <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
            <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
            	<collectionProp name="Arguments.arguments">
					<elementProp name="" elementType="HTTPArgument">
						<boolProp name="HTTPArgument.always_encode">false</boolProp>
						<stringProp name="Argument.value">\${__FileToString(${fp}/${operationDIR}\/ops\/\${__eval(\${TF})}.json,,)}</stringProp>
						<stringProp name="Argument.metadata">=</stringProp>
					</elementProp>
                </collectionProp>
            </elementProp>
            <stringProp name="HTTPSampler.domain">${parsedNet[idx].address}</stringProp>
            <stringProp name="HTTPSampler.port">${parsedNet[idx].port}</stringProp>
            <stringProp name="HTTPSampler.protocol">${parsedNet[idx].protocol}</stringProp>
            <stringProp name="HTTPSampler.contentEncoding">utf-8</stringProp>
            <stringProp name="HTTPSampler.path">/builder/send/queue</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
            <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
            <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
            <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
            <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
            <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
            <stringProp name="HTTPSampler.connect_timeout"></stringProp>
            <stringProp name="HTTPSampler.response_timeout"></stringProp>
        </HTTPSamplerProxy>
        <hashTree/>
    </hashTree>`.trim();
		});

		const jmx = `
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.5">
	<hashTree>
		<TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan" enabled="true">
			<stringProp name="TestPlan.comments"></stringProp>
			<boolProp name="TestPlan.functional_mode">false</boolProp>
			<boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>
			<boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
			<elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
				<collectionProp name="Arguments.arguments"/>
			</elementProp>
			<stringProp name="TestPlan.user_define_classpath"></stringProp>
		</TestPlan>
		<hashTree>
        ${css.join("\n")}
		</hashTree>
	</hashTree>
</jmeterTestPlan>`.trim();

		writeFileSync(`${operationDIR}/test-result/test.jmx`, jmx);
		log(`${operationDIR}/test-result/test.jmx created`);
		writeFileSync(
			`${operationDIR}/test-result/bash.sh`,
			`JVM_ARGS="-Xms50g -Xmx50g" jmeter -n -t ${operationDIR}/test-result/test.jmx -l ${operationDIR}/test-result/result.jtl -j ${operationDIR}/test-result/jmeter.log`
		);
		log(`${operationDIR}/test-result/bash.sh created`);
		execSync(`bash ${operationDIR}/test-result/bash.sh`);
	} else if (mode === "network-client") {
		// const files = readFileSync(`${newPath}/files.csv`)
		// 	.split("\n")
		// 	.filter((ln) => ln !== "");
		// log(`get transfer files...`);
		//
		// let pt = 0;
		// const interval = parseInt(rampUpPeriod / n);
		// writeFileSync(
		// 	`${newPath}/operations/test-result/result.jtl`,
		// 	new Date().getTime()
		// );
		// log(`${newPath}/operations/test-result/result.jtl created`);
		//
		// files.forEach((f, idx) => {
		// 	execSync(
		// 		`./m network client send-operation '${networkID}' ${apiEndpoints[pt]}#tls_insecure --body=${newPath}/operations/${f}.json --log.level=fatal > ${newPath}/operations/test-result/network-client-log/${f}.json 2>&1`
		// 	);
		// 	success(`${idx}:: ${d.fact.hash} sent by network-client`);
		// });
		// pt = (pt + 1) % apiEndpoints.length;
		// await wait(interval);
	}
}
