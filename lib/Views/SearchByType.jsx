import React from "react";
import PropTypes from "prop-types";
import { observable } from "mobx";

import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";
import { useState } from "react";

function SearchByType(props) {
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "search"
  };

  const [searchType, setSearchType] = useState("");

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

      <input
        id="searchByType"
        type="text"
        name="searchByType"
        placeholder="Enter search type."
        autocomplete="off"
        value={searchType}
        onChange={e => setSearchType(e.target.value)}
        style={{ color: "grey" }}
      ></input>
    </MenuPanel>
  );
}

SearchByType.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default SearchByType;
