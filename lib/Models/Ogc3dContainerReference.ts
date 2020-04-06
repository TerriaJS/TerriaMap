import ReferenceMixin from "terriajs/lib/ModelMixins/ReferenceMixin";
import UrlMixin from "terriajs/lib/ModelMixins/UrlMixin";
import CreateModel from "terriajs/lib/Models/CreateModel";
import { BaseModel } from "terriajs/lib/Models/Model";
import CatalogMemberReferenceTraits from "terriajs/lib/Traits/CatalogMemberReferenceTraits";
import mixTraits from "terriajs/lib/Traits/mixTraits";
import UrlTraits from "terriajs/lib/Traits/UrlTraits";
import proxyCatalogItemUrl from "terriajs/lib/Models/proxyCatalogItemUrl";
import loadJson from "terriajs/lib/Core/loadJson";
import { JsonObject, JsonArray } from "terriajs/lib/Core/Json";
import CatalogGroup from "terriajs/lib/Models/CatalogGroupNew";

export class Ogc3dContainerReferenceTraits extends mixTraits(
  CatalogMemberReferenceTraits,
  UrlTraits
) {}

export default class Ogc3dContainerReference extends UrlMixin(
  ReferenceMixin(CreateModel(Ogc3dContainerReferenceTraits))
) {
  protected forceLoadReference(previousTarget: BaseModel): Promise<BaseModel> {
    const proxiedUrl = proxyCatalogItemUrl(this, this.uri.toString(), "0d");
    return loadJson(proxiedUrl).then(json => {
      if (json.collections !== undefined) {
        return this.createGroup(json, previousTarget);
      }
      return undefined;
    });
  }

  private createGroup(
    json: any,
    previousTarget: BaseModel
  ): Promise<BaseModel> {
    let group: BaseModel;
    if (previousTarget && previousTarget instanceof CatalogGroup) {
      group = previousTarget;
    } else {
      group = new CatalogGroup(this.uniqueId, this.terria, this);
    }

    const collections = json.collections;

    return Promise.resolve(group);
  }
}
