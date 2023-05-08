import PropTypes from "prop-types";
import React, { useState } from "react";
// import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import version from "../../version";
import { Context } from "../context/context";
import "./global.scss";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LayersProvider } from "../custom-ui/context";
import { Layout } from "../custom-ui/components/layout";

export default function UserInterface(props) {
  const [layerData, setLayerData] = useState("default data");
  const [selectedLayers, setSelectedLayers] = useState([]);

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
      </Context.Provider>
    </>
  );
}
UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
