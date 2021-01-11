const CardIconItemSchema = {
  type: "object",
  properties: {
    content: {
      type: "string"
    },
    checksum: {
      type: "string"
    }
  },
  required: ["content", "checksum"],
  additionalProperties: false
};
module.exports = CardIconItemSchema;
