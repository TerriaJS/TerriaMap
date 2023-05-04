import { useState } from "react";
import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import {
  Settings as ConfigIcon,
  Info as DetailsIcon,
  SsidChart as GraphIcon
} from "@mui/icons-material";
import { useLayers } from "../../../context";
import { ConfigTab, DetailsTab, GraphTab } from "./tabs";
import React from "react";
//

const TABS = [
  {
    id: "details",
    label: "Details",
    tabIcon: <DetailsIcon />,
    component: <DetailsTab />
  },
  {
    id: "graph",
    label: "Graph",
    tabIcon: <GraphIcon />,
    component: <GraphTab />
  },
  {
    id: "config",
    label: "Config",
    tabIcon: <ConfigIcon />,
    component: <ConfigTab />
  }
];

function a11yProps(id) {
  return {
    id: `details-tab-${id}`,
    "aria-controls": `details-tab-panel-${id}`
  };
}

export const ActiveLayerDetails = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { activeLayer } = useLayers();

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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ pl: 2 }}>
          {activeLayer.name}
        </Typography>
        <Tabs
          value={currentTabIndex}
          onChange={handleClickTab}
          aria-label="Layer details tab selection"
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
      </Stack>

      <Divider />

      <Box sx={{ height: "100%", overfow: "hidden" }}>
        {TABS[currentTabIndex].component}
      </Box>
    </Stack>
  );
};
