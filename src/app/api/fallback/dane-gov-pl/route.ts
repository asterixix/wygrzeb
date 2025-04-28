import { NextResponse } from 'next/server';
import axios from 'axios';
import { FactCheckResult } from '@/types/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const category = searchParams.get('category') || '';
    const format = searchParams.get('format') || '';
    
    // Get API key from environment variables
    const apiKey = process.env.DANE_GOV_PL_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DANE.GOV.PL API key is required' },
        { status: 401 }
      );
    }
    
    // Base URL for DANE.GOV.PL API
    const baseUrl = 'https://api.dane.gov.pl/api/v1';
    
    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    };
    
    // Build search parameters
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      per_page: pageSize.toString()
    });
    
    if (category) {
      params.append('category', category);
    }
    
    if (format) {
      params.append('format', format);
    }
    
    // Make the API request
    const response = await axios.get(`${baseUrl}/datasets`, {
      headers,
      params
    });
    
    // Check for successful response
    if (response.status !== 200) {
      return NextResponse.json(
        { error: `Failed to fetch data from DANE.GOV.PL: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Process the data
    const data = response.data;
    const results: FactCheckResult[] = data.data.map((dataset: any) => ({
      id: `dane-gov-${dataset.id}`,
      title: dataset.attributes.title,
      content: dataset.attributes.description || '',
      url: dataset.attributes.url || `https://dane.gov.pl/dataset/${dataset.id}`,
      source: {
        name: 'DANE.GOV.PL',
        url: 'https://dane.gov.pl',
        icon: 'https://dane.gov.pl/assets/images/logo.png'
      },
      type: 'dataset',
      metadata: {
        category: dataset.attributes.category,
        format: dataset.attributes.format,
        organization: dataset.attributes.organization,
        lastUpdate: dataset.attributes.last_update,
        tags: dataset.attributes.tags
      }
    }));
    
    return NextResponse.json({
      results,
      totalResults: data.meta?.total || results.length,
      page,
      pageSize,
      source: 'dane-gov-pl',
      authenticated: true
    });
  } catch (error: any) {
    console.error('Error fetching data from DANE.GOV.PL:', error);
    
    // Handle authentication errors specifically
    if (error.response && error.response.status === 401) {
      return NextResponse.json(
        { error: 'Invalid or missing DANE.GOV.PL API key' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch data from DANE.GOV.PL', message: error.message },
      { status: 500 }
    );
  }
} 