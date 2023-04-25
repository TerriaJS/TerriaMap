import React, { useState, useContext } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CheckBox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import CommonPanel from "./CommonPanel";
import { Context } from "../../context/context";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import StyledSelect from "./StyledComponents/StyledSelect";

export default function SynopticPanel(props) {
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState("");
  const [grid, setGrid] = React.useState("");
  const [instance, setInstance] = React.useState("");
  const { layers, setLayerData } = useContext(Context);
  const { selectedLayers, setSelectedLayers } = useContext(Context);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCycleChange = (event) => {
    setCycle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      `https://apsviz-ui-data-dev.apps.renci.org/get_ui_data?met_class=synoptic&grid_type=${grid}&cycle=${cycle}&instance_name=${instance}&run_date=${date}`
    )
      .then((response) => response.json())
      .then((data) => setLayerData(data));
  };

  const handleCheckboxChange = (event) => {
    props.view.terria.catalog.userAddedDataGroup.addMembersFromJson(
      CommonStrata.definition,
      layers.catalog
    );

    props.view.terria.catalog.group.memberModels[0].memberModels.map(
      (member, index) => {
        if (
          props.view.terria.catalog.group.memberModels[0].memberModels[index]
        ) {
          let selectedCatalogItem =
            props.view.terria.catalog.group.memberModels[0].memberModels[
              index
            ].memberModels.find((item) => item.uniqueId == event.target.id);
          setSelectedLayers([...selectedLayers, selectedCatalogItem]);
          props.view.terria.workbench.add(selectedCatalogItem);
        }
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ margin: "0 2px" }}>
        <div>
          <div style={{ marginBottom: "10px" }}></div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                color: "#fff"
              }}
              InputLabelProps={{
                style: { color: "#fff" }
              }}
              label="Run Date"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  InputLabelProps={{
                    style: { color: "#fff" }
                  }}
                  // disabled={disabled}
                  sx={{
                    input: { color: "#fff" },
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
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled": {
                      ":hover": {
                        border: "3px solid #fff !important",
                        boxShadow: "none"
                      }
                    }
                  }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
          <div style={{ marginBottom: "10px" }}></div>
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth sx={{ margin: "0 0 10px 0" }}>
              <InputLabel id="demo-simple-select-label">Cycle</InputLabel>
              <StyledSelect
                onChange={handleCycleChange}
                name={"Cycle"}
                value={cycle}
              >
                {props.data.data.cycles &&
                  props.data.data.cycles.map((cycle) => {
                    if (cycle == "") {
                      return <MenuItem value={cycle}>NULL</MenuItem>;
                    }
                    return <MenuItem value={cycle}>{cycle}</MenuItem>;
                  })}
              </StyledSelect>
            </FormControl>
          </Box>
          <CommonPanel
            grid={grid}
            instance={instance}
            setInstance={setInstance}
            setGrid={setGrid}
            data={props.data.data}
          />
        </div>
        <input
          style={{ margin: "0 11px 0 auto", display: "block" }}
          type="submit"
          value="Submit"
        ></input>
      </form>
      {layers.catalog && (
        <div>
          {layers.catalog.map((catalog) => {
            return (
              <div key={catalog.id} style={{ margin: 14 }}>
                <p style={{ fontWeight: "bold", fontSize: 20 }}>{catalog.id}</p>
                {catalog.members.map((member, index) => {
                  return (
                    <div style={{ l: 20 }}>
                      <FormControl>
                        <FormControlLabel
                          control={
                            <CheckBox
                              size={"small"}
                              id={member.id}
                              onChange={(e) => handleCheckboxChange(e)}
                            />
                          }
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
