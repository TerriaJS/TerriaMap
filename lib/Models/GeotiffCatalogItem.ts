import BoundingRectangle from "terriajs-cesium/Source/Core/BoundingRectangle";
import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import CesiumEvent from "terriajs-cesium/Source/Core/Event";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import WebMercatorTilingScheme from "terriajs-cesium/Source/Core/WebMercatorTilingScheme";
import ImageryLayerFeatureInfo from "terriajs-cesium/Source/Scene/ImageryLayerFeatureInfo";
import ImageryProvider from "terriajs-cesium/Source/Scene/ImageryProvider";
import when from "terriajs-cesium/Source/ThirdParty/when";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import isDefined from "terriajs/lib/Core/isDefined";
const GeoTIFF = require("geotiff");
const plotty = require("plotty");
import SplitterTraits from "terriajs/lib/Traits/SplitterTraits";
import FeatureInfoTraits from "terriajs/lib/Traits/FeatureInfoTraits";
import mixTraits from "terriajs/lib/Traits/mixTraits";
import UrlTraits from "terriajs/lib/Traits/UrlTraits";
import MappableTraits, {
  RectangleTraits
} from "terriajs/lib/Traits/MappableTraits";
import CatalogMemberTraits from "terriajs/lib/Traits/CatalogMemberTraits";
import RasterLayerTraits from "terriajs/lib/Traits/RasterLayerTraits";
import UrlMixin from "terriajs/lib/ModelMixins/UrlMixin";
import CatalogMemberMixin from "terriajs/lib/ModelMixins/CatalogMemberMixin";
import CreateModel from "terriajs/lib/Models/CreateModel";
import Mappable, { ImageryParts } from "terriajs/lib/Models/Mappable";
import { computed } from "mobx";

interface Coords {
  x: number;
  y: number;
  level: number;
}

interface GeotiffImageryProviderOptions {
  url: string;
  minimumZoom?: number;
  maximumZoom?: number;
  rectangle?: Rectangle;
}

export class GeotiffImageryProvider implements ImageryProvider {
  private readonly _url: string;
  private readonly _tilingScheme: WebMercatorTilingScheme;
  private readonly _tileWidth: number;
  private readonly _tileHeight: number;
  private readonly _rectangle: Rectangle;
  private readonly _errorEvent = new CesiumEvent();
  private readonly _ready = true;
  private readonly _tiffPromise: Promise<any>;

  constructor(options: GeotiffImageryProviderOptions) {
    this._url = options.url;

    this._tilingScheme = new WebMercatorTilingScheme();

    this._tileWidth = 256;
    this._tileHeight = 256;

    this._rectangle = isDefined(options.rectangle)
      ? Rectangle.intersection(options.rectangle, this._tilingScheme.rectangle)
      : this._tilingScheme.rectangle;

    // Check the number of tiles at the minimum level.  If it's more than four,
    // throw an exception, because starting at the higher minimum
    // level will cause too many tiles to be downloaded and rendered.
    // const swTile = this._tilingScheme.positionToTileXY(
    //   Rectangle.southwest(this._rectangle),
    //   this._minimumLevel
    // );
    // const neTile = this._tilingScheme.positionToTileXY(
    //   Rectangle.northeast(this._rectangle),
    //   this._minimumLevel
    // );
    // const tileCount =
    //   (Math.abs(neTile.x - swTile.x) + 1) * (Math.abs(neTile.y - swTile.y) + 1);
    // if (tileCount > 4) {
    //   throw new DeveloperError(
    //     "The imagery provider's rectangle and minimumLevel indicate that there are " +
    //       tileCount +
    //       " tiles at the minimum level. Imagery providers with more than four tiles at the minimum level are not supported."
    //   );
    // }

    this._errorEvent = new CesiumEvent();

    this._tiffPromise = GeoTIFF.fromUrl(this._url);

    this._ready = true;
  }

  get url() {
    return this._url;
  }

  get tileWidth() {
    return this._tileWidth;
  }

  get tileHeight() {
    return this._tileHeight;
  }

  get tilingScheme() {
    return this._tilingScheme;
  }

  get rectangle() {
    return this._rectangle;
  }

  get errorEvent() {
    return this._errorEvent;
  }

  get ready() {
    return this._ready;
  }

  get hasAlphaChannel() {
    return true;
  }

  get credit(): Cesium.Credit {
    return <any>undefined;
  }

  get defaultAlpha(): number {
    return <any>undefined;
  }

  get defaultBrightness(): number {
    return <any>undefined;
  }

  get defaultContrast(): number {
    return <any>undefined;
  }

  get defaultGamma(): number {
    return <any>undefined;
  }

  get defaultHue(): number {
    return <any>undefined;
  }

  get defaultSaturation(): number {
    return <any>undefined;
  }

  get defaultMagnificationFilter(): any {
    return undefined;
  }

  get defaultMinificationFilter(): any {
    return undefined;
  }

  get maximumLevel() {
    return 28;
  }

  get minimumLevel() {
    return 0;
  }

  get proxy(): Cesium.Proxy {
    return <any>undefined;
  }

  get readyPromise(): Promise<boolean> {
    return when(true);
  }

  get tileDiscardPolicy(): Cesium.TileDiscardPolicy {
    return <any>undefined;
  }

  getTileCredits(x: number, y: number, level: number): Cesium.Credit[] {
    return [];
  }

  async requestImage(x: number, y: number, level: number) {
    const canvas = document.createElement("canvas");
    canvas.width = this._tileWidth;
    canvas.height = this._tileHeight;
    const rectangle = this._tilingScheme.tileXYToRectangle(x, y, level);
    const tiff = await this._tiffPromise;
    const data = await tiff.readRasters({
      bbox: [
        CesiumMath.toDegrees(rectangle.west),
        CesiumMath.toDegrees(rectangle.south),
        CesiumMath.toDegrees(rectangle.east),
        CesiumMath.toDegrees(rectangle.north)
      ],
      width: this._tileWidth,
      height: this._tileHeight
    });
    const plot = new plotty.plot({
      canvas,
      data: data,
      width: data.width,
      height: data.height,
      domain: [0, 256],
      colorScale: "viridis"
    });
    plot.render();
    return canvas;
  }

  async pickFeatures(
    x: number,
    y: number,
    level: number,
    longitude: number,
    latitude: number
  ) {
    return [];
  }
}

export class ImageCatalogItemTraits extends mixTraits(
  SplitterTraits,
  FeatureInfoTraits,
  UrlTraits,
  RectangleTraits,
  CatalogMemberTraits,
  RasterLayerTraits,
  MappableTraits
) {}

export default class GeotiffCatalogItem
  extends UrlMixin(CatalogMemberMixin(CreateModel(ImageCatalogItemTraits)))
  implements Mappable {
  static type = "geotiff";
  type = "geotiff";

  forceLoadMetadata() {
    return Promise.resolve();
  }
  loadMapItems() {
    return Promise.resolve();
  }
  @computed get imageryProvider() {
    return new GeotiffImageryProvider({
      url: this.url || ""
    });
  }
  @computed
  get mapItems(): [ImageryParts] {
    return [
      {
        imageryProvider: this.imageryProvider,
        alpha: this.opacity,
        show: this.show
      }
    ];
  }
}
