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
        YEAR,
        CASE
          WHEN DIRECTION_SEQ='0' THEN 'BOTH'
          WHEN DIRECTION_SEQ='1' THEN 'NORTH'
          WHEN DIRECTION_SEQ='3' THEN 'EAST'
          WHEN DIRECTION_SEQ='5' THEN 'SOUTH'
          WHEN DIRECTION_SEQ='7' THEN 'WEST'
          WHEN DIRECTION_SEQ='9' THEN 'NORTHBOUND-SOUTHBOUND'
          WHEN DIRECTION_SEQ='10' THEN 'EASTBOUND-WESTBOUND'
        END AS PRIMARY_DIRECTION,
        SUM(CASE CLASSIFICATION_TYPE WHEN 'UNCLASSIFIED' THEN TRAFFIC_COUNT ELSE 0 END) AS UNCLASSIFIED_COUNT,
        SUM(CASE CLASSIFICATION_TYPE WHEN 'ALL VEHICLES' THEN TRAFFIC_COUNT ELSE 0 END) AS ALL_VEHICLES_COUNT,
        SUM(CASE CLASSIFICATION_TYPE WHEN 'LIGHT VEHICLES' THEN TRAFFIC_COUNT ELSE 0 END) AS LIGHT_VEHICLES_COUNT,
        SUM(CASE CLASSIFICATION_TYPE WHEN 'HEAVY VEHICLES' THEN TRAFFIC_COUNT ELSE 0 END) AS HEAVY_VEHICLES_COUNT
      FROM road_traffic_counts_station_reference REF
      JOIN road_traffic_counts_yearly_summary SUMM ON REF.STATION_KEY=SUMM.STATION_KEY
      WHERE YEAR IN ('2015','2016','2017','2018','2019')
        AND PERIOD='ALL DAYS'
        AND TRAFFIC_DIRECTION_SEQ='2'
      GROUP BY REF.STATION_ID,NAME,LGA,SUBURB,WGS84_LATITUDE,WGS84_LONGITUDE,YEAR,ROAD_FUNCTIONAL_HIERARCHY,DIRECTION_SEQ
`);

  const url = `${rootUrl}${query}`;

  CsvCatalogItem.call(this, terria, url);

  const detailTrafficDirectionQuery = encodeURIComponent(`
     SELECT TO_CHAR(HOURLY.DATE :: DATE, 'YYYY-MM-DD') AS DATE,
     CASE
      WHEN DIRECTION_SEQ='0' THEN 'BOTH'
      WHEN DIRECTION_SEQ='1' THEN 'NORTH'
      WHEN DIRECTION_SEQ='3' THEN 'EAST'
      WHEN DIRECTION_SEQ='5' THEN 'SOUTH'
      WHEN DIRECTION_SEQ='7' THEN 'WEST'
      WHEN DIRECTION_SEQ='9' THEN 'NORTHBOUND-SOUTHBOUND'
      WHEN DIRECTION_SEQ='10' THEN 'EASTBOUND-WESTBOUND'
    END AS PRIMARY_DIRECTION,
    SUM(CASE TRAFFIC_DIRECTION_SEQ WHEN '0' THEN DAILY_TOTAL ELSE 0 END) AS PRIMARY_DIRECTION_COUNT,
    SUM(CASE TRAFFIC_DIRECTION_SEQ WHEN '1' THEN DAILY_TOTAL ELSE 0 END) AS OPPOSITE_DIRECTION__COUNT
    FROM road_traffic_counts_station_reference REF
      JOIN road_traffic_counts_hourly_permanent HOURLY ON REF.STATION_KEY=HOURLY.STATION_KEY
      WHERE DATE BETWEEN '2019-01-01' AND CURRENT_DATE
    `);

  const detailVehicleTypeQuery = encodeURIComponent(`
     SELECT TO_CHAR(HOURLY.DATE :: DATE, 'YYYY-MM-DD') AS DATE,
    SUM(CASE CLASSIFICATION_SEQ WHEN '0' THEN DAILY_TOTAL ELSE 0 END) AS UNCLASSIFIED_COUNT,
    SUM(CASE CLASSIFICATION_SEQ WHEN '1' THEN DAILY_TOTAL ELSE 0 END) AS ALL_VEHICLES_COUNT,
    SUM(CASE CLASSIFICATION_SEQ WHEN '2' THEN DAILY_TOTAL ELSE 0 END) AS LIGHT_VEHICLES_COUNT,
    SUM(CASE CLASSIFICATION_SEQ WHEN '3' THEN DAILY_TOTAL ELSE 0 END) AS HEAVY_VEHICLES_COUNT
    FROM road_traffic_counts_station_reference REF
      JOIN road_traffic_counts_hourly_permanent HOURLY ON REF.STATION_KEY=HOURLY.STATION_KEY
      WHERE DATE BETWEEN '2019-01-01' AND CURRENT_DATE
    `);

  this.featureInfoTemplate = {
    template: `<h4 style="margin-top:10px;margin-bottom:5px;">{{name}}</h4>
        Station ID: {{station_id}}<br/>
        LGA: {{lga}}<br/>
        SUBURB: {{suburb}}<br/>
        ROAD TYPE: {{road_type}}<br/>
        PRIMARY DIRECTION CAPTURED: {{primary_direction}}<br/>
        <h4 style="margin-top:10px;margin-bottom:5px;">{{year}} Average Daily Traffic Counts</h4>
        Unclassified Count: {{unclassified_count}}<br/>
        Light Vehicles Count: {{light_vehicles_count}}<br/>
        Heavy Vehicles Count: {{heavy_vehicles_count}}<br/>
        All Vehicles Count: {{all_vehicles_count}}<br/>
        <br/><br/>

  <h5 style="margin-top:5px;margin-bottom:5px;">Daily History</h5>
  <chart
    id="{{name}}"
    title="{{name}}"
    sources="${rootUrl}${detailTrafficDirectionQuery} {{#terria.urlEncodeComponent}}AND STATION_ID='{{station_id}}' GROUP BY HOURLY.DATE,DIRECTION_SEQ{{/terria.urlEncodeComponent}},${rootUrl}${detailVehicleTypeQuery} {{#terria.urlEncodeComponent}}AND STATION_ID='{{station_id}}' GROUP BY HOURLY.DATE{{/terria.urlEncodeComponent}}"
    source-names='Chart By Traffic Direction, Chart By Vehicle Type'
    downloads="${rootUrl}${detailTrafficDirectionQuery} {{#terria.urlEncodeComponent}}AND STATION_ID='{{station_id}}' GROUP BY HOURLY.DATE,DIRECTION_SEQ{{/terria.urlEncodeComponent}}"
    download-names='1d'
  ></chart>
  `
  };
  this.tableStyle.colorBins = [
    0,
    1000,
    5000,
    10000,
    20000,
    30000,
    50000,
    70000
  ];
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
