const mongoose = require("mongoose");

// title,number,semester,instructor,enrollment
// schema defined based on BMC_CS_courses.csv file format
const BMCCourseSchema = new mongoose.Schema({
  title: String,
  number: Number,
  semester: String,
  instructor: String, // instructor's last name
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
  email: { type: String, required: true },
  department: { type: String, required: true },
  coursesTaken: { type: [String] },

  overallRating: { type: Number, required: true },
  clearCommunication: { type: Boolean},
  responsive: { type: Boolean},
  engaging: { type: Boolean},
  inspiring: { type: Boolean},
  createWelcomingEnv: { type: Boolean},
  accessibleOutsideClass: { type: Boolean},

  lectureHeavy: { type: Boolean},
  testHeavy: { type: Boolean},
  readingHeavy: { type: Boolean},
  lotsOfHomework: { type: Boolean },
  assignsUsefulProjects: { type: Boolean},
  organized: { type: Boolean},

  giveGoodFeedback: { type: Boolean},
  offersExtraCredit: { type: Boolean},
  fairGrader: { type: Boolean},
  toughGrader: { type: Boolean},
  clearGradingCriteria: { type: Boolean },
  
  comment: { type: String },
  status: { type: Number }, // 0: pending, 1: approved, 2: rejected
});

module.exports = {
  BMCCourseSchema,
  BMCInstructorSchema,
  instructorReviewSchema,
  courseReviewSchema,
};
