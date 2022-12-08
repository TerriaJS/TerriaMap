import React, { useState } from "react";
import PropTypes from "prop-types";
import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";
import DatePicker from "react-datepicker";

// import { runInAction } from "mobx";
// import DataSourceCollection from "terriajs-cesium/Source/DataSources/DataSourceCollection";

function SearchByDay(props) {
  const [startDate, setStartDate] = useState();
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "calendar"
  };

  const { viewState } = props;

  const convertDateToString = (date) => {
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = date.getFullYear();

    return mm + "-" + dd + "-" + yyyy;
  };

  const isValidDate = (d) => {
    // console.log("valid date", d instanceof Date, !isNaN(d));
    return d instanceof Date && !isNaN(d);
  };

  const searchByDate = () => {
    const searchBy = "date";
    // console.log("searchByDate - search state", viewState);
    viewState.searchState.searchCatalog(searchBy);
  };

  const onDateChanged = (date) => {
    // console.log(new Date())
    setStartDate(date._d);

    viewState.changeSearchState(convertDateToString(date._d));

    searchByDate();

    viewState.setTopElement("AddData");
    viewState.openAddData();
  };

  /*
  const onKeyDown = (event) => {
    console.log("key down", event.keyCode)
    if (event.keyCode === 13) {
      const value = event.target.value
      if (value.length === 10) {      
        const date = new Date(value)
        console.log("date entered", date, isValidDate(date))
        if (isValidDate(date)) onDateChanged(date);
      }
    }
  }

  const changeSearchText = (newText) => {
    runInAction(() => {
        this.props.viewState.searchState.catalogSearchText = newText;
    });
  }

  const search = () => {
      this.props.viewState.searchState.searchCatalog();
  }

  const handleChange = (event) => {
    const value = event.target.value;
    // immediately bypass debounce if we started with no value
    if (this.props.searchText.length === 0) {
        this.props.onSearchTextChanged(value);
        this.search();
    }
    else {
        this.props.onSearchTextChanged(value);
        this.searchWithDebounce();
    }
  }
  */

  // const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  //   <input style={{ width: "100%" }} onClick={onClick} ref={ref} value={value}/>
  // ));

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Calendar Date"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="Search related maps by Calendar Date"
    >
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>Calendar Date</label>
      </div>
      <div className="customDatePickerWidth">
        <DatePicker
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          // selected={startDate}
          onChange={(date) => onDateChanged(date)}
          style={{ color: "grey" }}
          // customInput={<CustomInput />}
        />
      </div>
    </MenuPanel>
  );
}
SearchByDay.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};
export default SearchByDay;
