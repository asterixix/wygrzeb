'use client';

import { createContext, useContext, useCallback, useReducer, ReactNode } from 'react';
import { SearchResultUnion } from '@/types/SearchResult';
import { Source } from '@/types/DataSource';
import { SearchContextType, SearchFilters } from '@/types/SearchContextType';
import { searchAllSources } from '@/utils/searchService';
import React from 'react';

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
  { id: 'twitter', name: 'Twitter', category: 'social', enabled: true },
  { id: 'dane-gov-pl', name: 'Dane Gov PL', category: 'government', enabled: true },
  { id: 'stat-gov-poland', name: 'Stat Gov Poland', category: 'government', enabled: true },
  { id: 'sdg-poland', name: 'SDG Poland', category: 'dataset', enabled: true },
];

interface SearchState {
  searchTerm: string;
  results: SearchResultUnion[];
  isLoading: boolean;
  error: string | null;
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
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sort: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  searchHistory: string[];
  activeSource: string;
}

export const initialState: SearchState = {
  searchTerm: '',
  results: [],
  isLoading: false,
  error: null,
  filters: {
    sources: [],
    dateRange: {
      start: '',
      end: '',
    },
    language: '',
    country: '',
    theme: '',
    format: '',
    goal: '',
    datasetType: '',
    source: '',
    category: '',
    sortBy: 'date',
    sourceCategory: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  sort: {
    sortBy: 'date',
    sortOrder: 'desc',
  },
  searchHistory: [],
  activeSource: '',
};

type SearchAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_RESULTS'; payload: SearchResultUnion[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<SearchState['filters']> }
  | { type: 'SET_PAGINATION'; payload: Partial<SearchState['pagination']> }
  | { type: 'SET_COUNTRY'; payload: string }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_FORMAT'; payload: string }
  | { type: 'SET_GOAL'; payload: string }
  | { type: 'SET_DATASET_TYPE'; payload: string }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'TOGGLE_SOURCE'; payload: Source }
  | { type: 'SET_ACTIVE_SOURCE'; payload: string }
  | { type: 'UPDATE_FILTER'; payload: { key: keyof SearchState['filters']; value: any } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'SET_DATE_RANGE'; payload: { start: string; end: string } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number };

type FilterKey = keyof SearchState['filters'];

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_RESULTS':
      return { 
        ...state, 
        results: action.payload,
        pagination: {
          ...state.pagination,
          total: action.payload.length
        }
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    case 'SET_COUNTRY':
      return {
        ...state,
        filters: {
          ...state.filters,
          country: action.payload,
        },
      };
    case 'SET_THEME':
      return {
        ...state,
        filters: {
          ...state.filters,
          theme: action.payload,
        },
      };
    case 'SET_FORMAT':
      return {
        ...state,
        filters: {
          ...state.filters,
          format: action.payload,
        },
      };
    case 'SET_GOAL':
      return {
        ...state,
        filters: {
          ...state.filters,
          goal: action.payload,
        },
      };
    case 'SET_DATASET_TYPE':
      return {
        ...state,
        filters: {
          ...state.filters,
          datasetType: action.payload,
        },
      };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory.filter(q => q !== action.payload)].slice(0, 10),
      };
    case 'CLEAR_HISTORY':
      return { ...state, searchHistory: [] };
    case 'TOGGLE_SOURCE':
      return {
        ...state,
        filters: {
          ...state.filters,
          sources: state.filters.sources.map((src: Source) =>
            src.id === action.payload.id ? { ...src, enabled: !src.enabled } : src
          ),
        },
      };
    case 'SET_ACTIVE_SOURCE':
      return { ...state, activeSource: action.payload };
    case 'UPDATE_FILTER':
      const { key, value } = action.payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          [key]: value,
        },
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };
    case 'SET_DATE_RANGE':
      return {
        ...state,
        filters: {
          ...state.filters,
          dateRange: action.payload,
        },
      };
    case 'SET_PAGE':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload,
        },
      };
    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          pageSize: action.payload,
        },
      };
    case 'SET_SORT':
      return {
        ...state,
        sort: {
          ...state.sort,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

// Create the context with proper typing
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    const source = state.filters.sources.find(s => s.id === sourceId);
    if (source) {
      dispatch({ type: 'TOGGLE_SOURCE', payload: { ...source, enabled: !source.enabled } });
    }
  }, [state.filters.sources]);

  const setActiveSource = useCallback((source: string) => {
    dispatch({ type: 'SET_ACTIVE_SOURCE', payload: source });
  }, []);

  const updateFilter = useCallback((key: FilterKey, value: any) => {
    dispatch({ type: 'UPDATE_FILTER', payload: { key, value } });
  }, []);

  const setFilter = useCallback((key: FilterKey, value: any) => {
    updateFilter(key, value);
  }, [updateFilter]);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const setSort = useCallback((sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  const setDateRange = useCallback((dateRange: { start: string; end: string }) => {
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
      const activeSources = state.filters.sources
        .filter(source => source.enabled)
        .map(source => source.id);
      
      const results = await searchAllSources({
        query: searchQuery,
        page: state.pagination.page,
        pageSize: state.pagination.pageSize,
        sortBy: state.sort.sortBy,
        sortOrder: state.sort.sortOrder,
        language: state.filters.language,
        country: state.filters.country,
        dateFrom: state.filters.dateRange.start,
        dateTo: state.filters.dateRange.end,
        source: state.filters.source,
        category: state.filters.category,
        sourceCategory: state.filters.sourceCategory,
        mediaTypes: state.filters.mediaTypes,
        enabledSources: activeSources
      });
      
      dispatch({
        type: 'SET_RESULTS',
        payload: results.results,
      });

      dispatch({
        type: 'SET_PAGINATION',
        payload: {
          total: results.totalResults,
          page: results.page,
          pageSize: results.pageSize
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

  // Helper type guard to check if a result has a category property
  function hasCategory(result: any): result is { category: any } {
    return (
      result &&
      (
        (typeof result.type === 'string' && (
          result.type === 'news' ||
          result.type === 'dataset' ||
          result.type === 'statistic' ||
          result.type === 'government-data'
        )) &&
        'category' in result
      )
    );
  }

  // Compute available categories from both enabled sources and current results
  const availableCategories = React.useMemo(() => {
    const categories = new Set<string>();
    // From enabled sources
    state.filters.sources.forEach(source => {
      if (source.enabled && source.category) {
        categories.add(source.category);
      }
    });
    // From current results
    state.results.forEach(result => {
      if (hasCategory(result)) {
        if (Array.isArray(result.category)) {
          result.category.forEach((cat: any) => {
            if (typeof cat === 'string' && cat) categories.add(cat);
            else if (cat && typeof cat === 'object' && 'name' in cat && typeof cat.name === 'string') categories.add(cat.name);
          });
        } else if (typeof result.category === 'string' && result.category) {
          categories.add(result.category);
        } else if (result.category && typeof result.category === 'object' && 'name' in result.category && typeof result.category.name === 'string') {
          categories.add(result.category.name);
        }
      }
    });
    return Array.from(categories).sort();
  }, [state.filters.sources, state.results]);

  // List of available media types
  const AVAILABLE_MEDIA_TYPES = [
    { value: 'news', label: 'News' },
    { value: 'tweet', label: 'Tweet' },
    { value: 'dataset', label: 'Dataset' },
    { value: 'statistic', label: 'Statistic' },
    { value: 'government-data', label: 'Government Data' },
    // Add more as needed
  ];

  // Compute filtered results based on selected media types (client-side)
  const filteredResults = React.useMemo(() => {
    const { mediaTypes } = state.filters;
    if (!mediaTypes || mediaTypes.length === 0) return state.results;
    return state.results.filter(result => mediaTypes.includes(result.type));
  }, [state.results, state.filters.mediaTypes]);

  const contextValue: SearchContextType = {
    searchTerm: state.searchTerm,
    setSearchTerm,
    searchResults: state.results,
    isLoading: state.isLoading,
    error: state.error,
    searchHistory: state.searchHistory,
    selectedSources: state.filters.sources,
    activeSource: state.activeSource,
    setActiveSource,
    filters: state.filters,
    updateFilter,
    setFilter,
    page: state.pagination.page,
    setPage,
    pageSize: state.pagination.pageSize,
    setPageSize,
    totalResults: state.pagination.total,
    performSearch,
    addToHistory,
    clearHistory,
    toggleSource,
    clearFilters,
    sort: state.sort,
    setSort,
    dateRange: state.filters.dateRange,
    setDateRange,
    availableCategories,
    availableMediaTypes: AVAILABLE_MEDIA_TYPES,
    filteredResults,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the context
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};