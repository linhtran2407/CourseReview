const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Set up static files
app.use(express.static('public'));
app.use(cors());
// Set up body parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('Connected to DB'));

// Import routes
const courseReviewsRouter = require('./routes/courseReview');
// const instructorReviewsRouter = require('./routes/instructorReviews');
const courseRouter = require('./routes/course')
// Use routes
app.use('/courseReview', courseReviewsRouter);
// app.use('/instructorReview', instructorReviewsRouter);
app.use('/api/v1', courseRouter)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));