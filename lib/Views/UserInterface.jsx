import PropTypes from "prop-types";
import React from "react";
import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import {
  ExperimentalMenu,
  MenuLeft
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
// import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";

// import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import SearchByDay from "./SearchByDay";
import SearchByType from "./SearchByType";
import SearchByGrid from "./SearchByGrid";
import SearchByInstance from "./SearchByInstance";
import Collapsible from "./collapsible";
// import SplitPoint from "terriajs/lib/ReactViews/SplitPoint";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import SplitPoint from "terriajs/lib/ReactViews/SplitPoint";
// import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx";
// import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import version from "../../version";
import "./global.scss";
// function loadAugmentedVirtuality(callback) {
//   require.ensure(
//     "terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool",
//     () => {
//       const AugmentedVirtualityTool = require("terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool");
//       callback(AugmentedVirtualityTool);
//     },
//     "AugmentedVirtuality"
//   );
// }
// function isBrowserSupportedAV() {
//   return /Android|iPhone|iPad/i.test(navigator.userAgent);
// }

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function BasicPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        ADCIRC
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </div>
  );
}

export default function UserInterface(props) {
  // console.log(props)
  // console.log("props")
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // const relatedMaps = props.viewState.terria.configParameters.relatedMaps;

  return (
    <>
      <div
        style={{
          zIndex: 100,
          width: "10%",
          height: "80vh",
          backgroundColor: "rgba(2,0,19,0.418)",
          position: "fixed"
        }}
      >
        <ul>
          <li>
            <BasicPopover />
          </li>
          <li>
            <BasicPopover />
          </li>
        </ul>
      </div>
      <StandardUserInterface
        {...props}
        version={version}
        style={{ maxHeight: "400px !important" }}
      >
        {/* {windowDimensions.width < 768 && (
        <MenuLeft>
          <SearchByType viewState={props.viewState} />
          <SearchByGrid viewState={props.viewState} />
          <SearchByInstance viewState={props.viewState} />
          <SearchByDay viewState={props.viewState} />
        </MenuLeft>
      )}
      {windowDimensions.width >= 768 && (
        <ExperimentalMenu>
          <SearchByDay viewState={props.viewState} />
          <SearchByInstance viewState={props.viewState} />
          <SearchByType viewState={props.viewState} />
          <SearchByGrid viewState={props.viewState} />
        </ExperimentalMenu>
      )} */}
      </StandardUserInterface>
      {/* <div
        style={{
          zIndex: 101,
          width: "20%",
          height: "20vh",
          background: "green",
          position: "fixed",
          bottom: 0
        }}
      >
        Selected Layer List
      </div> */}
      {/* <Collapsible name={"Lisa"} /> */}
    </>
  );
}
UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
