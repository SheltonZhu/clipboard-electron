import log from "@/main/log";
import clipboardItem from "../schemas/clipboardItem";
import initDataSet from "../initData";
import baseStore from "@/main/db/stores/baseStore";

class ClipboardItemStore extends baseStore {
  constructor() {
    const dbName = "clipboard.db";
    super(dbName, clipboardItem);
    this.visibleField = {
      _id: 1,
      copyType: 1,
      copyTime: 1,
      copyContent: 1,
      otherInfo: 1
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
    return this.db.remove({ table }, { multi: true });
  }

  removeOne(table, _id) {
    return this.db.remove({ table, _id }, {});
  }

  count(query) {
    return this.db.count(query);
  }

  read(_id) {
    return this.db.findOne({ _id }).exec();
  }

  // readActive() {
  //   return this.db.find({ isDone: false }).exec();
  // }

  // archive({ _id }) {
  //   return this.db.update({ _id }, { $set: { isDone: true } });
  // }
}

export default new ClipboardItemStore();
