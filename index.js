'use strict';

/*global require*/
var UiWrapper = require('terriajs/lib/ReactViews/UiWrapper.jsx'),
    main = document.getElementById('main'),
    nav = document.getElementById('nav'),
    aside = document.getElementById('aside'),
    mapNav = document.getElementById('map-nav'),
    chart = document.getElementById('chart');

var configuration = {
    terriaBaseUrl: 'build/TerriaJS',
    cesiumBaseUrl: undefined, // use default
    bingMapsKey: undefined, // use Cesium key
    proxyBaseUrl: 'proxy/',
    conversionServiceBaseUrl: 'convert',
    regionMappingDefinitionsUrl: 'data/regionMapping.json'
};

var Terria = require('terriajs/lib/Models/Terria');
var TerriaViewer = require('terriajs/lib/ReactViews/TerriaViewer');
var corsProxy = require('terriajs/lib/Core/corsProxy');
var OgrCatalogItem = require('terriajs/lib/Models/OgrCatalogItem');
var registerCatalogMembers = require('terriajs/lib/Models/registerCatalogMembers');
var raiseErrorToUser = require('terriajs/lib/Models/raiseErrorToUser');
var GoogleUrlShortener = require('terriajs/lib/Models/GoogleUrlShortener');
var isCommonMobilePlatform = require('terriajs/lib/Core/isCommonMobilePlatform');
var ViewerMode = require('terriajs/lib/Models/ViewerMode');
var GoogleAnalytics = require('terriajs/lib/Core/GoogleAnalytics');


// Configure the base URL for the proxy service used to work around CORS restrictions.
corsProxy.baseProxyUrl = configuration.proxyBaseUrl;

// Tell the OGR catalog item where to find its conversion service.  If you're not using OgrCatalogItem you can remove this.
OgrCatalogItem.conversionServiceBaseUrl = configuration.conversionServiceBaseUrl;

// Register all types of catalog members in the core TerriaJS.  If you only want to register a subset of them
// (i.e. to reduce the size of your application if you don't actually use them all), feel free to copy a subset of
// the code in the registerCatalogMembers function here instead.
registerCatalogMembers();

// Construct the TerriaJS application, arrange to show errors to the user, and start it up.
var terria = new Terria({
    appName: 'NationalMap',
    supportEmail: 'data@pmc.gov.au',
    baseUrl: configuration.terriaBaseUrl,
    cesiumBaseUrl: configuration.cesiumBaseUrl,
    regionMappingDefinitionsUrl: configuration.regionMappingDefinitionsUrl,
    analytics: new GoogleAnalytics()
  });
terria.start({
    // If you don't want the user to be able to control catalog loading via the URL, remove the applicationUrl property below
    // as well as the call to "updateApplicationOnHashChange" further down.
    applicationUrl: window.location,
    configUrl: 'config.json',
    defaultTo2D: isCommonMobilePlatform(),
    urlShortener: new GoogleUrlShortener({
        terria: terria
    })
}).otherwise(function(e) {
    raiseErrorToUser(terria, e);
}).always(function() {
    configuration.bingMapsKey = terria.configParameters.bingMapsKey ? terria.configParameters.bingMapsKey : configuration.bingMapsKey;
    //more configurables to come

    // Create the map/globe.
    var terriaViewer = TerriaViewer.create(terria, {
        developerAttribution: {
            text: 'NICTA',
            link: 'http://www.nicta.com.au'
        }
    });

    //temp
    var createAustraliaBaseMapOptions = require('terriajs/lib/ViewModels/createAustraliaBaseMapOptions');
    var createGlobalBaseMapOptions = require('terriajs/lib/ViewModels/createGlobalBaseMapOptions');
    var selectBaseMap = require('terriajs/lib/ViewModels/selectBaseMap');
    // Create the various base map options.
    var australiaBaseMaps = createAustraliaBaseMapOptions(terria);
    var globalBaseMaps = createGlobalBaseMapOptions(terria, configuration.bingMapsKey);

    var allBaseMaps = australiaBaseMaps.concat(globalBaseMaps);
    selectBaseMap(terria, allBaseMaps, 'Bing Maps Aerial with Labels', true);

    terriaViewer.updateBaseMap();

    // Automatically update Terria (load new catalogs, etc.) when the hash part of the URL changes.
    // updateApplicationOnHashChange(terria, window);

    var uiWrapper = new UiWrapper(terria);
    uiWrapper.init(main, nav, aside, mapNav, chart, allBaseMaps);

  });


