import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "@mui/icons-material";
import "../css/SearchBar.css";
import { InputAdornment } from "@mui/material";

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

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!selectedOption || !selectedOption.type) {
        navigate(`/error`)
      } else if (selectedOption.type === "course") {
        navigate(`/search-review/${selectedOption.type}/${selectedOption.number}`)
      } else {
        navigate(`/search-review/${selectedOption.type}/${selectedOption.email}`)
      }
    }
}

  return (
  
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
              label="Search for reviews of course or instructor"
              InputProps={{
                ...params.InputProps,
                type: "search",
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onKeyUp={handleKeyPress.bind(this)}
            />
          )}
          sx={{ width: "500px" }}
          onChange={(event, selectedOption) => setSelectedOption(selectedOption)
            
          }
        />

      </div>
    
  );
}

export default SearchBar;
