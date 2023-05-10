import { Box } from "@mui/material";
import React from "react";
import { LineGraph } from "../../../graph";

export const GraphTab = ({ activatedLayer }) => {
  return (
    <Box sx={{ height: "294px" }}>
      <LineGraph activatedLayer={activatedLayer} height="294px" />
    </Box>
  );
};
