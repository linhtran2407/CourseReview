import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

function Home() {
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/v1/courseAndInstructor"
    );

    if (res.status !== 200 || !res.data) {
      return;
    }
    const responseData = res.data;
    setData(responseData);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    console.log(data)
  }, [data]);

  return (
    <Autocomplete
      id="course-search"
      freeSolo
      options={data.map((option) => option.name ? option.name : "")}
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
    />
  );
}

export default Home;
