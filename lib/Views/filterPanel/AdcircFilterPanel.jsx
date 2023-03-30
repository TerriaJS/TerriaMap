import React from "react";
import { Get } from "react-axios";
import { useState, useContext } from "react";
import { Context } from "../../context/context";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Radio } from "@mui/material";
import SynopticPanel from "./SynopticPanel";
import TropicalPanel from "./TropicalPanel";

export default function AdcircFilterForm() {
  const { layers, setLayerData } = useContext(Context);
  const [panel, setPanel] = useState("synoptic");

  // console.log(layers);

  return (
    <>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          ADCIRC Run Type
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="Synoptic"
          name="radio-buttons-group"
        >
          <FormControlLabel
            value="Synoptic"
            control={<Radio onChange={() => setPanel("synoptic")} />}
            label="Synoptic"
          />
          <FormControlLabel
            value="Tropical"
            control={<Radio onChange={() => setPanel("tropical")} />}
            label="Tropical"
          />
        </RadioGroup>
      </FormControl>
      <Get
        url="https://apsviz-ui-data-dev.apps.renci.org/get_pulldown_data"
        params={{ met_class: panel }}
      >
        {(error, response, isLoading, makeRequest, axios) => {
          if (error) {
            return <div>Something bad happened</div>;
          } else if (isLoading) {
            return <div>Loading...</div>;
          } else if (response !== null) {
            // setLayerData(response);
            console.log(response);
            return (
              <div>
                {panel === "synoptic" ? (
                  <SynopticPanel data={response} />
                ) : (
                  <TropicalPanel data={response} />
                )}
              </div>
            );
          }
          return <div>Default message before request is made.</div>;
        }}
      </Get>
    </>
  );
}
