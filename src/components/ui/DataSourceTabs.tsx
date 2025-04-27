'use client';

import React from 'react';
import { Tabs, Tab, Box, useTheme, Paper } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import TwitterIcon from '@mui/icons-material/Twitter';
import PublicIcon from '@mui/icons-material/Public';
import StorageIcon from '@mui/icons-material/Storage';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

// Export this type for use in other components
export type SourceType = 'news' | 'factChecks' | 'tweets' | 'datasets' | 'statistics';

interface DataSourceTabsProps {
  activeTab: 'all' | SourceType;
  onTabChange: (tab: 'all' | SourceType) => void;
  counts?: Record<string, number>;
  loading?: boolean;
}

const DataSourceTabs: React.FC<DataSourceTabsProps> = ({
  activeTab,
  onTabChange,
  counts = { all: 0, news: 0, factChecks: 0, tweets: 0, datasets: 0, statistics: 0 },
  loading = false
}) => {
  const theme = useTheme();
  
  // Convert string value to number for MUI Tabs
  const getTabValue = () => {
    switch(activeTab) {
      case 'all': return 0;
      case 'news': return 1;
      case 'factChecks': return 2;
      case 'tweets': return 3;
      case 'datasets': return 4;
      case 'statistics': return 5;
      default: return 0;
    }
  };
  
  // Convert number back to string source type
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    let sourceType: 'all' | SourceType;
    switch(newValue) {
      case 0: sourceType = 'all'; break;
      case 1: sourceType = 'news'; break;
      case 2: sourceType = 'factChecks'; break;
      case 3: sourceType = 'tweets'; break;
      case 4: sourceType = 'datasets'; break;
      case 5: sourceType = 'statistics'; break;
      default: sourceType = 'all';
    }
    onTabChange(sourceType);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <Tabs
          value={getTabValue()}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="data source tabs"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 48,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <Tab 
            icon={<AllInclusiveIcon />} 
            iconPosition="start" 
            label={`All Sources${counts.all > 0 ? ` (${counts.all})` : ''}`}
            disabled={loading}
          />
          <Tab 
            icon={<NewspaperIcon />} 
            iconPosition="start" 
            label={`News${counts.news > 0 ? ` (${counts.news})` : ''}`}
            disabled={loading || counts.news === 0}
          />
          <Tab 
            icon={<FactCheckIcon />} 
            iconPosition="start" 
            label={`Fact Checks${counts.factChecks > 0 ? ` (${counts.factChecks})` : ''}`}
            disabled={loading || counts.factChecks === 0}
          />
          <Tab 
            icon={<TwitterIcon />} 
            iconPosition="start" 
            label={`Tweets${counts.tweets > 0 ? ` (${counts.tweets})` : ''}`}
            disabled={loading || counts.tweets === 0}
          />
          <Tab 
            icon={<StorageIcon />} 
            iconPosition="start" 
            label={`Datasets${counts.datasets > 0 ? ` (${counts.datasets})` : ''}`}
            disabled={loading || counts.datasets === 0}
          />
          <Tab 
            icon={<PublicIcon />} 
            iconPosition="start" 
            label={`Statistics${counts.statistics > 0 ? ` (${counts.statistics})` : ''}`}
            disabled={loading || counts.statistics === 0}
          />
        </Tabs>
      </Paper>
    </Box>
  );
};

export default DataSourceTabs;