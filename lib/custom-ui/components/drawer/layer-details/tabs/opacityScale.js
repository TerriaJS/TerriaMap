import * as React from "react";
import Slider from "@mui/material/Slider";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";

function valueLabelFormat(value) {
  const units = ["%"];

  let unitIndex = 0;
  let scaledValue = value;

  while (scaledValue >= 100 && unitIndex < units.length - 1) {
    unitIndex += 1;
    scaledValue /= 100;
  }

  return `Opacity: ${scaledValue} ${units[unitIndex]}`;
}

export default function OpacityScale(props) {
  const [value, setValue] = React.useState(80);

  const handleChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }

    props.activatedLayer.setTrait(CommonStrata.user, "opacity", value / 100.0);
  };

  return (
    <Slider
      value={value}
      min={1}
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
