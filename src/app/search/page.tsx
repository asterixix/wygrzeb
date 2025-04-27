"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Paper,
  Pagination,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  IconButton,
  Collapse,
} from '@mui/material';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { useSearch } from '@/context/SearchContext';
import DataSourceTabs from '@/components/ui/DataSourceTabs';
import { SearchResultUnion } from '@/types/SearchResult';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import HistoryIcon from '@mui/icons-material/History';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Import SourceType from where DataSourceTabs gets it instead of redefining
import { SourceType } from '@/components/ui/DataSourceTabs';

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
    setSearchTerm: setQuery,
    setPage,
    performSearch: executeSearch,
    toggleSource,
    updateFilter: setFilter,
    clearFilters,
    clearHistory,
  } = useSearch();

  // State for UI elements
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [activeFiltersExpanded, setActiveFiltersExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | SourceType>('all');

  // Handle search from URL when page loads
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl && queryFromUrl !== query) {
      setQuery(queryFromUrl);
      executeSearch(queryFromUrl);
    }
  }, [searchParams, query, setQuery, executeSearch]);

  // Update URL when search or filters change
  useEffect(() => {
    if (!query) return;
    
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('q', query);
    
    // Add active filters to URL
    if (filters.language) newParams.set('lang', filters.language);
    if (filters.country) newParams.set('country', filters.country);
    if (filters.dateFrom) newParams.set('from', filters.dateFrom);
    if (filters.dateTo) newParams.set('to', filters.dateTo);
    if (filters.sortBy) newParams.set('sort', filters.sortBy);
    if (filters.sortOrder) newParams.set('order', filters.sortOrder);
    if (filters.sourceCategory) newParams.set('category', filters.sourceCategory);
    
    // Update URL without reloading the page
    router.push(`/search?${newParams.toString()}`, { scroll: false });
  }, [query, filters, router, searchParams]);

  // Apply filters from URL on initial load
  useEffect(() => {
    const langParam = searchParams.get('lang');
    const countryParam = searchParams.get('country');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    const categoryParam = searchParams.get('category');
    
    if (langParam) setFilter('language', langParam);
    if (countryParam) setFilter('country', countryParam);
    if (fromParam) setFilter('dateFrom', fromParam);
    if (toParam) setFilter('dateTo', toParam);
    if (sortParam) setFilter('sortBy', sortParam);
    if (orderParam && (orderParam === 'asc' || orderParam === 'desc')) 
      setFilter('sortOrder', orderParam);
    if (categoryParam) setFilter('sourceCategory', categoryParam);
  }, []);

  const handleSearch = (newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(1);
      executeSearch(newQuery);
    } else {
      executeSearch(query);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    executeSearch(query);
  };

  const handleTabChange = (tab: 'all' | SourceType) => {
    setActiveTab(tab);
    console.log("Tab changed to:", tab);
  };

  const handleRemoveFilter = (key: string) => {
    if (key === 'dateRange') {
      setFilter('dateFrom', undefined);
      setFilter('dateTo', undefined);
    } else {
      setFilter(key, undefined);
    }
    executeSearch(query);
  };

  const handleHistoryItemClick = (term: string) => {
    setQuery(term);
    executeSearch(term);
    setShowHistory(false);
  };

  // Calculate counts for each category of results
  const getResultCounts = useCallback(() => {
    const counts = {
      all: 0, 
      news: 0, 
      factChecks: 0, 
      tweets: 0, 
      datasets: 0, 
      statistics: 0
    };
    
    if (results && Array.isArray(results)) {
      results.forEach((result: SearchResultUnion) => {
        // Update the count for the specific type
        const type = result.type;
        const normalizedType = type.toLowerCase();
        
        // Always update the total count
        counts.all++;
        
        // Update specific category counts
        if (normalizedType === 'news') counts.news++;
        else if (normalizedType === 'factcheck' || normalizedType === 'fact-check') counts.factChecks++;
        else if (normalizedType === 'tweet') counts.tweets++;
        else if (normalizedType === 'dataset') counts.datasets++;
        else if (normalizedType === 'statistic' || normalizedType === 'government-data') counts.statistics++;
      });
    }
    
    return counts;
  }, [results]);

  // Get active filters for display
  const getActiveFilters = useCallback(() => {
    const activeFilters = [];
    
    if (filters.language) {
      activeFilters.push({
        key: 'language',
        label: `Language: ${filters.language.toUpperCase()}`,
        value: filters.language
      });
    }
    
    if (filters.country) {
      activeFilters.push({
        key: 'country',
        label: `Country: ${filters.country.toUpperCase()}`,
        value: filters.country
      });
    }
    
    if (filters.dateFrom || filters.dateTo) {
      const dateLabel = `Date: ${filters.dateFrom || 'Any'} to ${filters.dateTo || 'Any'}`;
      activeFilters.push({
        key: 'dateRange',
        label: dateLabel,
        value: 'custom'
      });
    }
    
    if (filters.sortBy && filters.sortBy !== 'relevance') {
      activeFilters.push({
        key: 'sortBy',
        label: `Sort by: ${filters.sortBy} ${filters.sortOrder === 'desc' ? '↓' : '↑'}`,
        value: filters.sortBy
      });
    }
    
    if (filters.sourceCategory) {
      activeFilters.push({
        key: 'sourceCategory',
        label: `Category: ${filters.sourceCategory}`,
        value: filters.sourceCategory
      });
    }
    
    return activeFilters;
  }, [filters]);
  
  const activeFilters = getActiveFilters();

  // Calculate total number of pages
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  // Filter results based on active tab
  const filteredResults = results?.filter((result: SearchResultUnion) => {
    if (activeTab === 'all') return true;
    
    // Exact match for type
    if (result.type === activeTab) return true;
    
    // Handle normalized types
    if (activeTab === 'factChecks' && (result.type === 'fact-check' )) return true;
    if (activeTab === 'tweets' && result.type === 'tweet') return true;
    if (activeTab === 'datasets' && result.type === 'dataset') return true;
    if (activeTab === 'statistics' && (result.type === 'government-data' )) return true;
    
    return false;
  }) || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <SearchBar 
            initialQuery={query} 
            onSearch={handleSearch} 
            isLoading={loading} 
          />
          <IconButton 
            color={searchHistory.length > 0 ? 'primary' : 'default'}
            onClick={() => setShowHistory(!showHistory)} 
            disabled={searchHistory.length === 0}
            sx={{ ml: 1 }}
            title="Search History"
          >
            <HistoryIcon />
          </IconButton>
        </Box>
        
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setActiveFiltersExpanded(!activeFiltersExpanded)}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Active Filters
              </Typography>
              {activeFiltersExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </Box>
            
            <Collapse in={activeFiltersExpanded}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {activeFilters.map((filter) => (
                  <Chip
                    key={filter.key}
                    label={filter.label}
                    onDelete={() => handleRemoveFilter(filter.key)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
                
                {activeFilters.length > 0 && (
                  <Chip
                    label="Clear All"
                    onClick={clearFilters}
                    size="small"
                    color="default"
                    icon={<CloseIcon />}
                  />
                )}
              </Box>
            </Collapse>
          </Box>
        )}
      </Paper>

      {/* Search History Drawer */}
      <Drawer
        anchor="left"
        open={showHistory}
        onClose={() => setShowHistory(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 320 } }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Search History</Typography>
            <IconButton onClick={() => setShowHistory(false)}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          
          {searchHistory.length > 0 ? (
            <>
              <List>
                {searchHistory.map((term, index) => (
                  <ListItem 
                    key={index} 
                    button 
                    onClick={() => handleHistoryItemClick(term)}
                    sx={{ 
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={term} />
                  </ListItem>
                ))}
              </List>
              
              <Button 
                startIcon={<HistoryToggleOffIcon />}
                onClick={clearHistory}
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Clear History
              </Button>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
              <SearchOffIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary" align="center">
                No search history found
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid xs={12} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mb: 2, display: { xs: 'flex', md: 'none' } }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Box sx={{ display: { xs: showFilters ? 'block' : 'none', md: 'block' } }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <SearchFilters
              selectedSources={selectedSources || []}
              onFilterChange={(key, value) => {
                setFilter(key, value);
                executeSearch(query);
              }}
              onSourceToggle={(sourceId) => {
                toggleSource(sourceId);
                executeSearch(query);
              }}
              onClearFilters={() => {
                clearFilters();
                executeSearch(query);
              }}
            />
          </Box>
        </Grid>

        {/* Results Section */}
        <Grid xs={12} md={9}>
          <DataSourceTabs
            counts={getResultCounts()}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            loading={loading}
          />
          <Divider sx={{ my: 2 }} />

          {loading && page === 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          )}

          {!loading && filteredResults.length === 0 && !error && query && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No results found for "{query}". Try refining your search or filters.
            </Alert>
          )}

          {filteredResults.length > 0 && (
            <SearchResults 
              results={filteredResults} 
              loading={loading && page > 1}
            />
          )}

          {totalPages > 1 && !error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}