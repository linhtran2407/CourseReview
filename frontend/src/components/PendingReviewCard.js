import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import axios from "axios";
import {
  shortToLongSemester,
  fullCourseName,
  showStatus,
  instructorNameEmail,
} from "./Formartter";
import {
  courseMetrics,
  instructorReviewFormFields,
  instructorMetrics,
} from "./ReviewMetrics";

function PendingReviewCard({ review, reviewType, idx, onDelete, isAdmin }) {
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;

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
      `${backendPrefix}/admin/approve/${reviewType}/${review._id}`
    );

    if (res.status !== 200 || !res.data) {
      console.error(`error approving ${reviewType} review`);
      return;
    }

    onDelete();
  };

  const handleDisApprove = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      `${backendPrefix}/admin/disapprove/${reviewType}/${review._id}`
    );

    if (res.status !== 200 || !res.data) {
      console.error(`error disapproving ${reviewType} review`);
      return;
    }

    onDelete();
  };

  const formatCoursesTaken = (courses) => {
    return courses.join(", ");
  };

  return (
    <Card
      sx={{ maxWidth: 500, backgroundColor: `${colors[idx % colors.length]}` }}
    >
      {reviewType === "course" ? (
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {fullCourseName(review.courseTitle, review.courseNumber, "B")}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {shortToLongSemester(review.semester)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {instructorNameEmail(review.instructorName, review.instructorEmail)}
          </Typography>

          {courseMetrics.map((metric) => (
            <Typography variant="body2" color="text.secondary">
              {metric.name}: {review[metric.id]}
            </Typography>
          ))}

          <Typography variant="body2" color="text.secondary">
            Comment: {review.comment}
          </Typography>
          {isAdmin ? (
            <Typography variant="body2" color="text.secondary">
              Status: {showStatus(review.status)}
            </Typography>
          ) : null}
        </CardContent>
      ) : (
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {instructorNameEmail(review.name, review.email)}
          </Typography>

          <Typography gutterBottom variant="body2" color="text.secondary">
            Courses taken: {formatCoursesTaken(review.coursesTaken)}
          </Typography>

          {instructorReviewFormFields.map((metric) => (
            <Typography variant="body2" color="text.secondary">
              {metric.name}: {review[metric.id]}
            </Typography>
          ))}

          {Object.keys(instructorMetrics).map((key) => {
            const metrics = instructorMetrics[key];
            return metrics.map((metric) => {
              return review[metric.id] ? (
                <Typography variant="body2" color="text.secondary">
                  {metric.name}
                </Typography>
              ) : null;
            });
          })}

          {isAdmin ? (
            <Typography variant="body2" color="text.secondary">
              Status: {showStatus(review.status)}
            </Typography>
          ) : null}
        </CardContent>
      )}

      {isAdmin ? (
        <CardActions>
          <Tooltip title="Approve">
            <IconButton onClick={handleApprove}>
              <ThumbUp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Disapprove">
            <IconButton onClick={handleDisApprove}>
              <ThumbDown />
            </IconButton>
          </Tooltip>
        </CardActions>
      ) : null}
    </Card>
  );
}

export default PendingReviewCard;
