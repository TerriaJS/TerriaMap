import { Box, Typography } from "@mui/material";
import React from "react";

export const GeneralDetails = ({ layers }) => {
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
      <Typography paragraph>selected layers: {layers.length}</Typography>
    </Box>
  );
};
