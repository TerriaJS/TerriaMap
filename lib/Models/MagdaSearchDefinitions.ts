export interface MagdaItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
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
  dataSets: any[];
}
