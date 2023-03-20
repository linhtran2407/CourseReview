import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import {
  fullCourseName,
  instructorNameEmail,
  shortToLongSemester,
} from "./Formartter";
import { TableBody } from "@mui/material";
import HomeButton from "./HomeButton";
import Grid from "@mui/material/Grid";
import SearchBar from "./SearchBar";
import { courseMetrics } from "./ReviewMetrics";
import "../css/Review.css";

function Review() {
  const location = useLocation();
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;
  const [reviews, setReviews] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState(location.state);
  const [clickedRow, setClickedRow] = React.useState(null);

  const fetchReviews = async (state) => {
    const res =
      state.type === "course"
        ? await axios.get(`${backendPrefix}/data/review_course/${state.number}`)
        : await axios.get(
            `${backendPrefix}/data/review_instructor/${state.email}`
          );

    if (res.status !== 200 || !res.data) {
      console.error("error fetching reviews");
      return;
    }

    setReviews(res.data);
  };

  React.useEffect(() => {
    fetchReviews(location.state);
  }, []);

  React.useEffect(() => {
    setClickedRow(null);
    setSelectedOption(location.state);
    fetchReviews(location.state);
  }, [location.state]);

  return (
    <>
      <SearchBar />

      {selectedOption.type === "course" ? (
        <Typography gutterBottom variant="h5">
          {" "}
          {fullCourseName(selectedOption.name, selectedOption.number, "B")}{" "}
        </Typography>
      ) : (
        <Typography gutterBottom variant="h5">
          {" "}
          {instructorNameEmail(selectedOption.name, selectedOption.email)}{" "}
        </Typography>
      )}

      {!reviews || !reviews["grouped"] || Object.keys(reviews["grouped"]).length === 0 ? (
        <Grid container justify="center" alignItems="center" spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="body1">
              There is no review currently. Feel free to contribute one :-{`)`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <HomeButton />
          </Grid>
        </Grid>
      ) : (
        <>
          <Box className="box">
            <Paper
              className="reviewTables"
              sx={{ width: "100%", overflow: "hidden" }}
            >
              <TableContainer>
                <Table stickyHeader sx={{ border: "2px solid whitesmoke" }}>
                  <TableHead sx={{ fontWeight: "bold", fontSize: "17px" }}>
                    Metric Averages
                  </TableHead>
                  <TableRow>
                    <TableCell align="center" className="reviewTableHeader">
                      Semester
                    </TableCell>
                    <TableCell
                      key="instructor"
                      align="center"
                      className="reviewTableHeader"
                      style={{ width: "20%" }}
                    >
                      Instructor
                    </TableCell>
                    {courseMetrics.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        className="reviewTableHeader"
                      >
                        {column.name}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableBody>
                    {Object.keys(reviews["averages"]).map((key) => {
                      const data = reviews["averages"][key];
                      console.log(data);

                      return (
                        <TableRow
                          onClick={() => {
                            setClickedRow(key);
                            console.log("fdhjksa");
                            // color to blue
                          }}
                          hover
                          selected={clickedRow === key}
                          sx={{ "& > *": { borderBottom: "unset" } }}
                        >
                          <TableCell>
                            {shortToLongSemester(data.semester)}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {instructorNameEmail(
                              data.instructorName,
                              data.instructorEmail
                            )}
                          </TableCell>

                          {courseMetrics.map((metric) => (
                            <TableCell align="center">
                              {" "}
                              {data[metric.id]}{" "}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {clickedRow ? (
              <Paper className="detailTable">
                <TableContainer>
                  <Table stickyHeader sx={{ border: "2px solid whitesmoke" }}>
                    <TableHead sx={{ fontWeight: "bold", fontSize: "17px" }}>
                      Individual Reviews
                    </TableHead>

                    <TableRow>
                      <TableCell
                        align="center"
                        className="reviewTableHeader"
                        style={{ width: "1px" }}
                      >
                        No.
                      </TableCell>
                      {courseMetrics.map((column) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          className="reviewTableHeader"
                        >
                          {column.name}
                        </TableCell>
                      ))}
                      <TableCell
                        align="center"
                        style={{ width: "30%" }}
                        className="reviewTableHeader"
                      >
                        Additional Comment
                      </TableCell>
                    </TableRow>

                    <TableBody>
                      {reviews["grouped"][clickedRow] && reviews["grouped"][clickedRow].map((review, idx) => {
                        return (
                          <TableRow
                            hover
                            sx={{ "& > *": { borderBottom: "unset" } }}
                          >
                            <TableCell align="center">{idx + 1}.</TableCell>

                            {courseMetrics.map((metric) => (
                              <TableCell align="center">
                                {" "}
                                {review[metric.id]}{" "}
                              </TableCell>
                            ))}

                            <TableCell align="center">
                              {review["comment"]}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ) : null}
          </Box>

          <HomeButton />
        </>
      )}
    </>
  );
}

export default Review;
