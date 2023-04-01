import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Grid,
  Checkbox,
  Paper,
  FormControl,
  MenuItem,
  Chip,
  InputLabel,
  Typography,
} from "@mui/material";
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import ClassIcon from '@mui/icons-material/Class';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Select from "@mui/material/Select";
import { useState } from "react";
import axios from "axios";
import AlertDialog from "./AlertDialog";
import { Check, Send } from "@mui/icons-material";
import { getRatingDescription } from "./Formartter";
import { instructorMetrics } from "./ReviewMetrics";

function InstructorReviewForm() {
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "CMSC",
    overAllRating: 3,
    clearCommunication: false,
    responsive: false,
    inspiring: false,
    engaging: false,
    enthusiastic: false,
    caring: false,
    createWelcomingEnv: false,
    lectureHeavy: false,
    testHeavy: false,
    readingHeavy: false,
    giveGoodFeedback: false,
    organized: false,
    accessibleOutsideClass: false,
    assignsUsefulProjects: false,
    offersExtraCredit: false,
    fairGrader: false,
    classesTaken: { type: [String] },
    comment: "",
  });

  const [chipId, setChipId] = React.useState([]);

  useEffect(() => {}, [chipId]);

  const handleChangeChip = (e) => {
    console.log(e.target.name);
    console.log(e.target.checked);
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type === "number") {
      value = Number(value); // Convert to number
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(`${backendPrefix}/review/instructor`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if ((res.status !== 200 && res.status !== 201) || !res.data) {
      console.error("error saving course review: " + res.status);
      return;
    }
  };

  const [instructors, setInstructors] = React.useState([]);
  const fetchInstructors = async () => {
    const res = await axios.get(`${backendPrefix}/data/bmc_instructors`);

    if (res.status !== 200 || !res.data) {
      console.error("error fetching instructors");
      return;
    }

    setInstructors(res.data);
  };

  React.useEffect(() => {
    fetchInstructors();
  }, []);

  const [emailByInstructor, setEmailByInstructor] = React.useState([]);
  React.useEffect(() => {
    if (formData.name) {
      const emails = [];
      instructors.forEach((instructor) => {
        if (instructor.name === formData.name) {
          emails.push(instructor.email);
        }
      });

      setEmailByInstructor(emails);
    }
  }, [formData.name]);

  function hasRequiredFields() {
    return formData.department && formData.email && formData.name;
  }

  const getIcon = (key) => {
    if (key === "Communication and Engagement"){
      return InterpreterModeIcon;
    } else if (key === "Course Design and Assessment"){
      return ClassIcon;
    } else {
      return FeedbackIcon;
    }
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
          <InputLabel id="instructorName-label">Instructor Name</InputLabel>
          <Select
            labelId="instructorName-label"
            id="name"
            value={formData.name}
            label="Instructor Name"
            onChange={handleChange}
            name="name"
            required
          >
            {instructors.map((instructor) => (
              <MenuItem key={instructor.email} value={instructor.name}>
                {instructor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          style={{ marginBottom: "16px" }}
          disabled={!formData.name}
        >
          <InputLabel id="email-label">Instructor Email</InputLabel>
          <Select
            labelId="email-label"
            id="email"
            value={formData.email}
            label="Email"
            onChange={handleChange}
            name="email"
            required
          >
            {emailByInstructor.map((email) => (
              <MenuItem key={email} value={email}>
                {email}
              </MenuItem>
            ))}
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

        {hasRequiredFields() ? (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid container item spacing={2}>
                <Grid
                  item
                  xs={1}
                  sx={{ marginBottom: "16px", marginLeft: "5px" }}
                >
                  <Typography>Overall Rating</Typography>
                </Grid>
                <Grid item>
                  <Slider
                    sx={{ width: 300, height: 10 }}
                    onChange={handleChange}
                    aria-label="Overall Rating"
                    defaultValue={3}
                    name="overAllRating"
                    value={formData["overAllRating"]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={getRatingDescription(
                      formData["overAllRating"],
                      "overAllRating"
                    )}
                    step={1}
                    marks
                    min={1}
                    max={5}
                    required
                  />
                </Grid>
              </Grid>

              <Grid
                container
                item
                spacing={2}
                sx={{
                  marginBottom: "16px",
                  marginLeft: "16px",
                  marginRight: "20px",
                }}
              >

                {Object.keys(instructorMetrics).map((key) => {
                  const metrics = instructorMetrics[key];
                  const iconComponent = getIcon(key);
                  return (
                    <Grid item xs={4}>
                      <Chip icon={React.createElement(iconComponent)} label={key} sx={{fontSize: "16px", marginBottom: "16px"}} />
                      {metrics.map((metric) => {
                        return (
                          <Grid item xs={3}>
                            <Paper elevation={3} sx={{ width: 350 }}>
                              <Grid container alignItems={"center"}>
                                <Grid item>
                                  <Checkbox onChange={handleChangeChip} value={metric.id} name={metric.id} />
                                </Grid>
                                <Grid item xs={8}>
                                  <Typography>{metric.name}</Typography>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })}
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
            endIcon={<Check />}
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default InstructorReviewForm;
