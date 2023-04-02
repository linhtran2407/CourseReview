const express = require("express");
const router = express.Router();
const {
  courseReviewModel,
  instructorReviewModel,
} = require("../models/models");
const {
  fullCourseReviewFields,
  instructorReviewMetrics,
  fullInstructorReviewFields,
} = require("./formFields");

// add new course review
router.post("/course", async (req, res) => {
  try {
    const courseReview = new courseReviewModel({
      status: 0, // pending
    });

    fullCourseReviewFields.forEach((field) => {
      if (field === "semester") {
        courseReview[field] = req.body.semesterCode;
      } else {
        courseReview[field] = req.body[field];
      }
    });

    const savedReview = await courseReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// add new instructor review
router.post("/instructor", async (req, res) => {
  try {
    const instructorReview = new instructorReviewModel({
      status: 0, // pending
    });

    fullInstructorReviewFields.forEach((field) => {
      instructorReview[field] = req.body[field];
    });
    
    const savedReview = await instructorReview.save();
    
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
