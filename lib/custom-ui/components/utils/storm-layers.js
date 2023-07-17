import {
  getTrackData,
  getTrackGeojson
} from "../layer-selection/forms/metget/helpers/track";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";

export function getStormLayers(viewState, item) {
  const LAYER_TYPES = ["cone", "track", "points", "labels"];

  // first see if hurricane layers have already been added for this model run
  // TODO: probably need to figure out a better way to do this
  let item_id_parts = item.uniqueId.split("-");
  let item_id = item_id_parts[0];
  for (let i = 1; i < item_id_parts.length - 1; i++) {
    item_id = item_id + "-" + item_id_parts[i];
  }
  let new_id = item_id + "-" + "cone";
  //let geojson_item = new GeoJsonCatalogItem(new_id, viewState.terria);
  const layer = viewState.terria.workbench.items.find(
    (list_item) => list_item.uniqueId === new_id
  );

  if (!layer) {
    let layer_list = [];
    getTrackData("2023", "3", "20").then((track) => {
      const info_trait = item.info;
      const track_geojson = getTrackGeojson(track, "utc");
      // now add points, line cone, and label
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
        layer_list.push(geojson_item);
      });
      return layer_list;
    });
  }
}
