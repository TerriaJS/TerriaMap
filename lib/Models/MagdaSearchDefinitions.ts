export interface DataSet {
  identifier: string;
  title?: string;
  type: string;
  isMappable: boolean;
}

export interface MagdaItem {
  id: string;
  name?: string;
  recordId: string;
  url: string;
  type: string;
  isMappable: boolean;
}

export interface MagdaPortalGroup {
  identifier: string;
  name: string;
  datasetCount: number;
  jurisdiction?: string;
  description?: string;
  email?: string;
  aggKeywords: string;
  website: string;
}

export interface MagdaGroupSearchResponse {
  hitCount: number;
  start: number;
  nextStart: number;
  organisations: MagdaPortalGroup[];
}

export interface MagdaRecordSearchResponse {
  hitCount: number;
  start: number;
  num: number;
  nextStart: number;
  dataSets: DataSet[];
}
