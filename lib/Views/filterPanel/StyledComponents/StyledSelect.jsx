import React from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export default function StyledSelect(props) {
  return (
    <>
      <InputLabel
        sx={{
          color: "#fff"
        }}
        id={props.name}
      >
        {props.name}
      </InputLabel>
      <Select
        labelId={props.name}
        id={props.name + "1"}
        value={props.value}
        label={props.name}
        onChange={props.onChange}
        sx={{
          "&:hover": {
            "&& fieldset": {
              border: "3px solid #1a76d2"
            }
          },
          color: "#fff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff"
          },
          "& .MuiSvgIcon-root": {
            color: "#fff"
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "#fff",
              "& .MuiMenuItem-root": {
                padding: 2
              }
            }
          }
        }}
      >
        {props.children}
      </Select>
    </>
  );
}
