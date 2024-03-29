import * as React from "react";
import Button from "@mui/material/Button";
import { Link, Outlet } from "react-router-dom";
import { Class, LocalLibrary } from "@mui/icons-material";
import { Grid } from "@mui/material";
import SearchBar from "./SearchBar";
import Header from "./Header";
import { AdminButton } from "./NavButton";
import "../css/Home.css";

function Home() {
  return (
    <>
      <AdminButton className="admin_button" />
    <div className="container">
      <Header />
      <SearchBar />
      <Grid
        className="centered_button"
        container
        spacing={3}
        style={{ marginTop: "16px", flexGrow: 1 }}
      >
        <Grid item>
          <Link to="/review-course" className="review_button">
            <Button variant="contained" endIcon={<Class />}>
              Review a course
            </Button>
          </Link>
        </Grid>

        <Grid item>
          <Link to="/review-instructor" className="review_button">
            <Button variant="contained" endIcon={<LocalLibrary />}>
              Review an instructor
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
    </>
  );
}

export default Home;
