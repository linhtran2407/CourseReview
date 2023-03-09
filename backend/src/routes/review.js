const express = require("express");
const router = express.Router();
const { CourseReview } = require("../models/models");

router.get("/allReviews", async (req, res) => {
  try {
    const courseReviews = await CourseReview.find();
    res.status(200).json(courseReviews);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// add new course review
router.post("/course", async (req, res) => {
  console.log(req.body);
  // const courseReview = new CourseReview(req.body);
  // console.log(courseReview);
  // try {
  //   await courseReview.save();
  //   res.redirect("/");
  // } catch (err) {
  //   console.error(err);
  //   res.sendStatus(500);
  // }
});

module.exports = router;
