import React from "react";
import PropTypes from "prop-types";

import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

function RelatedMaps(props) {
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "gallery"
  };

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Visores"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="Ver visores"
      showDropdownInCenter
    >
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>Visores</label>
      </div>

      <p>
        Al hacer clic en un mapa a continuación, se abrirá en una ventana o
        pestaña separada.
      </p>

      <div className={classNames(PanelStyles.section, Styles.section)}>
        <a target="_blank" href="http://172.16.60.46:3002/">
          <img
            className={Styles.image}
            src={require("../../wwwroot/images/g4_energias.png")}
            alt="AREMI"
          />
        </a>

        <a
          target="_blank"
          className={Styles.link}
          href="http://172.16.60.46:3002/"
        >
          Energías Renovables
        </a>

        <p>
          Visor de las variables meteorológicas a escala mensual en las torres
          de energía renovables
        </p>
      </div>
    </MenuPanel>
  );
}

RelatedMaps.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default RelatedMaps;
