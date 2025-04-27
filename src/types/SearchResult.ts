export interface BaseSearchResult {
  id: string;
  title: string;
  url: string;
  description?: string;
  source: string;
  date?: string;
  score?: number;
}

export interface NewsResult extends BaseSearchResult {
  type: 'news';
  imageUrl?: string;
  author?: string;
  category?: string;
}

export interface FactCheckResult extends BaseSearchResult {
  type: 'fact-check';
  claimant?: string;
  rating?: string;
  reviewDate?: string;
}

export interface Tweet extends BaseSearchResult {
  type: 'tweet';
  author: string;
  authorUsername: string;
  authorProfileImageUrl?: string;
  retweets?: number;
  likes?: number;
  tweetId: string;
}

export interface DatasetResult extends BaseSearchResult {
  type: 'dataset';
  publisher?: string;
  format?: string;
  lastUpdated?: string;
  fields?: string[];
}

export interface GovernmentDataResult extends BaseSearchResult {
  type: 'government-data';
  institution?: string;
  category?: string;
  publicationDate?: string;
}

export type SearchResultUnion = 
  | NewsResult 
  | FactCheckResult 
  | Tweet 
  | DatasetResult 
  | GovernmentDataResult;
