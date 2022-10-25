import {
  MenuLeft,
  Nav,
  ExperimentalMenu
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
// import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import SearchByDay from "./SearchByDay";
import SearchByType from "./SearchByType";
import SearchByGrid from "./SearchByGrid";
import SearchByInstance from "./SearchByInstance";

// import SplitPoint from "terriajs/lib/ReactViews/SplitPoint";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
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

export default function UserInterface(props) {
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

  return (
    <StandardUserInterface {...props} version={version}>
      {windowDimensions.width < 768 && (
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
      )}
    </StandardUserInterface>
  );
}
UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
