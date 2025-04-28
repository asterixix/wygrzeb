import { FactCheckResult, BaseSearchParams, Source } from './api';
import { NewsArticle, FactCheck, Tweet, Dataset, Statistic } from './news'; // Import specific types

// Union type for all possible search result formats
export type SearchResultUnion = NewsArticle | FactCheck | Tweet | Dataset | Statistic | FactCheckResult; // Include FactCheckResult as potential fallback/base

// Search state interface
export interface SearchState {
  query: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  language: string;
  sources: string[];
  filters: Record<string, any>;
  from?: string;
  to?: string;
  loading: boolean;
  error: string | null;
  results: SearchResultUnion[]; // Use the union type
  totalResults: number;
  searchHistory?: string[];
  selectedSources?: Source[]; // Assuming Source from api.ts is used
}

// Search context type
export interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  executeSearch: (params?: Partial<BaseSearchParams>) => Promise<void>;
  toggleSource: (sourceId: string) => void; // Keep if needed
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  setQuery: (query: string) => void;
  setPage: (page: number) => void;
  // Add other methods/properties exposed by the context based on SearchContext.tsx
}

// Search action types
export type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_SOURCES'; payload: string[] }
  | { type: 'SET_FILTER'; payload: { key: string; value: any } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_DATE_RANGE'; payload: { from?: string; to?: string } }
  | { type: 'SET_SORT'; payload: { sortBy: string; sortOrder: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESULTS'; payload: { results: SearchResultUnion[]; totalResults: number } } // Use the union type
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'SET_SELECTED_SOURCES'; payload: Source[] };

export interface SearchFilters {
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    sources: string[];
    reliability: number | null;
    language: string | null;
    sortBy: 'relevance' | 'date';
}

export interface SearchFiltersType {
  sources: Source[];
  dateRange: {
    start: string;
    end: string;
  };
  language: string;
  country: string;
  theme: string;
  format: string;
  goal: string;
  datasetType: string;
  source: string;
  category: string;
  sortBy: string;
  sourceCategory: string;
}