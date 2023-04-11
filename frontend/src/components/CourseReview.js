import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import {
  instructorNameEmail,
  shortToLongSemester,
} from "./Formartter";
import { TableBody } from "@mui/material";
import { courseMetrics } from "./ReviewMetrics";
import "../css/Review.css";
import { useLocation } from "react-router-dom";
import AddReviewPrompt from "./AddReviewPrompt";

export default function CourseReview({reviews}) {
    const [clickedRow, setClickedRow] = React.useState(null);
    const location = useLocation();
    React.useEffect(() => {
        setClickedRow(null); 
      }, [location]);

  return (
    reviews["grouped"] && Object.keys(reviews["grouped"]).length > 0?
    <Box className="box">
      <Paper
        className="reviewTables"
        sx={{ width: "100%", overflow: "hidden" }}
      >
      <Chip
        className="chip-header"
        label="Review Averages"
      />
        <TableContainer>
          <Table stickyHeader sx={{ border: "2px solid whitesmoke" }}>
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

                return (
                  <TableRow
                    onClick={() => {
                      setClickedRow(key);
                    }}
                    hover
                    selected={clickedRow === key}
                    sx={{ "& > *": { borderBottom: "unset" } }}
                  >
                    <TableCell>{shortToLongSemester(data.semester)}</TableCell>
                    <TableCell component="th" scope="row">
                      {instructorNameEmail(
                        data.instructorName,
                        data.instructorEmail
                      )}
                    </TableCell>

                    {courseMetrics.map((metric) => (
                      <TableCell align="center" > {data[metric.id]} </TableCell>
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
          
          <Chip
            className="chip-header"
            label="Detailed Reviews"
          />
          
          <TableContainer>
            <Table stickyHeader sx={{ border: "2px solid whitesmoke" }}>
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
                  Comment
                </TableCell>
              </TableRow>

              <TableBody>
                {reviews["grouped"][clickedRow] &&
                  reviews["grouped"][clickedRow].map((review, idx) => {
                    return (
                      <TableRow
                        hover
                        sx={{ "& > *": { borderBottom: "unset" } }}
                      >
                        <TableCell align="center">{idx + 1}.</TableCell>

                        {courseMetrics.map((metric) => (
                          <TableCell align="center" style={{ fontSize: 16 }}>
                            {" "}
                            {review[metric.id]}{" "}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="comment">{review["comment"]}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : null}
      
    </Box> : <AddReviewPrompt />
  );
}
