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
import GltfCatalogItem from 'terriajs/lib/Models/GltfCatalogItem';
import WebMapServiceCatalogGroup from 'terriajs/lib/Models/WebMapServiceCatalogGroup';
import WebMapServiceCatalogItem from 'terriajs/lib/Models/WebMapServiceCatalogItem';
import GeoJsonCatalogItem from "terriajs/lib/Models/GeoJsonCatalogItem";
import MagdaCatalogItem from "terriajs/lib/Models/MagdaCatalogItem";
import CsvCatalogItem from "terriajs/lib/Models/CsvCatalogItem";
import CzmlCatalogItem from "terriajs/lib/Models/CzmlCatalogItem";
import ArcGisMapServerCatalogItem from "terriajs/lib/Models/ArcGisMapServerCatalogItem";
import Cesium3DTilesCatalogItem from "terriajs/lib/Models/Cesium3DTilesCatalogItem";
import createGlobalBaseMapOptions from 'terriajs/lib/ViewModels/createGlobalBaseMapOptions';
import GtfsCatalogItem from 'terriajs/lib/Models/GtfsCatalogItem';
import CesiumTerrainProviderCatalogItem from 'terriajs/lib/Models/CesiumTerrainCatalogItem';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PrimitiveArrayTrait } from 'terriajs/lib/Traits/primitiveArrayTrait';
import { PrimitiveTrait } from 'terriajs/lib/Traits/primitiveTrait';
import { ObjectArrayTrait } from 'terriajs/lib/Traits/objectArrayTrait';
import { ObjectTrait } from 'terriajs/lib/Traits/objectTrait';


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
CatalogMemberFactory.register(GltfCatalogItem.type, GltfCatalogItem);
CatalogMemberFactory.register(GeoJsonCatalogItem.type, GeoJsonCatalogItem);
CatalogMemberFactory.register(MagdaCatalogItem.type, MagdaCatalogItem);
CatalogMemberFactory.register(CsvCatalogItem.type, CsvCatalogItem);
CatalogMemberFactory.register(CzmlCatalogItem.type, CzmlCatalogItem);
CatalogMemberFactory.register(ArcGisMapServerCatalogItem.type, ArcGisMapServerCatalogItem);
CatalogMemberFactory.register(Cesium3DTilesCatalogItem.type, Cesium3DTilesCatalogItem);
CatalogMemberFactory.register(GtfsCatalogItem.type, GtfsCatalogItem);
CatalogMemberFactory.register(CesiumTerrainProviderCatalogItem.type, CesiumTerrainProviderCatalogItem);
const catalogMembers = [
  'ArcGisMapServerCatalogItem',
  'BingMapsCatalogItem',
  'CatalogGroupNew',
  'Cesium3DTilesCatalogItem',
  'CesiumTerrainCatalogItem',
  'CsvCatalogItem',
  'CzmlCatalogItem',
  'GeoJsonCatalogItem',
  'GltfCatalogItem',
  'GtfsCatalogItem',
  'IonImageryCatalogItem',
  'MagdaCatalogGroup',
  'MagdaCatalogItem',
  'OpenStreetMapCatalogItem',
  'WebMapServiceCatalogGroup',
  'WebMapServiceCatalogItem'
];

const zip = new JSZip();
const models = zip.folder('models');

function markdownFromTraitType(trait) {
  let base = '';
  if (trait instanceof PrimitiveTrait || trait instanceof PrimitiveArrayTrait) {
    base = trait.type;
  } else if (trait instanceof ObjectTrait || trait instanceof ObjectArrayTrait ) {
    base = 'object';
  }
  if (trait instanceof PrimitiveArrayTrait || trait instanceof ObjectArrayTrait) {
    return base + '[]';
  } else {
    return base;
  }
}

function markdownFromObjectTrait(objectTrait) {
  return [
    '_Properties_:',
    ...Object.entries(objectTrait.type.traits).map(([k, trait]) => {
      let line1 = '* `' + k + '`';
      const traitType = markdownFromTraitType(trait);
      if (traitType) {
        line1 += ': **' + traitType + '**';
      }
      let description = trait.description.replace(/\n/g, '\r').replace(/\r+\s+/g, '\r    ');

      return line1 + ', ' + description;
    })
  ];
}

catalogMembers.forEach(m => {
  const Member = require(`terriajs/lib/Models/${m}.ts`).default;

  let content = '!!! note\r\r' +
    '    This page is automatically generated from the source code, and is a bit rough.  If you have\r' +
    '    trouble, check the [source code for this type](https://github.com/TerriaJS/terriajs/blob/mobx/lib/Models/' + m + '.ts) or post a message to the [forum](https://groups.google.com/forum/#!forum/terriajs).\r\r';
  content += '## [Initialization File](../../customizing/initialization-files.md) properties:\r\r';
  content += '`"type": "' + Member.type + '"`\r\r';

  Object.entries(Member.traits).forEach(([k, trait]) => {
    content += '\r\r-----\r\r';
    content += '`' + k + '`';
    const traitType = markdownFromTraitType(trait);
    if (traitType) {
      content += ': **' + traitType + '**';
    }
    content += '\r\r';
    content += trait.description + '\r\r';
    if (trait instanceof ObjectTrait || trait instanceof ObjectArrayTrait ) {
      content += markdownFromObjectTrait(trait).join('\r\r') + '\r\r';
    }
  });
  models.file(`${Member.type}.md`, content);
  console.log(content);
});

zip.generateAsync({type:"blob"}).then(function(content) {
  saveAs(content, "models.zip");
});

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
