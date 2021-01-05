import labelItem from "../schemas/labelItem";
import baseStore from "@/main/db/stores/baseStore";

class LabelItemStore extends baseStore {
  constructor() {
    const dbName = "label.db";
    super(dbName, labelItem);
    this.visibleField = {
      _id: 1,
      name: 1,
      color: 1
    };
  }

  initData() {
    return (async () => {
      if (!(await this.hasData())) {
        await this.create({
          name: "实用链接",
          color: "#ff625c"
        });
      }
    })();
  }

  readAll() {
    return this.db.find({}, this.visibleField).sort({ createdAt: 1 });
  }

  async hasData() {
    return (await this.count({})) > 0;
  }

  removeAll() {
    return this.db.remove({}, { multi: true });
  }

  removeOne(_id) {
    return this.db.remove({ _id }, {});
  }

  removeLabelAndData(_id) {
    return (async _id => {
      let removedNum = 0;
      removedNum += await global.db.removeAll(_id);
      removedNum += await this.removeOne(_id);
      return removedNum;
    })(_id);
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

  recolor(_id, color) {
    return this.db.update({ _id }, { $set: { color } });
  }

  // readActive() {
  //   return this.db.find({ isDone: false }).exec();
  // }

  // archive({ _id }) {
  //   return this.db.update({ _id }, { $set: { isDone: true } });
  // }
}

export default new LabelItemStore();
