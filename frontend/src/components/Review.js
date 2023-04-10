import React from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {
  fullCourseName,
  instructorNameEmail,
} from "./Formartter";
import { HomeButton } from "./NavButton";
import SearchBar from "./SearchBar";
import "../css/Review.css";
import CourseReview from "./CourseReview";
import InstructorReview from "./InstructorReview";
import ErrorPage from "./ErrorPage";


/*
 * REVIEWS FOR A SPECIFIC COURSE/INSTRUCTOR
 */
function Review() {
  const location = useLocation();
  const { reviewType, reviewKey } = useParams();
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;
  const [name, setName] = React.useState();
  const [courseReviews, setCourseReviews] = React.useState([]);
  const [instructorReviews, setInstructorReviews] = React.useState([]);

  const fetchReviews = async () => {
    const res =
    reviewType === "course"
    ? await axios.get(`${backendPrefix}/data/review_course/${reviewKey}`)
    : await axios.get(
      `${backendPrefix}/data/review_instructor/${reviewKey}`
      );
      
      if (res.status !== 200 || !res.data) {
      console.error("error fetching reviews");
      return;
    }

    reviewType === "course"
      ? setCourseReviews(res.data)
      : setInstructorReviews(res.data);
  };

  const fetchName = async () => {
    const res = await axios.get(`${backendPrefix}/data/name/${reviewType}/${reviewKey}`);
    setName(res.data);
  }

  React.useEffect(() => {
    fetchReviews();
    fetchName();
  }, [location, []]);

  return (
    <>
      <div className="nav-bar">
        <SearchBar />
      </div>

      {reviewType === "course" ? (
        <div>
          <Typography className="title" gutterBottom variant="h5">
            {fullCourseName(name, reviewKey, "B")}{" "}
          </Typography>
          <CourseReview reviews={courseReviews} />
        </div>
      ) : reviewType === "instructor" ?(
        <div>
        <Typography className="title" gutterBottom variant="h5">
          {instructorNameEmail(name, reviewKey)}{" "}
        </Typography>
        <InstructorReview reviews={instructorReviews} />
        </div>  
      ) : <ErrorPage />}
      
      <div className="home-button">
        <HomeButton />
      </div>
    </>
  );
}

export default Review;
