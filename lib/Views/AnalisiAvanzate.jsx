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
  var totem_link = "/#en_totemweb"; //puntare al json che carica il tool con il codice di calcolo
  var modCalc_link = "/#en_modcalc";
  var analisi = "Advanced Analysis";
  if (userLang === "it-IT" || userLang === "it") {
    totem_link = "/#it_dati_storici"; //inserire il path che punta al tool codice di calcolo
    modCalc_link = "/#it_modcalc";
    analisi = "Analisi Avanzate";
  }

  return (
    <MenuPanel
      theme={dropdownTheme}
      btnText={analisi}
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle={analisi}
    >
      {/* titolo della pagina */}
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>
          <h1> Naviga tra i tools di approfondimento </h1>
        </label>
      </div>

      {/* totem */}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            {/*<div class="row">
            <div class="col-sm-6">*/}
            <h2> DOWLOAD DATI STORICI </h2>
            <a target="_blank" href="http://rakino.ricerca.lan">
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/wind.png")}
                /*src={require("../../wwwroot/images/shutterstock_107017613.png")}*/
                alt="totem"
              />
            </a>
            <p>
              {" "}
              <i>Download dati storici .... altro testo</i> Per accedere{" "}
              <a className={Styles.link} href={totem_link}>
                clicca sulla mappa nella zona di interesse
              </a>
              .
              {/* Permette la definizione ed il salvataggio di dati territoriali
              necessari a software di analisi multienergetiche. Prima di
              attivare il tool è necessario selezionare, a partire dal link qui
              di seguito, il <i>territorio provinciale e l'anno </i> in cui se
              vuole effettuare l'analisi. */}{" "}
            </p>
          </li>
        </ul>
      </div>
      {/* modulo calcolo */}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h2> CALCOLO PRESTAZIONI </h2>
            <a target="_blank" href="http://rakino.ricerca.lan">
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/wind.png")}
                /*src={require("../../wwwroot/images/totem3_v3.png")}*/
                alt="totem"
              />
            </a>
            <p>
              {" "}
              <i>Valutazione tecnico economica di un parco eolico</i>: Per
              accedere{" "}
              <a className={Styles.link} href={modCalc_link}>
                clicca sulla mappa nella zona di interesse
              </a>
              .
              {/* Permette la definizione ed il salvataggio di dati territoriali
              necessari a software di analisi multienergetiche. Prima di
              attivare il tool è necessario selezionare, a partire dal link qui
              di seguito, il <i>territorio provinciale e l'anno </i> in cui se
              vuole effettuare l'analisi. */}{" "}
            </p>
          </li>
        </ul>
      </div>
      {/* caso multi energy*/}

      {/* collegamento a DOWNLOAD MAPPE DI VENTO*/}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul>
          <li class="list-group-item">
            <h2>DOWNLOAD MAPPE DI VENTO</h2>
            <a
              target="_blank"
              // href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="https://atlanteeolico.rse-web.it/download_griglia-IT.php"
            >
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/wind.png")}
                alt="WEN"
              />
            </a>
            <p>
              Il file contiene la copertura in formato ESRI Shapefile che
              rappresenta la griglia con passo 1.4x1.4 km relativa ai parametri
              dell'Atlante Eolico dell'Italia. Altro testo ....
            </p>
            <a
              target="_blank"
              //href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="https://atlanteeolico.rse-web.it/download_griglia-IT.php"
              className={Styles.link}
            >
              Download Mappe di vento
            </a>
          </li>
        </ul>
      </div>
    </MenuPanel>
  );
}

AnalisiAvanzate.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

export default AnalisiAvanzate;
