import React, { useState } from "react";
import {
  Box,
  TextField,
  Alert,
  Button,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import PendingReviewCard from "./PendingReviewCard";
import { TagFaces } from "@mui/icons-material";

import {HomeButton} from "./NavButton";

function Admin() {
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await axios.post(
      `${backendPrefix}/admin/authenAdmin`,
      {
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data && res.data.isAdmin) {
      setError(false);
      setShake(false);
      setAuthenticated(true);
    } else {
      setError(true);
      setShake(true);
      setAuthenticated(false);
    }
  };

  const handleAnimationEnd = () => {
    setShake(false);
  };

  const [courseReviews, setCourseReviews] = React.useState([]);
  const [instructorReviews, setInstructorReviews] = React.useState([]);

  const fetchCourseReviews = async () => {
    const res = await axios.get(`${backendPrefix}/admin/pendingReviews/course`);

    if (res.status !== 200 || !res.data) {
      console.error("error fetching pending course reviews");
      return;
    }
    setCourseReviews(res.data);
  };

  const fetchInstructorReviews = async () => {
    const res = await axios.get(
      `${backendPrefix}/admin/pendingReviews/instructor`
    );

    if (res.status !== 200 || !res.data) {
      console.error("error fetching pending course reviews");
      return;
    }

    setInstructorReviews(res.data);
  };

  React.useEffect(() => {
    fetchCourseReviews();
    fetchInstructorReviews();
  }, []);

  const handleDelete = (idx, reviewType) => {
    // Delete the element at the given index
    (reviewType === "course") ? setCourseReviews((prevReviews) => {
      const newReviews = [...prevReviews];
      newReviews.splice(idx, 1);
      return newReviews;
    }) : setInstructorReviews((prevReviews) => {
      const newReviews = [...prevReviews];
      newReviews.splice(idx, 1);
      return newReviews;
    });
  };

  return !authenticated ? (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "50ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          error={error}
          id="password-input"
          label="Enter Admin password & Press Enter"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onAnimationEnd={handleAnimationEnd}
          sx={{
            animation: shake
              ? "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
              : "",
          }}
        />
      </div>
    </Box>
  ) : courseReviews.length > 0 || instructorReviews.length > 0 ? (
    <Grid container justifyContent="center" alignItems="center" spacing={3}>
      <Grid item>
        <Divider>
          <Chip
            label="Pending Course Reviews"
            variant="h5"
            sx={{ fontSize: "30px" }}
          />
        </Divider>
      </Grid>

      <Grid container item spacing={3}>
        {courseReviews.map((review, idx) => (
          <Grid item xs={12} sm={6} md={4} key={review._id}>
            <PendingReviewCard
              review={review}
              idx={idx}
              reviewType="course"
              onDelete={() => handleDelete(idx, "course")}
              isAdmin={true}
            />
          </Grid>
        ))}
      </Grid>

      <Grid item>
        <Divider>
          <Chip
            label="Pending Instructor Reviews"
            variant="h5"
            sx={{ fontSize: "30px" }}
          />
        </Divider>
      </Grid>

      <Grid container item spacing={3}>
        {instructorReviews.map((review, idx) => (
          <Grid item xs={12} sm={6} md={4} key={review._id}>
            <PendingReviewCard
              review={review}
              idx={idx}
              reviewType="instructor"
              onDelete={() => handleDelete(idx, "instructor")}
              isAdmin={true}
            />
          </Grid>
        ))}
      </Grid>

      <Grid item xs={12}>
        <HomeButton />
      </Grid>
    </Grid>
  ) : (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert icon={<TagFaces />} severity="success">
          No pending review!
        </Alert>
      </Grid>

      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12}>
            <HomeButton />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Admin;
