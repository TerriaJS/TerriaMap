import React from "react";
import PropTypes from "prop-types";

import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

function AnalisiAvanzate(props) {
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "gallery"
  };

  // to select language config.json depending on the browser language
  var userLang = navigator.language || navigator.userLanguage;
  var totem_link = "/#en_totemweb";
  if (userLang === "it-IT" || userLang === "it") {
    totem_link = "/#it_totemweb";
  }

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Analisi Avanzate"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="Analisi Avanzate"
    >
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>Multienergy case study</label>
      </div>

      <p>testo che spiega dove stai per essere reindirizzato</p>

      <p>
        <a className={Styles.link} href={totem_link}>
          Apri la selezione della provincia per TOTEMWEB in TerriaMap
        </a>
      </p>

      <div className={classNames(PanelStyles.section, Styles.section)}>
        <a target="_blank" href="http://atlanteintegrato.rse-web.it/">
          <img
            className={Styles.image}
            src={require("../../wwwroot/images/multienergy.jpg")}
            alt="multienergy"
          />
        </a>

        <a
          target="_blank"
          className={Styles.link}
          href="http://atlanteintegrato.rse-web.it/"
        >
          vai ai risultati del caso studio
        </a>

        <p>vai ai risultati del caso studio Sulcis Iglesiente</p>
      </div>
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <p>
          <a
            target="_blank"
            href="http://gis2.rse-web.it:8080/mapstore"
            className={Styles.link}
          >
            Geoportale
          </a>
        </p>
        <p>
          <a
            target="_blank"
            href="http://atlanteintegrato.rse-web.it/sankey.php"
            className={Styles.link}
          >
            WEN
          </a>
        </p>
      </div>
    </MenuPanel>
  );
}

AnalisiAvanzate.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default AnalisiAvanzate;
