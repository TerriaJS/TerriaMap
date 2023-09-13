import * as React from "react";
import Slider from "@mui/material/Slider";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";

function valueLabelFormat(value) {
  return `Opacity: ${Math.floor(value)}%`;
}

export default function OpacityScale(props) {
  const [value, setValue] = React.useState(props.activatedLayer.opacity * 100);

  const handleChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
    props.activatedLayer.setTrait(CommonStrata.user, "opacity", value / 100.0);
  };

  return (
    <Slider
      value={props.activatedLayer.opacity * 100}
      min={0.0}
      step={1}
      max={100}
      valueLabelFormat={valueLabelFormat}
      onChange={handleChange}
      aria-label="Opacity"
      orientation="vertical"
      valueLabelDisplay="auto"
    />
  );
}
