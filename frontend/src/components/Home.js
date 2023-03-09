import * as React from "react";
import Button from "@mui/material/Button";
import { Link, Outlet } from "react-router-dom";

function Home() {
  return (
    <>
      <Outlet />

      <Link to="/review-course">
        <Button variant="contained" color="primary">
          Review a course
        </Button>
      </Link>

      <Link to="/review-instructor">
        <Button variant="contained" color="primary">
          Review an instructor
        </Button>
      </Link>
    </>
  );
}

export default Home;
