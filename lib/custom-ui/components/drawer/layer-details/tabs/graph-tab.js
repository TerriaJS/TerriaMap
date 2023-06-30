import { Box } from "@mui/material";
import React from "react";
import { LineGraph } from "../../../graph";
import ChartPanel from "terriajs/lib/ReactViews/Custom/Chart/ChartPanel";

export const GraphTab = ({ activatedLayer, viewState, terria }) => {
  return (
    <Box sx={{ height: "294px" }}>
      <ChartPanel terria={terria} viewState={viewState} />
    </Box>
  );
};
