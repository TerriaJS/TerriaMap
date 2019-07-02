'use strict';

/*global require,window */

var terriaOptions = {
    baseUrl: 'build/TerriaJS'
};

// checkBrowserCompatibility('ui');
import GoogleAnalytics from 'terriajs/lib/Core/GoogleAnalytics';
import ShareDataService from 'terriajs/lib/Models/ShareDataService';
import raiseErrorToUser from 'terriajs/lib/Models/raiseErrorToUser';
// import registerAnalytics from 'terriajs/lib/Models/registerAnalytics';
// import registerCatalogMembers from 'terriajs/lib/Models/registerCatalogMembers';
// import registerCustomComponentTypes from 'terriajs/lib/ReactViews/Custom/registerCustomComponentTypes';
import Terria from 'terriajs/lib/Models/Terria';
import updateApplicationOnHashChange from 'terriajs/lib/ViewModels/updateApplicationOnHashChange';
// import updateApplicationOnMessageFromParentWindow from 'terriajs/lib/ViewModels/updateApplicationOnMessageFromParentWindow';
import ViewState from 'terriajs/lib/ReactViewModels/ViewState';
import BingMapsSearchProviderViewModel from 'terriajs/lib/Models/BingMapsSearchProvider';
// import GazetteerSearchProviderViewModel from 'terriajs/lib/ViewModels/GazetteerSearchProviderViewModel.js';
// import GnafSearchProviderViewModel from 'terriajs/lib/ViewModels/GnafSearchProviderViewModel.js';
// import defined from 'terriajs-cesium/Source/Core/defined';
import render from './lib/Views/render';
import CatalogMemberFactory from 'terriajs/lib/Models/CatalogMemberFactory';
import WebMapServiceCatalogGroup from 'terriajs/lib/Models/WebMapServiceCatalogGroup';
import WebMapServiceCatalogItem from 'terriajs/lib/Models/WebMapServiceCatalogItem';
import GeoJsonCatalogItem from "terriajs/lib/Models/GeoJsonCatalogItem";
import MagdaCatalogItem from "terriajs/lib/Models/MagdaCatalogItem";
import CsvCatalogItem from "terriajs/lib/Models/CsvCatalogItem";
import CzmlCatalogItem from "terriajs/lib/Models/CzmlCatalogItem";
import ArcGisMapServerCatalogItem from "terriajs/lib/Models/ArcGisMapServerCatalogItem";
import Cesium3DTilesCatalogItem from "terriajs/lib/Models/Cesium3DTilesCatalogItem";
import createGlobalBaseMapOptions from 'terriajs/lib/ViewModels/createGlobalBaseMapOptions';


// Register all types of catalog members in the core TerriaJS.  If you only want to register a subset of them
// (i.e. to reduce the size of your application if you don't actually use them all), feel free to copy a subset of
// the code in the registerCatalogMembers function here instead.
// registerCatalogMembers();
// registerAnalytics();

terriaOptions.analytics = new GoogleAnalytics();

// Construct the TerriaJS application, arrange to show errors to the user, and start it up.
var terria = new Terria(terriaOptions);

// Register custom components in the core TerriaJS.  If you only want to register a subset of them, or to add your own,
// insert your custom version of the code in the registerCustomComponentTypes function here instead.
// registerCustomComponentTypes(terria);

// Create the ViewState before terria.start so that errors have somewhere to go.
const viewState = new ViewState({
    terria: terria
});

CatalogMemberFactory.register(WebMapServiceCatalogItem.type, WebMapServiceCatalogItem);
CatalogMemberFactory.register(WebMapServiceCatalogGroup.type, WebMapServiceCatalogGroup);
CatalogMemberFactory.register(GeoJsonCatalogItem.type, GeoJsonCatalogItem);
CatalogMemberFactory.register(MagdaCatalogItem.type, MagdaCatalogItem);
CatalogMemberFactory.register(CsvCatalogItem.type, CsvCatalogItem);
CatalogMemberFactory.register(CzmlCatalogItem.type, CzmlCatalogItem);
CatalogMemberFactory.register(ArcGisMapServerCatalogItem.type, ArcGisMapServerCatalogItem);
CatalogMemberFactory.register(Cesium3DTilesCatalogItem.type, Cesium3DTilesCatalogItem);

if (process.env.NODE_ENV === "development") {
    window.viewState = viewState;
}

// If we're running in dev mode, disable the built style sheet as we'll be using the webpack style loader.
// Note that if the first stylesheet stops being nationalmap.css then this will have to change.
if (process.env.NODE_ENV !== "production" && module.hot) {
    document.styleSheets[0].disabled = true;
}

module.exports = terria.start({
    // If you don't want the user to be able to control catalog loading via the URL, remove the applicationUrl property below
    // as well as the call to "updateApplicationOnHashChange" further down.
    applicationUrl: window.location,
    configUrl: 'config.json',
    shareDataService: new ShareDataService({
        terria: terria
    })
}).catch(function(e) {
    raiseErrorToUser(terria, e);
}).finally(function() {
    terria.loadInitSources().catch(e => {
        raiseErrorToUser(terria, e);
    });
    try {
        viewState.searchState.locationSearchProviders = [
            new BingMapsSearchProviderViewModel({
                terria: terria,
                key: terria.configParameters.bingMapsKey
            }),
            // new GazetteerSearchProviderViewModel({terria}),
            // new GnafSearchProviderViewModel({terria})
        ];

        // Automatically update Terria (load new catalogs, etc.) when the hash part of the URL changes.
        updateApplicationOnHashChange(terria, window);
        // updateApplicationOnMessageFromParentWindow(terria, window);

        // Create the various base map options.
        // var createAustraliaBaseMapOptions = require('terriajs/lib/ViewModels/createAustraliaBaseMapOptions');
        // var selectBaseMap = require('terriajs/lib/ViewModels/selectBaseMap');

        // var australiaBaseMaps = createAustraliaBaseMapOptions(terria);
        const globalBaseMaps = createGlobalBaseMapOptions(terria, terria.configParameters.bingMapsKey);
        terria.baseMaps.push(...globalBaseMaps);

        // var allBaseMaps = australiaBaseMaps.concat(globalBaseMaps);
        // selectBaseMap(terria, allBaseMaps, 'Bing Maps Aerial with Labels', true);
        // const allBaseMaps = undefined;

        // Show a modal disclaimer before user can do anything else.
        // if (defined(terria.configParameters.globalDisclaimer)) {
        //     var globalDisclaimer = terria.configParameters.globalDisclaimer;
        //     var hostname = window.location.hostname;
        //     if (globalDisclaimer.enableOnLocalhost || hostname.indexOf('localhost') === -1) {
        //         var message = '';
        //         // Sometimes we want to show a preamble if the user is viewing a site other than the official production instance.
        //         // This can be expressed as a devHostRegex ("any site starting with staging.") or a negative prodHostRegex ("any site not ending in .gov.au")
        //         if (defined(globalDisclaimer.devHostRegex) && hostname.match(globalDisclaimer.devHostRegex) ||
        //             defined(globalDisclaimer.prodHostRegex) && !hostname.match(globalDisclaimer.prodHostRegex)) {
        //                 message += require('./lib/Views/DevelopmentDisclaimerPreamble.html');
        //         }
        //         message += require('./lib/Views/GlobalDisclaimer.html');

        //         var options = {
        //             title: (globalDisclaimer.title !== undefined) ? globalDisclaimer.title : 'Warning',
        //             confirmText: (globalDisclaimer.buttonTitle || "Ok"),
        //             width: 600,
        //             height: 550,
        //             message: message,
        //             horizontalPadding : 100
        //         };
        //         viewState.notifications.push(options);
        //     }
        // }

        render(terria, [], viewState);
    } catch (e) {
        console.error(e);
        console.error(e.stack);
    }
});
