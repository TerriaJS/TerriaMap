import React from "react";
import PropTypes from "prop-types";

import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

function SearchByType(props) {
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "search"
  };

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Search By Type"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="See types"
      showDropdownInCenter
    >
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>Search by type</label>
      </div>
    </MenuPanel>
  );
}

SearchByType.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default SearchByType;
