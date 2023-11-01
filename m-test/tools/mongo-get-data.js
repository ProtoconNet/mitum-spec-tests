const dbName = process.env["MITUM_DATABASE"];

print(`database : '${dbName}'`)

const collectionAccountName = 'digest_ac';
const dbConnection = db.getSiblingDB(dbName);
const recordCount = dbConnection.getCollection(collectionAccountName).countDocuments();
print(`Number of records in '${collectionAccountName}': ${recordCount}`);

const collectionIssuerName = 'digest_did_issuer';
const dbConnection1 = db.getSiblingDB(dbName);
const recordCount1 = dbConnection1.getCollection(collectionIssuerName).countDocuments();
print(`Number of records in '${collectionIssuerName}': ${recordCount1}`);

const collectionTemplateName = 'digest_did_template';
const dbConnection2 = db.getSiblingDB(dbName);
const recordCount2 = dbConnection2.getCollection(collectionTemplateName).countDocuments();
print(`Number of records in '${collectionTemplateName}': ${recordCount2}`);

const collectionCredentialName = 'digest_did_credential';
const dbConnection3 = db.getSiblingDB(dbName);
const recordCount3 = dbConnection3.getCollection(collectionCredentialName).countDocuments();

print(`Number of records in '${collectionCredentialName}': ${recordCount3}`);