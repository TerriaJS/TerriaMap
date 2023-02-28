import React, { useState } from "react";

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
/*import PropTypes from "prop-types";
import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";
import DatePicker from "react-datepicker";*/


export default function AdcircFilterForm() {
  const [textValue, setTextValue] = useState<string>("");

  /*const onTextChange = (e: any) => setTextValue(e.target.value);
  const handleSubmit = () => console.log(textValue);
  const handleReset = () => setTextValue("");
*/
  return (
    <FormControl>
    <FormLabel id="demo-radio-buttons-group-label">Run Type</FormLabel>
    <RadioGroup
      aria-labelledby="demo-radio-buttons-group-label"
      defaultValue="female"
      name="radio-buttons-group"
    >
      <FormControlLabel value="Synoptic" control={<Radio />} label="Synoptic" />
      <FormControlLabel value="Tropical" control={<Radio />} label="Tropical" />
    </RadioGroup>
  </FormControl>
  );
}
