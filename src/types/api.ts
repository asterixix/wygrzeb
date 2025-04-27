// Base search parameters
export interface BaseSearchParams {
  query: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  language?: string;
  from?: string;
  to?: string;
}

// Google News API parameters
export interface GoogleNewsAPIParams extends BaseSearchParams {
  country?: string;
  excludeDomains?: string;
}

// News API parameters
export interface NewsAPIParams extends BaseSearchParams {
  sources?: string;
  domains?: string;
  excludeDomains?: string;
  category?: string;
}

// Google Fact Check API parameters
export interface GoogleFactCheckAPIParams extends BaseSearchParams {
  reviewPublisher?: string;
  claimant?: string;
  reviewDate?: string;
}

// Twitter API parameters
export interface TwitterAPIParams extends BaseSearchParams {
  username?: string;
  hashtag?: string;
  maxResults?: number;
  includeRetweets?: boolean;
}

// SDG API parameters
export interface SDGAPIParams {
  cel?: number;
  num?: string;
}

// Stat Gov API parameters
export interface StatGovAPIParams extends BaseSearchParams {
  area?: string;
  topic?: string;
  year?: string;
}

// DANE.GOV.PL API parameters
export interface DaneGovAPIParams extends BaseSearchParams {
  category?: string;
  format?: string;
}

// Elasticsearch parameters
export interface ElasticsearchParams extends BaseSearchParams {
  index?: string;
  fields?: string[];
}

// Common result types
export interface Source {
  name: string;
  url: string;
  icon?: string;
  reliability?: 'high' | 'medium' | 'low' | 'unknown';
}

export interface FactCheckResult {
  id: string;
  title: string;
  content?: string;
  url: string;
  source: Source;
  date?: string;
  image?: string;
  rating?: string;
  type?: string;
  relatedLinks?: {
    url: string;
    title: string;
  }[];
  metadata?: any;
}

// API response types
export interface GoogleNewsResponse {
  results: FactCheckResult[];
  totalResults: number;
  source: string;
}

export interface NewsAPIResponse {
   totalResults: number;
   articles: {
     source: { name: string };
     author?: string;
     title: string;
     description?: string;
     url: string;
     urlToImage?: string;
     publishedAt: string;
     content?: string;
   }[];
}

export interface GoogleFactCheckResponse {
   // Add existing properties here
   claims?: {
     text: string;
     claimant?: string;
     claimDate?: string;
     claimReview?: {
       title?: string;
       url?: string;
       publisher?: {
         name?: string;
         site?: string;
       };
       reviewDate?: string;
       textualRating?: string;
       languageCode?: string;
     }[];
   }[];
 }

export interface TwitterResponse {
  results: FactCheckResult[];
  totalResults: number;
  source: string;
}

export interface SDGAPIResponse {
  results: FactCheckResult[];
  totalResults: number;
  source: string;
}

export interface StatGovAPIResponse {
  results: FactCheckResult[];
  totalResults: number;
  source: string;
}

export interface DaneGovDataset {
  id: string;
  title: string;
  notes?: string;
  url?: string;
  organization?: {
    title: string;
  };
  resources?: Array<{
    name: string;
    format: string;
    url: string;
  }>;
  tags?: Array<{
    name: string;
  }>;
}

export interface DaneGovAPIResponse {
  results: FactCheckResult[];
  totalResults: number;
  source: string;
}

export interface ElasticsearchResponse {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: Array<{
      _id: string;
      _score: number;
      _source: any;
    }>;
  };
  aggregations?: any;
}