import React, { useState, useContext } from "react";

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
import { Context } from "../../context/context";

export default function SynopticPanel(props) {
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState("");
  const [grid, setGrid] = React.useState("");
  const [instance, setInstance] = React.useState("");
  const { layers, setLayerData } = useContext(Context);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCycleChange = (event) => {
    setCycle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_type=${grid}&cycle=${cycle}&instance_name=${instance}&run_date=${date}`
    );
    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_type=${grid}&cycle=${cycle}&instance_name=${instance}&run_date=${date}`
    )
      .then((response) => response.json())
      .then((data) => setLayerData(data));
  };
  console.log(layers);
  return (
    <>
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
                {props.data.data.cycles &&
                  props.data.data.cycles.map((cycle) => {
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
            data={props.data.data}
          />
        </FormControl>
        <input type="submit" value="Submit"></input>
      </form>
      {layers.catalog && (
        <div>
          {layers.catalog[0].members.map((layer) => {
            // console.log(layer)
            return <h3>{layer.name}</h3>;
          })}
        </div>
      )}
    </>
  );
}
