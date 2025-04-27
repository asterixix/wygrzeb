import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DaneGovDataset, FactCheckResult } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const format = searchParams.get('format') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    // API key from environment variables - optional for DANE.GOV.PL
    const apiKey = process.env.DANE_GOV_API_KEY;
    
    // Base URL for DANE.GOV.PL API
    const baseUrl = 'https://api.dane.gov.pl/1.4';
    
    // Prepare parameters for API request
    const params: any = {
      page,
      per_page: pageSize,
      sort: 'relevance',
      lang: 'pl', // Default to Polish
    };
    
    // Add query parameter if provided
    if (query) {
      params.q = query;
    }
    
    // Add optional filters if provided
    if (category) {
      params.category = category;
    }
    
    if (format) {
      params.format = format;
    }
    
    // Prepare headers with API key if available
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    // Add Bearer authentication if API key is provided
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    // Make the API request
    const response = await axios.get(`${baseUrl}/datasets`, {
      params,
      headers,
    });
    
    // Check for successful response
    if (response.status !== 200) {
      return NextResponse.json(
        { error: `Failed to fetch DANE.GOV.PL data: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Process the data
    const data = response.data;
    const datasets: DaneGovDataset[] = data.data || [];
    
    // Transform DaneGovDataset items to our FactCheckResult format
    const results: FactCheckResult[] = datasets.map((dataset, index) => {
      const resources = dataset.resources || [];
      const firstResource = resources[0] || {};
      
      return {
        id: `danegov-${dataset.id || Date.now()}-${index}`,
        title: dataset.title || `Dataset ${index + 1}`,
        content: dataset.notes || '',
        url: dataset.url || firstResource.url || `https://dane.gov.pl/pl/dataset/${dataset.id}`,
        source: {
          name: 'DANE.GOV.PL',
          url: 'https://dane.gov.pl',
          icon: 'https://dane.gov.pl/images/logo.svg',
        },
        type: 'dataset',
        metadata: {
          organization: dataset.organization?.title,
          formats: resources.map(r => r.format),
          tags: dataset.tags?.map(tag => tag.name),
          resources: resources.map(r => ({
            name: r.name,
            format: r.format,
            url: r.url,
          })),
        }
      };
    });
    
    return NextResponse.json({
      results,
      totalResults: data.meta?.count || results.length,
      page,
      pageSize,
      source: 'dane-gov-pl',
      authenticated: !!apiKey
    });
  } catch (error: any) {
    console.error('Error fetching data from DANE.GOV.PL API:', error);
    
    // Handle authentication/authorization errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return NextResponse.json(
        { 
          error: 'Authentication error with DANE.GOV.PL API. Check your API key or try anonymous access.',
          message: error.response.data?.message || 'Authentication failed'
        },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch data from DANE.GOV.PL API', message: error.message },
      { status: 500 }
    );
  }
}