const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt")

const userSchema = new Schema({
   name: {
      type: String,
      required: [true, "Please provide name"],
   },
   email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         "Please provide a valid email",
      ],
   },
   password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6
   }
});


userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
   }

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

userSchema.methods.matchPassword = async function (password) {
   return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', userSchema);