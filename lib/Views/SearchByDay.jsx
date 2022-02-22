import React, { useState } from "react";
import PropTypes from "prop-types";
import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";
import DatePicker from "react-datepicker";
function SearchByDay(props) {
  const [startDate, setStartDate] = useState(new Date());
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "search"
  };
  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Search By Day"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="See related maps"
      showDropdownInCenter
    >
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>Search by Day</label>
      </div>
      <DatePicker
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        selected={startDate}
        onChange={date => setStartDate(date)}
      />
    </MenuPanel>
  );
}
SearchByDay.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};
export default SearchByDay;
