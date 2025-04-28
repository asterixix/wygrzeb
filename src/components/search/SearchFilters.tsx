'use client';

import React, { useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import { Source } from '@/types/DataSource';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { SearchFilters as SearchFiltersType } from '@/types/SearchContextType';

interface SearchFiltersProps {
  onFilterChange: (key: keyof SearchFiltersType, value: any) => void;
  onClearFilters: () => void;
  onSourceToggle: (sourceId: string) => void;
  selectedSources: Source[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange,
  onClearFilters,
  onSourceToggle,
  selectedSources,
}) => {
  const [expanded, setExpanded] = useState(true);
  const { filters, availableCategories, availableMediaTypes } = useSearch();

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

  const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    onFilterChange(name as keyof SearchFiltersType, value || undefined);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onFilterChange(name as keyof SearchFiltersType, value || undefined);
  };

  const handleCategoryClick = (category: string | undefined) => {
    onFilterChange('category', category);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Media Types Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Content Type</label>
            <select
              name="mediaTypes"
              multiple
              value={filters.mediaTypes || []}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                onFilterChange('mediaTypes', selected.length > 0 ? selected : undefined);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {availableMediaTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              name="language"
              value={filters.language}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              name="country"
              value={filters.country}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <input
                type="date"
                name="dateFrom"
                value={filters.dateRange.start}
                onChange={handleDateChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="dateTo"
                value={filters.dateRange.end}
                onChange={handleDateChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                key="all"
                onClick={() => handleCategoryClick(undefined)}
                className={`px-3 py-1 rounded-full text-sm ${
                  !filters.category ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.category === cat ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="pt-4">
            <button
              onClick={onClearFilters}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;