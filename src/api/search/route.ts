import { NextRequest, NextResponse } from 'next/server';
import { searchAllSources } from '@/utils/searchService';
import { BaseSearchParams } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = (searchParams.get('sortOrder') === 'asc' || searchParams.get('sortOrder') === 'desc') 
      ? searchParams.get('sortOrder') 
      : 'desc';
    const language = searchParams.get('language') || 'pl'; // Default to Polish
    
    // Process sources parameter (comma-separated list)
    const sourcesParam = searchParams.get('sources');
    const sources = sourcesParam ? sourcesParam.split(',') : [];
    
    // Process filters
    const filters: Record<string, any> = {};
    
    // Date range
    if (searchParams.get('from')) {
      filters.dateFrom = searchParams.get('from');
    }
    
    if (searchParams.get('to')) {
      filters.dateTo = searchParams.get('to');
    }
    
    // Content types
    const typesParam = searchParams.get('types');
    if (typesParam) {
      filters.types = typesParam.split(',');
    }
    
    // Source names
    const sourceNamesParam = searchParams.get('sourceNames');
    if (sourceNamesParam) {
      filters.sources = sourceNamesParam.split(',');
    }
    
    // Reliability filter
    const reliabilityMinParam = searchParams.get('reliabilityMin');
    const reliabilityMaxParam = searchParams.get('reliabilityMax');
    if (reliabilityMinParam && reliabilityMaxParam) {
      filters.reliability = [
        parseInt(reliabilityMinParam),
        parseInt(reliabilityMaxParam)
      ];
    }
    
    // Verified sources only
    const verifiedOnlyParam = searchParams.get('verifiedOnly');
    if (verifiedOnlyParam === 'true') {
      filters.verifiedOnly = true;
    }
    
    // Language filter
    if (language !== 'all') {
      filters.language = language;
    }
    
    // Additional filter params
    for (const [key, value] of searchParams.entries()) {
      if (!['query', 'page', 'pageSize', 'sortBy', 'sortOrder', 'sources', 
            'from', 'to', 'types', 'sourceNames', 'reliabilityMin', 
            'reliabilityMax', 'verifiedOnly', 'language'].includes(key)) {
        filters[key] = value;
      }
    }
    
    // Create search params object
    const searchServiceParams: BaseSearchParams & { 
      sources?: string[],
      filters?: Record<string, any>
    } = {
      query,
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder || 'desc',
      language,
      sources,
      filters
    };
    const { results, totalResults } = await searchAllSources({
      ...searchServiceParams,
      sortOrder: sortOrder as 'asc' | 'desc'
    });
    
    // Apply pagination - our search service handles all sources at once,
    // but still need to paginate final results
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);
    
    return NextResponse.json({
      results: paginatedResults,
      totalResults,
      page,
      pageSize,
      query,
      source: 'unified-search',
    });
  } catch (error) {
    console.error('Unified search error:', error);
    
    return NextResponse.json(
      { error: 'Failed to perform unified search' },
      { status: 500 }
    );
  }
}