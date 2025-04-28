'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '@/context/SearchContext';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '',
  onSearch,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { 
    searchTerm,
    performSearch, 
    searchHistory, 
    clearHistory 
  } = useSearch();

  useEffect(() => {
    if (initialQuery) {
      setInputValue(initialQuery);
    } else if (searchTerm) {
      setInputValue(searchTerm);
    }
  }, [initialQuery, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (onSearch) {
        onSearch(inputValue);
      } else {
        performSearch(inputValue);
      }
      if (dropdownRef.current) {
         dropdownRef.current.removeAttribute('open');
      }
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = () => {
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleHistoryItemClick = (term: string) => {
    setInputValue(term);
    if (onSearch) {
      onSearch(term);
    } else {
      performSearch(term);
    }
    if (dropdownRef.current) {
      dropdownRef.current.removeAttribute('open');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
         dropdownRef.current.removeAttribute('open');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl"> 
      <form onSubmit={handleSearch} className="join w-full shadow-md rounded-full border border-base-300 hover:border-primary transition-colors duration-200">
        <button
          type="submit"
          className="btn btn-ghost join-item rounded-l-full px-4"
          aria-label="search"
          disabled={isLoading}
        >
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <MagnifyingGlassIcon className="h-5 w-5" />}
        </button>
        <input
          ref={inputRef}
          type="text"
          className="input input-ghost join-item w-full focus:outline-none focus:bg-transparent focus:text-current"
          placeholder="Search for information..."
          aria-label="search for information"
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && (
          <button 
            type="button" 
            className="btn btn-ghost join-item px-3" 
            aria-label="clear input" 
            onClick={handleClearInput}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        
        {searchHistory && searchHistory.length > 0 && (
          <div ref={dropdownRef} className="dropdown dropdown-end join-item">
            <button 
              type="button" 
              tabIndex={0}
              className="btn btn-ghost rounded-r-full px-4" 
              aria-label="search history"
            >
              <ClockIcon className="h-5 w-5" />
            </button>
            <ul 
              tabIndex={0}
              className="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-64 max-h-80 overflow-y-auto mt-2 border border-base-300"
            >
              {searchHistory.map((search: string, index: number) => (
                <li key={index}>
                  <button 
                    className="flex items-center gap-2 w-full text-left"
                    onClick={() => handleHistoryItemClick(search)}
                  >
                    <ClockIcon className="h-4 w-4 opacity-70" /> {search}
                  </button>
                </li>
              ))}
              <li><div className="divider my-1"></div></li>
              <li>
                <button 
                  className="justify-center text-error"
                  onClick={clearHistory}
                >
                  Clear search history
                </button>
              </li>
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;