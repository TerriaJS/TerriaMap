import React from "react";
import PropTypes from "prop-types";

import MenuPanel from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx";
import PanelStyles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Styles from "./related-maps.scss";
import classNames from "classnames";

import withTerriaRef from "terriajs/lib/ReactViews/HOCs/withTerriaRef"; //GOF HOC x Ref di aggancio dei punti del Tour
import { Trans, useTranslation, withTranslation } from "react-i18next"; //GOF x traduzione didascalie

function AnalisiAvanzate(props) {
  const { t } = useTranslation(); //GOF x traduzione didascalie

  const dropdownTheme = {
    inner: Styles.dropdownInner,
    icon: "gallery"
  };

  // to select language config.json depending on the browser language
  var userLang = navigator.language || navigator.userLanguage;
  var totem_link = "/#en_dati_storici"; //puntare al json che carica il tool con il codice di calcolo
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
          <h1> {t("analisiAvanzate.h1navigaTraITool")} </h1>
        </label>
      </div>

      {/* modulo calcolo */}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul class="list-group list-group-flush">
          <table>
            <tr>
              <td colspan="2">
                {/* <h2> MODULO DI CALCOLO </h2> */}
                <h2>{t("analisiAvanzate.h2ModuloDiCalcolo")}</h2>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  className={Styles.image}
                  src={require("../../wwwroot/images/modulo_calcolo.png")}
                  /*src={require("../../wwwroot/images/totem3_v3.png")}*/
                  alt="totem"
                />
              </td>
              <td>
                {" "}
                <p align="justify">
                  {t("analisiAvanzate.infoValutazioneTecnicoEconomica")}
                </p>
                <a
                  target="_blank"
                  //href="http://atlanteintegrato.rse-web.it/sankey.php"
                  href="https://atlanteeolico.rse-web.it/help/help-terria-calcolo-IT.html"
                  className={Styles.link}
                >
                  {t("analisiAvanzate.approfondisci")}
                </a>{" "}
                <br></br>
                <br></br>
                {t("analisiAvanzate.perAccedere")}{" "}
                <a className={Styles.link} href={modCalc_link}>
                  {t("analisiAvanzate.cliccaQui")}
                </a>
                .
              </td>
            </tr>
          </table>
        </ul>
      </div>

      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul class="list-group list-group-flush">
          <table>
            <tr>
              <td colspan="2">
                <h2>{t("analisiAvanzate.downloadSerieStorica")}</h2>
              </td>
            </tr>
            <tr>
              <td tyle="vertical-align:top">
                <img
                  width="50%"
                  height="80%"
                  className={Styles.image}
                  src={require("../../wwwroot/images/download_serie_storica.png")}
                  /*src={require("../../wwwroot/images/shutterstock_107017613.png")}*/
                  alt="totem"
                />
              </td>
              <td>
                {" "}
                <p align="justify">{t("analisiAvanzate.infoSerieStorica")}</p>
                <br></br>
                {t("analisiAvanzate.perAccedere")}{" "}
                <a className={Styles.link} href={totem_link}>
                  {t("analisiAvanzate.cliccaQui")}
                </a>
                .
                {/* Permette la definizione ed il salvataggio di dati territoriali
              necessari a software di analisi multienergetiche. Prima di
              attivare il tool è necessario selezionare, a partire dal link qui
              di seguito, il <i>territorio provinciale e l'anno </i> in cui se
              vuole effettuare l'analisi. */}{" "}
              </td>
            </tr>
          </table>
        </ul>
      </div>

      {/* collegamento a DOWNLOAD MAPPE DI VENTO*/}
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul class="list-group list-group-flush">
          <table>
            <tr>
              <td colspan="2">
                <h2>{t("analisiAvanzate.h2DownloadMappaVento")}</h2>
              </td>
            </tr>
            <tr>
              <td tyle="vertical-align:top">
                <img
                  className={Styles.image}
                  src={require("../../wwwroot/images/download_mappa_vento.png")}
                  alt="WEN"
                />
              </td>
              <td>
                <p align="justify"> {t("analisiAvanzate.infoShapefile")}</p>{" "}
                <a
                  target="_blank"
                  //href="http://atlanteintegrato.rse-web.it/sankey.php"
                  //href="https://atlanteeolico.rse-web.it/download_griglia-IT.php"
                  href="https://atlanteeolico.rse-web.it/download_terria_griglia-IT.php"
                  className={Styles.link}
                >
                  {t("analisiAvanzate.approfondisciEdownload")}
                </a>
              </td>
            </tr>
          </table>
        </ul>
      </div>
      <div className={classNames(PanelStyles.section, Styles.section)}>
        <ul>
          <h2>{t("analisiAvanzate.link")}</h2>
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
            {t("analisiAvanzate.ulterioriApprofondimenti")}{" "}
            <a
              target="_blank"
              //href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="https://atlanteintegrato.rse-web.it/"
              className={Styles.link}
            >
              {t("analisiAvanzate.atlanteIntegrato")}
            </a>
            <br></br>
            <br></br>
            {t("analisiAvanzate.possibileConsultare")}{" "}
            <a
              target="_blank"
              //href="http://atlanteintegrato.rse-web.it/sankey.php"
              href="https://dbeta.rse-web.it"
              className={Styles.link}
            >
              {t("analisiAvanzate.geoDbEta")}
            </a>
          </p>
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
