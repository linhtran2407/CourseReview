const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Set up middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", () => console.log("Connected to DB"));

//Import routes
const getDataRouter = require("./src/routes/data");
const reviewsRouter = require("./src/routes/review");
const adminRouter = require("./src/routes/admin");

// Use routes
const ver = "/api/v1";
app.use(`${ver}/data`, getDataRouter);
app.use(`${ver}/review`, reviewsRouter);
app.use(`${ver}/admin`, adminRouter);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
