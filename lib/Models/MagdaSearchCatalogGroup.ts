import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import loadJson from "terriajs/lib/Core/loadJson";
import TerriaError from "terriajs/lib/Core/TerriaError";
// import AccessControlMixin from "terriajs/lib/ModelMixins/AccessControlMixin";
import CatalogMemberMixin from "terriajs/lib/ModelMixins/CatalogMemberMixin";
import GroupMixin from "terriajs/lib/ModelMixins/GroupMixin";
import MagdaReferenceTraits from "terriajs/lib/Traits/MagdaReferenceTraits";
import {
  MagdaItem,
  MagdaPortalGroup,
  MagdaGroupSearchResponse,
  MagdaRecordSearchResponse
} from "./MagdaSearchDefinitions";
import CatalogGroup from "terriajs/lib/Models/CatalogGroupNew";
import CommonStrata from "terriajs/lib/Models//CommonStrata";
import CreateModel from "terriajs/lib/Models//CreateModel";
// import Group from "terriajs/lib/Models/Group";
import LoadableStratum from "terriajs/lib/Models//LoadableStratum";
import { BaseModel } from "terriajs/lib/Models//Model";
import proxyCatalogItemUrl from "terriajs/lib/Models//proxyCatalogItemUrl";
import StratumOrder from "terriajs/lib/Models//StratumOrder";
import Terria from "terriajs/lib/Models//Terria";
import CatalogGroupTraits from "terriajs/lib/Traits/CatalogGroupTraits";

interface GroupDataSets {
  [Key: string]: MagdaItem[];
}

export class MagdaStratum extends LoadableStratum(MagdaReferenceTraits) {
  static stratumName = "magdaPortal";

  groups: CatalogGroup[] = [];
  filteredGroups: CatalogGroup[] = [];
  dataSets: MagdaItem[] = [];
  groupDataSets: GroupDataSets = {};
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

    const groupSearchUri = new URI(
      "https://data.gov.au/api/v0/search/organisations"
    );

    magdaGroupSearchResponse = await paginateThroughResults(
      groupSearchUri,
      catalogGroup
    );

    if (magdaGroupSearchResponse === undefined) return undefined;

    magdaGroupSearchResponse.organisations.map(group => {});

    // https://data.gov.au/api/v0/search/datasets?publisher=AADC&format=geojson&format=kml&format=kmz&format=wms&format=wfs&format=ogc%20wms&publishingState=published
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
    let groups: CatalogGroup[] = [...createGroupsByPortalGroups(this)];
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
  async createGroupDatasets(
    groupId: string | undefined,
    groupName: string | undefined
  ) {
    if (groupId === undefined || groupName === undefined) return;
    const theGroup = this._catalogGroup.terria.getModelById(
      CatalogGroup,
      groupId
    );

    // https://data.gov.au/api/v0/search/datasets?publisher=AADC&format=geojson&format=kml&format=kmz&format=wms&format=wfs&format=ogc%20wms&publishingState=published
    const itemSearchUri = new URI(
      `https://data.gov.au/api/v0/search/datasets?publisher=${groupName}&format=geojson&format=wms&format=wfs&format=ogc%20wms&publishingState=published&limit=5`
    );
    // const itemSearchUri = new URI("https://data.gov.au")
    //   .segment("/api/v0/search/datasets")
    //   .addQuery({ limit: 10, publisher: groupName, format: "ogc%20wms", publishingState: "published"});

    let res: MagdaRecordSearchResponse | undefined = undefined;

    res = await paginateThroughResults(itemSearchUri, this._catalogGroup);

    if (res === undefined) return;

    const items = res.dataSets.map(ds => {
      return {
        id: ds.title,
        name: ds.title,
        recordId: ds.identifier,
        url: "https://data.gov.au",
        type: "magda",
        isMappable: true
      };
    });

    theGroup?.addMembersFromJson(CommonStrata.definition, items);
    theGroup?.terria.catalog.group.loadMembers();
  }

  @action
  createMembersFromGroups() {
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

    const theGroup = this._catalogGroup.terria.getModelById(
      MagdaSearchCatalogGroup,
      "dga-datasets-grouped-by-organisations"
    );
    theGroup?.addMembersFromJson(CommonStrata.definition, items);
    theGroup?.loadMembers();
    items.map(it => {
      this.createGroupDatasets(it.id, it.name);
    });
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
  static readonly type = "magda-groups";
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
        // portalStratum.createMembersFromDatasets();
        portalStratum.createMembersFromGroups();
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
  magdaPortal._magdaGroupResponse.organisations.forEach(
    (group: MagdaPortalGroup) => {
      const groupId =
        magdaPortal._catalogGroup.uniqueId + "/" + group.identifier;
      let existingGroup = magdaPortal._catalogGroup.terria.getModelById(
        CatalogGroup,
        groupId
      );
      if (existingGroup === undefined) {
        existingGroup = createGroup(
          groupId,
          magdaPortal._catalogGroup.terria,
          group.name
        );
        if (group.description) {
          existingGroup.setTrait(
            CommonStrata.definition,
            "description",
            group.description
          );
        }
      }

      out.push(existingGroup);
    }
  );
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
