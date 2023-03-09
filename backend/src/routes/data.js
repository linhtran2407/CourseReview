const express = require("express");
const router = express.Router();
const { BMCCourseModel, BMCCInstructorModel } = require("../models/models");

// get lists of course and instructor for the searching bar
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
router.get("/courses/:semester", async (req, res) => {
  try {
    const semInput = req.params.semester;
    if (!semInput) {
      res.status(400);
      return;
    }
    
    const courses = await BMCCourseModel.find({ semester: semInput}).exec();

    res.status(200).json(courses);
    
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
