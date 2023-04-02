const express = require("express");
const router = express.Router();
const {
  BMCCourseModel,
  BMCCInstructorModel,
  courseReviewModel,
  instructorReviewModel,
} = require("../models/models");
const {
  courseReviewMetrics,
  instructorReviewMetrics,
} = require("./formFields");

/*
 *  Course-review related APIs
 */
// get lists of unique courses and (BMC) instructors for the searching bar
router.get("/courseAndInstructor", async (req, res) => {
  try {
    // get courses unique by title and number
    const courses = await BMCCourseModel.aggregate([
      { $group: { _id: { title: "$title", number: "$number" } } },
      { $project: { _id: 0, title: "$_id.title", number: "$_id.number" } },
    ]);
    // get all instructors
    const instructors = await BMCCInstructorModel.find();

    const normalizedCourses = courses.map((course) => ({
      name: course.title,
      number: course.number,
      type: "course",
    }));

    const normalizedInstructors = instructors.map((instructor) => ({
      name: instructor.name,
      email: instructor.email,
      type: "instructor",
    }));

    normalizedCourses.sort((a, b) => a.number - b.number);
    normalizedInstructors.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    // Concatenate the normalized lists
    const courseAndInstructor = [
      ...normalizedCourses,
      ...normalizedInstructors,
    ];

    res.status(200).json(courseAndInstructor);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// get lists of BMC courses by semester
router.get("/bmc_courses/:semester", async (req, res) => {
  try {
    const courses = await BMCCourseModel.find({
      semester: req.params.semester,
    });
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// get BMC instructors by department and last name
router.get("/bmc_instructors/:dept/:lastName", async (req, res) => {
  try {
    const instructors = await BMCCInstructorModel.find({
      department: req.params.dept,
      last_name: req.params.lastName,
    });

    if (instructors.length > 0) {
      res.status(200).json(instructors[0]);
    } else {
      res.status(200).json();
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// get all reviews of course with courseNumber
router.get("/review_course/:courseNumber", async (req, res) => {
  try {
    const reviews = await courseReviewModel.find({
      courseNumber: req.params.courseNumber,
      status: 1, // approved
    });

    // sort reviews by semester in reverse chronological order
    reviews.sort((a, b) => {
      const semA = a.semester;
      const semB = b.semester;
      const yearA = parseInt(semA.slice(1));
      const yearB = parseInt(semB.slice(1));
      const semesterA = semA.charAt(0) === "f" ? 1 : 0;
      const semesterB = semB.charAt(0) === "f" ? 1 : 0;

      if (yearA === yearB) {
        return semesterB - semesterA;
      } else {
        return yearB - yearA;
      }
    });

    const averages = {};

    // group reviews by key being semester-instructor email
    const grouped = reviews.reduce((res, review) => {
      const key = `${review.semester}-${review.instructorEmail}`;
      if (!res[key]) {
        res[key] = [];
        averages[key] = {};
        const obj = review.toObject();
        for (const field in obj) {
          if (!courseReviewMetrics.includes(field) && field !== "comment") {
            // remove comment field for simplicity
            averages[key][field] = obj[field];
          }
        }
      }

      res[key].push(review);
      return res;
    }, {});

    Object.keys(grouped).reduce((res, key) => {
      const avg = computeAverages(grouped[key]);
      for (const field of courseReviewMetrics) {
        averages[key][field] = avg[field];
      }
    }, {});

    const arr = {
      grouped: grouped,
      averages: averages,
    };

    res.status(200).json(arr);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

function computeAverages(reviews) {
  const res = reviews.reduce((acc, curr) => {
    for (let key of courseReviewMetrics) {
      acc[key] = (acc[key] || 0) + curr[key];
    }
    return acc;
  }, {});

  for (let key in res) {
    res[key] = +(res[key] / reviews.length).toFixed(2);
  }

  return res;
}

/*
 *  Instructor-review related APIs
 */
// get all BMC instructors
// assume instructors in DB are unique by email
router.get("/bmc_instructors", async (req, res) => {
  try {
    const instructors = await BMCCInstructorModel.find({});
    res.status(200).json(instructors);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get("/review_instructor/:instructorEmail", async (req, res) => {
  try {
    const reviews = await instructorReviewModel.find({
      instructorEmail: req.params.instructorEmail,
      status: 1, // approved
    });

    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// get all BMC courses taught by the instructor specified by given last name
router.get("/courses/:instructorLast", async (req, res) => {
  try {
    const courses = await BMCCourseModel.find({
      instructor: req.params.instructorLast,
    });
    if (courses.length == 0) {
      // retrieve all courses if cannot find matching ones
      courses = await BMCCourseModel.find({});
    }
    courses.reverse();
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
