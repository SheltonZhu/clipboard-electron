import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import uuid from "uuid";
import Cryptr from "../cryptr";

const cryptr = new Cryptr("my secret key");
const adapter = new FileSync("db.json", {
  serialize: data => cryptr.encrypt(JSON.stringify(data)),
  deserialize: data => JSON.parse(cryptr.decrypt(data))
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

db.getAllData = table => {
  return db.get(table).value();
};

// db.removeData = (table) => {
// db.get(table)
//   .remove({ copyTime: 'low!' })
//   .write();
// TODO
// };
db.searchData = (table, copyContent) => {
  return db
    .get(table)
    .find({ copyContent: copyContent })
    .filter();
};
db.countData = table => {
  db.get(table)
    .size()
    .value();
};

db.deleteOneData = (table, data) => {
  db.get(table)
    .remove(data)
    .write();
};
// id, copyType, copyTime, copyContent, otherInfo
db.initMyDB = async () => {
  const dbStatus = db.getState();
  if (!dbStatus["count"] && !dbStatus["count"] > 0) {
    db.defaults({ historyData: [], user: {}, count: 0 }).write();
    let initDate = {
      id: uuid(),
      copyType: "text",
      copyTime: new Date(),
      copyContent: "Thank for you using!!!!",
      otherInfo: 23
    };
    db.addOneData("historyData", initDate);
  }
  // Set a user using Lodash shorthand syntax
  db.set("user.name", "clipboard").write();
};

export default db;
