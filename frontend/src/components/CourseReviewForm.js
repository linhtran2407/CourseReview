import React from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { useState } from "react";
import axios from "axios";
import AlertDialog from "./AlertDialog";
import { Check, Send } from "@mui/icons-material";

function CourseReviewForm() {
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    semester: "",
    semesterCode: "",
    department: "CMSC",
    course: "",
    courseNumber: "",
    courseTitle: "",
    instructor: "",
    instructorName: "",
    instructorEmail: "",
    courseQuality: 1,
    instructorQuality: 1,
    difficulty: 1,
    workRequired: 1,
    amountLearned: 1,
    recMajor: 1,
    recMinor: 1,
    comment: "",
  });

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type === "number") {
      value = Number(value); // Convert to number
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(`${backendPrefix}/review/course`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (res.status !== 200 || !res.data) {
      console.error("error saving course review");
      return;
    }
  };

  // fetch all (BMC) courses by selected semester
  const [coursesBySem, setCoursesBySem] = React.useState([]);
  const [formattedCoursesBySem, setFormattedCoursesBySem] = React.useState([]);

  const fetchCoursesBySem = async (semester) => {
    const res = await axios.get(
      `${backendPrefix}/data/bmc_courses/${semester}`
    );

    if (res.status !== 200 || !res.data) {
      console.error("error fetching courses by semester");
      return;
    }

    const coursesWithFormat = res.data.map((course) => ({
      ...course,
      format: `B${course.number} ${course.title}`,
    }));

    setCoursesBySem(coursesWithFormat);
  };

  React.useEffect(() => {
    if (formData.semester) {
      // reset course and instructor + reload list of courses
      // when semester changes
      const semesterCode = standardizeSemester(formData.semester);
      setFormData({
        ...formData,
        course: "",
        instructor: "",
        semesterCode: semesterCode,
      });
      fetchCoursesBySem(semesterCode);
    }
  }, [formData.semester]);

  // whenever list of courses changes, the formatted version of it changes too
  React.useEffect(() => {
    if (coursesBySem && coursesBySem.length > 0) {
      const set = new Set();
      for (const c of coursesBySem) {
        set.add(c.format);
      }

      setFormattedCoursesBySem(Array.from(set));
    }
  }, [coursesBySem]);

  // convert all semester to correct format in the DB
  // eg: Fall 2021 -> f21, Spring 2023 -> s23
  function standardizeSemester(semester) {
    const [term, year] = semester.split(" ");
    const shortTerm = term.charAt(0).toLowerCase();
    const shortYear = year.slice(-2);
    return `${shortTerm}${shortYear}`;
  }

  // fetch all (BMC) instructors by selected semester and coures
  const [instructorsBySemCourse, setInstructorsBySemCourse] = React.useState(
    []
  );
  const [formattedInstructors, setFormattedInstructors] = React.useState([]);

  async function getInstructor(instructor) {
    const res = await axios.get(
      `${backendPrefix}/data/bmc_instructors/${formData.department}/${instructor}`
    );
    if (res.status !== 200 || !res.data) {
      console.error("error fetching instructors by deparment + last name");
      return;
    }

    return res.data;
  }

  const fetchInstructorsBySemCourse = async () => {
    // get all instructor's last names who teach the selected course
    const instructorLastSet = new Set();
    for (let c of coursesBySem) {
      if (c.format === formData.course) {
        instructorLastSet.add(c.instructor);
      }
    }

    const instructorLasts = Array.from(instructorLastSet);

    const instructors = [];
    for (let i of instructorLasts) {
      const instructor = await getInstructor(i);
      instructors.push(instructor);
    }

    setInstructorsBySemCourse(instructors);
  };

  React.useEffect(() => {
    if (formData.semester && formData.course) {
      const matchingCourseObj = coursesBySem.find(
        (obj) => obj.format === formData.course
      );
      setFormData({
        ...formData,
        courseNumber: matchingCourseObj.number,
        courseTitle: matchingCourseObj.title,
      });
      // reload list of instructors when course changes
      fetchInstructorsBySemCourse();
    }
  }, [formData.course]);

  React.useEffect(() => {
    if (instructorsBySemCourse) {
      // format instructors
      const formattedInstructors = [];
      instructorsBySemCourse.forEach((i) => {
        formattedInstructors.push(`${i.name} - ${i.email}`);
      });
      setFormattedInstructors(formattedInstructors);
    }
  }, [instructorsBySemCourse]);

  React.useEffect(() => {
    if (formData.instructor) {
      const [name, email] = formData.instructor.split(" - ");
      setFormData({
        ...formData,
        instructorEmail: email,
        instructorName: name,
      });
    }
  }, [formData.instructor]);

  function hasRequiredFields() {
    return formData.semester && formData.course && formData.instructor;
  }

  const [submissionAlert, setSubmissionAlert] = React.useState(false);

  const openSubmissionAlert = () => {
    setSubmissionAlert(true);
  };

  const closeSubmissionAlert = () => {
    setSubmissionAlert(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel id="semester-label">Semester</InputLabel>
          <Select
            labelId="semester-label"
            id="semester"
            value={formData.semester}
            label="Semester"
            onChange={handleChange}
            name="semester"
            required
          >
            <MenuItem value={`Spring ${new Date().getFullYear()}`}>
              Spring {new Date().getFullYear()}
            </MenuItem>
            <MenuItem value={`Fall ${new Date().getFullYear() - 1}`}>
              Fall {new Date().getFullYear() - 1}
            </MenuItem>
            <MenuItem value={`Spring ${new Date().getFullYear() - 1}`}>
              Spring {new Date().getFullYear() - 1}
            </MenuItem>
            <MenuItem value={`Fall ${new Date().getFullYear() - 2}`}>
              Fall {new Date().getFullYear() - 2}
            </MenuItem>
            <MenuItem value={`Spring ${new Date().getFullYear() - 2}`}>
              Spring {new Date().getFullYear() - 2}
            </MenuItem>
            <MenuItem value={`Fall ${new Date().getFullYear() - 3}`}>
              Fall {new Date().getFullYear() - 3}
            </MenuItem>
            <MenuItem value={`Spring ${new Date().getFullYear() - 3}`}>
              Spring {new Date().getFullYear() - 2}
            </MenuItem>
            <MenuItem value={`Fall ${new Date().getFullYear() - 4}`}>
              Fall {new Date().getFullYear() - 3}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <TextField
            disabled
            id="department"
            label="Department"
            defaultValue="CMSC"
          />
        </FormControl>

        <FormControl
          fullWidth
          style={{ marginBottom: "16px" }}
          disabled={!formData.semester}
        >
          <InputLabel id="course-label">Course</InputLabel>
          <Select
            labelId="course-label"
            id="course"
            value={formData.course}
            label="Course"
            onChange={handleChange}
            name="course"
            required
          >
            {formattedCoursesBySem.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          style={{ marginBottom: "16px" }}
          disabled={!formData.semester || !formData.course}
        >
          <InputLabel id="instructor-label">Instructor</InputLabel>
          <Select
            labelId="instructor-label"
            id="instructor"
            value={formData.instructor}
            label="Instructor"
            onChange={handleChange}
            name="instructor"
            required
          >
            {formattedInstructors.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasRequiredFields() ? (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid container item spacing={2}>
                <Grid item xs={2}>
                  <Typography>Course Quality</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Course Quality"
                    defaultValue={3}
                    name="courseQuality"
                    value={formData.courseQuality}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={2}>
                  <Typography>Instructor Quality</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Instructor Quality"
                    defaultValue={3}
                    name="instructorQuality"
                    value={formData.instructorQuality}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={2}>
                  <Typography>Difficulty</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Difficulty"
                    defaultValue={3}
                    name="difficulty"
                    value={formData.difficulty}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={2}>
                  <Typography>Work Required</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Work Required"
                    defaultValue={3}
                    name="workRequired"
                    value={formData.workRequired}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={2}>
                  <Typography>Amount Learned</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Amount Learned"
                    defaultValue={3}
                    name="amountLearned"
                    value={formData.amountLearned}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={2}>
                  <Typography>Recommend for Major</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Recommend Major"
                    defaultValue={3}
                    name="recMajor"
                    value={formData.recMajor}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={2}>
                  <Typography>Recommend for Minor</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Recommend Minor"
                    defaultValue={3}
                    name="recMinor"
                    value={formData.recMinor}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <FormControl
                  xs={2}
                  fullWidth
                  style={{ marginBottom: "16px", marginLeft: "16px" }}
                >
                  <TextField
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    label="Additional Comment"
                    multiline
                    rows={4}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        ) : null}
        <AlertDialog
          open={submissionAlert}
          handleClose={closeSubmissionAlert}
        />
        <Stack spacing={2} direction="row">
          <Button
            xs={2}
            variant="contained"
            color="success"
            type="submit"
            onClick={openSubmissionAlert}
            endIcon={<Send />}
          >
            Submit
          </Button>

          

          <Button
            xs={2}
            variant="contained"
            color="error"
            type="submit"
            onClick={() => navigate("/")}
            endIcon={<Check/>}
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default CourseReviewForm;
