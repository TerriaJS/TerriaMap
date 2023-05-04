import { Box } from "@mui/material";
import { useLayers } from "../../../../context";
import React from "react";

//

export const DetailsTab = () => {
  const { activeLayer } = useLayers();

  return (
    <Box
      component="pre"
      sx={{
        margin: 0,
        overflowY: "scroll",
        flex: 1,
        p: 1,
        height: "100%"
      }}
    >
      {JSON.stringify(activeLayer, null, 2)}
    </Box>
  );
};
