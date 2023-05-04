import React from "react";
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme
} from "@mui/material";
import {
  Storm as StormIcon,
  Thunderstorm as ThunderstormIcon
} from "@mui/icons-material";
import { useLayout } from "../layout";

export const LayerSelectionMenu = () => {
  const theme = useTheme();
  const { handleClickOpenDialog } = useLayout();

  const menuItems = [
    {
      id: "adcirc",
      label: "ADCIRC",
      icon: <StormIcon />
    },
    {
      id: "ec-flow",
      label: "EC-FLOW",
      icon: <ThunderstormIcon />
    }
  ];

  return (
    <Box
      sx={{
        height: 320,
        transform: "translateZ(0px)",
        flexGrow: 1,
        zIndex: 100,
        position: "fixed",
        left: theme.spacing(2),
        top: theme.spacing(2),
        ".MuiSpeedDialAction-fab svg": {
          pointerEvents: "none"
        }
      }}
    >
      <SpeedDial
        direction="down"
        ariaLabel="Layer Selection Menu"
        icon={<SpeedDialIcon />}
        sx={{ position: "absolute", top: 16, left: 16 }}
      >
        {menuItems.map((item) => (
          <SpeedDialAction
            key={item.label}
            onClick={handleClickOpenDialog}
            icon={item.icon}
            data-source={item.id}
            tooltipTitle={item.label}
            tooltipPlacement="right"
          />
        ))}
      </SpeedDial>
    </Box>
  );
};
