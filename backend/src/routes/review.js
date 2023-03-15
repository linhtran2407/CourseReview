const express = require("express");
const router = express.Router();
const { courseReviewModel } = require("../models/models");

// add new course review
router.post("/course", async (req, res) => {
  try {
    const courseReview = new courseReviewModel({
      courseTitle: req.body.courseTitle,
      courseNumber: req.body.courseNumber,
      semester: req.body.semesterCode,
      instructorName: req.body.instructorName,
      instructorEmail: req.body.instructorEmail,
      courseQuality: req.body.courseQuality,
      instructorQuality: req.body.instructorQuality,
      difficulty: req.body.difficulty,
      workRequired: req.body.workRequired,
      amountLearned: req.body.amountLearned,
      recMajor: req.body.recMajor,
      recMinor: req.body.recMinor,
      comment: req.body.comment,
      status: 0, // pending
    });
    const savedCourseReview = await courseReview.save();
    res.status(201).json(savedCourseReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
