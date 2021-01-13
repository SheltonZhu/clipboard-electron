import cardIcon from "../schemas/cardIconItem";
import baseStore from "@/main/db/stores/baseStore";
import md5 from "md5";

class CardIconItemStore extends baseStore {
  constructor() {
    const dbName = "cardIcon.db";
    super(dbName, cardIcon);
    this.visibleField = {
      _id: 1,
      content: 1,
      checksum: 1
    };
  }

  create(data) {
    return super.create(data);
  }

  readAll() {
    return this.db.find({}, this.visibleField);
  }

  async hasData() {
    return (await this.count({})) > 0;
  }

  getChecksum(content) {
    return md5(content);
  }

  async getChecksumAndExist(content) {
    const checksum = this.getChecksum(content);
    return [checksum, await this.exists(checksum)];
  }

  async exists(checksum) {
    return (await this.count({ checksum })) > 0;
  }

  // readActive() {
  //   return this.db.find({ isDone: false }).exec();
  // }
  count(query) {
    return this.db.count(query);
  }

  // archive({ _id }) {
  //   return this.db.update({ _id }, { $set: { isDone: true } });
  // }
}

export default new CardIconItemStore();
