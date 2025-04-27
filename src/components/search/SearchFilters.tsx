'use client';

import React, { useState } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
  Theme, // Import Theme type
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSearch } from '@/context/SearchContext';
import { Source } from '@/types/DataSource';

interface SearchFiltersProps {
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onSourceToggle: (sourceId: string) => void;
  selectedSources: Source[];
  theme?: Theme; // Make theme optional in props
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange,
  onClearFilters,
  onSourceToggle,
  selectedSources,
  theme: propTheme, // Destructure theme from props
}) => {
  const [expanded, setExpanded] = useState(false);
  // Get the default theme first, then override with prop theme if provided
  const defaultTheme = useTheme();
  const theme = propTheme ?? defaultTheme; 
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 
  
  // Properly use the imported useSearch hook
  const { filters, dateRange } = useSearch();

  // Log filters and dateRange for debugging
  React.useEffect(() => {
    console.log('Current filters:', filters);
    console.log('Current date range:', dateRange);
  }, [filters, dateRange]);

  const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polish' },
    { code: 'de', name: 'German' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
  ];

  const COUNTRIES = [
    { code: 'us', name: 'United States' },
    { code: 'pl', name: 'Poland' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
  ];

  const SOURCES = [
    { id: 'all', name: 'All Sources' },
    { id: 'news', name: 'News' },
    { id: 'fact-check', name: 'Fact Checks' },
    { id: 'social', name: 'Social Media' },
    { id: 'government', name: 'Government Data' },
  ];

  const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' },
  ];

  const handleLanguageChange = (event: SelectChangeEvent) => {
    onFilterChange('language', event.target.value);
  };

  const handleCountryChange = (event: SelectChangeEvent) => {
    onFilterChange('country', event.target.value);
  };

  const handleSourceChange = (event: SelectChangeEvent) => {
    onFilterChange('source', event.target.value);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    onFilterChange('sortBy', event.target.value);
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    onFilterChange('sortOrder', event.target.value);
  };

  const handleDateFromChange = (date: Date | null) => {
    onFilterChange('dateFrom', date ? date.toISOString().split('T')[0] : undefined);
  };

  const handleDateToChange = (date: Date | null) => {
    onFilterChange('dateTo', date ? date.toISOString().split('T')[0] : undefined);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      elevation={2}
      sx={{
        borderRadius: 2,
        mb: 2,
        overflow: 'hidden',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="filter-panel-content"
        id="filter-panel-header"
        sx={{
          bgcolor: theme.palette.background.paper, // Use theme directly here
          borderBottom: expanded ? `1px solid ${theme.palette.divider}` : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Search Filters</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="language-label">Language</InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                value={filters.language || ''}
                onChange={handleLanguageChange}
                label="Language"
              >
                {LANGUAGES.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                id="country-select"
                value={filters.country || ''}
                onChange={handleCountryChange}
                label="Country"
              >
                <MenuItem value="">All Countries</MenuItem>
                {COUNTRIES.map(country => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="source-label">Source</InputLabel>
              <Select
                labelId="source-label"
                id="source-select"
                value={filters.source || ''}
                onChange={handleSourceChange}
                label="Source"
              >
                <MenuItem value="">All Sources</MenuItem>
                {selectedSources
                  .filter(source => source.enabled)
                  .map(source => (
                    <MenuItem key={source.id} value={source.id}>
                      {source.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={filters.sortBy || 'relevance'}
                onChange={handleSortByChange}
                label="Sort By"
              >
                {SORT_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="sortOrder-label">Sort Order</InputLabel>
              <Select
                labelId="sortOrder-label"
                id="sortOrder-select"
                value={filters.sortOrder || 'desc'}
                onChange={handleSortOrderChange}
                label="Sort Order"
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={dateRange.dateFrom ? new Date(dateRange.dateFrom) : null}
                onChange={handleDateFromChange}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={dateRange.dateTo ? new Date(dateRange.dateTo) : null}
                onChange={handleDateToChange}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Source Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {SOURCES.map(sourceType => (
                <Button
                  key={sourceType.id}
                  variant={filters.sourceCategory === sourceType.id || (sourceType.id === 'all' && !filters.sourceCategory) ? "contained" : "outlined"}
                  size="small"
                  onClick={() => onFilterChange('sourceCategory', sourceType.id === 'all' ? undefined : sourceType.id)}
                  sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none'
                  }}
                >
                  {sourceType.name}
                </Button>
              ))}
            </Box>
          </Grid>
          <Grid xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Active Sources
            </Typography>
            <Grid container spacing={1}>
              {selectedSources
                .filter(source => 
                  !filters.sourceCategory || 
                  filters.sourceCategory === 'all' || 
                  source.category === filters.sourceCategory)
                .map(source => (
                  <Grid key={source.id}>
                    <Button
                      variant={source.enabled ? "contained" : "outlined"}
                      size="small"
                      onClick={() => onSourceToggle(source.id)}
                      sx={{ 
                        borderRadius: '20px',
                        opacity: source.enabled ? 1 : 0.6,
                        textTransform: 'none'
                      }}
                    >
                      {source.name}
                    </Button>
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: isMobile ? 1 : 2 }}>
            <Button
              startIcon={<RestartAltIcon />}
              onClick={onClearFilters}
              color="inherit"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "Reset" : "Reset Filters"}
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default SearchFilters;