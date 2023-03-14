import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "@mui/icons-material";
import "../css/SearchBar.css";

const backendPrefix = process.env.REACT_APP_BACKEND_PREFIX;

function SearchBar() {
  const navigate = useNavigate();
  const [options, setOptions] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState([]);

  const fetchOptions = async () => {
    const res = await axios.get(`${backendPrefix}/data/courseAndInstructor`);

    if (res.status !== 200 || !res.data) {
      console.error("error fetching data: courseAndInstructor");
      return;
    }

    setOptions(res.data);
  };

  React.useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <>
      <h1>BiCo Course Review</h1>
      <div className="search">
        <Autocomplete
          id="course-search"
          freeSolo
          options={options}
          groupBy={(option) =>
            option.type === "instructor" ? "Instructors" : "Courses"
          }
          getOptionLabel={(option) =>
            option.type === "instructor"
              ? `${option.name} - ${option.email}`
              : `B${option.number} ${option.name}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter a course or instructor"
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
            />
          )}
          sx={{ width: "500px" }}
          onChange={(event, selectedOption) => setSelectedOption(selectedOption)
          }
        />

        <Button
          className="link-button"
          variant="outlined"
          startIcon={<Search />}
          onClick={selectedOption && selectedOption.name ? () => navigate("/search-review", { state: selectedOption }) : () => {}}
        >
          Search for Review
        </Button>
      </div>
    </>
  );
}

export default SearchBar;
