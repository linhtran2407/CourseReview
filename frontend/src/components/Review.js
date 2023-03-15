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
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  fullCourseName,
  instructorNameEmail,
  shortToLongSemester,
} from "./Formartter";
import { TableBody } from "@mui/material";
import HomeButton from "./HomeButton";
import Grid from "@mui/material/Grid";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { courseMetrics } from "./ReviewMetrics";

function Row(props) {
  const data = props.data;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          {instructorNameEmail(data.instructorName, data.instructorEmail)}
        </TableCell>

        {courseMetrics.map((metric) => (
          <TableCell align="center"> {data[metric.id]} </TableCell>
        ))}
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="body2"
                gutterBottom
                component="div"
                style={{ fontWeight: "bold" }}
              >
                Breakdown of individual reviews
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell> {/**cell left empty on purpose */}
                    <TableCell
                      style={{ top: 57, minWidth: 170 }}
                    ></TableCell>{" "} {/**cell left empty on purpose */}
                    {courseMetrics.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ top: 57 }}
                      >
                        {column.name}
                      </TableCell>
                    ))}
                    <TableCell
                    key={"comment"}
                    align="center"
                    style={{ top: 57 }}
                    >
                    Additional Comment
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* {row.breakdown.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Review() {
  const location = useLocation();
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;
  const [reviews, setReviews] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState(location.state);

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
    setSelectedOption(location.state);
    fetchReviews(location.state);
  }, [location.state]);

  const getAvgData = (array) => {
    for (let i = 0; i < array.length; i++) {
      const obj = array[i];
      if (obj.label === "avg") {
        return obj;
      }
    }
    return null;
  };

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

      {!reviews || Object.keys(reviews).length === 0 ? (
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
        <Grid container justify="center" alignItems="center" spacing={3}>
          <Grid item xs={12}>
            {Object.keys(reviews).map((sem) => (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          colSpan={9}
                          style={{ fontSize: "100%", fontWeight: "bold" }}
                        >
                          {shortToLongSemester(sem)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell></TableCell> {/* empty cell on purpose */}
                        <TableCell
                          key="instructor"
                          align="center"
                          style={{ top: 57, minWidth: 170 }}
                        >
                          Instructor
                        </TableCell>
                        {courseMetrics.map((column) => (
                          <TableCell
                            key={column.id}
                            align="center"
                            style={{ top: 57 }}
                          >
                            {column.name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {Object.keys(reviews[sem]).map((instructor) => (
                        <Row
                          data={getAvgData(reviews[sem][instructor])}
                          label="avg"
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))}
          </Grid>
          <Grid item xs={12}>
            <HomeButton />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Review;
