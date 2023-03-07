import React, { useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";

export default function CommonPanel() {
  const [grid, setGrid] = React.useState("");
  const [instance, setInstance] = React.useState("");
  const [checked, setChecked] = React.useState([0]);

  const handleGridChange = (event) => {
    setGrid(event.target.value);
  };

  const handleInstanceChange = (event) => {
    setInstance(event.target.value);
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
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label1">Grid</InputLabel>
        <Select
          labelId="demo-simple-select-label2"
          id="demo-simple-select"
          value={grid}
          label="Grid"
          onChange={handleGridChange}
        >
          <MenuItem value={0}>00</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label3">Instance</InputLabel>
        <Select
          labelId="demo-simple-select-label4"
          id="demo-simple-select2"
          value={instance}
          label="Instance"
          onChange={handleInstanceChange}
        >
          <MenuItem value={0}>sample instance</MenuItem>
        </Select>
      </FormControl>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {[0, 1, 2, 3].map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem
              key={value}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  <CommentIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                role={undefined}
                onClick={handleToggle(value)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`Layer item ${value + 1}`}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
