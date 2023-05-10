import { Box, Stack } from "@mui/material";
import ShortReport from "terriajs/lib/ReactViews/Workbench/Controls/ShortReport";
import Legend from "terriajs/lib/ReactViews/Workbench/Controls/Legend";
import EditRange from "./edit-range";
import OpacityScale from "./opacityScale";
import React from "react";

export const ConfigTab = ({ activatedLayer }) => {
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
          padding: "1rem 0"
        }
      }}
    >
      <Box className="main-content">
        <EditRange item={activatedLayer} />
      </Box>
      <Box className="slider-container">
        <OpacityScale activatedLayer={activatedLayer} />
      </Box>
    </Stack>
  );
};
