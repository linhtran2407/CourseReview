const mongoose = require("mongoose");

// title,number,semester,instructor,enrollment
// schema defined based on BMC_CS_courses.csv file format
const BMCCourseSchema = new mongoose.Schema({
  courseTitle: String,
  courseNumber: String,
  semester: String,
  instructor: String,
  enrollment: Number,
});

const courseReviewSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseID: { type: String, required: true, unique: true },
  semester: { type: String, required: true },
  instructor: { type: String, required: true },
  courseQuality: { type: Number, required: true },
  instructorQuality: { type: Number, required: true },
  difficulty: { type: Number, required: true },
  workRequired: { type: Number, required: true },
  amountLearned: { type: Number, required: true },
  recMajor: { type: Number },
  recMinor: { type: Number },
  readingValues: { type: Number },
});

courseReviewSchema.methods.standardizeName = function () {
  this.courseID = this.courseID.toUpperCase();
  return this.courseID;
};

const instructorReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  courses: [courseReviewSchema],
  avgCourseQuality: { type: Number, required: true },
  avgInstructorQuality: { type: Number, required: true },
  avgDifficulty: { type: Number, required: true },
});

module.exports = {
  BMCCourseSchema,
  instructorReviewSchema,
  courseReviewSchema,
};
