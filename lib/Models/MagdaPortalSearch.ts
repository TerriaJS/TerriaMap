import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import loadJson from "terriajs/lib/Core/loadJson";
import TerriaError from "terriajs/lib/Core/TerriaError";
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
import LoadableStratum from "terriajs/lib/Models//LoadableStratum";
import { BaseModel } from "terriajs/lib/Models//Model";
import proxyCatalogItemUrl from "terriajs/lib/Models//proxyCatalogItemUrl";
import StratumOrder from "terriajs/lib/Models//StratumOrder";
import Terria from "terriajs/lib/Models//Terria";
import CatalogGroupTraits from "terriajs/lib/Traits/CatalogGroupTraits";

const queryFormats =
  "format=geojson&format=kml&format=kmz&format=wms&format=wfs&format=ogc%20wms&publishingState=published";

export class MagdaStratum extends LoadableStratum(MagdaReferenceTraits) {
  static stratumName = "magdaPortal";

  groups: CatalogGroup[] = [];

  constructor(
    readonly _catalogGroup: MagdaSearchGroups,
    readonly _magdaGroupResponse: MagdaGroupSearchResponse | undefined
  ) {
    super();
    this.groups = this.getGroups();
  }

  duplicateLoadableStratum(model: BaseModel): this {
    return new MagdaStratum(
      model as MagdaSearchGroups,
      this._magdaGroupResponse
    ) as this;
  }

  static async load(
    catalogGroup: MagdaSearchGroups
  ): Promise<MagdaStratum | undefined> {
    let magdaGroupSearchResponse:
      | MagdaGroupSearchResponse
      | undefined = undefined;
    let magdaItemSearchResponse:
      | MagdaRecordSearchResponse
      | undefined = undefined;

    const groupSearchUri = new URI(
      "https://data.gov.au/api/v0/search/organisations?limit=1000"
    );

    magdaGroupSearchResponse = await paginateThroughResults(
      groupSearchUri,
      catalogGroup
    );

    if (magdaGroupSearchResponse === undefined) return undefined;

    return new MagdaStratum(catalogGroup, magdaGroupSearchResponse);
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

  @action
  async createDatasetsForSubGroup(
    groupId: string | undefined,
    groupName: string | undefined
  ) {
    if (groupId === undefined || groupName === undefined) return;
    const theGroup = this._catalogGroup.terria.getModelById(
      CatalogGroup,
      groupId
    );

    const itemSearchUri = new URI(
      `https://data.gov.au/api/v0/search/datasets?publisher=${groupName}&${queryFormats}&limit=1000`
    );

    let res: MagdaRecordSearchResponse | undefined = undefined;

    res = await paginateThroughResults(itemSearchUri, this._catalogGroup);

    if (res === undefined) return;

    const items: MagdaItem[] = res.dataSets.map(ds => {
      return {
        id: "dga-" + (ds.title ? ds.title : ds.identifier),
        name: ds.title ? ds.title : ds.identifier,
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
  createSubGroups() {
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
      MagdaSearchGroups,
      "dga-datasets-grouped-by-organisations"
    );
    theGroup?.addMembersFromJson(CommonStrata.definition, items);
    theGroup?.loadMembers();
    items.map(it => {
      this.createDatasetsForSubGroup(it.id, it.name);
    });
  }
}

StratumOrder.addLoadStratum(MagdaStratum.stratumName);

export default class MagdaSearchGroups extends GroupMixin(
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
        portalStratum.createSubGroups();
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
        if (group.description || group.aggKeywords) {
          existingGroup.setTrait(
            CommonStrata.definition,
            "description",
            group.description ? group.description : group.aggKeywords
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
  catalogGroup: MagdaSearchGroups
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

async function getPortalInformation(uri: any, catalogGroup: MagdaSearchGroups) {
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
  catalogGroup: MagdaSearchGroups,
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
