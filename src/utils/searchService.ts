import { SearchResultUnion } from '@/types/SearchResult';
import { SearchFilters } from '@/types/SearchContextType'; // Import SearchFilters type

// Interface for parameters accepted by searchAllSources
interface SearchAllSourcesParams extends SearchFilters { // Extend SearchFilters
  query: string;
  page?: number;
  pageSize?: number;
  enabledSources?: string[]; // List of source IDs to query
}

interface SearchResponse {
  items: SearchResultUnion[];
  totalResults: number;
  hasMore?: boolean;
  nextPage?: number | string;
  failedSources?: string[];
}

// Define apiEndpoints map (ensure this is correctly defined)
const apiEndpoints: { [key: string]: string } = {
  'newsapi': '/api/fallback/newsapi',
  'google-news': '/api/fallback/google-news',
  'twitter': '/api/fallback/twitter',
  'dane-gov-pl': '/api/fallback/dane-gov-pl',
  'stat-gov-poland': '/api/fallback/stat-gov-poland',
  'sdg-poland': '/api/fallback/sdg',
  'otwarte-dane': '/api/fallback/otwarte-dane',
  'european-data-portal': '/api/fallback/european-data-portal',
  'polish-gov': '/api/fallback/polish-gov',
  'eurostat': '/api/fallback/eurostat',
  'world-bank': '/api/fallback/world-bank',
  'un-data': '/api/fallback/un-data',
  'oecd': '/api/fallback/oecd',
  'data-gov': '/api/fallback/data-gov',
  'data-gov-uk': '/api/fallback/data-gov-uk',
  'data-gov-de': '/api/fallback/data-gov-de',
  'data-gov-fr': '/api/fallback/data-gov-fr',
  'data-gov-es': '/api/fallback/data-gov-es',
  'data-gov-it': '/api/fallback/data-gov-it',
  'data-gov-nl': '/api/fallback/data-gov-nl',
  'data-gov-se': '/api/fallback/data-gov-se',
  'data-gov-fi': '/api/fallback/data-gov-fi',
  'data-gov-dk': '/api/fallback/data-gov-dk',
  'data-gov-no': '/api/fallback/data-gov-no',
  'data-gov-at': '/api/fallback/data-gov-at',
  'data-gov-ch': '/api/fallback/data-gov-ch',
  'data-gov-be': '/api/fallback/data-gov-be',
  'data-gov-cz': '/api/fallback/data-gov-cz',
  'data-gov-sk': '/api/fallback/data-gov-sk',
  'data-gov-hu': '/api/fallback/data-gov-hu',
  'data-gov-ro': '/api/fallback/data-gov-ro',
  'data-gov-bg': '/api/fallback/data-gov-bg',
  'data-gov-gr': '/api/fallback/data-gov-gr',
  'data-gov-pt': '/api/fallback/data-gov-pt',
  'data-gov-ie': '/api/fallback/data-gov-ie',
  'data-gov-lu': '/api/fallback/data-gov-lu',
  'data-gov-ee': '/api/fallback/data-gov-ee',
  'data-gov-lv': '/api/fallback/data-gov-lv',
  'data-gov-lt': '/api/fallback/data-gov-lt',
  'data-gov-si': '/api/fallback/data-gov-si',
  'data-gov-hr': '/api/fallback/data-gov-hr',
  'data-gov-cy': '/api/fallback/data-gov-cy',
  'data-gov-mt': '/api/fallback/data-gov-mt',
  'data-gov-is': '/api/fallback/data-gov-is',
  'data-gov-li': '/api/fallback/data-gov-li',
  'data-gov-me': '/api/fallback/data-gov-me',
  'data-gov-mk': '/api/fallback/data-gov-mk',
  'data-gov-al': '/api/fallback/data-gov-al',
  'data-gov-rs': '/api/fallback/data-gov-rs',
  'data-gov-ba': '/api/fallback/data-gov-ba',
  'data-gov-xk': '/api/fallback/data-gov-xk',
  'data-gov-md': '/api/fallback/data-gov-md',
  'data-gov-ua': '/api/fallback/data-gov-ua',
  'data-gov-by': '/api/fallback/data-gov-by',
  'data-gov-ru': '/api/fallback/data-gov-ru',
  'data-gov-tr': '/api/fallback/data-gov-tr',
  'data-gov-il': '/api/fallback/data-gov-il',
  'data-gov-eg': '/api/fallback/data-gov-eg',
  'data-gov-sa': '/api/fallback/data-gov-sa',
  'data-gov-ae': '/api/fallback/data-gov-ae',
  'data-gov-qa': '/api/fallback/data-gov-qa',
  'data-gov-kw': '/api/fallback/data-gov-kw',
  'data-gov-bh': '/api/fallback/data-gov-bh',
  'data-gov-om': '/api/fallback/data-gov-om',
  'data-gov-ye': '/api/fallback/data-gov-ye',
  'data-gov-iq': '/api/fallback/data-gov-iq',
  'data-gov-sy': '/api/fallback/data-gov-sy',
  'data-gov-lb': '/api/fallback/data-gov-lb',
  'data-gov-jo': '/api/fallback/data-gov-jo',
  'data-gov-ps': '/api/fallback/data-gov-ps',
};

// Default source mapping helper
const getSourceEndpoint = (source: string): string => {
  if (apiEndpoints[source]) {
    return apiEndpoints[source];
  }
  // Fallback or error handling for unknown sources
  console.warn('Using default fallback mapping for unknown source:', source);
  return `/api/fallback/${source}`; // Generic fallback pattern
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
        console.warn(`Error fetching from ${endpoint}?${queryParams} (attempt ${attempt}/${retries}):`, error);
        // Optional: Add delay before retrying
        // await new Promise(resolve => setTimeout(resolve, 300 * Math.pow(2, attempt - 1)));
      } else {
         console.error(`All fetch attempts failed for ${endpoint}?${queryParams}. Last error:`, lastError);
      }
    }
  }
  
  // If all attempts fail, return empty results without trying fallback
  console.error(`Failed to fetch from source ${source} after ${retries} attempts.`);
  return {
    source,
    results: [],
    totalResults: 0,
  };
};

/**
 * Searches across specified sources with standardized parameters.
 * Aggregates results from multiple API endpoints.
 * @param params Parameters including query, filters, pagination, and enabled sources.
 * @returns Promise with aggregated search results and metadata.
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
  source, // Specific source filter (optional)
  category, // General category filter (optional)
  sourceCategory, // UI category filter (optional, might not be used directly by backend)
  enabledSources = [], // Default to empty array if not provided
  ...otherFilters // Capture any other filters passed
}: SearchAllSourcesParams): Promise<{
  results: SearchResultUnion[];
  totalResults: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  failedSources: string[];
}> {
  if (!query || query.trim() === '') {
    // Return empty results if query is empty
    return { results: [], totalResults: 0, page, pageSize, hasMore: false, failedSources: [] };
  }

  // Determine which sources to actually query based on enabledSources or specific source filter
  const sourcesToQuery = source ? [source] : (enabledSources.length > 0 ? enabledSources : Object.keys(apiEndpoints)); // Fallback to all known endpoints if enabledSources is empty

  // Build base query parameters
  const baseQueryParams = new URLSearchParams({
    query: query.trim(),
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  // Add optional filters
  if (language) baseQueryParams.append('language', language);
  if (country) baseQueryParams.append('country', country);
  if (dateFrom) baseQueryParams.append('from', dateFrom);
  if (dateTo) baseQueryParams.append('to', dateTo);
  if (category) baseQueryParams.append('category', category); // Pass category if backend uses it
  // Add otherFilters if the backend supports them
  Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
          baseQueryParams.append(key, String(value));
      }
  });

  console.log(`Searching sources: ${sourcesToQuery.join(', ')} with params: ${baseQueryParams.toString()}`);

  // Map promises for each source to query
  const fetchPromises = sourcesToQuery.map(sourceId => {
    const endpoint = getSourceEndpoint(sourceId); // Get the correct API endpoint
    // Potentially customize params per source if needed, otherwise use baseQueryParams
    const sourceSpecificParams = new URLSearchParams(baseQueryParams);

    return fetchFromSourceWithRetry(sourceId, endpoint, sourceSpecificParams.toString());
  });

  // Aggregate results
  try {
    const settledResults = await Promise.allSettled(fetchPromises);

    const allResults: SearchResultUnion[] = [];
    let totalAggregatedResults = 0;
    const failedSources: string[] = [];

    settledResults.forEach(result => {
      if (result.status === 'fulfilled') {
        const sourceData = result.value;
        // Add source identifier to each result item if not already present
        const resultsWithSource = sourceData.results.map(item => ({
            ...item,
            source: item.source || sourceData.source // Ensure source field is populated
        }));
        allResults.push(...resultsWithSource);
        // Use totalResults from source if reliable, otherwise sum lengths
        totalAggregatedResults += sourceData.totalResults || sourceData.results.length;
      } else {
        // Type assertion needed because TS doesn't know 'source' exists on rejected promises here
        const failedSourceId = (result as PromiseRejectedResult & { source?: string }).source || 'unknown';
        console.error(`Failed to fetch from source ${failedSourceId}:`, result.reason);
        failedSources.push(failedSourceId);
      }
    });

    // Optional: Re-sort aggregated results if needed (e.g., if sorting wasn't done by APIs)
    if (sortBy === 'date') {
        allResults.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    const hasMore = allResults.length > 0 && page * pageSize < totalAggregatedResults; // Approximation

    return {
      results: allResults, // Return combined results for the page
      totalResults: totalAggregatedResults, // Return sum/estimate of totals
      page,
      pageSize,
      hasMore,
      failedSources,
    };

  } catch (error) {
    console.error('Error processing aggregated search results:', error);
    return { results: [], totalResults: 0, page, pageSize, hasMore: false, failedSources: sourcesToQuery };
  }
}
