export interface DataSet {
  identifier: string;
  title?: string;
  publisher: {
    identifier: string;
    name: string;
    description: string;
    aggKeywords: string;
  };
  catalog: string;
  source: {
    name: string;
  };
}

export interface MagdaItem {
  id: string;
  name?: string;
  recordId: string;
  url: string;
  type: string;
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
