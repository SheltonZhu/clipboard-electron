import Datastore from "nedb-promises";
import Ajv from "ajv";
import path from "path";
import config from "@/main/config";
import log from "@/main/log";
import clipboardItem from "../schemas/clipboardItem";
import initDataSet from "../initData";

const isDevelopment = config.get("isDevelopment");

class ClipboardItemStore {
  constructor() {
    this.visibleField = {
      _id: 1,
      copyType: 1,
      copyTime: 1,
      copyContent: 1,
      otherInfo: 1
    };

    const dbName = "clipboard.db";

    let dbPath;
    if (isDevelopment) {
      dbPath = path.join(process.cwd(), dbName);
    } else {
      let dataPath = config.get("dataPath");
      dbPath = path.join(dataPath, dbName);
      log.info(`[main]: dataPath: ${dataPath}`);
    }
    log.info(`[main]: dbPath: ${dbPath}`);

    const ajv = new Ajv({
      allErrors: true,
      useDefaults: true
    });

    this.schemaValidator = ajv.compile(clipboardItem);

    this.db = Datastore.create({
      filename: dbPath,
      timestampData: true
    });
  }

  validate(data) {
    return this.schemaValidator(data);
  }

  create(data) {
    const isValid = this.validate(data);
    if (isValid) {
      return this.db.insert(data);
    } else {
      throw `[main]: data valid fail: ${JSON.stringify(data)}`;
    }
  }

  initData() {
    return (async () => {
      if (!(await this.hasData())) {
        for (let data of initDataSet) {
          await this.create(data);
        }
      }
    })();
  }

  read(_id) {
    return this.db.findOne({ _id }).exec();
  }

  readAll(table, queryKey, copyType) {
    let queryObj = {};
    queryObj.table = table;
    if (copyType) {
      queryObj.copyType = copyType;
    }
    if (queryKey && queryKey.trim()) {
      if (!copyType && copyType !== "Image") {
        queryObj.copyType = { $ne: "Image" };
        queryObj.copyContent = { $regex: new RegExp(`.*${queryKey}.*`) };
      }
    }
    log.info("[main]: queryString: ", queryObj);
    return this.db.find(queryObj, this.visibleField).sort({ copyTime: -1 });
  }

  async hasData() {
    return (await this.count({ table: "historyData" })) > 0;
  }

  removeAll(table) {
    return this.db.remove({ table: table }, { multi: true });
  }

  removeOne(table, _id) {
    return this.db.remove({ table: table, _id: _id });
  }

  count(query) {
    return this.db.count(query);
  }

  // readActive() {
  //   return this.db.find({ isDone: false }).exec();
  // }

  // archive({ _id }) {
  //   return this.db.update({ _id }, { $set: { isDone: true } });
  // }
}

export default new ClipboardItemStore();
