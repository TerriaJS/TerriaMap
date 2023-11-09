"use strict";

import { runInAction } from "mobx";

import ConsoleAnalytics from "terriajs/lib/Core/ConsoleAnalytics";
import GoogleAnalytics from "terriajs/lib/Core/GoogleAnalytics";
import isDefined from "terriajs/lib/Core/isDefined";
import ShareDataService from "terriajs/lib/Models/ShareDataService";
import registerCustomComponentTypes from "terriajs/lib/ReactViews/Custom/registerCustomComponentTypes";
import Terria from "terriajs/lib/Models/Terria";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import BingMapsSearchProviderViewModel from "terriajs/lib/Models/SearchProviders/BingMapsSearchProvider";
import render from "./lib/Views/render";
import registerCatalogMembers from "terriajs/lib/Models/Catalog/registerCatalogMembers";
import loadPlugins from "./lib/Core/loadPlugins";
import plugins from "./plugins";

const terriaOptions = {
  baseUrl: "build/TerriaJS"
};

// we check exact match for development to reduce chances that production flag isn't set on builds(?)
if (process.env.NODE_ENV === "development") {
  terriaOptions.analytics = new ConsoleAnalytics();
} else {
  terriaOptions.analytics = new GoogleAnalytics();
}

// Construct the TerriaJS application, arrange to show errors to the user, and start it up.
const terria = new Terria(terriaOptions);

// Register all types of catalog members in the core TerriaJS.  If you only want to register a subset of them
// (i.e. to reduce the size of your application if you don't actually use them all), feel free to copy a subset of
registerCatalogMembers();

// Register custom components in the core TerriaJS.  If you only want to register a subset of them, or to add your own,
// insert your custom version of the code in the registerCustomComponentTypes function here instead.
registerCustomComponentTypes(terria);

// Create the ViewState before terria.start so that errors have somewhere to go.
const viewState = new ViewState({
  terria: terria
});

// Add viewState to window global in dev environment for easy debugging
if (process.env.NODE_ENV === "development") {
  window.viewState = viewState;
}

// If we're running in dev mode, disable the built style sheet as we'll be using the webpack style loader.
// Note that if the first stylesheet stops being nationalmap.css then this will have to change.
if (process.env.NODE_ENV !== "production" && module.hot) {
  document.styleSheets[0].disabled = true;
}

/** Terria load procedure:
 * - Terria.start
 * - Load plugins
 * - load init sources
 * - render
 */
module.exports = async function () {
  try {
    await terria.start({
      configUrl: "config.json",
      shareDataService: new ShareDataService({
        terria: terria
      }),
      applicationUrl: window.location
    });
  } catch (e) {
    terria.raiseErrorToUser(e);
  }

  // Load plugins before loading init sources
  // as plugins can register new catalog member types.
  try {
    await loadPlugins(viewState, plugins);
  } catch (e) {
    console.error(`Error loading plugins`);
    console.error(e);
  }

  // Asynchronously load InitSources
  terria.loadInitSources().then((result) => result.raiseError(terria));

  try {
    viewState.searchState.locationSearchProviders = [
      new BingMapsSearchProviderViewModel({
        terria: terria,
        key: terria.configParameters.bingMapsKey
      })
    ];

    // Show a modal disclaimer before user can do anything else.
    if (isDefined(terria.configParameters.globalDisclaimer)) {
      const globalDisclaimer = terria.configParameters.globalDisclaimer;
      const hostname = window.location.hostname;
      if (
        globalDisclaimer.enableOnLocalhost ||
        hostname.indexOf("localhost") === -1
      ) {
        let message = "";
        // Sometimes we want to show a preamble if the user is viewing a site other than the official production instance.
        // This can be expressed as a devHostRegex ("any site starting with staging.") or a negative prodHostRegex ("any site not ending in .gov.au")
        if (
          (isDefined(globalDisclaimer.devHostRegex) &&
            hostname.match(globalDisclaimer.devHostRegex)) ||
          (isDefined(globalDisclaimer.prodHostRegex) &&
            !hostname.match(globalDisclaimer.prodHostRegex))
        ) {
          message += require("./lib/Views/DevelopmentDisclaimerPreamble.html");
        }
        message += require("./lib/Views/GlobalDisclaimer.html");

        const options = {
          title:
            globalDisclaimer.title !== undefined
              ? globalDisclaimer.title
              : "Warning",
          confirmText: globalDisclaimer.buttonTitle || "Ok",
          denyText: globalDisclaimer.denyText || "Cancel",
          denyAction: globalDisclaimer.afterDenyLocation
            ? function () {
                window.location = globalDisclaimer.afterDenyLocation;
              }
            : undefined,
          width: 600,
          height: 550,
          message: message,
          horizontalPadding: 100
        };
        runInAction(() => {
          viewState.disclaimerSettings = options;
          viewState.disclaimerVisible = true;
        });
      }
    }

    // Add font-imports
    const fontImports = terria.configParameters.theme?.fontImports;
    if (fontImports) {
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = fontImports;
      document.head.appendChild(styleSheet);
    }

    render(terria, [], viewState);
  } catch (e) {
    console.error(e);
    console.error(e.stack);
  }
};
