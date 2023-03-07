import PropTypes from "prop-types";
import React from "react";
// import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import version from "../../version";
import "./global.scss";
import IconSection from "./layerSelection/iconSection";
import SwipeableEdgeDrawer from "./selectedLayers/swipeableDrawer";

export default function UserInterface(props) {
  const [open, setOpen] = React.useState(false);
  // const relatedMaps = props.viewState.terria.configParameters.relatedMaps;
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <IconSection />
      <StandardUserInterface
        {...props}
        version={version}
        style={{ maxHeight: "400px !important" }}
      />
      <SwipeableEdgeDrawer open={open} toggleDrawer={toggleDrawer} />
    </>
  );
}
UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
