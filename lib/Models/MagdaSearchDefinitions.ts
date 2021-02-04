export interface DataSet {
  identifier: string;
  title?: string;
  type: string;
  isMappable: boolean;
  publisher: {
    identifier: string;
    name: string;
    description: string;
    aggKeywords: string;
  };
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

export interface MagdaDataSetSearchResponse {
  hitCount: number;
  dataSets: DataSet[];
}
