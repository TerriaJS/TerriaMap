import * as React from "react";
import { useState, useContext } from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

const minDistance = 0.25;

export default function EditRange(props) {
  const [value2, setValue2] = React.useState([0, 4]);

  // The following ranges are tightly coupled to the respective styles
  // must be updated if the styles change on GeoServer
  // style names are: maxele_env_style, maxwvel_env_style & swan_env_style
  const maxele_range = [
    0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25,
    3.5, 3.75, 4.0
  ];

  const maxwvel_range = [
    0.0, 3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0, 24.0, 27.0, 30.0, 33.0, 36.0,
    39.0, 42.0, 45.0, 48.0, 51.0, 54.0, 57.0, 60.0
  ];
  const swan_range = [
    0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0,
    14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0
  ];

  const scale_number = (unscaled, to_min, to_max, from_min, from_max) => {
    let scaled_num =
      ((to_max - to_min) * (unscaled - from_min)) / (from_max - from_min) +
      to_min;
    return scaled_num;
  };

  const scale_list = (l, minimum, maximum) => {
    let new_l = [];
    let to_min = parseFloat(minimum);
    let to_max = parseFloat(maximum);
    for (let i = 0; i < l.length; i++) {
      let num = scale_number(
        l[i],
        to_min,
        to_max,
        Math.min(...l).toFixed(2),
        Math.max(...l).toFixed(2)
      );
      new_l.push(num);
    }
    return new_l;
  };

  const build_params = (range) => {
    let param_str = "";
    let range_len = range.length;

    for (let i = 0; i < range_len; i++) {
      param_str +=
        "q" + (i + 1) + ":" + range[i] + ";" + "l" + (i + 1) + ":" + range[i];
      if (i + 1 < range_len) {
        param_str += ";";
      }
    }
    let params = { env: param_str };

    return params;
  };

  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    let new_range = scale_list(maxele_range, newValue[0], newValue[1]);

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 4 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue);
    }

    let params = build_params(new_range);

    // TODO: Probably need to update legend url here to make that refresh too
    // Maybe remove legend from member_def so, it is auto generated?
    props.item.setTrait("definition", "parameters", params);
  };

  return (
    <p>
      <h3>Change range of data in colormap</h3>
      <Box sx={{ width: 300, margin: "10px" }}>
        <Slider
          getAriaLabel={() => "Minimum distance shift"}
          value={value2}
          min={0.25}
          step={0.25}
          max={4}
          onChange={handleChange2}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
        />
      </Box>
    </p>
  );
}
