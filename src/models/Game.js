const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("game", gameSchema);
