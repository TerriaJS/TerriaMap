import React, { useState } from "react";

import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CommonPanel from "./CommonPanel";

export default function TropicalPanel(props) {
  const [name, setName] = React.useState("");
  const [advisory, setAdvisory] = React.useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAdvisoryChange = (event) => {
    setAdvisory(event.target.value);
  };

  return (
    <FormControl>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Storm Name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={name}
            label="Storm Name"
            onChange={handleNameChange}
          >
            {props.data.data.pulldown_data.storm_names &&
              props.data.data.pulldown_data.storm_names.map((storm) => {
                if (storm == "") {
                  return <MenuItem value={storm}>NULL</MenuItem>;
                }
                return <MenuItem value={storm}>{storm}</MenuItem>;
              })}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Advisory</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={advisory}
            label="Advisory"
            onChange={handleAdvisoryChange}
          >
            {props.data.data.pulldown_data.advisory_numbers &&
              props.data.data.pulldown_data.advisory_numbers.map((advisory) => {
                if (advisory == "") {
                  return <MenuItem value={advisory}>NULL</MenuItem>;
                }
                return <MenuItem value={advisory}>{advisory}</MenuItem>;
              })}
          </Select>
        </FormControl>
      </Box>
      <CommonPanel data={props.data.data.pulldown_data} />
    </FormControl>
  );
}
