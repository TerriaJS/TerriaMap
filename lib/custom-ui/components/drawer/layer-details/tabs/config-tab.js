import { Box, Slider, Stack } from "@mui/material";
import { useLayers } from "../../../../context";
import React from "react";

export const ConfigTab = () => {
  const { activeLayer, getLayerOpacity, setLayerOpacity } = useLayers();

  const handleChangeOpacity = (event, value) => {
    setLayerOpacity(activeLayer.id, value);
  };

  return (
    <Stack
      direction="row"
      alignItems="stretch"
      sx={{
        height: "100%",
        overflow: "hidden",
        ".main-content": {
          margin: 0,
          overflowY: "auto",
          flex: 1,
          p: 1
        },
        ".slider-container": {
          backgroundColor: "lightgrey",
          height: "100%",
          padding: "1rem 0"
        }
      }}
    >
      <Box className="main-content">
        <strong>configuration options</strong> <br />
        opacity control: --&gt; <br />
        color map adjustment: tbd <br />
        other: ? <br />
      </Box>
      <Box className="slider-container">
        <Slider
          aria-label="Opacity"
          orientation="vertical"
          step={0.01}
          min={0.0}
          max={1.0}
          valueLabelFormat={(x) => `Opacity: ${x}%`}
          valueLabelDisplay="auto"
          value={getLayerOpacity(activeLayer.id)}
          onChange={handleChangeOpacity}
        />
      </Box>
    </Stack>
  );
};
