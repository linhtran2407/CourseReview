const mongoose = require('mongoose');
const {BMCCourseSchema, BMCInstructorSchema, instructorReviewSchema, courseReviewSchema} = require("./schemas");

// declare models
const BMCCourseModel = mongoose.model("bmccourses", BMCCourseSchema);
const BMCCInstructorModel = mongoose.model("bmcinstructors", BMCInstructorSchema);
const courseReviewModel = mongoose.model("coursereviews", courseReviewSchema);
const instructorReviewModel = mongoose.model("instructorreviews", instructorReviewSchema);

module.exports = {BMCCourseModel, BMCCInstructorModel, courseReviewModel, instructorReviewModel}