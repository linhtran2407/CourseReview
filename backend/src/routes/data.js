const express = require("express");
const router = express.Router();
const {
  BMCCourseModel,
  BMCCInstructorModel,
  courseReviewModel,
  instructorReviewModel,
} = require("../models/models");

// get lists of unique courses and instructors for the searching bar
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

// get lists of courses by semester
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
// grouped by semester, then by instructor
// and sorted in reverse chronological order
// and append a object containing average scores in result
router.get("/review_course/:courseNumber", async (req, res) => {
  try {
    const reviews = await courseReviewModel.find({
      courseNumber: req.params.courseNumber,
      status: 1, // approved
    });

    // group reviews by semester
    const groupResult = reviews.reduce((acc, curr) => {
      const semester = curr.semester;
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push(curr);
      return acc;
    }, {});

    // sort semesters in reverse chronological order
    const sortResult = Object.keys(groupResult)
      .sort((a, b) => {
        const yearA = parseInt(a.slice(1));
        const yearB = parseInt(b.slice(1));
        const semesterA = a.charAt(0) === "f" ? 0 : 1;
        const semesterB = b.charAt(0) === "f" ? 0 : 1;

        if (yearA === yearB) {
          return semesterB - semesterA;
        } else {
          return yearB - yearA;
        }
      })
      .reduce((acc, semester) => {
        acc[semester] = groupResult[semester];
        return acc;
      }, {});

    // group reviews in each semester by instructor
    const updatedResult = Object.keys(sortResult).reduce((acc, semester) => {
      const semesterGroups = sortResult[semester];
      const instructorMap = semesterGroups.reduce((instructors, group) => {
        const email = group.instructorEmail;
        if (!instructors[email]) {
          instructors[email] = [];
        }
        instructors[email].push(group);
        return instructors;
      }, {});
      acc[semester] = instructorMap;
      return acc;
    }, {});

    Object.keys(updatedResult).forEach((sem) => {
      const instructorMaps = updatedResult[sem];
      Object.keys(instructorMaps).forEach((instructor) => {
        const averages = computeAverages(instructorMaps[instructor]);
        averages.label = "avg"; // add a label for object containing averages
        instructorMaps[instructor].push(averages);
      });
    });

    res.status(200).json(updatedResult);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

function computeAverages(list) {
  const fields = [
    "instructorName",
    "instructorEmail",
    "courseQuality",
    "instructorQuality",
    "difficulty",
    "workRequired",
    "amountLearned",
    "recMajor",
    "recMinor",
  ];
  const result = list.reduce((acc, curr) => {
    for (let key of fields) {
      if (key.startsWith("instructor")) {
        acc[key] = curr[key];
      } else {
        acc[key] = (acc[key] || 0) + curr[key];

      }
    }
    return acc;
  }, {});

  for (let key in result) {
    if (key.startsWith("instructor")) { continue; }
    result[key] = +(result[key] / list.length).toFixed(2);
  }

  return result;
}

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

module.exports = router;
