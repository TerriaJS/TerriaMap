import { Box } from "@mui/material";
import { useLayers } from "../../../../context";
import React from "react";

//

export const DetailsTab = ({ activatedLayer }) => {
  // const { activeLayer } = useLayers();

  return (
    <Box
      component="pre"
      sx={{
        margin: 0,
        overflowY: "scroll",
        flex: 1,
        p: 1,
        height: "100%",
        maxWidth: "50%"
      }}
    >
      <div style={{ width: "600px" }}>
        {JSON.stringify(activatedLayer.infoAsObject, null, 2)}
      </div>
    </Box>
  );
};
