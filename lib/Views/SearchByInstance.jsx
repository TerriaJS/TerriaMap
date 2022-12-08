import React, { useState } from "react";
import PropTypes from "prop-types";
import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

import { getDistinctInstanceNames } from "../helper";

function SearchByInstance(props) {
  const [searchInstance, setSearchInstance] = useState("");

  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "search"
  };

  const { instanceNames } = getDistinctInstanceNames();

  const searchByInstance = () => {
    const searchBy = "instance";
    viewState.searchState.searchCatalog(searchBy);
  };

  const handleChange = (selection) => {
    setSearchInstance(selection);

    viewState.changeSearchState(selection);

    searchByInstance();
    setSearchInstance("");
    viewState.setTopElement("AddData");
    viewState.openAddData();
  };

  const testDate = (e) => {
    console.log(e);
  };

  let arraySize = instanceNames.length + 1;

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Instance Name"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="Search related maps by Instance Name"
      useDropdownInMenu
      // showDropdownInCenter
    >
      <If condition={props.smallScreen}>
        <div className={classNames(PanelStyles.header)}>
          <label className={PanelStyles.heading}>Instance Name</label>
        </div>
      </If>

      <select
        id="searchByInstance"
        type="text"
        name="searchByInstance"
        autoComplete="off"
        value={searchInstance}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          color: props.smallScreen ? "grey" : "white",
          minWidth: "125px",
          width: "100%",
          background: "none",
          border: props.smallScreen ? "initial" : "none"
        }}
        size={arraySize}
      >
        <option value="" disabled>
          {props.smallScreen ? "Select an option" : "Instance Name"}
        </option>

        {instanceNames &&
          instanceNames.map((instanceName, idx) => (
            <option value={instanceName} key={idx}>
              {instanceName}
            </option>
          ))}
      </select>
    </MenuPanel>
  );
}

SearchByInstance.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default SearchByInstance;
