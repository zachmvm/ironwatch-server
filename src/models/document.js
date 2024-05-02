const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  title: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiryDate: { type: Date, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  file: {type: String}
});

const Document = model("Document", documentSchema);

module.exports = Document;
