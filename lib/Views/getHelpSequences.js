"use strict";

import HelpScreen from "terriajs/lib/ReactViewModels/HelpScreen";
import HelpSequence from "terriajs/lib/ReactViewModels/HelpSequence";
import HelpSequences from "terriajs/lib/ReactViewModels/HelpSequences";
import HelpViewState from "terriajs/lib/ReactViewModels/HelpViewState";

/**
 * Set up help screens.
 **/
const getHelpSequences = function() {
  const options = {
    menuTitle: " What would you like to do? "
  };
  const helpSequences = new HelpSequences(options);

  helpSequences.sequences.push(getLoadDataFromCatalogSequence());
  helpSequences.sequences.push(getLoadDataFromExternal());
  helpSequences.sequences.push(getChangeMapSettings());
  helpSequences.sequences.push(getShareExportPrintMap());
  helpSequences.sequences.push(getDownloadCatalogDataForOfflineUse());

  return helpSequences;
};

/**
 * @private
 */
function getLoadDataFromCatalogSequence() {
  const screenOneMessage =
    "<div><strong>Click here to:</strong><ul><li>Browse all of the additional data sets within the State of the Environment catalogue</li><li>Add selected data sets to the map</li></ul></div>";
  const screenOneComponentId =
    "tjs-side-panel__button tjs-_buttons__btn tjs-_buttons__btn-primary";

  const screenTwoMessage =
    "<div>All of your active data sets will appear in your data workbench.</div>";
  const screenTwoComponentId = "tjs-side-panel__workbenchEmpty";

  const helpScreenList = [
    new HelpScreen({
      message: screenOneMessage,
      highlightedComponentId: screenOneComponentId,
      positionLeft: HelpViewState.RelativePosition.RECT_LEFT,
      positionTop: HelpViewState.RelativePosition.RECT_BOTTOM,
      offsetTop: 10,
      caretTop: -5,
      caretLeft: 10
    }),
    new HelpScreen({
      message: screenTwoMessage,
      highlightedComponentId: screenTwoComponentId,
      positionLeft: HelpViewState.RelativePosition.RECT_RIGHT,
      positionTop: HelpViewState.RelativePosition.RECT_TOP,
      offsetLeft: 15,
      offsetTop: -3,
      caretTop: 5,
      caretLeft: -5
    })
  ];

  const options = {
    title: "Load data from the catalogue",
    screens: helpScreenList
  };

  return new HelpSequence(options);
}

/**
 * @private
 */
function getLoadDataFromExternal() {
  const screenOneMessage =
    "<div><strong>Click here to:</strong><ul><li>Launch the data catalogue window</li></ul></div>";
  const screenOneComponentId =
    "tjs-side-panel__button tjs-_buttons__btn tjs-_buttons__btn-primary";

  const screenTwoMessage =
    "<div><strong>Click here to:</strong><ul><li>Load a local data file or load data from an external web service</li><li>Preview your previously loaded data sets</li></ul></div>";
  const screenTwoComponentId =
    "tjs-tabs__btn--tab tjs-_buttons__btn tjs-tabs__btn--selected";

  const helpScreenList = [
    new HelpScreen({
      message: screenOneMessage,
      highlightedComponentId: screenOneComponentId,
      positionLeft: HelpViewState.RelativePosition.RECT_LEFT,
      positionTop: HelpViewState.RelativePosition.RECT_BOTTOM,
      offsetTop: 10,
      caretTop: -5,
      caretLeft: 10
    }),
    new HelpScreen({
      message: screenTwoMessage,
      highlightedComponentId: screenTwoComponentId,
      positionLeft: HelpViewState.RelativePosition.RECT_LEFT,
      positionTop: HelpViewState.RelativePosition.RECT_BOTTOM,
      offsetTop: 10,
      offsetLeft: -103,
      caretTop: -5,
      caretLeft: 139,
      preDisplayHook: function(viewState) {
        viewState.openUserData();
      },
      postDisplayHook: function(viewState) {
        viewState.closeCatalog();
      }
    })
  ];

  const options = {
    title: "Load data from a file or external source",
    screens: helpScreenList
  };

  return new HelpSequence(options);
}

/**
 * @private
 */
function getChangeMapSettings() {
  const screenOneMessage =
    "<div><strong>Click here to:</strong><ul><li>Set your preferred map projection (2D/3D Smooth/3D Terrain)</li><li>Select your preferred base map style</li></ul></div>";
  const screenOneComponentId =
    "tjs-panel__button tjs-_buttons__btn tjs-_buttons__btn--map";

  const helpScreenList = [
    new HelpScreen({
      message: screenOneMessage,
      highlightedComponentId: screenOneComponentId,
      positionLeft: HelpViewState.RelativePosition.RECT_LEFT,
      positionTop: HelpViewState.RelativePosition.RECT_BOTTOM,
      offsetTop: 10,
      offsetLeft: -113,
      caretTop: -5,
      caretLeft: 133
    })
  ];

  const options = {
    title: "Change the map settings",
    screens: helpScreenList
  };

  return new HelpSequence(options);
}

/**
 * @private
 */
function getShareExportPrintMap() {
  const screenOneMessage =
    "<div><strong>Click here to:</strong><ul><li>Download a printable screenshot of your current map</li><li>Get a shareable link to your current map</li></ul></div>";
  const screenOneComponentId = "tjs-panel__panel tjs-share-panel__share-panel";

  const helpScreenList = [
    new HelpScreen({
      message: screenOneMessage,
      highlightedComponentId: screenOneComponentId,
      positionLeft: HelpViewState.RelativePosition.RECT_LEFT,
      positionTop: HelpViewState.RelativePosition.RECT_BOTTOM,
      offsetTop: 10,
      offsetLeft: -113,
      caretTop: -5,
      caretLeft: 138
    })
  ];

  const options = {
    title: "Share/Export/Print my map",
    screens: helpScreenList
  };

  return new HelpSequence(options);
}

/**
 * @private
 */
function getDownloadCatalogDataForOfflineUse() {
  const screenOneMessage =
    '<div><video id=download_data_video width="592px" height="320px" controls="1"><source src="./images/download_data.mp4" type="video/mp4"><source src="./images/download_data.webm" type="video/webm">Your browser does not support the video tag.</video><p><strong>To download catalogue data for offline use:</strong></p><ol><li>Add a dataset from the data catalogue</li><li>Return to the map and click on a feature or region</li><li>Click on the Download this Table button in the Feature Info panel</li><li>Select your preferred download format (CSV or JSON)</li></ol></div>';
  const screenOneComponentId =
    "tjs-side-panel__button tjs-_buttons__btn tjs-_buttons__btn-primary";

  const helpScreenList = [
    new HelpScreen({
      message: screenOneMessage,
      highlightedComponentId: screenOneComponentId,
      positionLeft: HelpViewState.RelativePosition.RECT_RIGHT,
      positionTop: HelpViewState.RelativePosition.RECT_TOP,
      offsetLeft: 15,
      offsetTop: -3,
      caretTop: 5,
      caretLeft: -5,
      width: 612
    })
  ];

  const options = {
    title: "Download catalogue data for offline use",
    screens: helpScreenList
  };

  return new HelpSequence(options);
}

module.exports = getHelpSequences;
