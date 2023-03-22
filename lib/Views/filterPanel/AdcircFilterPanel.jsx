import React, { useState } from "react";

import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Radio } from "@mui/material";
import SynopticPanel from "./SynopticPanel";
import TropicalPanel from "./TropicalPanel";

export default function AdcircFilterForm() {
  // const [textValue, setTextValue] = useState("");
  const [panel, setPanel] = useState("Synoptic");

  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">ADCIRC Run Type</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="Synoptic"
        name="radio-buttons-group"
      >
        <FormControlLabel
          value="Synoptic"
          control={<Radio onChange={() => setPanel("Synoptic")} />}
          label="Synoptic"
        />
        <FormControlLabel
          value="Tropical"
          control={<Radio onChange={() => setPanel("Tropical")} />}
          label="Tropical"
        />
      </RadioGroup>

      {panel === "Synoptic" ? <SynopticPanel /> : <TropicalPanel />}
    </FormControl>
  );
}
