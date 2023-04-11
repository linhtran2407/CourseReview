import React from "react";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import AddReviewPrompt from "./AddReviewPrompt";
import { instructorMetrics } from "./ReviewMetrics";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentVerySatisfiedRoundedIcon from "@mui/icons-material/SentimentVerySatisfiedRounded";
import { instructorMetricIcon, getInstructorMetricColor } from "./Formartter";

export default function InstructorReview({ reviews }) {
  const ReviewPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: "#f7f8fa",
    ...theme.typography.body2,
    padding: theme.spacing(1),
  }));

  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
      color: theme.palette.action.disabled,
    },
  }));

  const overallIcon = {
    1: {
      icon: (
        <SentimentVeryDissatisfiedRoundedIcon fontSize="large" color="error" />
      ),
    },
    2: {
      icon: <SentimentDissatisfiedRoundedIcon fontSize="large" color="error" />,
    },
    3: {
      icon: <SentimentSatisfiedRoundedIcon fontSize="large" color="warning" />,
    },
    4: {
      icon: (
        <SentimentSatisfiedAltRoundedIcon fontSize="large" color="success" />
      ),
    },
    5: {
      icon: (
        <SentimentVerySatisfiedRoundedIcon fontSize="large" color="success" />
      ),
    },
  };
  function OverallIconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{overallIcon[value].icon}</span>;
  }

  OverallIconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

  const getSelectedInstructorMetrics = (review) => {
    const metrics = [];
    Object.keys(instructorMetrics).forEach((key) => {
      for (let metric of instructorMetrics[key]) {
        if (review[metric.id] && review[metric.id] === true) {
          const metricIcon = instructorMetricIcon[metric.id];
          metrics.push({
            name: metric.name,
            iconComponent: metricIcon,
            color: getInstructorMetricColor(metric.id),
          });
        }
      }
    });

    return metrics;
  };

  return reviews && reviews.reviews && reviews.reviews.length > 0 ? (
    <>
      <Typography variant="body" sx={{ fontStyle: "italic" }}>
        {" "}
        Department: {reviews.reviews[0]["department"]}{" "}
      </Typography>
      <Grid sx={{ marginTop: 0.2 }} container alignItems="center" spacing={3}>
        <Grid item>
          <Typography variant="body"> Average Rating: </Typography>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 75,
              height: 75,
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main",
                opacity: [0.9, 0.8, 0.7],
              },
              color: "white",
              fontSize: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "20px",
              border: "2px solid",
            }}
          >
            {reviews.avgOverallRating.toFixed(1)}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 2, width: "100%" }}>
        <Stack spacing={5}>
          {reviews.reviews.map((review) => {
            return (
              <ReviewPaper>
                <>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                      {getSelectedInstructorMetrics(review).map((metric) => {
                        const color = metric.color;
                        return (
                          <Chip
                            icon={React.createElement(metric.iconComponent)}
                            sx={{
                              marginRight: "5px",
                              backgroundColor: color,
                              marginBottom: "7px",
                            }}
                            key={metric.name}
                            label={metric.name}
                          />
                        );
                      })}
                    </Grid>

                    <Grid container alignItems="center" item sx={12}>
                      <Grid item sx={{ fontWeight: "bold" }} xs={1}>
                        Overall Rating:{" "}
                      </Grid>
                      <Grid item>
                        <StyledRating
                          readOnly
                          name="styled-rating"
                          defaultValue={review.overallRating}
                          IconContainerComponent={OverallIconContainer}
                          getLabelText={(value) => overallIcon[value].label}
                          highlightSelectedOnly
                        />
                      </Grid>
                    </Grid>

                    <Grid container={"true"} item sx={12}>
                      <Grid item sx={{ fontWeight: "bold" }} xs={1}>
                        Comment:{" "}
                      </Grid>
                      <Grid item>{review.comment}</Grid>
                    </Grid>

                    <Grid item sx={{ fontWeight: "bold" }}>
                      Courses taken:{" "}
                    </Grid>
                    <Grid item>
                      {review.coursesTaken.map((course) => {
                        return (
                          <Chip
                            sx={{ marginRight: "5px" }}
                            key={course}
                            label={course}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </>
              </ReviewPaper>
            );
          })}
        </Stack>
      </Box>
    </>
  ) : (
    <AddReviewPrompt />
  );
}
