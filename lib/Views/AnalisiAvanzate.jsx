import React from "react";
import PropTypes from "prop-types";

import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

import withTerriaRef from "terriajs/lib/ReactViews/HOCs/withTerriaRef"; //GOF HOC x Ref di aggancio dei punti del Tour

function AnalisiAvanzate(props) {
  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "gallery"
  };

  // to select language config.json depending on the browser language
  var userLang = navigator.language || navigator.userLanguage;
  var totem_link = "/#en_totemweb"; //puntare al json che carica il tool con il codice di calcolo
  var modCalc_link = "/#en_modcalc";
  var dati_storici_prova = "/#it_dati_storici_prova";
  var analisi = "Advanced Analysis";
  if (userLang === "it-IT" || userLang === "it") {
    totem_link = "/#it_dati_storici"; //inserire il path che punta al tool codice di calcolo
    modCalc_link = "/#it_modcalc";
    analisi = "Strumenti Aggiuntivi";
    dati_storici_prova = "/#it_dati_storici_prova";
  }

  return (
    <MenuPanel
      btnRef={props.refFromHOC} //GOF   Ref sul bottone per il Tour
      theme={dropdownTheme}
      btnText={analisi}
      smallScreen={props.smallScreen}
      viewState={props.viewState}
      btnTitle={analisi}
    >
      {/* titolo della pagina */}
      <div className={classNames(PanelStyles.header)}>
        <label className={PanelStyles.heading}>
          <h1> Naviga tra i tool di approfondimento </h1>
        </label>
      </div>

      {/* modulo calcolo */}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h2> MODULO DI CALCOLO </h2>
            <img
              className={Styles.image}
              src={require("../../wwwroot/images/modulo_calcolo.png")}
              /*src={require("../../wwwroot/images/totem3_v3.png")}*/
              alt="totem"
            />
            <p>
              {" "}
              Questo strumento permette di effettuare una valutazione
              tecnico-economica preliminare di un ipotetico parco eolico situato
              in un punto prescelto sulle mappe, simulando le prestazioni
              energetiche e il costo medio dell'energia prodotta dall'impianto.{" "}
              <br></br>
              <a
                //target="_blank"
                //href="http://atlanteintegrato.rse-web.it/sankey.php"
                href="https://atlanteeolico.rse-web.it/help/help-terria-calcolo-IT.html"
                className={Styles.link}
              >
                Approfondisci.
              </a>{" "}
              <br></br>
              <br></br>Per accedere{" "}
              <a className={Styles.link} href={modCalc_link}>
                clicca qui
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

      {/* totem */}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            {/*<div class="row">
            <div class="col-sm-6">*/}
            <h2> DOWNLOAD DELLA SERIE STORICA DI VELOCITA' DEL VENTO </h2>
            {/* <a target="_blank" href="http://rakino.ricerca.lan"> */}
            <img
              width="50%"
              height="80%"
              className={Styles.image}
              src={require("../../wwwroot/images/download_serie_storica.png")}
              /*src={require("../../wwwroot/images/shutterstock_107017613.png")}*/
              alt="totem"
            />
            {/* </a> */}
            <p>
              {" "}
              Questo strumento permette di scaricare la serie storica oraria
              trentennale (1990- 2019) di velocità del vento (m/s), attraverso
              la selezione dell’area di interesse sui domini onshore e offshore
              del territorio nazionale e la compilazione di un modulo di
              richiesta dei dati. <br></br>
              <a
                target="_blank"
                //href="http://atlanteintegrato.rse-web.it/sankey.php"
                href="https://atlanteeolico.rse-web.it/help/help-terria-calcolo-IT.html"
                className={Styles.link}
              >
                Approfondisci.
              </a>{" "}
              <br></br>
              <br></br>Per accedere{" "}
              <a className={Styles.link} href={totem_link}>
                clicca qui
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
            <h2>DOWNLOAD DELLA MAPPA DI VENTO</h2>
            <a
              target="_blank"
              // href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="https://atlanteeolico.rse-web.it/download_griglia-IT.php"
            >
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/download_mappa_vento.png")}
                alt="WEN"
              />
            </a>
            <p>
              Questo strumento permette di scaricare in formato shapefile (.shp)
              la griglia contenente i valori di velocità media annua del vento
              (m/s), producibilità specifica annua ( MWh/MW), parametro di forma
              della distribuzione di Weibull e distanza dalle cabine primarie
              (km), per ciascuna cella (1,4 x 1,4 km) sui domini onshore e
              offshore del territorio nazionale. <br></br>
              <a
                target="_blank"
                //href="http://atlanteintegrato.rse-web.it/sankey.php"
                href="https://atlanteeolico.rse-web.it/help/help-calcolo-IT.html"
                className={Styles.link}
              >
                Approfondisci.
              </a>{" "}
              <br></br>
            </p>
            <a
              target="_blank"
              //href="http://atlanteintegrato.rse-web.it/sankey.php"
              //href="https://atlanteeolico.rse-web.it/download_griglia-IT.php"
              href="https://atlanteeolico.rse-web.it/download/Grid_Nazionale21062022.zip"
              className={Styles.link}
            >
              Download
            </a>
          </li>
        </ul>
      </div>
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul>
          <li class="list-group-item">
            <h2>LINK</h2>
            <a
              target="_blank"
              // href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="https://atlanteeolico.rse-web.it/download_griglia-IT.php"
            >
              <img
                className={Styles.image}
                src={require("../../wwwroot/images/link_ai_dbeta.png")}
                alt="WEN"
              />
            </a>
            <p>
              Per ulteriori approfondimenti in materia di supporto alla
              pianificazione energetica è possibile consultare l'{" "}
              <a
                target="_blank"
                //href="http://atlanteintegrato.rse-web.it/sankey.php"
                href="https://atlanteintegrato.rse-web.it/"
                className={Styles.link}
              >
                Atlante Integrato.
              </a>
              <br></br>
              <br></br>E' inoltre possibile consultare e scaricare i dati
              relativi al sistema energetico nazionale presenti nel{" "}
              <a
                target="_blank"
                //href="http://atlanteintegrato.rse-web.it/sankey.php"
                href="https://dbeta.rse-web.it"
                className={Styles.link}
              >
                GeoDB ETA.
              </a>
            </p>
          </li>
        </ul>
      </div>

      {/* modulo PROVA */}
    </MenuPanel>
  );
}

AnalisiAvanzate.propTypes = {
  viewState: PropTypes.object.isRequired,
  smallScreen: PropTypes.bool
};

// export default AnalisiAvanzate;
export const TOOLS_PANEL_NAME = "MenuBarToolsButton"; //GOF
export default withTerriaRef(AnalisiAvanzate, TOOLS_PANEL_NAME); //GOF esporto AnalisiAvanzate con il Ref x il Tour
