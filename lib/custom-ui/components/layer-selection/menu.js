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

export const LayerSelectionMenu = ({ viewState }) => {
  const theme = useTheme();
  const { handleClickOpenDialog } = useLayout();

  const menuItems = [
    {
      id: "adcirc",
      label: "ADCIRC",
      icon: <StormIcon />
    }
    // },
    // {
    //   id: "hurricane",
    //   label: "Hurricane Layers",
    //   icon: <ThunderstormIcon />
    // }
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
      <img src="images/aps-logo.png" height="50" />
      <SpeedDial
        direction="down"
        ariaLabel="Layer Selection Menu"
        icon={
          <SpeedDialIcon
            sx={{
              background: "inherit",
              "&:hover": {
                background: "inherit"
              }
            }}
          />
        }
        sx={{
          position: "absolute",
          top: "60px",
          left: 0,
          button: {
            background: "#008da9",
            color: "white",
            "&:hover": {
              background: "#01667a"
            }
          }
        }}
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
