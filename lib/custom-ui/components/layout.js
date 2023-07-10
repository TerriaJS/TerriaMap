import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Drawer } from "./drawer";
import { LayerSelectionMenu, SelectionDialog } from "./layer-selection";
import { useLayers } from "../context";
// import {
//   setDefaultParameters,
//   getCurrentParametersRange,
//   getDefaultMaxRange,
//   getDefaultMaxSliderRange,
//   getMaxSliderRange
// } from "./utils/edit-range-utils";

const LayoutContext = createContext({});

export const useLayout = () => useContext(LayoutContext);

export const Layout = (props) => {
  const { setWebMapCatalogItems, setContextViewState, contextViewState } =
    useLayers();
  const [drawerIsOpen, setDrawerIsOpen] = useState(true);
  const closeDrawer = () => setDrawerIsOpen(false);
  const toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);
  //console.log(getDefaultParameters('maxwvel'))
  // if (props.viewState.terria.workbench.items) {
  //   console.log(props.viewState.terria.workbench.items);
  //   setDefaultParameters(props.viewState.terria.workbench.items);
  //   console.log(
  //     getCurrentParametersRange(props.viewState.terria.workbench.items[1])
  //   );
  //   console.log(getDefaultMaxRange(props.viewState.terria.workbench.items[1]));
  //   console.log(getMaxSliderRange(props.viewState.terria.workbench.items[1]));
  // }

  useEffect(() => {
    props.viewState.terria.workbench.items.map((layer) => {
      if (layer.chartItems.length > 0) {
        layer.chartItems.map((item) => {
          item.updateIsSelectedInWorkbench(true);
        });
      }
    });
    // Set the viewstate and catalog items to context
    setContextViewState(props.viewState);
    setWebMapCatalogItems(props.viewState.terria.workbench.items);
  }, [props.viewState.terria.workbench.items, props.viewState]);

  const [activeDialog, setActiveDialog] = useState(null);

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const handleClickOpenDialog = (event) => {
    const { source } = event.target.dataset;
    setDialogIsOpen(true);
    setActiveDialog(source);
  };
  const closeDialog = () => {
    setDialogIsOpen(false);
    const unsetTimer = setTimeout(() => {
      setActiveDialog(null);
    }, 250);
    return () => clearTimeout(unsetTimer);
  };

  return (
    <LayoutContext.Provider
      value={{
        drawerIsOpen,
        closeDrawer,
        toggleDrawer,
        dialogIsOpen,
        handleClickOpenDialog,
        closeDialog,
        activeDialog
      }}
    >
      {props.children}
      <LayerSelectionMenu viewState={props.viewState} />
      <SelectionDialog viewState={props.viewState} />
      <Drawer terria={props.terria} viewState={props.viewState} />
    </LayoutContext.Provider>
  );
};

// add viewstate to props
Layout.propTypes = {
  children: PropTypes.node
};
