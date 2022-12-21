const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const connectDB = async() => {
   try {
      await mongoose.connect(
         process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         });
      console.log(`Database connected successfully`);
   } catch (err) {
      console.log(`Error: ${err.message}`);
      process.exit(1);
   }
}

module.exports = connectDB;