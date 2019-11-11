import PointParameter from "terriajs/lib/Models/PointParameter";
import CatalogMemberMixin from "terriajs/lib/ModelMixins/CatalogMemberMixin";
import CreateModel from "terriajs/lib/Models/CreateModel";
import GeoJsonCatalogItem from "terriajs/lib/Models/GeoJsonCatalogItem";
import DarkSkyCatalogFunctionTraits from "../Traits/DarkSkyCatalogFunctionTraits";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import loadJson from "terriajs/lib/Core/loadJson";
import { runInAction } from "mobx";

/**
 * An example catalog function that shows weather at a point using DarkSky API.
 */
export default class DarkSkyCatalogFunction extends CatalogMemberMixin(
  CreateModel(DarkSkyCatalogFunctionTraits)
) {
  static readonly type = "dark-sky";
  readonly typeName = "Dark Sky";

  readonly parameters = [
    new PointParameter({
      id: "location",
      name: "Selected location",
      isRequired: true,
      converter: undefined
    })
  ];

  async forceLoadMetadata() {
    return;
  }

  async invoke() {
    const point = this.parameters[0];
    if (point.value === undefined) {
      return;
    }

    const longitude = CesiumMath.toDegrees(point.value.longitude);
    const latitude = CesiumMath.toDegrees(point.value.latitude);
    const forecastUrl = `${this.url}/${latitude},${longitude}`;
    const response = await loadJson(forecastUrl);
    if (response === undefined) {
      return;
    }

    const id = `Weather-@${latitude}-${longitude}`;
    const marker = new GeoJsonCatalogItem(id, this.terria);
    runInAction(() => {
      marker.setTrait("user", "name", `Weather @${latitude},${longitude}`);
      marker.setTrait("user", "geoJsonData", <any>{
        type: "FeatureCollection",
        features: [{ ...point.geoJsonFeature, properties: response.currently }],
        totalFeatures: 1
      });
      marker.setTrait("user", "style", {
        "stroke-width": 2,
        stroke: "white",
        fill: undefined,
        "fill-opacity": 0,
        "marker-color": "white",
        "marker-size": undefined,
        "marker-symbol": undefined,
        "marker-opacity": undefined,
        "stroke-opacity": undefined
      });
      marker.setTrait("user", "show", true);
      marker.loadMapItems();
    });
    this.terria.workbench.add(marker);
  }
}
