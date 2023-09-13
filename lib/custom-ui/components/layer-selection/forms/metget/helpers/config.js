// Catalog level definition objects.
const catalogSchema = [
  {
    prop: "model",
    name: "Model",
    format: (value) =>
      ({
        gfs: "GFS",
        nhc: "NHC"
      }[value]),
    icon: "diagram-2-fill",
    advanced: true,
    info: true
  },
  { prop: "storm", name: "Storm", icon: "hurricane", advanced: true },
  { prop: "mesh", name: "Mesh", icon: "grid-fill", advanced: true },
  {
    prop: "advisory",
    name: "Advisory",
    format: (value) => `Advisory ${value}`,
    icon: "exclamation-triangle-fill",
    advanced: true
  },
  {
    prop: "datetime",
    control: "datetime",
    name: "Date and Time",
    icon: "clock-fill",
    advanced: true,
    encode: (value) => value.getTime() / 1000,
    decode: (value) => new Date(value * 1000)
  },
  {
    prop: "ensembleMember",
    name: "Ensemble Member",
    filter: (value) => !["namforecast", "nowcast", "forecast"].includes(value),
    format: (value) =>
      ({
        nhcOfcl: "NHC Official",
        devRight50: "Veer Right 50%",
        devLeft50: "Veer Left 50%"
      }[value]),
    icon: "arrow-left-right",
    advanced: true
  },
  {
    prop: "metric",
    name: "Metric",
    filter: (value) => value !== "obs",
    format: (value) =>
      ({
        maxele63: "Peak Water Surface Elevation",
        maxwvel63: "Maximum Wind Speed",
        swan: "Maximum Wave Height"
      }[value]),
    icon: "bar-chart-line-fill"
  }
];

// Track point marker shapes.
const markerShapes = {
  h: "M 24.65373,20.997978 C 21.728818,26.7657 14.06931,31.641531 4.8786829,31.633223 4.6050068,31.632246 14.675795,26.079066 11.358451,24.1648 6.8667437,21.571231 5.1733733,15.725316 7.4527036,11.066959 10.182133,5.4878779 17.751718,0.09157311 27.108017,0.37746681 c 0.31766,0.009774 -9.527835,5.69490489 -6.360035,7.52364719 4.49073,2.592592 6.251542,8.472228 3.905748,13.096864 z",
  td: "M 16,5.9999998 C 10.47684,5.9999998 6.0000005,10.47735 6.0000005,16 6.0000005,21.52265 10.47735,26 16,26 21.522649,26 26,21.52265 26,16 26,10.47735 21.522649,5.9999998 16,5.9999998 Z M 16,21.18524 c -2.86361,0 -5.18473,-2.32163 -5.18473,-5.18473 0,-2.86311 2.32112,-5.18524 5.18473,-5.18524 2.86361,0 5.18473,2.32163 5.18473,5.18524 0,2.86361 -2.32112,5.18473 -5.18473,5.18473 z",
  ts: "M 24.658829,21.000934 C 27.005948,16.373198 25.244631,10.49073 20.750876,7.8961857 17.581288,6.0669002 27.432341,0.37855954 27.114502,0.36926885 17.75292,0.08272474 10.179061,5.4825654 7.4480904,11.064308 5.1674731,15.725294 6.8617997,21.574511 11.356044,24.169545 14.675261,26.085869 4.5982967,31.641207 4.8726163,31.641696 14.068433,31.650497 21.732265,26.771913 24.658829,21.000934 Z M 13.506591,20.432246 c -2.428779,-1.402403 -3.261028,-4.507446 -1.858625,-6.936714 1.402404,-2.428779 4.507446,-3.261028 6.936714,-1.858625 2.429269,1.402404 3.261029,4.507447 1.858626,6.936226 -1.402404,2.429268 -4.506958,3.261028 -6.936715,1.858624 z"
};
const markers = {
  td: {
    shape: markerShapes.td,
    fill: "#3565ff"
  },
  ts: {
    shape: markerShapes.ts,
    fill: "#5ebbff"
  },
  h1: {
    shape: markerShapes.h,
    fill: "#ffffba"
  },
  h2: {
    shape: markerShapes.h,
    fill: "#ffcc00"
  },
  h3: {
    shape: markerShapes.h,
    fill: "#ff8800"
  },
  h4: {
    shape: markerShapes.h,
    fill: "#ff5000"
  },
  h5: {
    shape: markerShapes.h,
    fill: "#cc0000"
  },
  "td-current": {
    shape: markerShapes.td,
    fill: "#3565ff",
    duration: 3000
  },
  "ts-current": {
    shape: markerShapes.ts,
    fill: "#5ebbff",
    duration: 3000
  },
  "h1-current": {
    shape: markerShapes.h,
    fill: "#ffffba",
    duration: 3000
  },
  "h2-current": {
    shape: markerShapes.h,
    fill: "#ffcc00",
    duration: 3000
  },
  "h3-current": {
    shape: markerShapes.h,
    fill: "#ff8800",
    duration: 3000
  },
  "h4-current": {
    shape: markerShapes.h,
    fill: "#ff5000",
    duration: 3000
  },
  "h5-current": {
    shape: markerShapes.h,
    fill: "#cc0000",
    duration: 3000
  }
};

// Legend item definitions.
const legends = {
  track: {
    colors: [
      "#3565ff",
      "#5ebbff",
      "#ffffba",
      "#ffcc00",
      "#ff8800",
      "#ff5000",
      "#cc0000"
    ],
    labels: ["TD", "TS", "H1", "H2", "H3", "H4", "H5"]
  }
};

// Temporary map of storm name to number.
const stormNumberMap = {
  DANIELLE: 5,
  IAN: 9,
  SEVEN: 7
};

// Basin code for MetGet.
const trackBasin = "al";

// Cone of uncertainty point radii from NOAA.
const trackConeSpecs = {
  2020: {
    hour: [0, 3, 12, 24, 36, 48, 60, 72, 96, 120],
    cone: [9.5, 16, 26, 41, 55, 69, 86, 103, 151, 196]
  },
  2021: {
    hour: [0, 3, 12, 24, 36, 48, 60, 72, 96, 120],
    cone: [9.5, 16, 27, 40, 55, 69, 86, 102, 148, 200]
  },
  2022: {
    hour: [0, 3, 12, 24, 36, 48, 60, 72, 96, 120],
    cone: [9.5, 16, 26, 39, 52, 67, 84, 100, 142, 200]
  },
  2023: {
    hour: [0, 3, 12, 24, 36, 48, 60, 72, 96, 120],
    cone: [9.5, 16, 26, 39, 53, 67, 81, 99, 145, 205]
  }
};

// Map layers that implement the track point popup behavior.
const trackPointLayers = [
  "track-point",
  "track-point-storm",
  "track-point-storm-background"
];

// API URL for retrieving storm track data.
//const trackUrl = "https://api.metget.zachcobell.com/stormtrack";
const trackUrl = "https://api.metget.org/stormtrack";

export default {
  catalogSchema,
  legends,
  markerShapes,
  markers,
  stormNumberMap,
  trackBasin,
  trackConeSpecs,
  trackPointLayers,
  trackUrl
};
