const labelItemSchema = {
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    color: {
      type: "string"
    }
  },
  required: ["name", "color"],
  additionalProperties: false
};
module.exports = labelItemSchema;
