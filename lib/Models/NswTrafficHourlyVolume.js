"use strict";

var inherit = require("terriajs/lib/Core/inherit");
var DataSourceCatalogItem = require("terriajs/lib/Models/DataSourceCatalogItem");
var CsvCatalogItem = require("terriajs/lib/Models/CsvCatalogItem");
var loadJson = require("terriajs/lib/Core/loadJson");
var overrideProperty = require("terriajs/lib/Core/overrideProperty");
import { json2csv } from "json-2-csv";

const createCatalogMemberFromType = require("terriajs/lib/Models/createCatalogMemberFromType");

var NswTrafficHourlyVolumeCatalogItem = function(terria) {
  DataSourceCatalogItem.call(this, terria);
  this._csvItem = new CsvCatalogItem(this.terria);

  overrideProperty(this, "legendUrls", {
    get: function() {
      if (this._csvItem) return this._csvItem.legendUrls;
    }
  });
};

inherit(DataSourceCatalogItem, NswTrafficHourlyVolumeCatalogItem);

Object.defineProperties(NswTrafficHourlyVolumeCatalogItem.prototype, {
  type: {
    get: function() {
      return "nsw-traffic-hourly-volume";
    }
  },

  typeName: {
    get: function() {
      return "NSW Traffic Hourly Volume";
    }
  },

  dataSource: {
    get: function() {
      return this._csvItem._dataSource;
    }
  },

  concepts: {
    get: function() {
      return this._csvItem.concepts;
    }
  }
});

NswTrafficHourlyVolumeCatalogItem.prototype._getValuesThatInfluenceLoad = function() {
  return [];
};

NswTrafficHourlyVolumeCatalogItem.register = function() {
  createCatalogMemberFromType.register(
    "nsw-traffic-hourly-volume",
    NswTrafficHourlyVolumeCatalogItem
  );
};

function getHoursArr() {
  const hours = [];
  let n = 0;
  while (n < 24) {
    hours.push({
      symbol: n < 12 ? "AM" : "PM",
      label: n < 10 ? `0${n.toString()}` : `${n.toString()}`,
      withPad: n < 10 ? `0${n.toString()}` : n.toString()
    });
    n++;
  }
  return hours;
}

function generateChartString() {
  const hours = getHoursArr();
  return hours
    .map(h => {
      return `${h.label},{{hour_${h.withPad}\}}\n`;
    })
    .join("");
}

function generateTable() {
  const hours = getHoursArr();
  let out = `<table style="width:100%;">
  <tr>
    <th>AM</th>
    <th>PM</th>
  </tr>`;
  let n = 0;
  while (n < 12) {
    const hourAm = hours[n];
    const hourPm = hours[n + 12];
    const str = `<tr>
    <td>${hourAm.label}:00${hourAm.symbol} - {{hour_${hourAm.withPad}}}</td>
    <td>${hourPm.label}:00${hourPm.symbol} - {{hour_${hourPm.withPad}}}</td>
    </tr>`;
    out += str;
    n++;
  }
  out += `</table>`;
  return out;
  // return hours.map(h => {
  //   return `${h.label}${h.symbol}: {{hour_${h.withPad}_direction0\}}<br/>`;
  // }).join('');
}

function getHoursForQuery() {
  const hours = getHoursArr();
  return hours
    .map(h => {
      return `ROUND(AVG(HOUR_${h.withPad}_SUM)) AS HOUR_${h.withPad}`;
    })
    .join(",");
}

function getHoursForSubQuery() {
  const hours = getHoursArr();
  return hours
    .map(h => {
      return `SUM(HOUR_${h.withPad}) AS HOUR_${h.withPad}_SUM`;
    })
    .join(",");
}

NswTrafficHourlyVolumeCatalogItem.prototype._load = function() {
  const that = this;
  const rootUrl = "https://api.transport.nsw.gov.au/v1/roads/spatial?q=";
  const query = encodeURIComponent(`
        SELECT
          REF.STATION_ID,
          NAME,
          LGA,
          SUBURB,
          ROAD_FUNCTIONAL_HIERARCHY AS ROAD_TYPE,
          CASE
            WHEN DIRECTION_SEQ='0' THEN 'BOTH'
            WHEN DIRECTION_SEQ='1' THEN 'NORTH'
            WHEN DIRECTION_SEQ='3' THEN 'EAST'
            WHEN DIRECTION_SEQ='5' THEN 'SOUTH'
            WHEN DIRECTION_SEQ='7' THEN 'WEST'
            WHEN DIRECTION_SEQ='9' THEN 'NORTHBOUND-SOUTHBOUND'
            WHEN DIRECTION_SEQ='10' THEN 'EASTBOUND-WESTBOUND'
            ELSE ''
          END AS DIRECTION_SEQ_NAME,
          WGS84_LATITUDE AS LATITUDE,
          WGS84_LONGITUDE AS LONGITUDE,
          ${getHoursForQuery()}
        FROM
            road_traffic_counts_station_reference as REF
            INNER JOIN LATERAL (
              SELECT STATION_KEY, DATE,
              ${getHoursForSubQuery()}
              FROM road_traffic_counts_hourly_permanent
              WHERE YEAR='2019' AND DAY_OF_WEEK IN ('1','2','3','4','5')
              GROUP BY STATION_KEY,DATE
            ) as SB ON REF.STATION_KEY=SB.STATION_KEY
        GROUP BY
            REF.STATION_ID,NAME,LGA,SUBURB,WGS84_LATITUDE,WGS84_LONGITUDE,ROAD_FUNCTIONAL_HIERARCHY,DIRECTION_SEQ
`);

  this.featureInfoTemplate = {
    template: `<h4 style="margin-top:10px;margin-bottom:5px;">{{name}}</h4>
        Station ID: {{station_id}}<br/>
        LGA: {{lga}}<br/>
        SUBURB: {{suburb}}<br/>
        ROAD TYPE: {{road_type}}<br/>
        PRIMARY DIRECTION CAPTURED: {{direction_seq_name}}<br/>
        <h4 style="margin-top:10px;margin-bottom:5px;">{{year}} Average Hourly Weekday Traffic Volume - 2019</h4>
        ${generateTable()}
        <br/><br/>

  <h5 style="margin-top:5px;margin-bottom:5px;">Average Hourly Weekday Volume - 2019</h5>
  <chart
    id="{{name}}"
    title="{{name}}"
    y-column="Avg Volume"
    x-column="Hour"
  >Hour,Avg Volume\n${generateChartString()}</chart>
  `
  };
  const url = `${rootUrl}${query}`;
  const corsProxy = this.terria.corsProxy;

  const proxiedUrl = corsProxy.getURL(url, "1d");
  return new Promise(function(resolve, reject) {
    loadJson(proxiedUrl).then(function(data) {
      json2csv(data.rows, function(err, csv) {
        that._csvItem.data = csv;
        that._csvItem.load().then(function() {
          resolve();
        });
      });
    });
  });
};

module.exports = NswTrafficHourlyVolumeCatalogItem;
