import React, { useState } from "react";
import PropTypes from "prop-types";
import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

import { getDistinctGridTypes } from "../helper";

function SearchByGrid(props) {
  const [searchGrid, setSearchGrid] = useState("");

  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "search"
  };

  const { gridTypes } = getDistinctGridTypes();

  const searchByGrid = () => {
    const searchBy = "grid";
    console.log("searchByGrid - search state", viewState);
    viewState.searchState.searchCatalog(searchBy);
  };

  const handleChange = selection => {
    setSearchGrid(selection);
    // console.log("date", convertDateToString(date));

    viewState.changeSearchState(selection);
    // console.log(
    //   "onDateChanged catalogSearchText: ",
    //   viewState.searchState.catalogSearchText
    // );

    searchByGrid();
    setSearchGrid("");
    viewState.setTopElement("AddData");
    viewState.openAddData();
  };

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="ADCIRC Grid"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="Search related maps by ADCIRC Grid"
      showDropdownInCenter
    >
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>ADCIRC Grid</label>
      </div>

      <select
        id="searchByGrid"
        type="text"
        name="searchByGrid"
        autoComplete="off"
        value={searchGrid}
        // onChange={e => setSearchGrid(e.target.value)}
        onChange={e => handleChange(e.target.value)}
        style={{ color: "grey", width: "100%" }}
      >
        <option value="">Select an option</option>
        {gridTypes &&
          gridTypes.map((gridType, idx) => (
            <option value={gridType} key={idx}>
              {gridType}
            </option>
          ))}
      </select>
      {/* <input
        id="searchByType"
        type="text"
        name="searchByType"
        placeholder="Enter search type."
        autocomplete="off"
        value={searchGrid}
        onChange={e => setSearchGrid(e.target.value)}
        style={{ color: "grey" }}
      ></input> */}
    </MenuPanel>
  );
}

SearchByGrid.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default SearchByGrid;
