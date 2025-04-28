import { SearchResultUnion } from "@/types/SearchResult";
import { Source } from "../types/DataSource";

interface ApiSearchParams {
  query: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  language?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  sourceCategory?: string;
  [key: string]: any; // Allow for additional parameters
}

interface ApiResponse {
  results: SearchResultUnion[];
  totalResults: number;
  nextPage?: number | string;
  hasMore?: boolean;
}

/**
 * Builds a URLSearchParams object from the given parameters
 */
export const buildQueryParams = (params: ApiSearchParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  }
  
  return queryParams;
};

/**
 * Fetches data from the specified API endpoint for a given source
 * @param sourceId The ID of the data source to query
 * @param params Search parameters including query, pagination, filters etc.
 * @returns A promise that resolves with the fetched data { results: SearchResultUnion[], total: number }
 */
export const fetchApiData = async (
  sourceId: string, 
  params: ApiSearchParams
): Promise<{ results: SearchResultUnion[], total: number }> => {
  console.log(`Fetching data for source: "${sourceId}" with params:`, params);
  
  const queryString = buildQueryParams(params);
  const endpoint = getEndpointForSource(sourceId, queryString.toString());
  
  try {
    const response = await fetchWithRetry(endpoint);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status} from ${endpoint}:`, errorText);
      return { results: [], total: 0 };
    }
    
    const data: ApiResponse = await response.json();
    
    return {
      results: data.results || [],
      total: data.totalResults || data.results?.length || 0
    };
  } catch (error) {
    console.error(`Error fetching data for source ${sourceId} from ${endpoint}:`, error);
    return { results: [], total: 0 };
  }
};

/**
 * Maps a source ID to the appropriate API endpoint
 */
export const getEndpointForSource = (sourceId: string, queryParams: string): string => {
  const apiEndpoints: Record<string, string> = {
    'newsapi': '/api/news',
    'google-news': '/api/google-news',
    'twitter': '/api/twitter',
    'dane-gov-pl': '/api/polish-data/dane-gov',
    'stat-gov-poland': '/api/polish-data/stat-gov',
    'sdg-poland': '/api/polish-data/sdg',
  };
  
  const endpoint = apiEndpoints[sourceId] || `/api/${sourceId}`;
  return `${endpoint}?${queryParams}`;
};

/**
 * Fetches a URL with retry logic
 */
export const fetchWithRetry = async (
  url: string, 
  options?: RequestInit, 
  retries = 2, 
  backoff = 300
): Promise<Response> => {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Fetch attempt ${attempt + 1}/${retries + 1} failed for ${url}:`, lastError.message);
      
      if (attempt < retries) {
        // Wait with exponential backoff before retrying
        const delay = backoff * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`);
};

/**
 * Maps a source category to its corresponding sources
 */
export const getSourcesByCategory = (
  sources: Source[], 
  category?: string
): Source[] => {
  if (!category || category === 'all') {
    return sources;
  }
  
  return sources.filter(source => source.category === category);
};

/**
 * Checks if a service is available by making a HEAD request
 */
export const checkServiceAvailability = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(endpoint, { 
      method: 'HEAD',
      // Don't retry for availability checks
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn(`Service at ${endpoint} is unavailable:`, error);
    return false;
  }
};
