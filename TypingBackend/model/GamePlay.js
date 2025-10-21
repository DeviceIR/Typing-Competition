const { Schema, model } = require("mongoose");

const gamePlaySchema = new Schema({
  startTime: { type: Date, required: false },
  words: [String],
  inputs: [
    {
      word: { type: String, required: true },
      enteredTime: { type: Date, required: true },
    },
  ],

  wpm: { type: Number, required: false },
  accuracy: { type: Number, required: false },
  ticket: { type: Schema.Types.ObjectId, required: true, ref: "Ticket" },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = model("GamePlay", gamePlaySchema);
