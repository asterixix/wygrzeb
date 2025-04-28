"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { useSearch } from '@/context/SearchContext';
import DataSourceTabs from '@/components/ui/DataSourceTabs';
import { SearchResultUnion } from '@/types/SearchResult';
import { SourceType } from '@/components/ui/DataSourceTabs';
import {
  ClockIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
  FunnelIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';
import { SearchFilters as SearchFiltersType, FilterKey } from '@/types/SearchContextType';
import { initialState } from '@/context/SearchContext';
import Footer from '@/components/layout/Footer';

// Define initial filters
const initialFilters = {
  sources: [],
  dateRange: {
    start: '',
    end: ''
  },
  language: 'en',
  country: '',
  theme: '',
  format: '',
  goal: '',
  datasetType: '',
  source: '',
  category: '',
  sortBy: 'date',
  sourceCategory: ''
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    searchTerm: query,
    searchResults: results,
    page,
    pageSize,
    isLoading: loading,
    error,
    totalResults,
    searchHistory,
    selectedSources,
    filters,
    sort,
    setSearchTerm: setQuery,
    setPage,
    performSearch,
    toggleSource,
    updateFilter: setFilter,
    clearFilters,
    clearHistory,
    setSort,
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [activeFiltersExpanded, setActiveFiltersExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | SourceType>('all');
  const [showDebug, setShowDebug] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [lastError, setLastError] = useState<any>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);

  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    const langParam = searchParams.get('lang');
    const countryParam = searchParams.get('country');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    const categoryParam = searchParams.get('category');
    const pageParam = searchParams.get('page');

    if (queryFromUrl && queryFromUrl !== query) {
      setQuery(queryFromUrl);
    }

    if (langParam && filters.language !== langParam) setFilter('language', langParam);
    if (countryParam && filters.country !== countryParam) setFilter('country', countryParam);
    if (fromParam && filters.dateRange.start !== fromParam) setFilter('dateRange', { ...filters.dateRange, start: fromParam });
    if (toParam && filters.dateRange.end !== toParam) setFilter('dateRange', { ...filters.dateRange, end: toParam });
    if (sortParam && filters.sortBy !== sortParam) setFilter('sortBy', sortParam);
    if (orderParam && sort.sortOrder !== orderParam && (orderParam === 'asc' || orderParam === 'desc')) setSort({ sortBy: filters.sortBy, sortOrder: orderParam });
    if (categoryParam && filters.sourceCategory !== categoryParam) setFilter('sourceCategory', categoryParam);

    if (pageParam && parseInt(pageParam) !== page) {
      setPage(parseInt(pageParam));
    }

    if (queryFromUrl) {
      performSearch(queryFromUrl);
    }
  }, []);

  useEffect(() => {
    if (!query) return;

    const newParams = new URLSearchParams();
    newParams.set('q', query);

    if (page > 1) newParams.set('page', page.toString());

    if (filters.language && filters.language !== initialFilters.language) newParams.set('lang', filters.language);
    if (filters.country) newParams.set('country', filters.country);
    if (filters.dateRange.start) newParams.set('from', filters.dateRange.start);
    if (filters.dateRange.end) newParams.set('to', filters.dateRange.end);
    if (filters.sortBy && filters.sortBy !== initialFilters.sortBy) newParams.set('sort', filters.sortBy);
    if (sort.sortOrder && sort.sortOrder !== initialState.sort.sortOrder) newParams.set('order', sort.sortOrder);
    if (filters.sourceCategory) newParams.set('category', filters.sourceCategory);

    const currentPathname = window.location.pathname;
    router.replace(`${currentPathname}?${newParams.toString()}`, { scroll: false });
  }, [query, filters, page, router, sort.sortOrder]);

  const handleSearch = (newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(1);
      performSearch(newQuery);
    } else {
      performSearch(query);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    performSearch(query);
  };

  const handleTabChange = (tab: 'all' | SourceType) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    setFilter(key as FilterKey, value);
    performSearch(query);
  };

  const handleSourceToggle = (sourceId: string) => {
    toggleSource(sourceId);
    performSearch(query);
  };

  const handleClearAllFilters = () => {
    clearFilters();
    performSearch(query);
  };

  const handleRemoveFilter = (key: string) => {
    if (key === 'dateRange') {
      setFilter('dateRange', { start: '', end: '' });
    } else {
      const defaultValue = initialFilters[key as keyof typeof initialFilters];
      setFilter(key as FilterKey, defaultValue);
    }
    performSearch(query);
  };

  const handleHistoryItemClick = (term: string) => {
    setQuery(term);
    setPage(1);
    performSearch(term);
    setShowHistoryDrawer(false);
  };

  const getResultCounts = useCallback(() => {
    const counts: Record<'all' | SourceType, number> = {
      all: 0,
      news: 0,
      factChecks: 0,
      tweets: 0,
      datasets: 0,
      statistics: 0,
    };

    if (results && Array.isArray(results)) {
      results.forEach((result: SearchResultUnion) => {
        const type = result.type;
        counts.all++;

        if (type === 'news') counts.news++;
        else if (type === 'fact-check') counts.factChecks++;
        else if (type === 'tweet') counts.tweets++;
        else if (type === 'dataset') counts.datasets++;
        else if (type === 'government-data') counts.statistics++;
      });
    }
    return counts;
  }, [results]);

  const getActiveFilters = useCallback(() => {
    const activeFiltersList = [];
    const currentFilters = filters;

    if (currentFilters.language && currentFilters.language !== initialFilters.language) {
      activeFiltersList.push({ key: 'language', label: `Language: ${currentFilters.language.toUpperCase()}`, value: currentFilters.language });
    }
    if (currentFilters.country) {
      activeFiltersList.push({ key: 'country', label: `Country: ${currentFilters.country.toUpperCase()}`, value: currentFilters.country });
    }
    if (currentFilters.dateRange.start || currentFilters.dateRange.end) {
      const dateLabel = `Date: ${currentFilters.dateRange.start || 'Any'} to ${currentFilters.dateRange.end || 'Any'}`;
      activeFiltersList.push({ key: 'dateRange', label: dateLabel, value: 'custom' });
    }
    if (currentFilters.sortBy && currentFilters.sortBy !== initialFilters.sortBy) {
      const sortLabel = `Sort: ${currentFilters.sortBy} ${sort.sortOrder === 'desc' ? '↓' : '↑'}`;
      activeFiltersList.push({ key: 'sortBy', label: sortLabel, value: currentFilters.sortBy });
    } else if (sort.sortOrder && sort.sortOrder !== initialState.sort.sortOrder && currentFilters.sortBy === initialFilters.sortBy) {
      const sortLabel = `Sort: ${initialFilters.sortBy} ${sort.sortOrder === 'desc' ? '↓' : '↑'}`;
      activeFiltersList.push({ key: 'sortBy', label: sortLabel, value: initialFilters.sortBy });
    }
    if (currentFilters.sourceCategory) {
      activeFiltersList.push({ key: 'sourceCategory', label: `Category: ${currentFilters.sourceCategory}`, value: currentFilters.sourceCategory });
    }

    return activeFiltersList;
  }, [filters, sort]);

  const activeFiltersList = getActiveFilters();
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const filteredResults = results?.filter((result: SearchResultUnion) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'news' && result.type === 'news') return true;
    if (activeTab === 'factChecks' && result.type === 'fact-check') return true;
    if (activeTab === 'tweets' && result.type === 'tweet') return true;
    if (activeTab === 'datasets' && result.type === 'dataset') return true;
    if (activeTab === 'statistics' && result.type === 'government-data') return true;
    return false;
  }) || [];

  const performSearchWithDebug = useCallback(async (query?: string) => {
    setLastQuery(String(query ?? ''));
    try {
      await performSearch(query ?? '');
      setLastApiResponse(null); // Clear on success
      setShowErrorToast(false);
    } catch (err: any) {
      setLastError(err);
      setShowErrorToast(true);
      setLastApiResponse(err?.response || null);
    }
  }, [performSearch]);

  return (
    <div className="drawer drawer-end">
      <input
        id="history-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={showHistoryDrawer}
        onChange={() => setShowHistoryDrawer(!showHistoryDrawer)}
      />
      <div className="drawer-content flex flex-col">
        <div className="container mx-auto px-4 mt-4 mb-4">
          <div className="card bg-base-200 shadow p-4 md:p-6 mb-4">
            <div className="flex items-center w-full gap-2">
              <SearchBar initialQuery={query} onSearch={handleSearch} isLoading={loading} />
              <label
                htmlFor="history-drawer"
                className={`btn btn-ghost btn-circle drawer-button ${searchHistory.length === 0 ? 'btn-disabled' : 'text-primary'}`}
                title="Search History"
                aria-label="Open search history"
              >
                <ClockIcon className="h-6 w-6" />
              </label>
            </div>

            {activeFiltersList.length > 0 && (
              <div className="mt-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveFiltersExpanded(!activeFiltersExpanded)}
                >
                  <span className="text-sm font-medium text-base-content/70">Active Filters</span>
                  {activeFiltersExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                </div>

                {activeFiltersExpanded && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeFiltersList.map((filter) => (
                      <div key={filter.key} className="badge badge-primary badge-outline gap-1">
                        {filter.label}
                        <button onClick={() => handleRemoveFilter(filter.key)} className="ml-1 hover:text-error" aria-label={`Remove filter ${filter.label}`}>
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {activeFiltersList.length > 0 && (
                      <button className="btn btn-xs btn-ghost text-error gap-1" onClick={handleClearAllFilters}>
                        <XMarkIcon className="h-4 w-4" /> Clear All
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <button
                className="btn btn-outline w-full mb-3 md:hidden gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                <h2 className="text-lg font-semibold mb-2 hidden md:block">Filters</h2>
                <SearchFilters
                  selectedSources={selectedSources || []}
                  onFilterChange={handleFilterChange}
                  onSourceToggle={handleSourceToggle}
                  onClearFilters={handleClearAllFilters}
                />
              </div>
            </div>

            <div className="md:col-span-9">
              <DataSourceTabs
                counts={getResultCounts()}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                loading={loading}
              />
              <div className="divider mt-0 mb-4"></div>

              {loading && page === 1 && (
                <div className="flex justify-center items-center min-h-[40vh]">
                  <span className="loading loading-lg loading-spinner text-primary"></span>
                </div>
              )}

              {error && (
                <div role="alert" className="alert alert-error mt-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                    <span>{typeof error === 'string' ? error : (typeof error === 'object' && 'message' in (error as any) ? (error as any).message : 'An error occurred')}</span>
                  </div>
                  {typeof error === 'object' && 'message' in (error as any) && (
                    <span className="text-xs text-base-content/70">{(error as any).message}</span>
                  )}
                </div>
              )}

              {!loading && filteredResults.length === 0 && !error && query && (
                <div role="alert" className="alert alert-info mt-2">
                  <InformationCircleIcon className="h-6 w-6" />
                  No results found for "{query}". Try refining your search or filters.
                </div>
              )}

              {filteredResults.length > 0 && (
                <SearchResults results={filteredResults} loading={loading && page > 1} />
              )}

              {totalPages > 1 && !error && (
                <div className="flex justify-center mt-6">
                  <div className="join">
                    <button
                      className="join-item btn btn-sm"
                      disabled={page <= 1 || loading}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      «
                    </button>
                    <button className="join-item btn btn-sm">
                      Page {page} of {totalPages}
                    </button>
                    <button
                      className="join-item btn btn-sm"
                      disabled={page >= totalPages || loading}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-side z-20">
        <label htmlFor="history-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Search History</h2>
            <label htmlFor="history-drawer" className="btn btn-sm btn-circle btn-ghost" aria-label="close history">
              ✕
            </label>
          </div>

          {searchHistory.length > 0 ? (
            <>
              <ul className="space-y-1 flex-grow overflow-y-auto">
                {searchHistory.map((term, index) => (
                  <li key={index}>
                    <button
                      className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-base-300"
                      onClick={() => handleHistoryItemClick(term)}
                    >
                      <ClockIcon className="h-4 w-4 opacity-70" /> {term}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-outline btn-error w-full mt-4 gap-2"
                onClick={clearHistory}
              >
                <TrashIcon className="h-5 w-5" /> Clear History
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow text-center">
              <ClockIcon className="text-6xl text-base-content/30 mb-4" />
              <p className="text-base-content/70">No search history found</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Toast Notification */}
      {showErrorToast && error && (
        <div className="fixed top-4 right-4 z-50 bg-error text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-fade-in">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span>{typeof error === 'string' ? error : (typeof error === 'object' && 'message' in (error as any) ? (error as any).message : 'An error occurred')}</span>
          <button className="ml-2" onClick={() => setShowErrorToast(false)}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      {/* Debug Panel Toggle */}
      <button
        className="fixed bottom-4 right-4 z-40 btn btn-sm btn-outline btn-info"
        onClick={() => setShowDebug((v) => !v)}
        title="Toggle Debug Panel"
      >
        {showDebug ? 'Hide Debug' : 'Show Debug'}
      </button>
      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-16 right-4 z-50 bg-base-200 border border-base-300 rounded-lg shadow-lg p-4 w-96 max-w-full overflow-auto animate-fade-in">
          <h3 className="font-bold mb-2">Debug Panel</h3>
          <div className="mb-2">
            <span className="font-semibold">Last Query:</span> <span className="break-all">{lastQuery}</span>
          </div>
          {lastError && (
            <div className="mb-2">
              <span className="font-semibold">Last Error:</span>
              <pre className="bg-error/10 text-error p-2 rounded mt-1 whitespace-pre-wrap break-all text-xs">{JSON.stringify(lastError, null, 2)}</pre>
            </div>
          )}
          {lastApiResponse && (
            <div className="mb-2">
              <span className="font-semibold">Last API Response:</span>
              <pre className="bg-base-100 p-2 rounded mt-1 whitespace-pre-wrap break-all text-xs">{JSON.stringify(lastApiResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      {/* Add Footer at the bottom of the page */}
      <Footer />
    </div>
  );
}