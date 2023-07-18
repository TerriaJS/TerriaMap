import { Box, Typography } from "@mui/material";
import React from "react";
import { useLayers } from "../../../context";

export const GeneralDetails = () => {
  const { webMapCatalogItems } = useLayers();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        color: "white"
      }}
    >
      <Typography paragraph>
        selected layers: {webMapCatalogItems.length}
      </Typography>
    </Box>
  );
};
