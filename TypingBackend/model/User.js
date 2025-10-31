const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentId: { type: String, required: true },
  nickName: { type: String, required: false },
  tickets: [{ type: ObjectId, ref: "Ticket" }],
  image: { type: String, required: false },
});

module.exports = model("User", userSchema);
