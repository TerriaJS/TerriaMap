'use strict';

import Branding from 'terriajs/lib/ReactViews/Branding.jsx';
import FeatureInfoPanel from 'terriajs/lib/ReactViews/FeatureInfoPanel.jsx';
import MapNavigation from 'terriajs/lib/ReactViews/MapNavigation.jsx';
import ModalWindow from 'terriajs/lib/ReactViews/ModalWindow.jsx';
import Notification from 'terriajs/lib/ReactViews/Notification.jsx';
import React from 'react';
import SidePanel from 'terriajs/lib/ReactViews/SidePanel.jsx';

var UserInterface = React.createClass({
    propTypes: {
        terria: React.PropTypes.object,
        allBaseMaps: React.PropTypes.array,
        terriaViewer: React.PropTypes.object
    },

    getInitialState() {
        return {
            // True if the explorer panel modal window is visible.
            explorerPanelIsVisible: true,

            // The ID of the tab that is visible on the explorer panel.
            explorerPanelActiveTabID: 0,

            // The catalog item that is being previewed.
            previewedCatalogItem: undefined,

            // The text being used to search the map.
            mapSearchText: undefined,

            // The text being used to search the catalog.
            catalogSearchText: undefined,

            // True if the notification popup is visible
            notificationIsVisible: false,

            // The title of the notification popup.
            notificationTitle: undefined,

            // The body of the notification popup.
            notificationBody: undefined
        };
    },

    componentWillMount(){
        this.props.terria.error.addEventListener(function(e) {
            this.setState({
                notificationIsVisible: true,
                notificationTitle: e.title,
                notificationBody: e.message
            });
        });
    },

    /**
     * Closes the current notification.
     */
    dismissNotification(){
        this.setState({
            notificationIsVisible: false
        });
    },

    /**
     * Opens the explorer panel to show the welcome page.
     * @return {[type]} [description]
     */
    showWelcome() {
        this.setState({
            explorerPanelIsVisible: true,
            explorerPanelActiveTabID: 0
        });
    },

    /**
     * Opens the explorer panel to let the user add data.
     */
    addData() {
        this.setState({
            explorerPanelIsVisible: true,
            explorerPanelActiveTabID: 1
        });
    },

    /**
     * Opens the explorer panel to show details of a particular catalog item.
     * @param {CatalogItem} catalogItem The catalog item to show.
     */
    showCatalogItemInfo(catalogItem) {
        this.setState({
            explorerPanelIsVisible: true,
            explorerPanelActiveTabID: 1,
            previewedCatalogItem: catalogItem
        });
    },

    /**
     * Opens the explorer panel to searh for particular text.
     * @param {String} searchText The text to search for.
     */
    searchCatalog(searchText) {
        this.setState({
            explorerPanelIsVisible: true,
            explorerPanelActiveTabID: 1,
            catalogSearchText: searchText
        });
    },

    /**
     * Changes the text being used to search the catalog, e.g. in response to user input.
     * @param {String} newSearchText The new search text.
     */
    changeCatalogSearchText(newSearchText) {
        this.setState({
            catalogSearchText: newSearchText
        });
    },

    /**
     * Changes the text being used to search the map, e.g. in response to user input.
     * @param {String} newSearchText The new search text.
     */
    changeMapSearchText(newSearchText) {
        this.setState({
            mapSearchText: newSearchText
        });
    },

    /**
     * Changes the active tab on the explorer panel.
     * @param {String} newActiveTabID The ID of the new active tab.
     */
    changeExplorerPanelActiveTab(newActiveTabID) {
        this.setState({
            explorerPanelActiveTabID: newActiveTab
        });
    },

    /**
     * Changes the previewed catalog item on the explorer panel.
     * @param {CatalogItem} newPreviewedCatalogItem The new previewed catalog item.
     */
    changePreviewedCatalogItem(newPreviewedCatalogItem) {
        this.setState({
            previewedCatalogItem: newPreviewedCatalogItem
        });
    },

    render(){
        const terria = this.props.terria;
        const allBaseMaps = this.props.allBaseMaps;
        const terriaViewer = this.props.terriaViewer;
        return (
            <div>
                <header className='workbench'>
                    <Branding onClick={this.showWelcome}/>
                <nav>
                    <SidePanel terria={terria}
                               onActivateAddData={this.addData}
                               onActivateCatalogItemInfo={this.showCatalogItemInfo}
                               onSearchCatalog={this.searchCatalog}
                    />
                </nav>
                </header>
                <main>
                    <ModalWindow terria={terria}
                                 isVisible={this.state.explorerPanelIsVisible}
                                 activeTabID={this.state.explorerPanelActiveTabID}
                                 catalogSearchText={this.state.catalogSearchText}
                                 previewedCatalogItem={this.state.previewedCatalogItem}
                                 onSearchTextChanged={this.changeCatalogSearchText}
                                 onActiveTabChanged={this.changeExplorerPanelActiveTab}
                                 onPreviewedCatalogItemChanged={this.changePreviewedCatalogItem}
                    />
                </main>
                <div id="map-nav">
                    <MapNavigation terria={terria}
                                   allBaseMaps={allBaseMaps}
                                   terriaViewer={terriaViewer}
                    />
                </div>
                <div id='notification'>
                    <Notification isVisible={this.state.notificationIsVisible}
                                  title={this.state.notificationTitle}
                                  body={this.state.notificationBody}
                    />
                </div>
            </div>);
    }
});

module.exports = UserInterface;
