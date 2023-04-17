import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

  return `${scaledValue} ${units[unitIndex]}`;
}

function calculateValue(value) {
  return value;
}

export default function NonLinearSlider(props) {
  const [value, setValue] = React.useState(80);

  const handleChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }

    props.data.setTrait(CommonStrata.user, "opacity", value / 100.0);
  };

  return (
    <Box sx={{ width: "95%" }}>
      <Typography
        color="#fff"
        variant="body2"
        id="non-linear-slider"
        gutterBottom
      >
        Opacity: {valueLabelFormat(calculateValue(value))}
      </Typography>
      <Slider
        value={value}
        min={1}
        step={1}
        max={100}
        scale={calculateValue}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        // valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      />
    </Box>
  );
}
