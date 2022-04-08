import React from "react";
import PropTypes from "prop-types";

import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

function Multienergy(props) {
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "gallery"
  };

  function getVar1() {
    let cod_reg = prompt("Inserisci il codice della regione:");
    // Var 1 è parte dell url a cui fa la chiamata
    // cod_reg è una var locale qualsiasi
    fetch(`http://localhost:3002/Var1/${cod_reg}`, {
      method: "GET"
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
      });
  }

  // to select language config.json depending on the browser language
  var userLang = navigator.language || navigator.userLanguage;
  var totem_link = "/#en_totemweb";
  if (userLang === "it-IT" || userLang === "it") {
    totem_link = "/#it_totemweb";
  }

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText="Multienergy"
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle="Multienergy case study"
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
        <p>prova bottone</p>
      </div>

      <button onClick={getVar1}>var1</button>
    </MenuPanel>
  );
}

Multienergy.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default Multienergy;
