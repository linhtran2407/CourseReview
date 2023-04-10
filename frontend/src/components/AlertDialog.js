import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Button, Alert } from "@mui/material";

export default function AlertDialog({ open, handleClose }) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Alert
          open={open}
          onClose={handleClose}
          action={
            <Button color="inherit" size="small" onClick={handleClose}>
              CLOSE
            </Button>
          }
        >
          Thank you! Your review has been successfully submitted! Once the admin approves your review, you will be able to see it on our platform.
        </Alert>
      </Dialog>
    </div>
  );
}
