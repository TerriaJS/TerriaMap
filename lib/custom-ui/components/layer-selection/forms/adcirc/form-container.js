import { Fragment, useCallback, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Tabs
} from "@mui/material";
import { SynopticLayerSelectionForm } from "./synopticForm";
import { TropicalLayerSelectionForm } from "./tropicalForm";
import React from "react";

function a11yProps(id) {
  return {
    id: `run-tab-${id}`,
    "aria-controls": `run-tabpanel-${id}`
  };
}

export const AdcircForm = ({ viewState }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const CurrentTabContents = useCallback(() => {
    return LAYER_TYPES[currentTab].form;
  }, [currentTab]);

  const handleClickTab = (event, newTabIndex) => {
    setCurrentTab(newTabIndex);
  };

  const LAYER_TYPES = [
    {
      id: "tropical",
      label: "Tropical",
      form: <TropicalLayerSelectionForm viewState={viewState} />
    },
    {
      id: "synoptic",
      label: "Synoptic",
      form: <SynopticLayerSelectionForm viewState={viewState} />
    }
  ];

  return (
    <Fragment>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <DialogTitle>ADCIRC Layer Selection</DialogTitle>
        <Tabs
          value={currentTab}
          onChange={handleClickTab}
          aria-label="Run type selection"
          sx={{
            ".MuiTabs-scroller": {
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch"
            }
          }}
        >
          {LAYER_TYPES.map(({ id, label }) => (
            <Tab key={`adcirc-tab-${label}`} label={label} {...a11yProps(id)} />
          ))}
        </Tabs>
      </Stack>

      <Divider />

      <DialogContent role="tabpanel">
        <CurrentTabContents />
      </DialogContent>
    </Fragment>
  );
};
