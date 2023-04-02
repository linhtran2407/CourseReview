const { name } = require("ejs");

const courseReviewMetrics = [
    "courseQuality",
    "instructorQuality",
    "difficulty",
    "workRequired",
    "amountLearned",
    "stimulateInterest",
    "instructorAccess",
];

const courseReviewFormFields = [
    "courseTitle",
    "courseNumber",
    "semester",
    "instructorName",
    "instructorEmail",
    "comment",
]

const fullCourseReviewFields = courseReviewFormFields.concat(courseReviewMetrics);

const instructorReviewMetrics = [
    "clearCommunication",
    "responsive",
    "engaging",
    "inspiring",
    "createWelcomingEnv",
    "accessibleOutsideClass",
  
    "lectureHeavy",
    "testHeavy",
    "readingHeavy",
    "lotsOfHomework",
    "assignsUsefulProjects",
    "organized",
  
    "giveGoodFeedback",
    "offersExtraCredit",
    "fairGrader",
    "toughGrader",
    "clearGradingCriteria",
];

const instructorReviewFormFields = [
    "name",
    "email",
    "department",
    "coursesTaken",
    "overallRating",
    "comment",
];

const fullInstructorReviewFields = instructorReviewFormFields.concat(instructorReviewMetrics);

module.exports = {
    courseReviewMetrics,
    fullCourseReviewFields,
    instructorReviewMetrics,
    fullInstructorReviewFields,
};
  
  