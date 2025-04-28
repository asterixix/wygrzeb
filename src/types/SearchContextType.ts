import { SearchResultUnion } from './SearchResult';
import { Source } from './DataSource';

export type FilterKey = 'sources' | 'dateRange' | 'language' | 'country' | 'theme' | 'format' | 'goal' | 'datasetType' | 'source' | 'category' | 'sortBy' | 'sourceCategory';

export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResultUnion[];
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
  selectedSources: Source[];
  activeSource: string;
  setActiveSource: (source: string) => void;
  filters: {
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
    mediaTypes?: string[];
  };
  updateFilter: (key: FilterKey, value: any) => void;
  setFilter: (key: FilterKey, value: any) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalResults: number;
  performSearch: (query: string) => Promise<void>;
  addToHistory: (term: string) => void;
  clearHistory: () => void;
  toggleSource: (sourceId: string) => void;
  clearFilters: () => void;
  sort: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  setSort: (sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void;
  dateRange: {
    start: string;
    end: string;
  };
  setDateRange: (dateRange: { start: string; end: string }) => void;
  availableCategories: string[];
  availableMediaTypes: { value: string; label: string }[];
  filteredResults: SearchResultUnion[];
}

export interface SearchFilters {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  language?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  category?: string;
  sourceCategory?: string;
  mediaTypes?: string[];
}
