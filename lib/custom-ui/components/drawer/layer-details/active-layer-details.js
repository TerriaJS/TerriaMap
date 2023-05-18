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

export const ActiveLayerDetails = () => {
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
      component: <GraphTab activatedLayer={activatedLayer} />
    },
    {
      id: "config",
      label: "Config",
      tabIcon: <ConfigIcon />,
      component: <ConfigTab activatedLayer={activatedLayer} />
    }
  ];

  const matches = useMediaQuery("(min-width:1280px)");

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
      >
        <Tabs
          value={currentTabIndex}
          onChange={handleClickTab}
          aria-label="Layer details tab selection"
          sx={{ minWidth: "400px" }}
        >
          {TABS.map(({ id, label, tabIcon }) => (
            <Tab
              key={`details-tab-${label}`}
              label={label}
              {...a11yProps(id)}
              icon={tabIcon}
              iconPosition="start"
            />
          ))}
        </Tabs>
        <Typography variant="h6" sx={{ p: 2, fontSize: "12px" }}>
          {activatedLayer.name}
        </Typography>
      </Stack>

      <Divider />

      <Box sx={{ height: "100%", overfow: "hidden" }}>
        {TABS[currentTabIndex].component}
      </Box>
    </Stack>
  );
};
