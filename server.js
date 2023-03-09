require("dotenv").config();
const express = require("express");

const connectDB = require("./src/config/db");
// const cors = require("cors");
const logger = require("morgan");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
app.use(express.json());

connectDB();

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// routes
app.use("/users/", require("./src/routes/auth"));
app.use("/recipes/", require("./src/routes/recipe"));
app.use("/games/", require("./src/routes/games"));

// 404 errors
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.statusCode = 404;
  next(error);
});

// Error handling
app.use(errorHandler);

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`server running on localhost:${port}`);
});
