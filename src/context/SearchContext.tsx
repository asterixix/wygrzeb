'use client';

import { createContext, useContext, useCallback, useReducer, ReactNode } from 'react';
import { SearchResultUnion } from '@/types/SearchResult';
import { Source } from '@/types/DataSource';
import { SearchContextType, SearchFilters } from '@/types/SearchContextType';
import { fetchSearchResults } from '@/utils/searchService';

// Initial state for search filters
const initialFilters: SearchFilters = {
  sortBy: 'relevance',
  sortOrder: 'desc',
  language: 'en',
  country: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  source: undefined,
  category: undefined,
  sourceCategory: undefined, // Add this property
};

const initialSources: Source[] = [
  { id: 'newsapi', name: 'News API', category: 'news', enabled: true },
  { id: 'google-news', name: 'Google News', category: 'news', enabled: true },
  { id: 'google-fact-check', name: 'Google Fact Check', category: 'factCheck', enabled: true },
  { id: 'twitter', name: 'Twitter', category: 'social', enabled: true },
  { id: 'dane-gov-pl', name: 'Dane Gov PL', category: 'government', enabled: true },
  { id: 'stat-gov-poland', name: 'Stat Gov Poland', category: 'government', enabled: true },
  { id: 'sdg-poland', name: 'SDG Poland', category: 'dataset', enabled: true },
];

type SearchState = {
  searchTerm: string;
  searchResults: SearchResultUnion[];
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
  selectedSources: Source[];
  activeSource: string;
  filters: SearchFilters;
  sort: { sortBy: string; sortOrder: 'asc' | 'desc' };
  dateRange: { dateFrom?: string; dateTo?: string };
  page: number;
  pageSize: number;
  totalResults: number;
};

const initialState: SearchState = {
  searchTerm: '',
  searchResults: [],
  isLoading: false,
  error: null,
  searchHistory: [],
  selectedSources: initialSources,
  activeSource: 'all',
  filters: initialFilters,
  sort: { sortBy: 'relevance', sortOrder: 'desc' },
  dateRange: { dateFrom: undefined, dateTo: undefined },
  page: 1,
  pageSize: 10,
  totalResults: 0,
};

type SearchAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: { results: SearchResultUnion[]; totalResults: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'TOGGLE_SOURCE'; payload: string }
  | { type: 'SET_ACTIVE_SOURCE'; payload: string }
  | { type: 'UPDATE_FILTER'; payload: { key: string; value: any } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'SET_DATE_RANGE'; payload: { dateFrom?: string; dateTo?: string } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { 
        ...state, 
        searchResults: action.payload.results,
        totalResults: action.payload.totalResults 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TO_HISTORY':
      if (state.searchHistory && !state.searchHistory.includes(action.payload)) {
        return {
          ...state,
          searchHistory: [action.payload, ...state.searchHistory].slice(0, 10),
        };
      }
      return state;
    case 'CLEAR_HISTORY':
      return { ...state, searchHistory: [] };
    case 'TOGGLE_SOURCE':
      return {
        ...state,
        selectedSources: state.selectedSources?.map(source => 
          source.id === action.payload
            ? { ...source, enabled: !source.enabled }
            : source
        ),
      };
    case 'SET_ACTIVE_SOURCE':
      return { ...state, activeSource: action.payload };
    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'CLEAR_FILTERS':
      return { ...state, filters: initialFilters };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload };
    default:
      return state;
  }
}

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const addToHistory = useCallback((term: string) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: term });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const toggleSource = useCallback((sourceId: string) => {
    dispatch({ type: 'TOGGLE_SOURCE', payload: sourceId });
  }, []);

  const setActiveSource = useCallback((source: string) => {
    dispatch({ type: 'SET_ACTIVE_SOURCE', payload: source });
  }, []);

  const updateFilter = useCallback((key: string, value: any) => {
    dispatch({ type: 'UPDATE_FILTER', payload: { key, value } });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const setSort = useCallback((sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  const setDateRange = useCallback((dateRange: { dateFrom?: string; dateTo?: string }) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: dateRange });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize });
  }, []);

  const performSearch = useCallback(async (query?: string) => {
    const searchQuery = query || state.searchTerm;
    
    if (!searchQuery.trim()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const activeSources = state.selectedSources
        .filter(source => source.enabled)
        .map(source => source.id);
      
      const results = await fetchSearchResults(
        searchQuery,
        {
          page: state.page,
          pageSize: state.pageSize,
          sortBy: state.sort.sortBy,
          sortOrder: state.sort.sortOrder,
          language: state.filters.language,
          country: state.filters.country,
          dateFrom: state.dateRange.dateFrom,
          dateTo: state.dateRange.dateTo,
          source: state.filters.source,
          category: state.filters.category,
        },
        activeSources
      );
      
      dispatch({
        type: 'SET_SEARCH_RESULTS',
        payload: {
          results: results.items,
          totalResults: results.totalResults
        }
      });
      
      if (query) {
        setSearchTerm(query);
        addToHistory(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred during search'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state, setSearchTerm, addToHistory]);

  const contextValue: SearchContextType = {
    searchTerm: state.searchTerm,
    setSearchTerm,
    searchResults: state.searchResults,
    isLoading: state.isLoading,
    error: state.error,
    searchHistory: state.searchHistory || [],
    selectedSources: state.selectedSources,
    activeSource: state.activeSource,
    setActiveSource,
    filters: state.filters,
    updateFilter,
    setFilter: (key: string, value: any) => updateFilter(key, value),
    sort: state.sort,
    setSort,
    dateRange: state.dateRange,
    setDateRange,
    page: state.page,
    setPage,
    pageSize: state.pageSize,
    setPageSize,
    totalResults: state.totalResults,
    performSearch,
    executeSearch: (query?: string) => performSearch(query),
    addToHistory,
    clearHistory,
    toggleSource,
    clearFilters,
  };

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

// Custom hook to use the context
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};