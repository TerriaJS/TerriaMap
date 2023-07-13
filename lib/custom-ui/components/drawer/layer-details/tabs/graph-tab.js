import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ChartPanel from "terriajs/lib/ReactViews/Custom/Chart/ChartPanel";

export const GraphTab = ({ viewState, terria }) => {
  useEffect(() => {
    console.log(terria);
  }, [terria]);
  return (
    <Box sx={{ height: "294px", overflow: "auto" }}>
      <ChartPanel terria={terria} viewState={viewState} />
    </Box>
  );
};
