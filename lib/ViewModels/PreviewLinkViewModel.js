'use strict';

/*global require*/
var knockout = require('terriajs-cesium/Source/ThirdParty/knockout');
var loadView = require('terriajs/lib/Core/loadView');

function PreviewLinkViewModel(options) {
    this.terria = options.terria;
    this.isShown = true;

    knockout.track(this, ['isShown']);
}

PreviewLinkViewModel.prototype.hide = function(container) {
    this.isShown = false;
};

PreviewLinkViewModel.create = function(options) {
    var viewModel = new PreviewLinkViewModel(options);
    loadView(require('../Views/PreviewLink.html'), options.container, viewModel);
    return viewModel;
};

module.exports = PreviewLinkViewModel;
