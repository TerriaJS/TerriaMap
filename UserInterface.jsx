'use strict';

const React = require('react');
const ModalWindow = require('terriajs/lib/ReactViews/ModalWindow.jsx');
const SidePanel = require('terriajs/lib/ReactViews/SidePanel.jsx');
const FeatureInfoPanel = require('terriajs/lib/ReactViews/FeatureInfoPanel.jsx');
const MapNavigation = require('terriajs/lib/ReactViews/MapNavigation.jsx');

import Branding from 'terriajs/lib/ReactViews/Branding.jsx';

var UiWrapper = React.createClass({
    propTypes: {
        terria: React.PropTypes.object,
        allBaseMaps: React.PropTypes.array,
        terriaViewer: React.PropTypes.object
    },
    getInitialState() {
        return {
            modalWindowIsOpen: true,
            activeTab: 0,
            defaultSearchText: ''
        };
    },

    toggleModalWindow(_action, _activeTab, _callback){
        this.setState({
            modalWindowIsOpen: _action,
            activeTab: _activeTab
        });
        if (_callback){_callback(this);}
    },

    render(){
        const terria = this.props.terria;
        const allBaseMaps = this.props.allBaseMaps;
        const terriaViewer = this.props.terriaViewer;
        return (<div>
            <header className='workbench'>
                <Branding toggleModalWindow={this.toggleModalWindow}/>
            <nav>
                <SidePanel terria={terria}
                toggleModalWindow={this.toggleModalWindow}
                />
            </nav>
            </header>
            <main>
                <ModalWindow terria={terria}
                modalWindowIsOpen={this.state.modalWindowIsOpen}
                activeTab={this.state.activeTab}
                toggleModalWindow={this.toggleModalWindow}
                defaultSearchText={this.state.defaultSearchText}
                />
            </main>
            <div id="map-nav">
            <MapNavigation
            terria={terria}
            allBaseMaps = {allBaseMaps}
            terriaViewer={terriaViewer}
            />
            </div>
            </div>);
    }
});

module.exports = UiWrapper;
