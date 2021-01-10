import Datastore from "nedb-promises";
import Ajv from "ajv";
import path from "path";
import config from "@/main/config";
import log from "@/main/log";

const isDevelopment = config.get("isDevelopment");

class BaseStore {
  constructor(dbName, scheme) {
    let dbPath;
    if (isDevelopment) {
      dbPath = path.join(process.cwd(), "db", dbName);
    } else {
      let dataPath = config.get("dataPath");
      dbPath = path.join(dataPath, "db", dbName);
    }
    log.scope("db").info(`dbPath: ${dbPath}`);
    const ajv = new Ajv({
      allErrors: true,
      useDefaults: true
    });

    this.schemaValidator = ajv.compile(scheme);

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
      throw `data valid fail: ${JSON.stringify(data)}`;
    }
  }
}

export default BaseStore;
