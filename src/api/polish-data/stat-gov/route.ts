import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { FactCheckResult } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const area = searchParams.get('area') || '';
    const topic = searchParams.get('topic') || '';
    const year = searchParams.get('year') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const format = searchParams.get('format') || 'json';
    const lang = searchParams.get('lang') || 'pl';
    
    // API key from environment variables
    const apiKey = process.env.STAT_GOV_API_KEY;
    
    // Base URL for STAT GOV API
    const baseUrl = 'https://api-dbw.stat.gov.pl/api/1.1.0';
    
    // Prepare parameters for API request
    const params: any = {
      page,
      page_size: pageSize,
      lang,
      format,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
    
    // Add query parameter if provided
    if (query) {
      params.q = query;
    }
    
    // Add optional filters if provided
    if (area) {
      params.area = area;
    }
    
    if (topic) {
      params.topic = topic;
    }
    
    if (year) {
      params.year = year;
    }
    
    // Prepare request headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    // Add API key to headers if available
    if (apiKey) {
      headers['X-ClientId'] = apiKey;
    }
    
    // Determine which endpoint to use based on parameters
    let endpoint = '/indicators';
    if (query) {
      endpoint = '/search';
    } else if (area && !topic) {
      endpoint = '/areas';
    } else if (topic) {
      endpoint = '/topics';
    }
    
    // Make the API request
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      params,
      headers,
    });
    
    // Check for successful response
    if (response.status !== 200) {
      return NextResponse.json(
        { error: `Failed to fetch STAT GOV data: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Process the data
    const data = response.data;
    const items = data.results || [];
    
    // Transform STAT GOV items to our FactCheckResult format
    const results: FactCheckResult[] = items.map((item: any, index: number) => {
      // Determine the type of result based on the endpoint
      const resultType = endpoint === '/indicators' ? 'statistic' : 
                        endpoint === '/topics' ? 'topic' : 
                        endpoint === '/areas' ? 'area' : 'search';
      
      return {
        id: `statgov-${item.id || Date.now()}-${index}`,
        title: item.title || item.name || `Statistics ${index + 1}`,
        content: item.description || item.notes || '',
        url: item.url || `https://stat.gov.pl/en/topics/${item.topic_id || ''}`,
        source: {
          name: 'Statistics Poland (GUS)',
          url: 'https://stat.gov.pl',
          icon: 'https://stat.gov.pl/images/logo_gus_en.svg',
        },
        type: resultType,
        metadata: {
          area: item.area || area,
          topic: item.topic || topic,
          year: item.year || year,
          value: item.value,
          unit: item.unit,
          lastUpdate: item.last_update,
          period: item.period,
          frequency: item.frequency,
          source: item.source,
          tags: item.tags,
          relatedTopics: item.related_topics,
          relatedAreas: item.related_areas,
        }
      };
    });
    
    return NextResponse.json({
      results,
      totalResults: data.total || results.length,
      page,
      pageSize,
      source: 'stat-gov-poland',
      authenticated: !!apiKey,
      endpoint,
      queryParams: params
    });
  } catch (error: any) {
    console.error('Error fetching data from STAT GOV API:', error);
    
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      if (status === 401 || status === 403) {
        return NextResponse.json(
          { 
            error: 'Authentication error with STAT GOV API. Check your API key or try anonymous access.',
            message
          },
          { status }
        );
      }
      
      if (status === 404) {
        return NextResponse.json(
          { 
            error: 'Requested resource not found in STAT GOV API.',
            message
          },
          { status }
        );
      }
      
      if (status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded for STAT GOV API. Please try again later.',
            message
          },
          { status }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch data from STAT GOV API', message: error.message },
      { status: 500 }
    );
  }
}