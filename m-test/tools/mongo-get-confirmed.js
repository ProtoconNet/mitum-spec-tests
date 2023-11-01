const dbName = process.env["MITUM_DATABASE"];
const collectionName = 'digest_op';

const dbConnection = db.getSiblingDB(dbName);
const result = dbConnection.getCollection(collectionName).find({}, {'d.confirmed_at': 1, _id: 0}).sort({$natural: -1}).limit(1).toArray();

if (result.length > 0 && result[0].d && result[0].d.confirmed_at) {
    print(result[0].d.confirmed_at.toISOString());
}
