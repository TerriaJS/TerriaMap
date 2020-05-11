"use strict";

/*global require*/
var defineProperties = require("terriajs-cesium/Source/Core/defineProperties")
  .default;
var polyline = require("@mapbox/polyline");

var inherit = require("terriajs/lib/Core/inherit");
var loadText = require("terriajs/lib/Core/loadText");
var csv = require("terriajs/lib/ThirdParty/csv");
var GeoJsonCatalogItem = require("terriajs/lib/Models/GeoJsonCatalogItem");

const createCatalogMemberFromType = require("terriajs/lib/Models/createCatalogMemberFromType");

var PolylineCatalogItem = function(terria) {
  const that = this;
  const url = "data/cables_polylines.csv";
  loadText(url).then(function(data) {
    const rows = csv.toObjects(data);
    const fc = {
      type: "FeatureCollection",
      features: []
    };
    for (var i = 0; i < rows.length; i++) {
      const r = rows[i];
      fc.features.push({
        type: "Feature",
        properties: r,
        geometry: polyline.toGeoJSON(r.polyline)
      });
    }
    that.data = fc;
  });
  this.data = { type: "FeatureCollection", features: [] };
  GeoJsonCatalogItem.call(this, terria);
};

inherit(GeoJsonCatalogItem, PolylineCatalogItem);

defineProperties(PolylineCatalogItem.prototype, {
  /**
   * Gets the type of data member represented by this instance.
   * @memberOf NswTrafficVolumeCatalogItem.prototype
   * @type {String}
   */
  type: {
    get: function() {
      return "polyline-csv";
    }
  },

  /**
   * Gets a human-readable name for this type of data source, 'NSW Traffic volume'.
   * @memberOf NswTrafficVolumeCatalogItem.prototype
   * @type {String}
   */
  typeName: {
    get: function() {
      return "Polyline CSV";
    }
  }
});

PolylineCatalogItem.prototype._getValuesThatInfluenceLoad = function() {
  return [];
};

PolylineCatalogItem.register = function() {
  createCatalogMemberFromType.register("polyline-csv", PolylineCatalogItem);
};

module.exports = PolylineCatalogItem;
