import React, { useEffect } from "react";
import {
  Box,
  Button,
  Drawer as MuiDrawer,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useLayout } from "../layout";
import { LayersList } from "./layers-list";
import { ActiveLayerDetails, GeneralDetails } from "./layer-details";
import { useLayers } from "../../context";
import { observer } from "mobx-react";

const TOGGLER_HEIGHT = "2rem";
const DRAWER_MAX_HEIGHT = "332px";

let Estg = observer(({ timer }) => (
  <span>Seconds passed: {timer.secondsPassed}</span>
));

export const Drawer = ({ viewState, terria }) => {
  const theme = useTheme();
  const { closeDrawer, drawerIsOpen, openDrawer } = useLayout();
  const { activatedLayer } = useLayers();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => {
    if (drawerIsOpen == true) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  return (
    <MuiDrawer
      anchor="bottom"
      variant="permanent"
      open={drawerIsOpen}
      // onClose={closeDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{
        background: "#585858",
        ".MuiBackdrop-root": {
          filter: "opacity(0.0)",
          pointerEvents: "none"
          // background: "#585858"
        },
        ".MuiDrawer-paper": {
          height: "100%",
          maxHeight: drawerIsOpen
            ? fullScreen
              ? "100%"
              : DRAWER_MAX_HEIGHT
            : TOGGLER_HEIGHT,
          transition: "max-height 250ms",
          // backgroundColor: "#585858",
          overflow: "hidden"
        },
        ".toggler": {
          position: "absolute",
          top: 0,
          zIndex: 99999,
          left: 0,
          borderRadius: 0,
          height: TOGGLER_HEIGHT,
          background: "#00424f",
          "&:hover": {
            background: "#022932"
          }
        },
        ".content": {
          height: "100%",
          paddingTop: TOGGLER_HEIGHT,
          flex: 1,
          background: "#585858",
          ".layers-list": {
            maxHeight: DRAWER_MAX_HEIGHT,
            position: "relative",
            flex: "0 0 400px",
            overflow: "auto"
          },
          ".layers-details": {
            backgroundColor: "#2e343d !important",
            flex: 1,
            maxHeight: DRAWER_MAX_HEIGHT,
            contain: "content"
            // paddingLeft: "22px"
          }
        }
      }}
    >
      <Button
        fullWidth
        onClick={toggleDrawer}
        className="toggler"
        color="primary"
        variant="contained"
      >
        - layers selected{" "}
        {/* {
          viewState.terria.workbench.items.map((layer) => {
            if (layer.type != "csv") {
              return "test";
            }
          }).length */}
        {
          viewState.terria.workbench.items.filter(function (layer) {
            return layer.type != "csv" && layer.type != "geojson";
          }).length
        }{" "}
        -{" "}
        <span
          style={{
            color: "#d3d3d3",
            position: "absolute",
            left: 0,
            margin: "0px 10px 0px 9px",
            display: "flex",
            gap: "10px"
          }}
        >
          <img src="images/renci-logo-dark.png" height="25" />
          <img src="images/terria_logo.png" height="20" />
        </span>
        <span
          style={{
            color: "#d3d3d3",
            position: "absolute",
            right: 0,
            margin: "0 10px 0 0",
            fontSize: "10px"
          }}
        >
          {process.env.APP_VERSION}
        </span>
      </Button>

      <Stack direction={{ xs: "column", md: "row" }} className="content">
        <Box className="layers-list">
          <LayersList terria={terria} viewState={viewState} />
        </Box>
        <Box xs={12} md={9} className="layers-details">
          {activatedLayer ? (
            <ActiveLayerDetails terria={terria} viewState={viewState} />
          ) : (
            <GeneralDetails />
          )}
        </Box>
      </Stack>
    </MuiDrawer>
  );
};
