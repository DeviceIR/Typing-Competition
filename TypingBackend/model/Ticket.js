const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const ticketSchema = Schema({
  ticketId: { type: String, required: true },
  buyTime: { type: Date, reuired: true },
  useTime: { type: Date, required: false },
  isUsed: { type: Boolean, default: false },
  isValid: { type: Boolean, default: true },
  user: { type: ObjectId, required: true, ref: "User" },
});

module.exports = model("Ticket", ticketSchema);
