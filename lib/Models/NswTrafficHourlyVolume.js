"use strict";

/*global require*/
var defineProperties = require("terriajs-cesium/Source/Core/defineProperties")
  .default;

var inherit = require("terriajs/lib/Core/inherit");
var CsvCatalogItem = require("terriajs/lib/Models/CsvCatalogItem");

const createCatalogMemberFromType = require("terriajs/lib/Models/createCatalogMemberFromType");

var NswTrafficVolumeCatalogItem = function(terria) {
  const rootUrl =
    "https://api.transport.nsw.gov.au/v1/roads/spatial?format=csv&q=";
  const query = encodeURIComponent(`
      SELECT
        REF.STATION_ID,
        NAME,
        LGA,
        SUBURB,
        ROAD_FUNCTIONAL_HIERARCHY AS ROAD_TYPE,
        WGS84_LATITUDE AS LATITUDE,
        WGS84_LONGITUDE AS LONGITUDE,
        AVG(CASE HOUR_00) AS HOUR_00,
        AVG(CASE HOUR_01) AS HOUR_01
      FROM road_traffic_counts_station_reference REF
      JOIN road_traffic_counts_hourly_permanent SUMM ON REF.STATION_KEY=SUMM.STATION_KEY
      WHERE YEAR='2019'
        AND DAY_OF_WEEK IN ('1', '2', '3', '4, '5)
      GROUP BY REF.STATION_ID,NAME,LGA,SUBURB,WGS84_LATITUDE,WGS84_LONGITUDE,YEAR,ROAD_FUNCTIONAL_HIERARCHY
`);

  const url = `${rootUrl}${query}`;

  CsvCatalogItem.call(this, terria, url);

  // const detailQuery = encodeURIComponent(`
  //    SELECT TO_CHAR(HOURLY.DATE :: DATE, 'YYYY-MM-DD') AS DATE,
  //   SUM(CASE CARDINAL_DIRECTION_SEQ WHEN '1' THEN DAILY_TOTAL ELSE 0 END) AS NORTH_COUNT,
  //   SUM(CASE CARDINAL_DIRECTION_SEQ WHEN '5' THEN DAILY_TOTAL ELSE 0 END) AS SOUTH_COUNT,
  //   SUM(CASE CARDINAL_DIRECTION_SEQ WHEN '3' THEN DAILY_TOTAL ELSE 0 END) AS EAST_COUNT,
  //   SUM(CASE CARDINAL_DIRECTION_SEQ WHEN '7' THEN DAILY_TOTAL ELSE 0 END) AS WEST_COUNT
  //   FROM road_traffic_counts_station_reference REF
  //     JOIN road_traffic_counts_hourly_permanent HOURLY ON REF.STATION_KEY=HOURLY.STATION_KEY
  //     WHERE DATE BETWEEN '2019-01-01' AND CURRENT_DATE
  //   `);

  // this.featureInfoTemplate = {
  //   template: `<h4 style="margin-top:10px;margin-bottom:5px;">{{name}}</h4>
  //       Station ID: {{station_id}}<br/>
  //       LGA: {{lga}}<br/>
  //       SUBURB: {{suburb}}<br/>
  //       ROAD TYPE: {{road_type}}
  //       <h4 style="margin-top:10px;margin-bottom:5px;">{{year}} Average Daily Traffic Counts</h4>
  //       Unclassified Count: {{unclassified_count}}<br/>
  //       Light Vehicles Count: {{light_vehicles_count}}<br/>
  //       Heavy Vehicles Count: {{heavy_vehicles_count}}<br/>
  //       All Vehicles Count: {{all_vehicles_count}}<br/>
  //       <br/><br/>

  // <h5 style="margin-top:5px;margin-bottom:5px;">Daily History</h5>
  // <chart
  //   id="{{name}}"
  //   title="{{name}}"
  //   sources="${rootUrl}${detailQuery} {{#terria.urlEncodeComponent}}AND STATION_ID='{{station_id}}' GROUP BY HOURLY.DATE{{/terria.urlEncodeComponent}}"
  //   source-names='Chart By Traffic Direction, Chart By Vehicle Type'
  //   downloads="${rootUrl}${detailQuery} {{#terria.urlEncodeComponent}}AND STATION_ID='{{station_id}}' GROUP BY HOURLY.DATE{{/terria.urlEncodeComponent}}"
  //   download-names='1d'
  // ></chart>
  // `
  // };
  // this.tableStyle.colorBins = [
  //   0,
  //   1000,
  //   5000,
  //   10000,
  //   20000,
  //   30000,
  //   50000,
  //   70000
  // ];
};

inherit(CsvCatalogItem, NswTrafficVolumeCatalogItem);

defineProperties(NswTrafficVolumeCatalogItem.prototype, {
  /**
   * Gets the type of data member represented by this instance.
   * @memberOf NswTrafficVolumeCatalogItem.prototype
   * @type {String}
   */
  type: {
    get: function() {
      return "nsw-traffic-volume";
    }
  },

  /**
   * Gets a human-readable name for this type of data source, 'NSW Traffic volume'.
   * @memberOf NswTrafficVolumeCatalogItem.prototype
   * @type {String}
   */
  typeName: {
    get: function() {
      return "NSW Traffic Volume";
    }
  }
});

NswTrafficVolumeCatalogItem.prototype._getValuesThatInfluenceLoad = function() {
  return [];
};

NswTrafficVolumeCatalogItem.register = function() {
  createCatalogMemberFromType.register(
    "nsw-traffic-volume",
    NswTrafficVolumeCatalogItem
  );
};

module.exports = NswTrafficVolumeCatalogItem;
