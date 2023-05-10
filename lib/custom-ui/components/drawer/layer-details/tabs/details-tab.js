import { Box } from "@mui/material";
import React from "react";
import Description from "terriajs/lib/ReactViews/Preview/Description";

//

export const DetailsTab = ({ activatedLayer }) => {
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
      <div style={{ width: "800px" }}>
        <Description item={activatedLayer} />
      </div>
    </Box>
  );
};
