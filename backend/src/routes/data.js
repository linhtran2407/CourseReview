const express = require("express");
const router = express.Router();
const { BMCCourseModel, BMCCInstructorModel } = require("../models/models");

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
    const courses = await BMCCourseModel.find({ semester: req.params.semester});
    res.status(200).json(courses);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// get lists of instructors by course number + semester
router.get("/instructors/:semester/:courseNum", async (req, res) => {
  try {
    // ! assume to be BMC instructor by finding from BMC db 
    const courses = await BMCCourseModel.find({
      semester: req.params.semester,
      number: req.params.courseNum,
    });

    const instructors = courses.map(course => 
      course.instructor
    );

    res.status(200).json(instructors);
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

module.exports = router;
