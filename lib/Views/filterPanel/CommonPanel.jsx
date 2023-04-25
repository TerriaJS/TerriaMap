import React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import StyledSelect from "./StyledComponents/StyledSelect";

export default function CommonPanel(props) {
  const handleGridChange = (event) => {
    props.setGrid(event.target.value);
  };

  const handleInstanceChange = (event) => {
    props.setInstance(event.target.value);
  };

  return (
    <form>
      <FormControl fullWidth sx={{ margin: "0 0 10px 0" }}>
        <StyledSelect
          onChange={handleGridChange}
          name={"Grid"}
          value={props.grid}
        >
          {props.data.grid_types &&
            props.data.grid_types.map((grid) => {
              if (grid == "") {
                return <MenuItem value={grid}>NULL</MenuItem>;
              }
              return <MenuItem value={grid}>{grid}</MenuItem>;
            })}
        </StyledSelect>
      </FormControl>
      <FormControl fullWidth sx={{ margin: "0 0 10px 0" }}>
        <StyledSelect
          value={props.instance}
          name={"Instance"}
          onChange={handleInstanceChange}
        >
          {props.data.instance_names &&
            props.data.instance_names.map((name) => {
              if (name == "") {
                return <MenuItem value={name}>NULL</MenuItem>;
              }
              return <MenuItem value={name}>{name}</MenuItem>;
            })}
        </StyledSelect>
      </FormControl>
    </form>
  );
}
