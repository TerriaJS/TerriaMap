import PropTypes from "prop-types";
import React from "react";
import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import {
  ExperimentalMenu,
  MenuLeft
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import version from "../../version";
import "./global.scss";

export default function UserInterface(props) {
  const relatedMaps = props.viewState.terria.configParameters.relatedMaps;
  const aboutButtonHrefUrl =
    props.viewState.terria.configParameters.aboutButtonHrefUrl;

  return (
    <StandardUserInterface {...props} version={version}>
      <MenuLeft>
        {aboutButtonHrefUrl ? (
          <MenuItem
            caption="About"
            href={aboutButtonHrefUrl}
            key="about-link"
          />
        ) : null}
        {relatedMaps && relatedMaps.length > 0 ? (
          <RelatedMaps relatedMaps={relatedMaps} />
        ) : null}
      </MenuLeft>
      <ExperimentalMenu />
    </StandardUserInterface>
  );
}

UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
