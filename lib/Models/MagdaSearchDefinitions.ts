export interface MagdaItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
}

export interface MagdaPortalGroup {
  id: string;
  title: string;
  isInvitationOnly: boolean;
  owner: string;
  description: string;
  snippet: string;
  tags: string[];
  phone: string;
  sortField: string;
  sortOrder: string;
  isViewOnly: boolean;
  isFav: boolean;
  thumbnail: string;
  created: number;
  modified: number;
  access: string;
  userMembership?: {
    username: string;
    memberType: string;
  };
  protected: boolean;
  autoJoin: boolean;
  hasCategorySchema: boolean;
  isOpenData: boolean;
}

export interface MagdaGroupSearchResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: MagdaPortalGroup[];
}

export interface MagdaRecordSearchResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  dataSets: any[];
}
