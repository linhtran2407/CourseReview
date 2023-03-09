const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Set up static files
app.use(express.static("public"));
app.use(cors());
// Set up body parser middleware
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json);

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", () => console.log("Connected to DB"));

//Import routes
const getDataRouter = require("./routes/data");
const reviewsRouter = require("./routes/review");

// Use routes
const ver = "/api/v1";
app.use(`${ver}/data`, getDataRouter);
app.use(`${ver}/review`, reviewsRouter);

// Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
