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

export default function SynopticPanel(props) {
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState("");
  const [grid, setGrid] = React.useState("");
  const [instance, setInstance] = React.useState("");

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCycleChange = (event) => {
    setCycle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_types=${grid}&cycles=${cycle}&instance_names=${instance}&run_date=${date}`
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <form onSubmit={handleSubmit}>
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
              {props.data.data.pulldown_data.cycles &&
                props.data.data.pulldown_data.cycles.map((cycle) => {
                  if (cycle == "") {
                    return <MenuItem value={cycle}>NULL</MenuItem>;
                  }
                  return <MenuItem value={cycle}>{cycle}</MenuItem>;
                })}
            </Select>
          </FormControl>
        </Box>
        <CommonPanel
          grid={grid}
          instance={instance}
          setInstance={setInstance}
          setGrid={setGrid}
          data={props.data.data.pulldown_data}
        />
      </FormControl>
      <input type="submit" value="Submit"></input>
    </form>
  );
}
