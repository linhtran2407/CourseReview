import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Delete, DoneAllRounded } from "@mui/icons-material";
import axios from "axios";

function CourseReview({ review, idx, onDelete, isAdmin }) {
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;
  function formatSemester(semester) {
    if (!semester) return "";
    const season = semester.startsWith("s") ? "Spring" : "Fall";
    const year = semester.slice(1);
    return `${season} 20${year}`;
  }

  function renderTitle(courseTitle, courseNumber, institution) {
    const institutionInitial = institution.slice(0, 1).toUpperCase();
    const title = `${institutionInitial}${courseNumber} - ${courseTitle}`;
    return title;
  }

  const colors = [
    "#FEE1E6",
    "#BDE0FE",
    "#E6F7F1",
    "#FFFBF2",
    "#E0FEFE",
    "#FFF0F3",
  ];

  const handleApprove = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      `${backendPrefix}/admin/approve/${review._id}`
    );

    if (res.status !== 200 || !res.data) {
      console.error("error approving course review");
      return;
    }

    onDelete();
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const res = await axios.post(`${backendPrefix}/admin/delete/${review._id}`);

    if (res.status !== 200 || !res.data) {
      console.error("error deleting course review");
      return;
    }

    onDelete();
  };

  return (
    <Card
      sx={{ maxWidth: 500, backgroundColor: `${colors[idx % colors.length]}` }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {renderTitle(review.courseTitle, review.courseNumber, "B")}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {formatSemester(review.semester)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Instructor: {review.instructorName} - {review.instructorEmail}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          review Quality: {review.courseQuality}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Instructor Quality: {review.instructorQuality}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Difficulty: {review.difficulty}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Work Required: {review.workRequired}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Amount Learned: {review.amountLearned}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rec for Major: {review.recMajor}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rec for Minor: {review.recMinor}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comment: {review.comment}
        </Typography>
      </CardContent>
      {isAdmin? <CardActions>
        <Tooltip title="Approve">
          <IconButton onClick={handleApprove}>
            <DoneAllRounded />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      </CardActions> : null}
    </Card>
  );
}

export default CourseReview;
