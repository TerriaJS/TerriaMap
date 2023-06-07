import {
  Box,
  Button,
  Drawer as MuiDrawer,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useEffect } from "react";
import { useLayout } from "../layout";
import { LayersList } from "./layers-list";
import { ActiveLayerDetails, GeneralDetails } from "./layer-details";
import { useLayers } from "../../context";

const TOGGLER_HEIGHT = "2rem";
const DRAWER_MAX_HEIGHT = "400px";

export const Drawer = ({ viewState }) => {
  const theme = useTheme();
  const { closeDrawer, drawerIsOpen, toggleDrawer } = useLayout();
  const { layers, setLayers, activatedLayer, setActivatedLayer } = useLayers();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [value2, setValue2] = React.useState([0, 0]);

  useEffect(() => {
    //Runs only on first render
    setLayers(viewState.terria.workbench.items);
  }, []);

  return (
    <MuiDrawer
      anchor="bottom"
      variant="permanent"
      open={drawerIsOpen}
      onClose={closeDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{
        ".MuiBackdrop-root": {
          filter: "opacity(0.0)",
          pointerEvents: "none"
        },
        ".MuiDrawer-paper": {
          height: "100%",
          maxHeight: drawerIsOpen
            ? fullScreen
              ? "100%"
              : DRAWER_MAX_HEIGHT
            : TOGGLER_HEIGHT,
          transition: "max-height 250ms",
          backgroundColor: "grey",
          overflow: "hidden"
        },
        ".toggler": {
          position: "absolute",
          top: 0,
          zIndex: 99999,
          left: 0,
          borderRadius: 0,
          height: TOGGLER_HEIGHT
        },
        ".content": {
          height: "100%",
          paddingTop: TOGGLER_HEIGHT,
          flex: 1,
          ".layers-list": {
            maxHeight: DRAWER_MAX_HEIGHT,
            position: "relative",
            flex: "0 0 400px"
          },
          ".layers-details": {
            backgroundColor: "azure",
            flex: 1,
            maxHeight: DRAWER_MAX_HEIGHT
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
        - layers selected {layers.length} -
      </Button>

      <Stack direction={{ xs: "column", md: "row" }} className="content">
        <Box className="layers-list">
          <LayersList
            activatedLayer={activatedLayer}
            setActivatedLayer={setActivatedLayer}
            setLayers={setLayers}
            layers={layers}
            viewState={viewState}
          />
        </Box>
        <Box xs={12} md={9} className="layers-details">
          {activatedLayer ? (
            <ActiveLayerDetails value2={value2} setValue2={setValue2} />
          ) : (
            <GeneralDetails layers={layers} />
          )}
        </Box>
      </Stack>
    </MuiDrawer>
  );
};
