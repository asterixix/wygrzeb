export interface Source {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  icon?: string;
  description?: string;
}

export type SourceType = 'news' | 'factCheck' | 'social' | 'government' | 'dataset';

export interface ApiResponse {
  results: any[];
  totalResults?: number;
  nextPage?: number | string;
  hasMore?: boolean;
}
