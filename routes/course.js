const express = require("express");
const router = express.Router();
const { BMCCourseModel } = require("../models/models");


router.get("/courseAndInstructor", async (req, res) => {
  try {
    
    const courses = await BMCCourseModel.aggregate([ // ! query not unique
        { $group: { _id: { title: "$title", number: "$number" } } },
        { $project: { _id: 0, title: "$_id.title", number: "$_id.number" } },
      ])

    const instructors = await BMCCourseModel.distinct("instructor")
    //   .then((result) =>
    //     result.map((instructorName) => ({
    //       instructor: instructorName,
    //       type: "instructor",
    //     }))
    //   )
    //   .then((result) => console.log(result))
    //   .catch((err) => console.error(err));

    // Normalize the objects to have a common structure
    const normalizedCourses = courses.map((course) => ({
      name: course.title,
      number: course.number,
      type: "course", // Default to 'course' if type is not provided
    }));

    const normalizedInstructors = instructors.map((instructor) => ({
        name: instructor, // Rename 'instructor' to 'title'
      type: "instructor", // Default to 'instructor' if type is not provided
    }));

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

module.exports = router;
