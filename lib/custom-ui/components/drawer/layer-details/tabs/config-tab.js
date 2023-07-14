import { Box, Stack } from "@mui/material";
import EditRange from "./edit-range";
import OpacityScale from "./opacityScale";
import React from "react";

export const ConfigTab = ({ activatedLayer }) => {
  const isObs = activatedLayer.uniqueId.endsWith("obs");
  return (
    <Stack
      direction="row"
      alignItems="stretch"
      sx={{
        height: "100%",
        overflow: "hidden",
        justifyContent: "space-between",
        color: "white",
        ".main-content": {
          margin: 0,
          overflowY: "auto",
          flex: 1,
          p: 1
        },
        ".slider-container": {
          backgroundColor: "lightgrey",
          padding: "1rem 0"
        }
      }}
    >
      {isObs ? (
        <h3> Edit colormap range not available for this layer type</h3>
      ) : (
        <Box className="main-content">
          <EditRange activatedLayer={activatedLayer} />
        </Box>
      )}
      <Box className="slider-container">
        <OpacityScale activatedLayer={activatedLayer} />
      </Box>
    </Stack>
  );
};
