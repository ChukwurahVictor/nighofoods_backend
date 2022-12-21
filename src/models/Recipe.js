const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
   name: {
      type: String,
      required: [true, "Please provide a name"],
   },
   chef: {
      type: String,
      required: [true, "Please provide a chef"],
   },
   duration: {
      type: String
   },
   image: {
      type: String,
   }
});

module.exports = mongoose.model('recipe', recipeSchema);