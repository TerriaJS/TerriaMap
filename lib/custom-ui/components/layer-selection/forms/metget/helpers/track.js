import bearing from "@turf/bearing";
import circle from "@turf/circle";
import destination from "@turf/destination";
import dissolve from "@turf/dissolve";
import distance from "@turf/distance";
import config from "./config";
import { getTrackPointDate } from "./time";

const { trackBasin, trackConeSpecs, trackUrl } = config;

/**
 * Fetch and parse JSON.
 * @param {string} url - JSON URL.
 * @returns {Object}
 */
export async function getJSON(url) {
  const response = await fetch(url);
  if (response.status != 200) return null;
  return (await response.json()).body;
}

/**
 * Retrieve storm track data from MetGet.
 * @param {number} stormYear - Current storm year.
 * @param {number} stormNumber - Current storm number.
 * @param {string} advisoryNumber - Current advisory number.
 * @returns {Object} - Object containing best track and advisory responses.
 */
export async function getTrackData(stormYear, stormNumber, advisoryNumber) {
  if (!stormYear || !stormNumber || !advisoryNumber) return null;

  const url = new URL(trackUrl);
  url.searchParams.set("basin", trackBasin);
  url.searchParams.set("storm", stormNumber.toString().padStart(2, "0"));
  url.searchParams.set("year", stormYear);
  url.searchParams.set("type", "best");
  const bestUrl = url.toString();
  url.searchParams.set("advisory", advisoryNumber.padStart(3, "0"));
  url.searchParams.set("type", "forecast");
  const advisoryUrl = url.toString();
  const [best, advisory] = await Promise.all(
    [bestUrl, advisoryUrl].map(getJSON)
  );
  if (best === null || advisory === null) return null;
  return { best, advisory };
}

/**
 * Calculate the average bearing based on two or three consecutive points from a line.
 * @param {Object} prev - Previous point feature.
 * @param {Object} curr - Current point feature.
 * @param {Object} next - Next point feature.
 * @returns {number} - Bearing in degrees from north.
 */
function avgBearing(prev, curr, next) {
  const bearings = [];
  if (prev) bearings.push(bearing(prev, curr));
  if (next) bearings.push(bearing(curr, next));
  return bearings.length
    ? bearings.reduce((a, b) => a + b) / bearings.length
    : null;
}

/**
 * Build storm track GeoJSON for display on the map.
 * @param {Object} trackData - Raw storm track data from MetGet.
 * @param {string} timezone - Selected timezone setting ("local" or "utc").
 * @returns {Object} - Object with track-related GeoJSON feature collections.
 */
export function getTrackGeojson(trackData, timezone, storm_name = "") {
  if (!trackData) return null;

  // TODO: We're assuming that the second point in the advisory track represents
  // the forecast time. Is this always the case?
  const forecastDate = new Date(
    `${trackData.advisory.geojson.features[1].properties.time_utc}Z`
  );
  const forecastDateTime = forecastDate.toISOString().split(".")[0];
  const forecastTime = forecastDate.getTime();

  // Combine the best and advisory tracks.
  let pointFeatures = trackData.best.geojson.features.filter(
    (feature) => feature.properties.time_utc < forecastDateTime
  );
  pointFeatures.push(...trackData.advisory.geojson.features.slice(1));

  // Assign a property indicating whether this is the storm point.
  // Updated to indicate what type of storm it is
  for (let pointFeature of pointFeatures) {
    // find proper icon for windspeed
    const storm_type = getStormType(pointFeature.properties.max_wind_speed_mph);
    if (storm_type) pointFeature.properties["storm_type"] = storm_type;

    pointFeature.properties.is_storm =
      pointFeature.properties.time_utc == forecastDateTime;

    // Add storm name if it is defined
    if (storm_name) pointFeature.properties["storm_name"] = storm_name;
  }

  const labelFeatures = [];
  const bufferFeatures = [];

  // Find the correct cone radii for the storm year, or use the closest year if
  // the storm year is not available.
  const trackYear = parseInt(trackData.best.query.year, 10);
  let coneSpec = trackConeSpecs[trackYear];
  if (!coneSpec) {
    const specYears = Object.keys(trackConeSpecs);
    const maxYear = Math.max(specYears);
    const minYear = Math.min(specYears);
    coneSpec = trackConeSpecs[trackYear > maxYear ? maxYear : minYear];
  }

  let prevDayOfMonth = null;
  let prevIdx = null;
  let prevRadius = null;
  pointFeatures.slice().forEach((feature, i) => {
    const date = getTrackPointDate(feature, timezone);
    const deltaHours = (date.getTime() - forecastTime) / 3600000; // Convert ms to hrs

    // If this point is on or after the forecast time, build the cone of uncertainty.
    if (deltaHours >= 0) {
      let hourIdx = 0;
      while (
        coneSpec.hour[hourIdx] < deltaHours &&
        coneSpec.hour.length - 1 > hourIdx
      ) {
        hourIdx++;
      }
      // Look up the radius, interpolating if necessary.
      const radiusNmi =
        coneSpec.hour[hourIdx] === deltaHours
          ? coneSpec.cone[hourIdx]
          : ((deltaHours - coneSpec.hour[hourIdx - 1]) /
              (coneSpec.hour[hourIdx] - coneSpec.hour[hourIdx - 1])) *
              (coneSpec.cone[hourIdx] - coneSpec.cone[hourIdx - 1]) +
            coneSpec.cone[hourIdx - 1];
      // Convert radius in nmi to km.
      const radius = radiusNmi * 1.852;
      // Add a circle around the point to the cone.
      bufferFeatures.push(circle(feature, radius));
      // If this point is after the forecast time, draw a polygon whose sides are lines
      // tangent to this circle and the previous circle.
      if (prevIdx !== null) {
        const featureDistance = distance(pointFeatures[prevIdx], feature);
        const featureBearing = avgBearing(pointFeatures[prevIdx], feature);
        const bearingOffset =
          (Math.acos((radius - prevRadius) / featureDistance) * 180) / Math.PI;
        if (!isNaN(bearingOffset)) {
          const currCoords = [-1, 1].map(
            (direction) =>
              destination(
                feature,
                radius,
                featureBearing + (180 - bearingOffset * direction)
              ).geometry.coordinates
          );
          const prevCoords = [1, -1].map(
            (direction) =>
              destination(
                pointFeatures[prevIdx],
                prevRadius,
                featureBearing + (180 - bearingOffset * direction)
              ).geometry.coordinates
          );
          // Add the polygon to the cone.
          bufferFeatures.push({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[...currCoords, ...prevCoords, currCoords[0]]]
            },
            properties: {}
          });
        }
      }
      prevIdx = i;
      prevRadius = radius;
    }

    const dayOfMonth = date.getDate();
    // If this point has a different day of the month than the previous point,
    // Generate the offsets for a date label.
    if (
      (!prevDayOfMonth && pointFeatures.length > 1) ||
      prevDayOfMonth !== dayOfMonth
    ) {
      const avgDegrees = avgBearing(
        pointFeatures[i - 1],
        feature,
        pointFeatures[i + 1]
      );
      const avgRadians = (avgDegrees * Math.PI) / 180;
      labelFeatures.push({
        ...feature,
        properties: {
          label: date.toString().split(" ").slice(1, 3).join(" "),
          textOffset: [Math.cos(avgRadians) * 2.5, Math.sin(avgRadians) * 2.5],
          rotate: avgDegrees + 90
        }
      });
    }
    prevDayOfMonth = dayOfMonth;
  });

  // Dissolve the cone features.
  let coneFeatureCollection = {
    type: "FeatureCollection",
    features: bufferFeatures
  };
  if (bufferFeatures.length)
    coneFeatureCollection = dissolve({
      type: "FeatureCollection",
      features: bufferFeatures
    });

  return {
    cone: coneFeatureCollection,
    labels: {
      type: "FeatureCollection",
      features: labelFeatures
    },
    line: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: pointFeatures.map((point) => point.geometry.coordinates)
      }
    },
    points: { type: "FeatureCollection", features: pointFeatures }
  };
}
// get the type of storm it is, according to saffir-simpson scale
function getStormType(windsp) {
  let storm_type = "";
  switch (true) {
    case windsp <= 38.0 || (windsp > 38.0 && windsp <= 73.0):
      storm_type = "TD";
      break;
    case windsp > 73.0 && windsp <= 95.0:
      storm_type = "CAT1";
      break;
    case windsp > 95.0 && windsp <= 110.0:
      storm_type = "CAT2";
      break;
    case windsp > 110.0 && windsp <= 129.0:
      storm_type = "CAT3";
      break;
    case windsp > 129.0 && windsp <= 156.0:
      storm_type = "CAT4";
      break;
    case windsp > 156.0:
      storm_type = "CAT5";
      break;
    default:
      storm_type = null;
  }
  return storm_type;
}
