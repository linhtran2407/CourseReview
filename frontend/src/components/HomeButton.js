import { Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      endIcon={<Home />}
      onClick={() => navigate("/")}
    >
      Return Home
    </Button>
  );
}
