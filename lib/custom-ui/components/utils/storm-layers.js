import {
  getTrackData,
  getTrackGeojson
} from "../layer-selection/forms/metget/helpers/track";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import CompositeCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/CompositeCatalogItem";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import createStratumInstance from "terriajs/lib/Models/Definition/createStratumInstance";
import { InfoSectionTraits } from "terriajs/lib/Traits/TraitsClasses/CatalogMemberTraits";
import LegendTraits from "terriajs/lib/Traits/TraitsClasses/LegendTraits";

//const LAYER_TYPES = ["cone", "track", "points", "labels"];
const LAYER_TYPES = ["cone", "line", "points"];

export function addStormLayers(viewState, item) {
  let icon_url = viewState.terria.configParameters.plugins.hurricaneIconsURL;

  // first see if hurricane layers have already been added for this model run
  // TODO: probably need to figure out a better way to do this
  const item_id = getTruncatedId(item.uniqueId);
  let new_id = item_id + "-hurr_composite";
  const layer = viewState.terria.workbench.items.find(
    (list_item) => list_item.uniqueId === new_id
  );

  if (!layer) {
    // get year, storm number, and advisory for this storm
    const year = "20" + item.infoAsObject["EventDate"].slice(0, 2);
    let stormnumber = item.infoAsObject["StormNumber"];
    // storm number can sometimes start with "al" so must remove if so
    if (stormnumber && stormnumber.length > 3)
      stormnumber = stormnumber.slice(2);
    const advisory = item.infoAsObject["Advisory"];
    let track_geojson = {};

    getTrackData(year, stormnumber, advisory).then((track) => {
      if (track != null) {
        track_geojson = getTrackGeojson(
          track,
          "utc",
          item.infoAsObject["StormName"]
        );

        // create a composite type catalog item to store
        // all of the hurricanes layers (track, cone, points)
        // and add to the workbench
        let composite = createComposite(
          icon_url,
          new_id,
          viewState.terria,
          item
        );

        LAYER_TYPES.forEach((layer_type) => {
          new_id = item_id + "-" + layer_type;
          let geojson_item = new GeoJsonCatalogItem(new_id, viewState.terria);
          geojson_item.setTrait(
            CommonStrata.user,
            "geoJsonData",
            track_geojson[layer_type]
          );

          //set traits for styling the hurricane layers
          if (layer_type === "cone") {
            geojson_item.setTrait(CommonStrata.defaults, "style", {
              //     fill: "#D3D3D3",
              "fill-opacity": 0,
              stroke: "#858585",
              "stroke-opacity": 0.7
            });
          }
          // if (layer_type === "line") {
          //   geojson_item.setTrait(CommonStrata.user, "style", {
          //     stroke: "#858585",
          //     "stroke-width": 1,
          //     "stroke-opacity": 0.8
          //   });
          // }
          if (layer_type === "points") {
            const feature_info = {
              template:
                "<div><p><h3>{{storm_name}}</h3></p> \
              <p><b>Time: </b>{{time_utc}}</p> \
              <p><b>Max Wind Speed: </b>{{max_wind_speed_mph}}</p> \
              <p><b>Min Sea Level Pressure: </b>{{minimum_sea_level_pressure_mb}}</p></div>"
            };
            geojson_item.setTrait(
              CommonStrata.user,
              "featureInfoTemplate",
              feature_info
            );

            geojson_item.setTrait(
              CommonStrata.user,
              "forceCesiumPrimitives",
              true
            );
            geojson_item.setTrait(CommonStrata.user, "perPropertyStyles", [
              {
                properties: { storm_type: "TD" },
                style: {
                  "marker-url": icon_url + "dep.png"
                }
              },
              {
                properties: { storm_type: "TS" },
                style: {
                  "marker-url": icon_url + "storm.png"
                }
              },
              {
                properties: { storm_type: "CAT1" },
                style: {
                  "marker-url": icon_url + "cat_1.png"
                }
              },
              {
                properties: { storm_type: "CAT2" },
                style: {
                  "marker-url": icon_url + "cat_2.png"
                }
              },
              {
                properties: { storm_type: "CAT3" },
                style: {
                  "marker-url": icon_url + "cat_3.png"
                }
              },
              {
                properties: { storm_type: "CAT4" },
                style: {
                  "marker-url": icon_url + "cat_4.png"
                }
              },
              {
                properties: { storm_type: "CAT5" },
                style: {
                  "marker-url": icon_url + "cat_5.png"
                }
              }
            ]);
          }
          composite.add(CommonStrata.definition, geojson_item);
        });
        viewState.terria.workbench.add(composite);
      }
    });
  }
}

export function removeStormLayers(viewState, item) {
  // first look through all the layers in the workbench
  // make sure there are no remaining layers left for this run.
  const item_id = getTruncatedId(item.uniqueId);
  const num_layers = viewState.terria.workbench.items.filter(function (layer) {
    const layer_id = getTruncatedId(layer.uniqueId);
    return layer_id === item_id;
  }).length;

  // only remove the storm layers if all the
  // layers for the same model run are gone.
  if (num_layers <= LAYER_TYPES.length) {
    LAYER_TYPES.forEach((layer_type) => {
      const new_id = item_id + "-" + layer_type;
      const layer = viewState.terria.workbench.items.find(
        (list_item) => list_item.uniqueId === new_id
      );
      viewState.terria.workbench.remove(layer);
    });
  }
}

export function toggleStormLayerVisability(viewState, item) {}

// example uniqueId looks like this: 4419-2023071912-gfsforecast-obs
// just want this part returned: 4419-2023071912-gfsforecast
function getTruncatedId(uniqueId) {
  let item_id_parts = uniqueId.split("-");
  let item_id = item_id_parts[0];
  for (let i = 1; i < item_id_parts.length - 1; i++) {
    item_id = item_id + "-" + item_id_parts[i];
  }

  return item_id;
}

function createComposite(icon_url, new_id, terria, item) {
  // add a legend for this layer
  const legend_trait = new LegendTraits();
  // TODO: need to use real legend here
  // just using any png for now
  legend_trait.url = icon_url + "cat_5.png";
  let composite = new CompositeCatalogItem(new_id, terria);
  composite.setTrait(CommonStrata.user, "legends", [legend_trait]);

  // Create info section for the composite - this code doesn't seem to work
  let info_list = [];

  // add the product type
  let info_value = { name: "ProductType", content: "hurr_composite" };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  // add the storm name
  info_value = { name: "StormName", content: item.infoAsObject["StormName"] };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  // add the advisory number
  info_value = { name: "Advisory", content: item.infoAsObject["Advisory"] };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  // add the date
  info_value = { name: "EventDate", content: item.infoAsObject["EventDate"] };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  // add the grid name
  info_value = { name: "GridType", content: item.infoAsObject["GridType"] };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  // add the type of run
  info_value = { name: "EventType", content: item.infoAsObject["EventType"] };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  // add the location of the run
  info_value = { name: "Location", content: item.infoAsObject["Location"] };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  // add the instance name
  info_value = {
    name: "InstanceName",
    content: item.infoAsObject["InstanceName"]
  };
  info_list.push(createStratumInstance(InfoSectionTraits, info_value));

  composite.setTrait(CommonStrata.user, "info", info_list);

  return composite;
}
