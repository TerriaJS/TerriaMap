import { useMemo } from "react";
import { Box } from "@mui/material";
import { useLayers } from "../../../../context";
import React from "react";
// import { LineGraph } from '../../../graph'

export const GraphTab = () => {
  const { activeLayer, activeLayerDatasets } = useLayers();

  const data = useMemo(() => {
    return activeLayerDatasets.map((index) => activeLayer.data[index]) || [];
  }, [activeLayer, activeLayerDatasets]);

  return (
    <Box sx={{ height: "294px" }}>
      {/* <LineGraph data={ data } height="294px" /> */}
    </Box>
  );
};
