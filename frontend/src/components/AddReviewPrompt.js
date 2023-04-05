import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import "../css/Review.css";

export default function AddReviewPrompt() {
  return (
      <Grid item xs={12}>
        <Typography gutterBottom variant="body1">
          There is no review currently. Feel free to contribute one :-{`)`}
        </Typography>
      </Grid>
  );
}
