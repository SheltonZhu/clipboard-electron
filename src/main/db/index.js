import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import uuid from "uuid";
import path from "path";
import Cryptor from "@/main/cryptor";
import config from "@/main/config";

const isDevelopment = config.get("isDevelopment");

let dbPath = "db.json";
if (!isDevelopment) {
  let dataPath = config.get("dataPath");
  dbPath = path.join(dataPath, dbPath);
}

const cryptor = new Cryptor.NoCryptor(config.get("dataEncodeKey"));
const adapter = new FileSync(dbPath, {
  serialize: data => cryptor.encrypt(JSON.stringify(data)),
  deserialize: data => JSON.parse(cryptor.decrypt(data))
});
const db = low(adapter);
db.addOneData = (table, data) => {
  // Add a post
  db.get(table)
    .push(data)
    .write();
  // Increment count
  db.update("count", n => n + 1).write();
};

db.getAllData = (table, query, copyType) => {
  let found;
  if (copyType) {
    found = db
      .get(table)
      .filter({ copyType: copyType })
      .sortBy("copyTime")
      .value()
      .reverse();
  } else {
    found = db
      .get(table)
      .sortBy("copyTime")
      .value()
      .reverse();
  }
  if (query.trim()) {
    let retData = [];
    if (copyType !== "Image") {
      for (let data of found) {
        if (data.copyType !== "Image" && data.copyContent.indexOf(query) >= 0) {
          retData.push(data);
        }
      }
      return retData;
    }
  }
  return found;
};

//待测试
db.removeAllData = table => {
  delete db[table];
  db.save();
  return db.set(table, []).write();
};

//待测试
db.countData = table => {
  db.get(table)
    .size()
    .value();
};

db.deleteOneData = (table, data) => {
  return (
    db
      .get(table)
      .remove(data)
      .write().length > 0
  );
};
// id, copyType, copyTime, copyContent, otherInfo
db.initMyDB = () => {
  const dbStatus = db.getState();
  if (!dbStatus["count"] && !dbStatus["count"] > 0) {
    db.defaults({ historyData: [], user: {}, count: 0 }).write();
    let initDate = {
      id: uuid(),
      copyType: "Text",
      copyTime: new Date(),
      copyContent: config.get("initCopyContent"),
      otherInfo: config.get("initCopyContent").length
    };
    db.addOneData("historyData", initDate);
  }
  db.set("user.name", "clipboard").write();
};

export default db;
