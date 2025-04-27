import { SearchResultUnion } from '@/types/SearchResult';

interface SearchParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  language?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  category?: string;
}

interface SearchResponse {
  items: SearchResultUnion[];
  totalResults: number;
  hasMore?: boolean;
  nextPage?: number | string;
}

// Utility function to build query parameters
const buildQueryParams = (params: SearchParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  }
  
  return queryParams;
};

// Function to fetch search results from multiple sources
export const fetchSearchResults = async (
  query: string,
  params: SearchParams,
  sources: string[] = []
): Promise<SearchResponse> => {
  if (!query.trim()) {
    return { items: [], totalResults: 0 };
  }

  console.log('Merging and ranking results for query:', query);

  // Add query to params
  const queryParams = buildQueryParams({
    ...params,
  });
  queryParams.set('query', query);

  const apiEndpoints: { [key: string]: string } = {
    'newsapi': '/api/news',
    'google-fact-check': '/api/fact-check',
    'google-news': '/api/google-news',
    'twitter': '/api/twitter',
    'dane-gov-pl': '/api/polish-data/dane-gov',
    'stat-gov-poland': '/api/polish-data/stat-gov',
    'sdg-poland': '/api/polish-data/sdg',
  };

  // Default source mapping for sources not in the apiEndpoints map
  const getSourceEndpoint = (source: string): string => {
    if (apiEndpoints[source]) {
      return apiEndpoints[source];
    }
    
    console.log('Using default mapping for unknown source:', source);
    return `/api/${source}`;
  };

  // Fetch from all selected sources
  const fetchPromises: Promise<{ source: string; results: SearchResultUnion[]; totalResults: number }>[] = [];
  const selectedSources = sources.length > 0 ? sources : Object.keys(apiEndpoints);

  for (const source of selectedSources) {
    const endpoint = getSourceEndpoint(source);
    
    fetchPromises.push(
      fetchFromSourceWithRetry(source, endpoint, queryParams.toString())
    );
  }

  try {
    const results = await Promise.all(fetchPromises);
    
    // Merge and rank results
    const allResults = results.flatMap(r => r.results.map(item => ({ ...item, source: r.source })));
    
    // Sort by date if available
    if (params.sortBy === 'date') {
      allResults.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return params.sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });
    }
    
    // Calculate total results by summing up the total from each source
    const totalResults = results.reduce((total, r) => total + r.totalResults, 0);
    
    // Apply pagination
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const paginatedResults = allResults.slice(start, end);
    
    return {
      items: paginatedResults,
      totalResults,
      hasMore: end < totalResults,
      nextPage: end < totalResults ? params.page + 1 : undefined,
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

// Helper function to fetch from a source with retry logic
const fetchFromSourceWithRetry = async (
  source: string,
  endpoint: string,
  queryParams: string,
  retries = 2
): Promise<{ source: string; results: SearchResultUnion[]; totalResults: number }> => {
  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status} from ${endpoint}?${queryParams}:`, errorText);
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        source,
        results: data.results || [],
        totalResults: data.totalResults || data.results?.length || 0,
      };
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        console.error(`Error fetching from ${endpoint}?${queryParams} (attempt ${attempt}):`, error);
      }
    }
  }
  
  // If all attempts fail, try fallback
  try {
    const fallbackEndpoint = `/api/fallback/${source}`;
    console.error(`All fetch attempts failed for ${endpoint}?${queryParams}. Last error:`, lastError);
    console.log(`Trying fallback endpoint: ${fallbackEndpoint}`);
    
    const fallbackResponse = await fetch(`${fallbackEndpoint}?${queryParams}`);
    
    if (!fallbackResponse.ok) {
      const errorText = await fallbackResponse.text();
      console.error(`Fallback API Error ${fallbackResponse.status} from ${fallbackEndpoint}?${queryParams}:`, errorText);
      throw new Error(`Fallback API returned ${fallbackResponse.status}`);
    }
    
    const fallbackData = await fallbackResponse.json();
    
    return {
      source,
      results: fallbackData.results || [],
      totalResults: fallbackData.totalResults || fallbackData.results?.length || 0,
    };
  } catch (fallbackError) {
    console.error(`Error fetching from fallback ${source}:`, fallbackError);
    console.error(`Failed to fetch from source ${source}: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
    
    // Return empty results if both main and fallback fail
    return {
      source,
      results: [],
      totalResults: 0,
    };
  }
};

/**
 * Searches across all enabled sources with standardized parameters
 * @param params Search parameters including query, filters, pagination, etc.
 * @returns Promise with search results and metadata
 */
export async function searchAllSources({
  query,
  page = 1,
  pageSize = 10,
  sortBy = 'relevance',
  sortOrder = 'desc',
  language,
  country,
  dateFrom,
  dateTo,
  source,
  category,
  enabledSources = []
}: {
  query: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  language?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  category?: string;
  enabledSources?: string[];
}): Promise<{
  results: SearchResultUnion[];
  totalResults: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  failedSources: string[];
}> {
  // Validate required parameters
  if (!query || query.trim() === '') {
    return {
      results: [],
      totalResults: 0,
      page,
      pageSize,
      hasMore: false,
      failedSources: []
    };
  }

  // Track failed sources for reporting
  const failedSources: string[] = [];
  
  try {
    // Use fetchSearchResults to get data from all enabled sources
    const searchParams: SearchParams = {
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      language,
      country,
      dateFrom,
      dateTo,
      source,
      category
    };

    // Filter to a specific source if requested
    const sourcesToSearch = source ? [source] : enabledSources;
    
    const response = await fetchSearchResults(query, searchParams, sourcesToSearch);
    
    return {
      results: response.items,
      totalResults: response.totalResults,
      page,
      pageSize,
      hasMore: !!response.hasMore,
      failedSources
    };
  } catch (error) {
    console.error('Error in searchAllSources:', error);
    
    // If the entire search fails, return empty results
    return {
      results: [],
      totalResults: 0,
      page,
      pageSize,
      hasMore: false,
      failedSources: enabledSources // Consider all sources failed
    };
  }
}
