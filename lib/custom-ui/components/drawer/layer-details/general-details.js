import { Box, Typography } from "@mui/material";
import { useLayers } from "../../../context";
import React from "react";

//

export const GeneralDetails = () => {
  const { layerSelection, visibleLayers } = useLayers();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }}
    >
      <Typography paragraph>
        selected layers: {Object.keys(layerSelection).length}
      </Typography>
      <Typography paragraph>visible layers: {visibleLayers.length}</Typography>
    </Box>
  );
};
