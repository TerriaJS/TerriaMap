import CsvCatalogItem from "terriajs/lib/Models/CsvCatalogItem";
import Terria from "terriajs/lib/Models/Terria";
import { BaseModel } from "terriajs/lib/Models/Model";
import CommonStrata from "terriajs/lib/Models/CommonStrata";

export default class CsvCatalogItemOverride extends CsvCatalogItem {
  constructor(
    id: string | undefined,
    terria: Terria,
    sourceReference?: BaseModel
  ) {
    super(id, terria);

    // this.setTrait(CommonStrata.underride, "enableManualRegionMapping", true);

    console.log(this);
  }
}
