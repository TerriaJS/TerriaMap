import * as React from "react";
import { useState, useContext } from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import { MarkAsUnreadOutlined } from "@mui/icons-material";

function valuetext(value) {
  return `${value}°C`;
}

const minDistance = 0.0;
// Brian states that the following ranges are good for min/max defaults values:
// maxele = 0 to 10
// maxwvel = 0 to 70
// swan = 0 to 20
const MAXELE_RANGE_MAX = 10;
const MAXWVEL_RANGE_MAX = 100;
const SWAN_RANGE_MAX = 30;

export default function EditRange(props) {
  // The following ranges are tightly coupled to the respective styles
  // must be updated if the styles change on GeoServer
  // style names are: maxele_env_style_v2, maxwvel_env_style & swan_env_style

  // (style: maxele_env_style)
  //const maxele_range = [
  // 0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25,
  //3.5, 3.75, 4.0
  //];

  // new one requested by Brian (style: maxele_env_style_v2).
  const maxele_range = [
    0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0, 1.125, 1.25, 1.375,
    1.5, 1.625, 1.75, 1.875, 2.0
  ];

  const maxwvel_range = [
    0.0, 3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0, 24.0, 27.0, 30.0, 33.0, 36.0,
    39.0, 42.0, 45.0, 48.0, 51.0, 54.0, 57.0, 60.0
  ];

  const swan_range = [
    0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0,
    14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0
  ];

  // collect all relevent range info
  let range_list = [];
  let default_max = 0;
  let max_range = 0;
  let range_step = 0;
  let marks = [];
  let layer_id = props.item.uniqueId;
  if (layer_id.includes("maxwvel")) {
    range_list = maxwvel_range;
    max_range = MAXWVEL_RANGE_MAX;
    default_max = maxwvel_range.slice(-1)[0];
    range_step = maxwvel_range[1] - maxwvel_range[0];
    let label3 = default_max + " m/s";
    let label4 = max_range + " m/s";
    marks = [
      { value: 0, label: "0 m/s" },
      { value: 0, label: "0 m/s" },
      { value: default_max, label: label3 },
      { value: max_range, label: label4 }
    ];
  } else if (layer_id.includes("swan")) {
    range_list = swan_range;
    max_range = SWAN_RANGE_MAX;
    default_max = swan_range.slice(-1)[0];
    range_step = swan_range[1] - swan_range[0];
    let label3 = default_max + " m";
    let label4 = max_range + " m";
    marks = [
      { value: 0, label: "0 m" },
      { value: 0, label: "0 m" },
      { value: default_max, label: label3 },
      { value: max_range, label: label4 }
    ];
  } else {
    range_list = maxele_range;
    max_range = MAXELE_RANGE_MAX;
    default_max = maxele_range.slice(-1)[0];
    range_step = maxele_range[1] - maxele_range[0];
    let label3 = default_max + " m";
    let label4 = max_range + " m";
    marks = [
      { value: 0, label: "0 m" },
      { value: 0, label: "0 m" },
      { value: default_max, label: label3 },
      { value: max_range, label: label4 }
    ];
  }

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

  const handleChange = (event, newValue, activeThumb) => {
    console.log(newValue);
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], max_range - minDistance);
        props.setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        props.setValue2([clamped - minDistance, clamped]);
      }
    } else {
      props.setValue2(newValue);
    }
  };

  const handleChangeCommit = (event, newValue, activeThumb) => {
    let new_range = scale_list(range_list, newValue[0], newValue[1]);
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
          value={props.value2}
          min={0.0}
          step={range_step}
          max={max_range}
          marks={marks}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommit}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
        />
      </Box>
    </p>
  );
}
