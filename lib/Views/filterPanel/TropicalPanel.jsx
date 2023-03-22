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

  console.log(props.data.data.pulldown_data);

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
            <MenuItem value={0}>Alpha</MenuItem>
            <MenuItem value={1}>Beta</MenuItem>
            <MenuItem value={3}>Carol</MenuItem>
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
            <MenuItem value={0}>1</MenuItem>
            <MenuItem value={1}>2</MenuItem>
            <MenuItem value={2}>3</MenuItem>
            <MenuItem value={3}>4</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <CommonPanel />
    </FormControl>
  );
}
