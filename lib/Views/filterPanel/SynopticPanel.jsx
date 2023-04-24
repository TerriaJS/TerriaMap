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

export default function SynopticPanel(props) {
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState("");
  const [grid, setGrid] = React.useState("");
  const [instance, setInstance] = React.useState("");
  const { layers, setLayerData } = useContext(Context);
  const { selectedLayers, setSelectedLayers } = useContext(Context);

  // console.log(props.data);

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
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ margin: 2 }}>
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
