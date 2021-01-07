const clipboardItemSchema = {
  type: "object",
  properties: {
    table: {
      type: "string"
    },
    copyType: {
      type: "string"
    },
    copyTime: {
      type: "object"
    },
    copyContent: {
      type: "string"
    },
    otherInfo: {
      type: "object"
    },
    name: {
      type: "string"
    }
  },
  required: ["copyType", "copyTime", "copyContent"],
  additionalProperties: false
};
module.exports = clipboardItemSchema;
