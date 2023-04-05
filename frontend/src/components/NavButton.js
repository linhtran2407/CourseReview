import { Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from "react-router-dom";

export function HomeButton() {
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

export function AdminButton() {
  const navigate = useNavigate();

  return (
    <Button
      color="secondary"
      variant="contained"
      endIcon={<ManageAccountsIcon />}
      onClick={() => navigate("/admin")}
    >
      Admin
    </Button>
  );
}
