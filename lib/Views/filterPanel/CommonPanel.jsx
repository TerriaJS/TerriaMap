import React, { useState, useEffect } from "react";

// import { getSynopticCatalog } from "../../utils/webServices";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function CommonPanel(props) {
  // const [grid, setGrid] = React.useState("");
  // const [instance, setInstance] = React.useState("");
  const [checked, setChecked] = React.useState([0]);

  // useEffect(() => {
  //   // Call for synoptic
  //   getSynopticCatalog()
  // });

  const handleGridChange = (event) => {
    props.setGrid(event.target.value);
  };

  const handleInstanceChange = (event) => {
    props.setInstance(event.target.value);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <div>
      <form>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label1">Grid</InputLabel>
          <Select
            labelId="demo-simple-select-label2"
            id="demo-simple-select"
            value={props.grid}
            label="Grid"
            onChange={handleGridChange}
          >
            {props.data.grid_types &&
              props.data.grid_types.map((grid) => {
                if (grid == "") {
                  return <MenuItem value={grid}>NULL</MenuItem>;
                }
                return <MenuItem value={grid}>{grid}</MenuItem>;
              })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label3">Instance</InputLabel>
          <Select
            labelId="demo-simple-select-label4"
            id="demo-simple-select2"
            value={props.instance}
            label="Instance"
            onChange={handleInstanceChange}
          >
            {props.data.instance_names &&
              props.data.instance_names.map((name) => {
                if (name == "") {
                  return <MenuItem value={name}>NULL</MenuItem>;
                }
                return <MenuItem value={name}>{name}</MenuItem>;
              })}
          </Select>
        </FormControl>
      </form>
    </div>
  );
}
