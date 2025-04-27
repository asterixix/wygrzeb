import { SearchResultUnion } from './SearchResult';
import { Source } from './DataSource';

export interface SearchFilters {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  language: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  category?: string;
  sourceCategory?: string; // Add this property
}

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
  filters: SearchFilters;
  setFilter: (key: string, value: any) => void;
  updateFilter: (key: string, value: any) => void;
  sort: { sortBy: string; sortOrder: 'asc' | 'desc' };
  setSort: (sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void;
  dateRange: { dateFrom?: string; dateTo?: string };
  setDateRange: (dateRange: { dateFrom?: string; dateTo?: string }) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalResults: number;
  performSearch: (query?: string) => Promise<void>;
  addToHistory: (term: string) => void;
  clearHistory: () => void;
  toggleSource: (sourceId: string) => void;
  clearFilters: () => void;
  executeSearch: () => Promise<void>;
}
