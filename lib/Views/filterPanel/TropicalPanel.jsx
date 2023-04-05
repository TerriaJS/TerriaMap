import React, { useState, useContext } from "react";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CheckBox from "@mui/material/Checkbox";
import CommonPanel from "./CommonPanel";
import { Context } from "../../context/context";

export default function TropicalPanel(props) {
  const [name, setName] = React.useState("");
  const [advisory, setAdvisory] = React.useState("");
  const [grid, setGrid] = React.useState("");
  const [instance, setInstance] = React.useState("");
  const { layers, setLayerData } = useContext(Context);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAdvisoryChange = (event) => {
    setAdvisory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=tropical&grid_type=${grid}&advisory=${advisory}&instance_name=${instance}&storm_name=${name}`
    )
      .then((response) => response.json())
      .then((data) => setLayerData(data));
  };
  console.log(layers);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ margin: 2 }}>
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Storm Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={name}
                label="Storm Name"
                onChange={handleNameChange}
              >
                {props.data.data.storm_names &&
                  props.data.data.storm_names.map((storm) => {
                    if (storm == "") {
                      return <MenuItem value={storm}>NULL</MenuItem>;
                    }
                    return <MenuItem value={storm}>{storm}</MenuItem>;
                  })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Advisory</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={advisory}
                label="Advisory"
                onChange={handleAdvisoryChange}
              >
                {props.data.data.advisory_numbers &&
                  props.data.data.advisory_numbers.map((advisory) => {
                    if (advisory == "") {
                      return <MenuItem value={advisory}>NULL</MenuItem>;
                    }
                    return <MenuItem value={advisory}>{advisory}</MenuItem>;
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
          {layers.catalog.map((catalog) => {
            return (
              <div key={catalog.id} style={{ margin: 14 }}>
                <p style={{ fontWeight: "bold", fontSize: 20 }}>{catalog.id}</p>
                {catalog.members.map((member, index) => {
                  return (
                    <div>
                      <FormControl>
                        <FormControlLabel
                          control={<CheckBox size="small" />}
                          label={member.name}
                        />
                      </FormControl>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
