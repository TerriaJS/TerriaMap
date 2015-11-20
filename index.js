'use strict';

/*global require*/
var React = window.React = require('react'),
    ReactDOM = require('react-dom'),
    ModalWindow = require('terriajs/lib/ReactViews/ModalWindow.jsx'),
    SidePanel = require('terriajs/lib/ReactViews/SidePanel.jsx'),
    TerriaViewer = require('terriajs/lib/ReactViews/TerriaViewer.js'),
    EventEmitter = require('terriajs/lib/ReactViews/EventEmitter.js'),
    element = document.getElementById('main'),
    nav = document.getElementById('nav');

var configuration = {
    terriaBaseUrl: 'build/TerriaJS',
    cesiumBaseUrl: undefined, // use default
    bingMapsKey: undefined, // use Cesium key
    proxyBaseUrl: 'proxy/',
    conversionServiceBaseUrl: 'convert',
    regionMappingDefinitionsUrl: 'data/regionMapping.json'
};

var Terria = require('terriajs/lib/Models/Terria');
var corsProxy = require('terriajs/lib/Core/corsProxy');
var OgrCatalogItem = require('terriajs/lib/Models/OgrCatalogItem');
var registerCatalogMembers = require('terriajs/lib/Models/registerCatalogMembers');
var raiseErrorToUser = require('terriajs/lib/Models/raiseErrorToUser');
var GoogleUrlShortener = require('terriajs/lib/Models/GoogleUrlShortener');
var isCommonMobilePlatform = require('terriajs/lib/Core/isCommonMobilePlatform');
var ViewerMode = require('terriajs/lib/Models/ViewerMode');

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
    regionMappingDefinitionsUrl: configuration.regionMappingDefinitionsUrl
  });

var emitter = new EventEmitter();
window.emitter = emitter;

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
    var catalogGroups = terria.catalog.group.items;
    ReactDOM.render(<ModalWindow catalog={catalogGroups} />, element);
    ReactDOM.render(<SidePanel terria={terria} />, nav);

    emitter.subscribe('nowViewing', function(data) {
      ReactDOM.render(<SidePanel terria={terria} />, nav);
    });
        // Create the map/globe.
    TerriaViewer.create(terria, {
        developerAttribution: {
            text: 'NICTA',
            link: 'http://www.nicta.com.au'
        }
    });
    terria.viewerMode = ViewerMode.CesiumEllipsoid;

    configuration.bingMapsKey = terria.configParameters.bingMapsKey ? terria.configParameters.bingMapsKey : configuration.bingMapsKey;

    // Automatically update Terria (load new catalogs, etc.) when the hash part of the URL changes.
    //updateApplicationOnHashChange(terria, window);
  });


