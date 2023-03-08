const mongoose = require('mongoose');
const {BMCCourseSchema, instructorReviewSchema, courseReviewSchema} = require("./schemas");
const BMCCourseModel = mongoose.model("bmccourses", BMCCourseSchema);
const courseReviewModel = mongoose.model("coursereviews", courseReviewSchema);
const instructorReviewModel = mongoose.model("instructorreviews", instructorReviewSchema);
module.exports = {BMCCourseModel, courseReviewModel, instructorReviewModel}