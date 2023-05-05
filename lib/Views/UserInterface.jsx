import PropTypes from "prop-types";
import React, { useMemo, useState, useEffect } from "react";
// import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import version from "../../version";
import { Context } from "../context/context";
import "./global.scss";
// import IconSection from "./layerSelection/iconSection";
// import SwipeableEdgeDrawer from "./selectedLayers/swipeableDrawer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LayersProvider } from "../custom-ui/context";
import { Layout } from "../custom-ui/components/layout";
// import { useLayers } from "../custom-ui/context";

export default function UserInterface(props) {
  const [open, setOpen] = React.useState(false);
  const [layerData, setLayerData] = useState("default data");
  const [selectedLayers, setSelectedLayers] = useState([]);
  // const [ setLayers ] = useLayers();
  // const value = useMemo(() => ({ layerData, setLayertData }), [layerData]);
  // console.log(props.viewState);
  // const relatedMaps = props.viewState.terria.configParameters.relatedMaps;
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  // useEffect(() => {
  //   setLayers([props.viewState.terria.workbench.items])
  // }, []);

  // setSelectedLayers([...selectedLayers, viewState.terria.workbench.items]);

  return (
    <>
      <Context.Provider
        value={{
          layers: layerData,
          setLayerData: setLayerData,
          selectedLayers: selectedLayers,
          setSelectedLayers: setSelectedLayers
        }}
      >
        {/* <IconSection view={props.viewState} /> */}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <LayersProvider>
            <Layout viewState={props.viewState}>
              <StandardUserInterface
                {...props}
                version={version}
                style={{ maxHeight: "400px !important" }}
              />
            </Layout>
          </LayersProvider>
        </LocalizationProvider>
        {/* <SwipeableEdgeDrawer
          data={props.viewState}
          open={open}
          toggleDrawer={toggleDrawer}
        /> */}
      </Context.Provider>
    </>
  );
}
UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
