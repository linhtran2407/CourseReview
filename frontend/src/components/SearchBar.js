import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";

const backendPrefix = "http://localhost:8000/api/v1";

function SearchBar() {
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    const res = await axios.get(`${backendPrefix}/data/courseAndInstructor`);

    if (res.status !== 200 || !res.data) {
      console.error("error fetching data: courseAndInstructor");
      return;
    }
    const responseData = res.data;
    setData(responseData);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <h1>BiCo Course Review</h1>
    <div>
      <Autocomplete
        id="course-search"
        freeSolo
        options={data}
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
            label="Search for course or instructor"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
        sx={{ width: "500px" }}
      />

      <Link to="/search-review">
        <Button variant="contained" color="secondary">
          Search for Review
        </Button>
      </Link>

      </div>

    </>
  );
}

export default SearchBar;
