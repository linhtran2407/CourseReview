import React, { useState } from "react";
import { Box, TextField, Alert, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import CourseReviewCard from "./CourseReviewCard";
import { TagFaces } from "@mui/icons-material";

import HomeButton from "./HomeButton";

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

  const fetchCourseReviews = async () => {
    const res = await axios.get(`${backendPrefix}/admin/pendingReviews`);

    if (res.status !== 200 || !res.data) {
      console.error("error fetching pending course reviews");
      return;
    }
    const responseData = res.data;
    setCourseReviews(responseData);
  };

  React.useEffect(() => {
    fetchCourseReviews();
  }, []);

  const handleDelete = (idx) => {
    // Delete the element at the given index
    setCourseReviews((prevReviews) => {
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
  ) : courseReviews.length > 0 ? (
    <Grid container justify="center" alignItems="center" spacing={3}>
      {courseReviews.map((review, idx) => (
        <Grid item xs={12} sm={6} md={4} key={review._id}>
          <CourseReviewCard
            review={review}
            idx={idx}
            onDelete={() => handleDelete(idx)}
            isAdmin={true}
          />
        </Grid>
      ))}
       <Grid item xs={12}>
            <HomeButton/>
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
          <HomeButton/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Admin;
