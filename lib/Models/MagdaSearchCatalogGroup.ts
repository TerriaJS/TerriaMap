import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import loadJson from "terriajs/lib/Core/loadJson";
import TerriaError from "terriajs/lib/Core/TerriaError";
import AccessControlMixin from "terriajs/lib/ModelMixins/AccessControlMixin";
import CatalogMemberMixin from "terriajs/lib/ModelMixins/CatalogMemberMixin";
import GroupMixin from "terriajs/lib/ModelMixins/GroupMixin";
import MagdaReferenceTraits from "terriajs/lib/Traits/MagdaReferenceTraits";
import {
  MagdaItem,
  MagdaPortalGroup,
  MagdaGroupSearchResponse,
  MagdaRecordSearchResponse
} from "./MagdaSearchDefinitions";
import CatalogGroup from "terriajs/lib/Models//CatalogGroupNew";
import CommonStrata from "terriajs/lib/Models//CommonStrata";
import CreateModel from "terriajs/lib/Models//CreateModel";
import LoadableStratum from "terriajs/lib/Models//LoadableStratum";
import { BaseModel } from "terriajs/lib/Models//Model";
import proxyCatalogItemUrl from "terriajs/lib/Models//proxyCatalogItemUrl";
import StratumOrder from "terriajs/lib/Models//StratumOrder";
import Terria from "terriajs/lib/Models//Terria";
import CatalogGroupTraits from "terriajs/lib/Traits/CatalogGroupTraits";

export class MagdaStratum extends LoadableStratum(MagdaReferenceTraits) {
  static stratumName = "magdaPortal";
  groups: CatalogGroup[] = [];
  filteredGroups: CatalogGroup[] = [];
  dataSets: MagdaItem[] = [];
  filteredDatasets: MagdaItem[] = [];

  constructor(
    readonly _catalogGroup: MagdaSearchCatalogGroup,
    readonly _magdaItemResponse: MagdaRecordSearchResponse,
    readonly _magdaGroupResponse: MagdaGroupSearchResponse | undefined
  ) {
    super();
    this.dataSets = this.getDataSets();
    this.groups = this.getGroups();
    this.filteredGroups = this.getFilteredGroups();
  }

  duplicateLoadableStratum(model: BaseModel): this {
    return new MagdaStratum(
      model as MagdaSearchCatalogGroup,
      this._magdaItemResponse,
      this._magdaGroupResponse
    ) as this;
  }

  static async load(
    catalogGroup: MagdaSearchCatalogGroup
  ): Promise<MagdaStratum | undefined> {
    let magdaGroupSearchResponse:
      | MagdaGroupSearchResponse
      | undefined = undefined;
    let magdaItemSearchResponse:
      | MagdaRecordSearchResponse
      | undefined = undefined;

    // /api/v0/search/datasets?publisher=AADC&format=geojson&format=kml&format=kmz&format=wms&format=wfs&publishingState=published
    const itemSearchUri = new URI(
      "https://data.gov.au/api/v0/search/datasets?publisher=City%20of%20Launceston&format=ogc%20wms&publishingState=published&limit=5"
    );
    // const itemSearchUri = new URI(catalogGroup.url)
    //   .segment("/api/v0/search/datasets")
    //   .addQuery({ limit: 100, publisher: "json" });

    magdaItemSearchResponse = await paginateThroughResults(
      itemSearchUri,
      catalogGroup
    );

    if (magdaItemSearchResponse === undefined) return undefined;

    return new MagdaStratum(
      catalogGroup,
      magdaItemSearchResponse,
      magdaGroupSearchResponse
    );
  }

  @computed
  get members(): MagdaItem[] {
    return this.dataSets;
  }

  private getDataSets(): MagdaItem[] {
    const dataSets: MagdaItem[] = this._magdaItemResponse.dataSets.map(ds => {
      return { id: ds.identifier, name: ds.title };
    });
    return dataSets;
  }

  private getGroups(): CatalogGroup[] {
    let groups: CatalogGroup[] = [
      ...createUngroupedGroup(this),
      ...createGroupsByPortalGroups(this)
    ];
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

  private getFilteredGroups(): CatalogGroup[] {
    if (this.groups.length === 0) return [];
    return this.groups;
  }

  @action
  createMembersFromDatasets() {
    const items = this.dataSets.map(ds => {
      return {
        id: ds.id,
        name: ds.name,
        recordId: ds.id,
        url: "https://data.gov.au",
        type: "magda",
        isMappable: true
      };
    });

    const theGroup = this.groups.length > 0 ? this.groups[0] : undefined;
    theGroup?.terria.catalog.group.addMembersFromJson(
      CommonStrata.definition,
      items
    );
    // theGroup?.addMembersFromJson(CommonStrata.definition, items);
    theGroup?.terria.catalog.group.loadMembers();
  }

  @action
  addCatalogItemToCatalogGroup(
    catalogItem: any,
    dataset: MagdaItem,
    groupId: string
  ) {
    let group:
      | CatalogGroup
      | undefined = this._catalogGroup.terria.getModelById(
      CatalogGroup,
      groupId
    );
    if (group !== undefined) {
      group.add(CommonStrata.definition, catalogItem);
    }
  }

  // @action
  // addCatalogItemByPortalGroupsToCatalogGroup(
  //   catalogItem: any,
  //   dataset: MagdaItem
  // ) {
  //   if (dataset.groupId === undefined) {
  //     const groupId = this._catalogGroup.uniqueId + "/ungrouped";
  //     this.addCatalogItemToCatalogGroup(catalogItem, dataset, groupId);
  //     return;
  //   }
  //   const groupId = this._catalogGroup.uniqueId + "/" + dataset.groupId;
  //   this.addCatalogItemToCatalogGroup(catalogItem, dataset, groupId);
  // }

  @action
  createMemberFromDataset(dataSet: MagdaItem) {
    const json = {
      name: dataSet.title,
      recordId: dataSet.id,
      url: "https://data.gov.au",
      type: "magda",
      isMappable: true
    };
    const theGroup = this.groups.length > 0 ? this.groups[0] : undefined;
    theGroup?.addMembersFromJson(CommonStrata.definition, [json]);
    theGroup?.loadMembers();
  }
}

StratumOrder.addLoadStratum(MagdaStratum.stratumName);

export default class MagdaSearchCatalogGroup extends GroupMixin(
  CatalogMemberMixin(CreateModel(CatalogGroupTraits))
) {
  static readonly type = "magda-portal";
  url: string = "";
  hideEmptyGroups: boolean = true;

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
        portalStratum.createMembersFromDatasets();
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

function createUngroupedGroup(magdaPortal: MagdaStratum) {
  const groupId = magdaPortal._catalogGroup.uniqueId + "/ungrouped";
  let existingGroup = magdaPortal._catalogGroup.terria.getModelById(
    CatalogGroup,
    groupId
  );
  if (existingGroup === undefined) {
    existingGroup = createGroup(
      groupId,
      magdaPortal._catalogGroup.terria,
      "unknown"
    );
  }
  return [existingGroup];
}

function createGroupsByPortalGroups(magdaPortal: MagdaStratum) {
  if (magdaPortal._magdaGroupResponse === undefined) return [];
  const out: CatalogGroup[] = [];
  magdaPortal._magdaGroupResponse.results.forEach((group: MagdaPortalGroup) => {
    const groupId = magdaPortal._catalogGroup.uniqueId + "/" + group.id;
    let existingGroup = magdaPortal._catalogGroup.terria.getModelById(
      CatalogGroup,
      groupId
    );
    if (existingGroup === undefined) {
      existingGroup = createGroup(
        groupId,
        magdaPortal._catalogGroup.terria,
        group.title
      );
      if (group.description) {
        existingGroup.setTrait(
          CommonStrata.definition,
          "description",
          group.description
        );
      }
    }

    if (
      AccessControlMixin.isMixedInto(existingGroup) &&
      group.access !== undefined
    ) {
      existingGroup.setAccessType(group.access);
    }
    out.push(existingGroup);
  });
  return out;
}

async function paginateThroughResults(
  uri: any,
  catalogGroup: MagdaSearchCatalogGroup
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
    return;
  }
  let nextStart: number = -1;
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

async function getPortalInformation(
  uri: any,
  catalogGroup: MagdaSearchCatalogGroup
) {
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
  catalogGroup: MagdaSearchCatalogGroup,
  baseResults: MagdaRecordSearchResponse,
  nextResultStart: number
) {
  uri.setQuery("start", nextResultStart);
  try {
    const magdaItemSearchResponse = await getPortalInformation(
      uri,
      catalogGroup
    );
    if (magdaItemSearchResponse === undefined) {
      return -1;
    }
    baseResults.dataSets = baseResults.dataSets.concat(
      magdaItemSearchResponse.results
    );
    return magdaItemSearchResponse.nextStart;
  } catch (err) {
    console.log(err);
    return -1;
  }
}
