import React, { useState } from "react";
import PropTypes from "prop-types";
import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

import { getDistinctEventTypes } from "../helper";

function SearchByType(props) {
  const [searchType, setSearchType] = useState("");

  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "search"
  };

  const { eventTypes } = getDistinctEventTypes();

  const searchByType = () => {
    const searchBy = "event";
    console.log("searchByType - search state", viewState);
    viewState.searchState.searchCatalog(searchBy);
  };

  const handleChange = selection => {
    setSearchType(selection);
    // console.log("date", convertDateToString(date));

    viewState.changeSearchState(selection);
    // console.log(
    //   "onDateChanged catalogSearchText: ",
    //   viewState.searchState.catalogSearchText
    // );

    searchByType();
    setSearchType("");
    viewState.setTopElement("AddData");
    viewState.openAddData();
  };

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Search By Type"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="Search By Type"
      showDropdownInCenter
    >
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>Search by Type</label>
      </div>

      <select
        id="searchByType"
        type="text"
        name="searchByType"
        autoComplete="off"
        value={searchType}
        onChange={e => handleChange(e.target.value)}
        style={{ color: "grey", width: "100%" }}
      >
        <option value="">Select an option</option>
        {eventTypes &&
          eventTypes.map((eventType, idx) => (
            <option value={eventType} key={idx}>
              {eventType}
            </option>
          ))}
      </select>

      {/* <input
        id="searchByType"
        type="text"
        name="searchByType"
        placeholder="Enter search type."
        autocomplete="off"
        value={searchType}
        onChange={e => setSearchType(e.target.value)}
        style={{ color: "grey" }}
      ></input> */}
    </MenuPanel>
  );
}

SearchByType.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default SearchByType;
