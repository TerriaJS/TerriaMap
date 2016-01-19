'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    ModalWindow = require('terriajs/lib/ReactViews/ModalWindow.jsx'),
    SidePanel = require('terriajs/lib/ReactViews/SidePanel.jsx'),
    CesiumEvent = require('terriajs-cesium/Source/Core/Event'),
    FeatureInfoPanel = require('terriajs/lib/ReactViews/FeatureInfoPanel.jsx'),
    Chart = require('terriajs/lib/ReactViews/Chart.jsx'),
    MapNavigation = require('terriajs/lib/ReactViews/MapNavigation.jsx');

import Branding from 'terriajs/lib/ReactViews/Branding.jsx';

var UiWrapper = function(terria) {
    /**
     * Gets or sets an event that is raised when the nowViewing is updated.
     * @type {CesiumEvent}
     */
    this.nowViewingUpdate = new CesiumEvent();

    /**
     * Gets or sets an event that is raised when the preview is updated.
     * @type {CesiumEvent}
     */
    this.previewUpdate = new CesiumEvent();

    /**
     * Gets or sets an event that is raised when modal window should be opened.
     * @type {CesiumEvent}
     */
    this.openModalWindow = new CesiumEvent();

    /**
     * Gets or sets an event that is raised when terriaViewer is updated
     * @type {CesiumEvent}
     */
    this.terriaViewerUpdate = new CesiumEvent();

    /**
     * Gets or sets an event that is raised when a feature is selected
     * @type {CesiumEvent}
     */
    this.onFeatureSelect = new CesiumEvent();

    /**
     * Gets or sets an event that is raised when searching data
     * @type {CesiumEvent}
     */

    this.searchData = new CesiumEvent();

    this.terria = terria;

    //temp
    window.nowViewingUpdate = this.nowViewingUpdate;
    window.previewUpdate = this.previewUpdate;
    window.openModalWindow = this.openModalWindow;
    window.terriaViewerUpdate = this.terriaViewerUpdate;
    window.onFeatureSelect = this.onFeatureSelect;
    window.searchData = this.searchData;
};

UiWrapper.prototype.init = function(allBaseMaps, terriaViewer) {
    var terria = this.terria;
    ReactDOM.render(<ModalWindow terria={terria} />, document.getElementById('main'));
    ReactDOM.render(<SidePanel terria={terria} />, document.getElementById('nav'));
    ReactDOM.render(<Chart terria={terria} />, document.getElementById('chart'));
    ReactDOM.render(<MapNavigation terria= {terria} allBaseMaps = {allBaseMaps} terriaViewer={terriaViewer} />, document.getElementById('map-nav'));
    ReactDOM.render(<Branding />, document.getElementById('branding'));


    this.onFeatureSelect.addEventListener(function() {
        if (terria.nowViewing.hasItems) {
            ReactDOM.render(<FeatureInfoPanel terria={terria} />, document.getElementById('aside'));
        }
    });

    this.terriaViewerUpdate.addEventListener(function() {
        ReactDOM.render(<MapNavigation terria= {terria} allBaseMaps = {allBaseMaps} terriaViewer={terriaViewer} />, document.getElementById('map-nav'));
    });

};

module.exports = UiWrapper;
