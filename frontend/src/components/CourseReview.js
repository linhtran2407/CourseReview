import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { shortToLongSemester, courseMetricIcon } from "./Formartter";
import { IconButton, TableBody, Tooltip, Typography } from "@mui/material";
import {
  courseMetrics,
  courseRequiredMetrics,
  courseExpandedMetrics,
} from "./ReviewMetrics";
import "../css/Review.css";
import { useLocation } from "react-router-dom";
import AddReviewPrompt from "./AddReviewPrompt";
import owl from "../images/owl.jpeg";
import PersonIcon from "@mui/icons-material/Person";
import DoubleArrowSharpIcon from "@mui/icons-material/DoubleArrowSharp";
import KeyboardDoubleArrowLeftSharpIcon from "@mui/icons-material/KeyboardDoubleArrowLeftSharp";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";

export default function CourseReview({ reviews }) {
  const [clickedRow, setClickedRow] = React.useState(null);
  const [expandTable, setExpandTable] = React.useState(false);
  const location = useLocation();
  React.useEffect(() => {
    setClickedRow(null);
  }, [location]);

  const StyledRating = styled(Rating)(({ theme, value }) => ({
    color: value > 3 ? theme.palette.success.main : value <= 2 ? theme.palette.error.light: theme.palette.warning,
  }));
  
  return reviews["grouped"] && Object.keys(reviews["grouped"]).length > 0 ? (
    <Box className="box">
      <Paper
        className="reviewTables"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <Chip className="chip-header" label="Review Averages" />
        <Button
          variant="contained"
          endIcon={
            expandTable ? (
              <KeyboardDoubleArrowLeftSharpIcon />
            ) : (
              <DoubleArrowSharpIcon />
            )
          }
          sx={{ float: "right", marginBottom: "8px" }}
          size="small"
          onClick={() => setExpandTable(!expandTable)}
        >
          {expandTable ? "Collapse" : "Expand"}
        </Button>
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
                style={{ width: "10%" }}
              >
                Instructor
              </TableCell>
              {courseRequiredMetrics.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  className="reviewTableHeader"
                >
                  {column.name}
                </TableCell>
              ))}
              {expandTable
                ? courseExpandedMetrics.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      className="reviewTableHeader"
                    >
                      {column.name}
                    </TableCell>
                  ))
                : null}
            </TableRow>

            <TableBody>
              {Object.keys(reviews["averages"]).map((key) => {
                const data = reviews["averages"][key];

                return (
                  <TableRow
                    onClick={() => {
                      if (clickedRow && clickedRow === key) {
                        setClickedRow(null);
                      } else {
                        setClickedRow(key);
                      }
                    }}
                    hover
                    selected={clickedRow === key}
                    sx={{ "& > *": { borderBottom: "unset" } }}
                  >
                    <TableCell align="center">
                      {shortToLongSemester(data.semester)}
                    </TableCell>
                    <Tooltip title={data.instructorEmail}>
                      <TableCell component="th" scope="row">
                        <IconButton>
                          <PersonIcon></PersonIcon>
                        </IconButton>
                        {data.instructorName}
                      </TableCell>
                    </Tooltip>
                    {courseRequiredMetrics.map((metric) => {
                          const icon = courseMetricIcon[metric.id][0];
                          const emptyIcon = courseMetricIcon[metric.id][1];
                          return (
                            <Tooltip title={data[metric.id]}>
                              <TableCell align="center">
                                <StyledRating
                                  readOnly
                                  value={data[metric.id]}
                                  precision={0.1}
                                  icon={React.createElement(icon)}
                                  emptyIcon={React.createElement(emptyIcon)}
                                />
                              </TableCell>
                            </Tooltip>
                          );
                        })}
                    {expandTable
                      ? courseExpandedMetrics.map((metric) => {
                          const icon = courseMetricIcon[metric.id][0];
                          const emptyIcon = courseMetricIcon[metric.id][1];
                          return (
                            <Tooltip title={data[metric.id]}>
                              <TableCell align="center">
                                <StyledRating
                                  readOnly
                                  value={data[metric.id]}
                                  precision={0.1}
                                  icon={React.createElement(icon)}
                                  emptyIcon={React.createElement(emptyIcon)}
                                />
                              </TableCell>
                            </Tooltip>
                          );
                        })
                      : null}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {clickedRow ? (
        <Paper className="detailTable">
          <Chip className="chip-header" label="Detailed Reviews" />

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
      ) : (
        <Paper className="detailTable">
          <img src={owl} className="owl" />
          <Typography
            sx={{
              color: "grey",
              display: "flex",
              justifyContent: "center",
              maxHeight: "300px",
              minHeight: "100px",
              alignItems: "center",
            }}
          >
            Select a row to see individual reviews of a specific course offering
          </Typography>
        </Paper>
      )}
    </Box>
  ) : (
    <AddReviewPrompt />
  );
}
