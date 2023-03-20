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

const BMCInstructorSchema = new mongoose.Schema({
  name: String,
  last_name: String,
  email: String,
  department: String,
});

const courseReviewSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseNumber: { type: Number, required: true },
  semester: { type: String, required: true },
  instructorName: { type: String, required: true },
  instructorEmail: { type: String, required: true },
  courseQuality: { type: Number, required: true },
  instructorQuality: { type: Number, required: true },
  difficulty: { type: Number, required: true },
  workRequired: { type: Number, required: true },
  amountLearned: { type: Number, required: true },
  stimulateInterest: { type: Number },
  instructorAccess: { type: Number },
  comment: { type: String },
  status: { type: Number }, // 0: pending, 1: approved, 2: rejected
});

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
  BMCInstructorSchema,
  instructorReviewSchema,
  courseReviewSchema,
};
