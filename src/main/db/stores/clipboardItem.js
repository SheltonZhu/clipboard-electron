import log from "@/main/log";
import clipboardItem from "../schemas/clipboardItem";
import initDataSet from "../initData";
import baseStore from "@/main/db/stores/baseStore";
import config from "@/main/config";

class ClipboardItemStore extends baseStore {
  constructor() {
    const dbName = "clipboard.db";
    super(dbName, clipboardItem);
    this.visibleField = {
      _id: 1,
      table: 1,
      copyType: 1,
      copyTime: 1,
      copyContent: 1,
      otherInfo: 1,
      name: 1,
      checksum: 1
    };
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

  async create(data) {
    let base = await super.create(data);
    if (data.table === "historyData") {
      await this.checkLimit();
    }
    return base;
  }

  readAll(table, queryKey, copyType) {
    let queryObj = {};
    queryObj.table = table;
    if (copyType) {
      queryObj.copyType = copyType;
    }
    if (queryKey && queryKey.trim()) {
      if (copyType !== "Image") {
        if (!copyType) {
          queryObj.copyType = { $ne: "Image" };
        }
        // queryObj.copyContent = {$or:{ $regex: new RegExp(`.*${queryKey}.*`, "i")} };
        queryObj["$or"] = [
          { name: { $regex: new RegExp(`.*${queryKey}.*`, "i") } },
          { copyContent: { $regex: new RegExp(`.*${queryKey}.*`, "i") } }
        ];
      }
    }
    log.scope("clipboard").info("queryString: ", queryObj);
    return this.db.find(queryObj, this.visibleField).sort({ copyTime: -1 });
  }

  async hasData() {
    return (await this.count({ table: "historyData" })) > 0;
  }

  removeAll(table) {
    return this.db.remove({ table }, { multi: true });
  }

  removeOne(table, _id) {
    return this.db.remove({ table, _id }, {});
  }

  async checkLimit() {
    const numLimit = parseInt(config.get("historyCapacityNum"));

    if (numLimit) {
      let qs = await this.getLimitData(numLimit);
      if (qs.length < numLimit) return 0;
      return await this.db.remove(
        { table: "historyData", copyTime: { $lt: qs.pop().copyTime } },
        { multi: true }
      );
    }
    return 0;
  }
  getLimitData(numLimit) {
    return this.db
      .find({ table: "historyData" })
      .sort({ copyTime: -1 })
      .limit(numLimit);
  }
  count(query) {
    return this.db.count(query);
  }

  read(_id) {
    return this.db.findOne({ _id }).exec();
  }

  rename(_id, name) {
    return this.db.update(
      { _id },
      { $set: { name } },
      { returnUpdatedDocs: true }
    );
  }

  // readActive() {
  //   return this.db.find({ isDone: false }).exec();
  // }

  // archive({ _id }) {
  //   return this.db.update({ _id }, { $set: { isDone: true } });
  // }
}

export default new ClipboardItemStore();
