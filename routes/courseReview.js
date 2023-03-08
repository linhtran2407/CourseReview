const express = require('express');
const router = express.Router();
const {CourseReview} = require('../models/models');

router.get('/', async (req, res) => {
  try {
    const courseReviews = await CourseReview.find();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/new', (req, res) => {
});

router.post('/', async (req, res) => {
  const courseReview = new CourseReview(req.body);
  try {
    await courseReview.save();
    res.redirect('/courseReview');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
