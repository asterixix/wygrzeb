'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  Popper, 
  Grow, 
  ClickAwayListener,
  CircularProgress,
  useTheme,
  Theme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import ClearIcon from '@mui/icons-material/Clear';
import { useSearch } from '@/context/SearchContext';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  theme?: Theme;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '',
  onSearch,
  isLoading = false,
  theme: propTheme,
}) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [showHistory, setShowHistory] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme: Theme = propTheme || useTheme();

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
      setShowHistory(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleHistoryClick = () => {
    setShowHistory((prev) => !prev);
  };

  const handleHistoryItemClick = (term: string) => {
    setInputValue(term);
    if (onSearch) {
      onSearch(term);
    } else {
      performSearch(term);
    }
    setShowHistory(false);
  };

  const handleClickAway = () => {
    setShowHistory(false);
  };

  return (
    <div ref={anchorRef} style={{ position: 'relative', width: '100%', maxWidth: 800 }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={3}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 30,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: 3,
          },
        }}
      >
        <IconButton
          type="submit"
          sx={{ p: '10px' }}
          aria-label="search"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
        <InputBase
          inputRef={inputRef}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for information..."
          inputProps={{ 'aria-label': 'search for information' }}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowHistory(false)}
        />
        {inputValue && (
          <IconButton sx={{ p: '10px' }} aria-label="clear input" onClick={handleClearInput}>
            <ClearIcon />
          </IconButton>
        )}
        {searchHistory && searchHistory.length > 0 && (
          <IconButton
            sx={{ p: '10px' }}
            aria-label="search history"
            onClick={handleHistoryClick}
          >
            <HistoryIcon />
          </IconButton>
        )}
      </Paper>

      <Popper
        open={showHistory}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-start"
        style={{ width: anchorRef.current?.clientWidth, zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={3} sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <List dense>
                  {searchHistory && searchHistory.map((search: string, index: number) => (
                    <ListItem 
                      button 
                      key={index} 
                      onClick={() => handleHistoryItemClick(search)}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme => theme.palette.action.hover,
                        },
                      }}
                    >
                      <HistoryIcon sx={{ mr: 2, fontSize: 20, opacity: 0.7 }} />
                      <ListItemText primary={search} />
                    </ListItem>
                  ))}
                  <ListItem 
                    button 
                    onClick={clearHistory}
                    sx={{
                      color: 'text.secondary',
                      borderTop: theme => `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        backgroundColor: theme => theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemText primary="Clear search history" sx={{ textAlign: 'center' }} />
                  </ListItem>
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default SearchBar;