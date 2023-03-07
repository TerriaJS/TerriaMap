import React, { useState } from "react";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CommonPanel from "./CommonPanel";

export default function SynopticPanel() {
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState("");

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCycleChange = (event) => {
    setCycle(event.target.value);
  };

  return (
    <FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Run Date"
          value={date}
          onChange={(newValue) => {
            setDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Cycle</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={cycle}
            label="Cycle"
            onChange={handleCycleChange}
          >
            <MenuItem value={0}>00</MenuItem>
            <MenuItem value={6}>06</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={18}>18</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <CommonPanel />
    </FormControl>
  );
}
