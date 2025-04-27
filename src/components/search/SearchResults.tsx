import React from 'react';
import { Box, Divider, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { FactCheckResult } from '@/types/api';
import { SearchResultUnion } from '@/types/SearchResult';
import NewsCard from '@/components/ui/NewsCard';
import FactCheckCard from '@/components/ui/FactCheckCard';
import TweetCard from '@/components/ui/TweetCard';
import { NewsArticle, FactCheck, Tweet, Dataset, Statistic } from '@/types/news';

interface SearchResultsProps {
  results: FactCheckResult[] | SearchResultUnion[];
  loading?: boolean;
}

// Map API results to component specific types
const mapToComponentType = (result: any): any => {
  switch (result.type) {
    case 'news':
      const newsArticle: NewsArticle = {
        id: result.id, // Add the missing id property
        type: 'news', // Add the missing type property
        title: result.title,
        content: result.content,
        description: result.content?.substring(0, 150) + '...',
        url: result.url,
        source: result.source,
        publishedAt: result.date,
        image: result.image,
        author: result.metadata?.author
      };
      return newsArticle;
      
    case 'factcheck':
      const factCheck: FactCheck = {
        id: result.id, // Add the missing id property
        type: 'factcheck', // Add the missing type property
        title: result.title,
        claim: result.content ?? '', // Provide default empty string if content is undefined
        url: result.url,
        source: result.source, // Add the missing source property
        reviewer: result.source, // Keep reviewer if needed, or adjust based on FactCheck type definition
        reviewDate: result.date,
        ratingValue: result.rating ?? '', // Provide default empty string if rating is undefined
        ratingExplanation: result.metadata?.explanation,
        claimant: result.metadata?.claimant,
        claimDate: result.metadata?.claimDate
      };
      return factCheck;
      
    case 'tweet':
      const tweet: Tweet = {
        id: result.id, // Add the missing id property
        type: 'tweet', // Add the missing type property
        author: result.metadata?.author, // Add the missing author property
        content: result.content ?? '', // Provide default empty string if content is undefined
        url: result.url,
        source: result.source,
        date: result.date,
        metadata: result.metadata
      };
      return tweet;
      
    case 'dataset':
      const dataset: Dataset = {
        id: result.id,
        type: 'dataset',
        title: result.title,
        description: result.content,
        url: result.url,
        source: result.source,
        date: result.date,
        dateModified: result.metadata?.lastModified,
        publisher: result.metadata?.publisher,
        format: result.metadata?.format,
        license: result.metadata?.license,
        fields: result.metadata?.fields,
        metadata: result.metadata
      };
      return dataset;
      
    case 'statistic':
      const statistic: Statistic = {
        id: result.id,
        type: 'statistic',
        title: result.title,
        description: result.content,
        url: result.url,
        source: result.source,
        date: result.date,
        value: result.metadata?.value,
        unit: result.metadata?.unit,
        category: result.metadata?.category,
        region: result.metadata?.region,
        period: result.metadata?.period,
        metadata: result.metadata
      };
      return statistic;
      
    default:
      return result;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Alert severity="info">
        Brak wyników do wyświetlenia. Spróbuj zmienić zapytanie lub sprawdź filtry.
      </Alert>
    );
  }

  return (
    <Box>
      {results.map((result, index) => {
        const typedResult = mapToComponentType(result);
        
        let resultComponent;
        
        try {
          // Render different components based on result type
          switch (result.type) {
            case 'news':
              resultComponent = (
                <NewsCard article={typedResult} />
              );
              break;
              
            case 'factcheck':
              resultComponent = (
                <FactCheckCard factCheck={typedResult} />
              );
              break;
              
            case 'tweet':
              resultComponent = (
                <TweetCard tweet={typedResult} />
              );
              break;
              
            case 'dataset':
            case 'statistic':
              // Generic display for dataset and statistic types
              resultComponent = (
                <Paper 
                  elevation={1} 
                  className={`${result.type}-card`}
                  sx={{ p: 3, mb: 3, borderRadius: 2 }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {result.title || 'Untitled'}
                  </Typography>
                  
                  {result.source && (
                    <Typography variant="caption" color="text.secondary" component="div" gutterBottom>
                      Źródło: {typeof result.source === 'object' && result.source.name ? result.source.name : String(result.source)}
                    </Typography>
                  )}
                  
                  {'content' in result && result.content && (
                    <Typography variant="body2" paragraph>
                      {result.content}
                    </Typography>
                  )}
                  
                  {result.date && (
                    <Typography variant="caption" color="text.secondary" component="div">
                      Data: {new Date(result.date).toLocaleDateString('pl-PL')}
                    </Typography>
                  )}
                  
                  {'metadata' in result && result.metadata && Object.keys(result.metadata).length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Dodatkowe informacje:
                      </Typography>
                      
                      <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 1 }}>
                        {Object.entries(result.metadata).map(([key, value]) => {
                          // Skip complex objects or arrays in metadata display
                          if (typeof value === 'object' && value !== null) return null;
                          
                          return (
                            <React.Fragment key={key}>
                              <Typography component="dt" variant="body2" fontWeight="bold">{key}:</Typography>
                              <Typography component="dd" variant="body2">{String(value)}</Typography>
                            </React.Fragment>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Paper>
              );
              break;
              
            default:
              // Fallback for unknown types
              resultComponent = (
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {result.title || 'Untitled Result'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {'content' in result && result.content ? result.content : 'No content available'}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    {typeof result.source === 'object' && 'name' in result.source ? result.source.name : String(result.source || 'Unknown source')}
                  </Typography>
                </Paper>
              );
          }
        } catch (error) {
          console.error(`Error rendering result of type ${result.type}:`, error);
          
          // Error fallback
          resultComponent = (
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, borderLeft: '4px solid var(--error)' }}>
              <Alert severity="error">
                Wystąpił problem z wyświetleniem tego wyniku. Spróbuj odświeżyć stronę.
              </Alert>
            </Paper>
          );
        }
        
        return (
          <Box key={result.id || index} sx={{ mb: 3 }}>
            {resultComponent}
            {index < results.length - 1 && <Divider sx={{ mt: 3 }} />}
          </Box>
        );
      })}
    </Box>
  );
};

export default SearchResults;