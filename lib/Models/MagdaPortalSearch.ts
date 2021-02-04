import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import loadJson from "terriajs/lib/Core/loadJson";
import TerriaError from "terriajs/lib/Core/TerriaError";
import CatalogMemberMixin from "terriajs/lib/ModelMixins/CatalogMemberMixin";
import GroupMixin from "terriajs/lib/ModelMixins/GroupMixin";
import MagdaReferenceTraits from "terriajs/lib/Traits/MagdaReferenceTraits";
import {
  DataSet,
  MagdaItem,
  MagdaDataSetSearchResponse
} from "./MagdaSearchDefinitions";
import CatalogGroup from "terriajs/lib/Models/CatalogGroupNew";
import CommonStrata from "terriajs/lib/Models//CommonStrata";
import CreateModel from "terriajs/lib/Models//CreateModel";
import LoadableStratum from "terriajs/lib/Models//LoadableStratum";
import { BaseModel } from "terriajs/lib/Models//Model";
import proxyCatalogItemUrl from "terriajs/lib/Models//proxyCatalogItemUrl";
import StratumOrder from "terriajs/lib/Models//StratumOrder";
import Terria from "terriajs/lib/Models//Terria";
import MagdaPortalSearchTraits from "../Traits/MagdaPortalSearchTraits";

const queryLimit = 500;
const queryFormats =
  "format=geojson&format=kml&format=kmz&format=wms&format=wfs&format=ogc%20wms&publishingState=published";

export class MagdaStratum extends LoadableStratum(MagdaReferenceTraits) {
  static stratumName = "magdaPortal";

  groups: CatalogGroup[] = [];

  constructor(
    readonly _catalogGroup: MagdaPortalSearch,
    readonly _magdaRecordSearchResponse: MagdaDataSetSearchResponse | undefined
  ) {
    super();
    this.groups = this.getGroups();
  }

  duplicateLoadableStratum(model: BaseModel): this {
    return new MagdaStratum(
      model as MagdaPortalSearch,
      this._magdaRecordSearchResponse
    ) as this;
  }

  static async load(
    catalogGroup: MagdaPortalSearch
  ): Promise<MagdaStratum | undefined> {
    const portalUrl: string = catalogGroup.url
      ? catalogGroup.url
      : "https://data.gov.au";

    let magdaRecordSearchResponse:
      | MagdaDataSetSearchResponse
      | undefined = undefined;

    const dataSetSearchUri = new URI(
      `${portalUrl}/api/v0/search/datasets?${queryFormats}&limit=${queryLimit}`
    );

    magdaRecordSearchResponse = await paginateThroughResults(
      dataSetSearchUri,
      catalogGroup
    );

    if (magdaRecordSearchResponse === undefined) return;

    return new MagdaStratum(catalogGroup, magdaRecordSearchResponse);
  }

  private getGroups(): CatalogGroup[] {
    let groups: CatalogGroup[] = [...createGroupsFromDataSets(this)];
    groups.sort(function(a, b) {
      if (a.nameInCatalog === undefined || b.nameInCatalog === undefined)
        return 0;
      if (a.nameInCatalog < b.nameInCatalog) {
        return -1;
      }
      if (a.nameInCatalog > b.nameInCatalog) {
        return 1;
      }
      return 0;
    });
    return groups;
  }

  @action
  addSubGroups() {
    const items = this.groups.map(group => {
      return {
        id: group.uniqueId,
        name: group.name,
        description: group.description,
        type: "group",
        isGroup: true,
        isOpen: false
      };
    });

    const thePortalGroupId = this._catalogGroup.id
      ? this._catalogGroup.id
      : "dga-datasets-grouped-by-publishers";
    const theGroup = this._catalogGroup.terria.getModelById(
      MagdaPortalSearch,
      thePortalGroupId
    );
    theGroup?.addMembersFromJson(CommonStrata.definition, items);
    theGroup?.loadMembers();
  }
}

StratumOrder.addLoadStratum(MagdaStratum.stratumName);

export default class MagdaPortalSearch extends GroupMixin(
  CatalogMemberMixin(CreateModel(MagdaPortalSearchTraits))
) {
  static readonly type = "magda-portal";

  get typeName() {
    return i18next.t("models.magdaPortal.nameGroup");
  }

  @computed
  get cacheDuration(): string {
    return "0d";
  }

  protected forceLoadMetadata(): Promise<void> {
    const portalStratum = <MagdaStratum | undefined>(
      this.strata.get(MagdaStratum.stratumName)
    );
    if (!portalStratum) {
      return MagdaStratum.load(this).then(stratum => {
        if (stratum === undefined) return;
        runInAction(() => {
          this.strata.set(MagdaStratum.stratumName, stratum);
        });
      });
    } else {
      return Promise.resolve();
    }
  }

  protected forceLoadMembers(): Promise<void> {
    return this.loadMetadata().then(() => {
      const portalStratum = <MagdaStratum | undefined>(
        this.strata.get(MagdaStratum.stratumName)
      );
      if (portalStratum) {
        portalStratum.addSubGroups();
      }
    });
  }
}

function createGroup(groupId: string, terria: Terria, groupName: string) {
  const g = new CatalogGroup(groupId, terria);
  g.setTrait(CommonStrata.definition, "name", groupName);
  terria.addModel(g);
  return g;
}

function createGroupsFromDataSets(magdaPortal: MagdaStratum) {
  const portalUrl = magdaPortal._catalogGroup.url;
  if (
    portalUrl === undefined ||
    magdaPortal._magdaRecordSearchResponse === undefined
  )
    return [];
  const out: CatalogGroup[] = [];

  magdaPortal._magdaRecordSearchResponse.dataSets.forEach(
    (dataSet: DataSet) => {
      const publisher = dataSet.publisher;
      const groupId =
        magdaPortal._catalogGroup.uniqueId + "/" + publisher?.identifier;
      let existingGroup = magdaPortal._catalogGroup.terria.getModelById(
        CatalogGroup,
        groupId
      );
      if (existingGroup === undefined) {
        const groupName =
          publisher && publisher.name ? publisher.name : "Unamed Group";
        existingGroup = createGroup(
          groupId,
          magdaPortal._catalogGroup.terria,
          groupName
        );
        if (
          publisher !== null &&
          publisher !== undefined &&
          (publisher.description || publisher.aggKeywords)
        ) {
          existingGroup.setTrait(
            CommonStrata.definition,
            "description",
            publisher.description
              ? publisher.description
              : publisher.aggKeywords
          );
        }
      }

      const item: MagdaItem = {
        id: "dga-" + (dataSet.title ? dataSet.title : dataSet.identifier),
        name: dataSet.title ? dataSet.title : dataSet.identifier,
        recordId: dataSet.identifier,
        url: portalUrl,
        type: "magda",
        isMappable: true
      };

      existingGroup.addMembersFromJson(CommonStrata.definition, [item]);
      existingGroup.terria.catalog.group.loadMembers();

      out.push(existingGroup);
    }
  );
  return out;
}

async function paginateThroughResults(
  uri: any,
  catalogGroup: MagdaPortalSearch
) {
  const magdaPortalResponse = await getPortalInformation(uri, catalogGroup);
  if (magdaPortalResponse === undefined || !magdaPortalResponse) {
    throw new TerriaError({
      title: i18next.t("models.magdaPortal.errorLoadingTitle"),
      message: i18next.t("models.magdaPortal.errorLoadingMessage", {
        email:
          '<a href="mailto:' +
          catalogGroup.terria.supportEmail +
          '">' +
          catalogGroup.terria.supportEmail +
          "</a>"
      })
    });
  }

  let nextStart: number = queryLimit;
  while (nextStart !== -1) {
    nextStart = await getMoreResults(
      uri,
      catalogGroup,
      magdaPortalResponse,
      nextStart
    );
  }
  return magdaPortalResponse;
}

async function getPortalInformation(uri: any, catalogGroup: MagdaPortalSearch) {
  try {
    const response = await loadJson(
      proxyCatalogItemUrl(
        catalogGroup,
        uri.toString(),
        catalogGroup.cacheDuration
      )
    );
    return response;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

async function getMoreResults(
  uri: any,
  catalogGroup: MagdaPortalSearch,
  baseResults: MagdaDataSetSearchResponse,
  nextResultStart: number
) {
  uri.setQuery("start", nextResultStart);
  try {
    const magdaItemSearchResponse: MagdaDataSetSearchResponse = await getPortalInformation(
      uri,
      catalogGroup
    );
    if (magdaItemSearchResponse === undefined) {
      return -1;
    }
    baseResults.dataSets = baseResults.dataSets.concat(
      magdaItemSearchResponse.dataSets
    );

    const start = nextResultStart + magdaItemSearchResponse.dataSets.length;
    // return start >= magdaItemSearchResponse.hitCount ? -1 : start;
    return start < magdaItemSearchResponse.hitCount - 1 ? start : -1;
  } catch (err) {
    console.log(err);
    return -1;
  }
}
