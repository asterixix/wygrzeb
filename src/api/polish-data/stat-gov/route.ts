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
    
    // API key from environment variables
    // Using the API key is optional but recommended for production
    const apiKey = process.env.STAT_GOV_API_KEY;
    
    // Base URL for STAT GOV API
    const baseUrl = 'https://api-dbw.stat.gov.pl/api/1.1.0';
    
    // Prepare parameters for API request
    const params: any = {
      page,
      page_size: pageSize,
      lang: 'pl', // Default to Polish
      format: 'json',
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
    const headers: Record<string, string> = {};
    
    // Add API key to headers if available
    if (apiKey) {
      headers['X-ClientId'] = apiKey;
    }
    
    // Make the API request
    const response = await axios.get(`${baseUrl}/indicators`, {
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
    const results: FactCheckResult[] = items.map((item: any, index: number) => ({
      id: `statgov-${item.id || Date.now()}-${index}`,
      title: item.title || item.name || `Statistics ${index + 1}`,
      content: item.description || '',
      url: item.url || `https://stat.gov.pl/en/topics/${item.topic_id || ''}`,
      source: {
        name: 'Statistics Poland (GUS)',
        url: 'https://stat.gov.pl',
        icon: 'https://stat.gov.pl/images/logo_gus_en.svg',
      },
      type: 'statistic',
      metadata: {
        area: item.area || area,
        topic: item.topic || topic,
        year: item.year || year,
        value: item.value,
        unit: item.unit,
        lastUpdate: item.last_update,
      }
    }));
    
    return NextResponse.json({
      results,
      totalResults: data.total || results.length,
      page,
      pageSize,
      source: 'stat-gov-poland',
      authenticated: !!apiKey
    });
  } catch (error: any) {
    console.error('Error fetching data from STAT GOV API:', error);
    
    // Handle authentication/authorization errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return NextResponse.json(
        { 
          error: 'Authentication error with STAT GOV API. Check your API key or try anonymous access.',
          message: error.response.data?.message || 'Authentication failed'
        },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch data from STAT GOV API', message: error.message },
      { status: 500 }
    );
  }
}