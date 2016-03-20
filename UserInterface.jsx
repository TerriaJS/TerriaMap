'use strict';

import arrayContains from 'terriajs/lib/Core/arrayContains';
import Branding from 'terriajs/lib/ReactViews/Branding.jsx';
import ChartPanel from 'terriajs/lib/ReactViews/Chart/ChartPanel.jsx';
import DistanceLegend from 'terriajs/lib/ReactViews/DistanceLegend.jsx';
import FeatureInfoPanel from 'terriajs/lib/ReactViews/FeatureInfo/FeatureInfoPanel.jsx';
import knockout from 'terriajs-cesium/Source/ThirdParty/knockout';
import LocationBar from 'terriajs/lib/ReactViews/LocationBar.jsx';
import MapNavigation from 'terriajs/lib/ReactViews/MapNavigation.jsx';
import MobileHeader from 'terriajs/lib/ReactViews/Mobile/MobileHeader.jsx';
import ModalWindow from 'terriajs/lib/ReactViews/ModalWindow.jsx';
import Notification from 'terriajs/lib/ReactViews/Notification.jsx';
import ObserveModelMixin from 'terriajs/lib/ReactViews/ObserveModelMixin';
import React from 'react';
import SidePanel from 'terriajs/lib/ReactViews/SidePanel.jsx';
import ProgressBar from 'terriajs/lib/ReactViews/ProgressBar.jsx';
import ViewState from 'terriajs/lib/ReactViewModels/ViewState.js';

var UserInterface = React.createClass({
    propTypes: {
        terria: React.PropTypes.object,
        allBaseMaps: React.PropTypes.array,
        terriaViewer: React.PropTypes.object
    },

    mixins: [ObserveModelMixin],

    getInitialState() {
        return {
            // True if the notification popup is visible
            notificationIsVisible: false,

            // The title of the notification popup.
            notificationTitle: undefined,

            // The body of the notification popup.
            notificationBody: undefined,

            // True if the feature info panel is visible.
            featureInfoPanelIsVisible: false,

            // True if the feature info panel is collapsed.
            featureInfoPanelIsCollapsed: false
        };
    },

    componentWillMount() {
        this.viewState = new ViewState();

        this.props.terria.error.addEventListener(e => {
            this.setState({
                notificationIsVisible: true,
                notificationTitle: e.title,
                notificationBody: e.message
            });
        });
        knockout.getObservable(this.props.terria, 'pickedFeatures').subscribe(() => {
            this.setState({
                featureInfoPanelIsVisible: true,
                featureInfoPanelIsCollapsed: false
            });
        }, this);

        const  that = this;
        // TO DO(chloe): change window into a container
        window.addEventListener('dragover', e => {
            if (!e.dataTransfer.types || !arrayContains(e.dataTransfer.types, 'Files')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            that.acceptDragDropFile();
        });
    },

    /**
     * Closes the current notification.
     */
    closeNotification() {
        this.setState({
            notificationIsVisible: false
        });
    },

    /**
     * Show feature info panel.
     */
    closeFeatureInfoPanel(){
        this.setState({
            featureInfoPanelIsVisible: false
        });
    },

    /**
     * Opens the explorer panel to show the welcome page.
     * @return {[type]} [description]
     */
    showWelcome() {
        this.viewState.openWelcome();
    },

    /**
     * Changes the open/collapse state of the feature info panel.
     */
    changeFeatureInfoPanelIsCollapsed() {
        this.setState({
            featureInfoPanelIsCollapsed: !this.state.featureInfoPanelIsCollapsed
        });
    },

    acceptDragDropFile(){
        this.viewState.openUserData();
        this.viewState.isDraggingDroppingFile = true;
    },

    render(){
        const terria = this.props.terria;
        const allBaseMaps = this.props.allBaseMaps;
        const terriaViewer = this.props.terriaViewer;
        return (
            <div>
                <div className='header'>
                <MobileHeader terria={terria}
                                  viewState={this.viewState}
                />
                <div className='workbench'>
                    <Branding onClick={this.showWelcome}/>
                    <nav>
                        <SidePanel terria={terria}
                                   viewState={this.viewState}
                        />
                    </nav>
                </div>
                </div>
                <main>
                    <ModalWindow terria={terria}
                                 viewState={this.viewState}
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
                                  onDismiss={this.closeNotification}
                    />
                </div>
                <ProgressBar terria={terria} />
                <FeatureInfoPanel terria={terria}
                                  viewState={this.viewState}
                                  isVisible={this.state.featureInfoPanelIsVisible}
                                  onClose={this.closeFeatureInfoPanel}
                                  isCollapsed ={this.state.featureInfoPanelIsCollapsed}
                                  onChangeFeatureInfoPanelIsCollapsed={this.changeFeatureInfoPanelIsCollapsed}
                />
                <div className='location-distance'>
                  <LocationBar terria={terria}/>
                  <DistanceLegend terria={terria}/>
                </div>
                <ChartPanel terria={terria}
                            viewState={this.viewState}
                            isVisible={this.state.featureInfoPanelIsVisible}
                            onClose={this.closeFeatureInfoPanel}
                            isCollapsed ={this.state.featureInfoPanelIsCollapsed}
                />
            </div>);
    }
});


module.exports = UserInterface;
