import { useState } from "react";
import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import {
  Settings as ConfigIcon,
  Info as DetailsIcon,
  SsidChart as GraphIcon
} from "@mui/icons-material";
import { useLayers } from "../../../context";
import { ConfigTab, DetailsTab, GraphTab } from "./tabs";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

function a11yProps(id) {
  return {
    id: `details-tab-${id}`,
    "aria-controls": `details-tab-panel-${id}`
  };
}

export const ActiveLayerDetails = ({ viewState, terria }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { activatedLayer } = useLayers();

  const TABS = [
    {
      id: "details",
      label: "Details",
      tabIcon: <DetailsIcon />,
      component: <DetailsTab activatedLayer={activatedLayer} />
    },
    {
      id: "graph",
      label: "Graph",
      tabIcon: <GraphIcon />,
      component: (
        <GraphTab
          terria={terria}
          viewState={viewState}
          activatedLayer={activatedLayer}
        />
      )
    },
    {
      id: "config",
      label: "Config",
      tabIcon: <ConfigIcon />,
      component: <ConfigTab activatedLayer={activatedLayer} />
    }
  ];

  const matches = useMediaQuery("(min-width:1280px)");
  let orderValue = matches ? 1 : 2;
  let orderValue2 = matches ? 2 : 1;

  const handleClickTab = (event, newTabIndex) => {
    setCurrentTabIndex(newTabIndex);
  };

  return (
    <Stack
      alignItems="stretch"
      sx={{
        height: "100%",
        overflow: "hidden",
        ".MuiTab-root": { py: 0, px: 2 }
      }}
    >
      <Stack
        direction={matches ? "row" : "column"}
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "40px", background: "#2e343d" }}
      >
        <Tabs
          value={currentTabIndex}
          onChange={handleClickTab}
          aria-label="Layer details tab selection"
          sx={{
            minWidth: "400px",
            order: orderValue2,
            height: "40px",
            minHeight: "unset"
          }}
        >
          {TABS.map(({ id, label, tabIcon }) => (
            <Tab
              key={`details-tab-${label}`}
              label={label}
              {...a11yProps(id)}
              icon={tabIcon}
              iconPosition="start"
              sx={{
                height: "40px",
                minHeight: "unset",
                color: "#008daa"
              }}
            />
          ))}
        </Tabs>
      </Stack>

      <Divider sx={{ backgroundColor: "#737171" }} />

      <Box sx={{ height: "100%", overfow: "hidden" }}>
        {TABS[currentTabIndex].component}
      </Box>
    </Stack>
  );
};
