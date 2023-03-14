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
import PropTypes from "prop-types";
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

const courseReviewColsDef = [
  {
    id: "instructor",
    name: "Instructor",
    minWidth: 170,
    format: (name, email) => `${name} - ${email}`,
  },
  { id: "courseQuality", name: "Course Quality" },
  { id: "instructorQuality", name: "Instructor Quality" },
  { id: "difficulty", name: "Difficulty" },
  { id: "workRequired", name: "Work Required" },
  { id: "amountLearned", name: "Amount Learned" },
  { id: "recMajor", name: "Rec. for Major" },
  { id: "recMinor", name: "Rec. for Minor" },
];

function createData(
  instructorNameEmail,
  courseQuality,
  instructorQuality,
  difficulty,
  workRequired,
  amountLearned,
  recMajor,
  recMinor,
  breakdown
) {
  return {
    instructorNameEmail,
    courseQuality,
    instructorQuality,
    difficulty,
    workRequired,
    amountLearned,
    recMajor,
    recMinor,
    breakdown, // each is a review
  };
}

function Row(props) {
  const { row } = props;
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
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.breakdown.map((historyRow) => (
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
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    courseQuality: PropTypes.number.isRequired,
    instr: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

function Review() {
  const location = useLocation();
  const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;
  const [reviews, setReviews] = React.useState([]);
  const selectedOption = location.state;

  const fetchReviews = async () => {
    const res =
      selectedOption.type === "course"
        ? await axios.get(
            `${backendPrefix}/data/review_course/${selectedOption.number}`
          )
        : await axios.get(
            `${backendPrefix}/data/review_instructor/${selectedOption.email}`
          );
    console.log(`${backendPrefix}/data/review_course/${selectedOption.number}`);
    if (res.status !== 200 || !res.data) {
      console.error("error fetching reviews");
      return;
    }

    setReviews(res.data);
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <h1>BiCo Course Review</h1>
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
        <Typography gutterBottom variant="body1">
          There is no review currently. Feel free to contribute one :-{`)`}
        </Typography>
      ) : (
        Object.keys(reviews).map((sem) => (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                    <TableCell> </TableCell>
                    {courseReviewColsDef.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ top: 57, minWidth: column.minWidth }}
                      >
                        {column.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* for each  instructor -> a collapsible row */}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))
      )}
    </>
  );
}

export default Review;
