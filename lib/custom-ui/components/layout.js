import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { Drawer } from "./drawer";
import React from "react";
import { LayerSelectionMenu, SelectionDialog } from "./layer-selection";

const LayoutContext = createContext({});

export const useLayout = () => useContext(LayoutContext);

export const Layout = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(true);
  const closeDrawer = () => setDrawerIsOpen(false);
  const toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);

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
      <LayerSelectionMenu />
      <SelectionDialog />
      <Drawer viewState={props.viewState} />
    </LayoutContext.Provider>
  );
};

// add viewstate to props
Layout.propTypes = {
  children: PropTypes.node
};
