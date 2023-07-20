import {
  getTrackData,
  getTrackGeojson
} from "../layer-selection/forms/metget/helpers/track";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";

const LAYER_TYPES = ["cone", "points"];

export function addStormLayers(viewState, item) {
  //console.log(item)
  //const LAYER_TYPES = ["cone", "track", "points", "labels"];

  // first see if hurricane layers have already been added for this model run
  // TODO: probably need to figure out a better way to do this
  const item_id = getTruncatedId(item.uniqueId);
  let new_id = item_id + "-" + "cone";
  const layer = viewState.terria.workbench.items.find(
    (list_item) => list_item.uniqueId === new_id
  );

  if (!layer) {
    // get year, storm number, and advisory for this storm
    const year = "20" + item.infoAsObject["EventDate"].slice(0, 2);
    const stormnumber = item.infoAsObject["StormNumber"];
    const advisory = item.infoAsObject["Advisory"];
    getTrackData(year, stormnumber, advisory).then((track) => {
      const info_trait = item.info;
      const track_geojson = getTrackGeojson(track, "utc");
      //console.log(track_geojson)
      // now add points, track, cone, and label
      // geojson catalog items to the workbench
      LAYER_TYPES.forEach((layer_type) => {
        new_id = item_id + "-" + layer_type;
        let geojson_item = new GeoJsonCatalogItem(new_id, viewState.terria);
        geojson_item.setTrait(
          CommonStrata.user,
          "geoJsonData",
          track_geojson[layer_type]
        );
        geojson_item.setTrait(CommonStrata.user, "info", info_trait);

        viewState.terria.workbench.add(geojson_item);
      });
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

  // only remove the storm layers if all of the
  // layers for the same model run are gone.
  if (num_layers <= LAYER_TYPES.length) {
    LAYER_TYPES.forEach((layer_type) => {
      const new_id = item_id + "-" + layer_type;
      console.log("new_id:" + new_id);
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
