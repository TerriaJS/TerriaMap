import {
  getTrackData,
  getTrackGeojson
} from "../layer-selection/forms/metget/helpers/track";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";

export function addStormLayers(viewState, item) {
  //console.log(item)
  const LAYER_TYPES = ["cone", "track", "points", "labels"];

  // first see if hurricane layers have already been added for this model run
  // TODO: probably need to figure out a better way to do this
  let item_id_parts = item.uniqueId.split("-");
  let item_id = item_id_parts[0];
  for (let i = 1; i < item_id_parts.length - 1; i++) {
    item_id = item_id + "-" + item_id_parts[i];
  }
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
