import { toJS } from "mobx";
import filterOutUndefined from "terriajs/lib/Core/filterOutUndefined";
import { JsonObject } from "terriajs/lib/Core/Json";
import loadJson from "terriajs/lib/Core/loadJson";
import ReferenceMixin from "terriajs/lib/ModelMixins/ReferenceMixin";
import UrlMixin from "terriajs/lib/ModelMixins/UrlMixin";
import CatalogGroup from "terriajs/lib/Models/CatalogGroupNew";
import Cesium3DTilesCatalogItem from "terriajs/lib/Models/Cesium3DTilesCatalogItem";
import CommonStrata from "terriajs/lib/Models/CommonStrata";
import CreateModel from "terriajs/lib/Models/CreateModel";
import { BaseModel } from "terriajs/lib/Models/Model";
import proxyCatalogItemUrl from "terriajs/lib/Models/proxyCatalogItemUrl";
import Terria from "terriajs/lib/Models/Terria";
import anyTrait from "terriajs/lib/Traits/anyTrait";
import CatalogMemberReferenceTraits from "terriajs/lib/Traits/CatalogMemberReferenceTraits";
import mixTraits from "terriajs/lib/Traits/mixTraits";
import UrlTraits from "terriajs/lib/Traits/UrlTraits";
import updateModelFromJson from "terriajs/lib/Models/updateModelFromJson";

export class Ogc3dContainerReferenceTraits extends mixTraits(
  CatalogMemberReferenceTraits,
  UrlTraits
) {
  @anyTrait({
    name: "Override",
    description:
      "The properties to apply to the dereferenced item, overriding properties that " +
      "come from the OGC API itself."
  })
  override?: JsonObject;
}

export default class Ogc3dContainerReference extends UrlMixin(
  ReferenceMixin(CreateModel(Ogc3dContainerReferenceTraits))
) {
  static readonly type = "ogc3d";

  get type() {
    return Ogc3dContainerReference.type;
  }

  protected forceLoadReference(
    previousTarget: BaseModel
  ): Promise<BaseModel | undefined> {
    if (this.uri === undefined) {
      return Promise.resolve(undefined);
    }

    const id = this.uniqueId;
    const name = this.name;
    const override = toJS(this.override);

    const proxiedUrl = proxyCatalogItemUrl(this, this.uri.toString(), "0d");
    return loadJson(proxiedUrl).then(json => {
      if (json.collections !== undefined) {
        return Ogc3dContainerReference.loadFromCollections(
          this.terria,
          this,
          id,
          name,
          json,
          previousTarget,
          override
        );
      } else if (json.links !== undefined) {
        return Ogc3dContainerReference.loadFromLandingPage(
          this.terria,
          this,
          id,
          name,
          json,
          previousTarget,
          override
        );
      }
      return undefined;
    });
  }

  private static loadFromLandingPage(
    terria: Terria,
    sourceReference: BaseModel | undefined,
    id: string | undefined,
    name: string | undefined,
    json: any,
    previousTarget: BaseModel,
    override: JsonObject | undefined
  ): Promise<BaseModel | undefined> {
    const links = json.links;
    const dataLinks = links.filter(
      (link: any) => link.rel === "data" && link.href !== undefined
    );
    if (dataLinks.length === 0) {
      return Promise.resolve(undefined);
    }

    const firstDataLink = dataLinks[0];
    const proxiedUrl = proxyCatalogItemUrl(
      sourceReference,
      firstDataLink.href,
      "0d"
    );
    return loadJson(proxiedUrl).then(json => {
      if (json.collections !== undefined) {
        return Ogc3dContainerReference.loadFromCollections(
          terria,
          sourceReference,
          id,
          name,
          json,
          previousTarget,
          override
        );
      }
      return undefined;
    });
  }

  private static loadFromCollections(
    terria: Terria,
    sourceReference: BaseModel | undefined,
    id: string | undefined,
    name: string | undefined,
    json: any,
    previousTarget: BaseModel,
    override: JsonObject | undefined
  ): Promise<BaseModel | undefined> {
    return Ogc3dContainerReference.loadGroup(
      terria,
      sourceReference,
      id,
      name,
      json,
      previousTarget,
      override
    );
  }

  private static loadGroup(
    terria: Terria,
    sourceReference: BaseModel | undefined,
    id: string | undefined,
    name: string | undefined,
    json: any,
    previousTarget: BaseModel,
    override: JsonObject | undefined
  ): Promise<BaseModel> {
    let group: BaseModel;
    if (previousTarget && previousTarget instanceof CatalogGroup) {
      group = previousTarget;
    } else {
      group = new CatalogGroup(id, terria, sourceReference);
    }

    group.setTrait(CommonStrata.definition, "name", name);

    const collections = json.collections;

    const ids = filterOutUndefined(
      collections.map((collection: any) => {
        const collectionId = id + "/" + collection.id;
        const links = collection.links;
        if (links === undefined) {
          return undefined;
        }

        const compatibleLinks = links.filter(
          (link: any) => link.type === "application/json+3dtiles"
        );
        if (compatibleLinks.length === 0) {
          return undefined;
        }

        const existing = terria.getModelById(BaseModel, collectionId);
        const model =
          existing && existing.type === Cesium3DTilesCatalogItem.type
            ? existing
            : new Cesium3DTilesCatalogItem(collectionId, terria);

        if (existing === undefined) {
          terria.addModel(model);
        }

        model.setTrait(CommonStrata.definition, "name", collection.title);
        model.setTrait(
          CommonStrata.definition,
          "description",
          collection.description
        );
        model.setTrait(CommonStrata.definition, "url", compatibleLinks[0].href);

        return model.uniqueId;
      })
    );

    group.setTrait(CommonStrata.definition, "members", ids);

    if (override) {
      updateModelFromJson(group, CommonStrata.override, override, true);
    }

    return Promise.resolve(group);
  }
}
