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
  var analisi = "Advanced Analysis";
  if (userLang === "it-IT" || userLang === "it") {
    totem_link = "/#it_totemweb";
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
            <h2> TOTEM </h2>
            <a target="_blank" href="http://rakino.ricerca.lan">
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/logo_totem_TrW_new.png")}
                /*src={require("../../wwwroot/images/totem3_v3.png")}*/
                alt="totem"
              />
            </a>
            {/*</div>
            <div class="col-sm-6">*/}
            <p>
              {" "}
              TOTEM (<i>Territory Overview Tool for Energy Modelling</i>):{" "}
              fornisce una caratterizzazione energetica del territorio e
              permette di stimare, visualizzare e salvare dati a scala
              provinciale riguardanti: domanda energetica, risorsa rinnovabile,
              vincoli territoriali e potenziale di accumulo idrico da pompaggi.{" "}
              Per accedere{" "}
              <a className={Styles.link} href={totem_link}>
                seleziona una provincia
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
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul>
          <li class="list-group-item">
            <h2> Sulcis - Iglesiente </h2>
            <a
              target="_blank"
              href="http://gis2.rse-web.it:8080/mapstore/#/geostory/131"
            >
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/location_Wtr.png")}
                alt="multienergy"
              />
            </a>
            <p>
              {" "}
              Grazie alla collaborazione con l'Università di Cagliari è stato
              realizzato un caso studio di integrazione multienergetica nella
              provincia del Sulcis Iglesiente.
            </p>
            <p>
              {" "}
              Scopri il caso studio:
              <a
                target="_blank"
                className={Styles.link}
                href="http://gis2.rse-web.it:8080/mapstore/#/geostory/131"
              >
                {" "}
                Sulcis Iglesiente
              </a>
            </p>
          </li>
        </ul>
      </div>

      {/* collegamento a WEN*/}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul>
          <li class="list-group-item">
            <h2>Water-Energy Nexus</h2>
            <a
              target="_blank"
              // href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="http://atlanteintegrato.rse-web.it/sankey_it.php"
            >
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/water-Energy.png")}
                alt="WEN"
              />
            </a>
            <p>
              L'acqua per l'energia, l'energia per l'acqua. Flussi energetici e
              idrici nazionali scala nazionale.
            </p>
            <a
              target="_blank"
              //href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="http://atlanteintegrato.rse-web.it/sankey_it.php"
              className={Styles.link}
            >
              WEN - Water Energy Nexus
            </a>
          </li>
        </ul>
      </div>

      {/* collegamento a mapstore */}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul>
          <li class="list-group-item">
            <h2>Nuovo Geoportale Energia e Territorio</h2>
            <a target="_blank" href="http://gis2.rse-web.it/mapstore">
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/geo_ET_TrGG.png")}
                alt="geoportale"
              />
            </a>
            <p>
              Nel portale sono presenti tutti i siti di approfondimento
              geografico del gruppo AmbienteRisorseTerritorio. Vi sono anche
              mappe dedicate a tematismi di interesse e storymaps.
            </p>
            <a
              target="_blank"
              href="http://gis2.rse-web.it/mapstore"
              className={Styles.link}
            >
              Geoportale Energia e Territorio
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
