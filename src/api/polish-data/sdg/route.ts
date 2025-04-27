import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { FactCheckResult } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const cel = searchParams.get('cel') ? parseInt(searchParams.get('cel') || '0') : undefined;
    const num = searchParams.get('num') || '';
    
    // GitHub token for increased rate limits from environment variables
    // Note: Anonymous requests are limited to 60 requests/hour
    // With a token, this increases to 5000 requests/hour
    const githubToken = process.env.SDG_API_TOKEN;
    
    // Base URL for SDG API
    const baseUrl = 'https://api.github.com/repos/statisticspoland/sdg-indicators-pl/contents/api/v1';
    
    // Prepare headers for GitHub API
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3.raw',
    };
    
    // Add token if available for increased rate limits
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    let apiPath = '';
    
    // Determine which API endpoint to use based on parameters
    if (cel && num) {
      // Specific indicator
      apiPath = `/globalne/${cel}/${num}.json`;
    } else if (cel) {
      // All indicators for a goal
      apiPath = `/globalne/${cel}.json`;
    } else {
      // All indicators
      apiPath = '/globalne_dane.json';
    }
    
    // Make the API request
    const response = await axios.get(`${baseUrl}${apiPath}`, { headers });
    
    // Check for successful response
    if (response.status !== 200) {
      return NextResponse.json(
        { error: `Failed to fetch SDG data: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Process the data based on the endpoint
    const data = response.data;
    let results: FactCheckResult[] = [];
    
    if (Array.isArray(data)) {
      // Multiple indicators
      results = data.map((indicator, index) => ({
        id: `sdg-${indicator.id || Date.now()}-${index}`,
        title: indicator.title || `Indicator ${index + 1}`,
        content: indicator.description || indicator.metadata?.description || '',
        url: `https://sdg.gov.pl/statistics_glob/${indicator.id}/`,
        source: {
          name: 'SDG Poland',
          url: 'https://sdg.gov.pl',
          icon: 'https://sdg.gov.pl/assets/images/logo.png',
        },
        type: 'statistic',
        metadata: {
          goal: indicator.goal || indicator.metadata?.goal,
          target: indicator.target || indicator.metadata?.target,
          data: indicator.data,
          source: indicator.source,
        }
      }));
    } else {
      // Single indicator
      results = [{
        id: `sdg-${data.id || Date.now()}`,
        title: data.title || 'SDG Indicator',
        content: data.description || data.metadata?.description || '',
        url: `https://sdg.gov.pl/statistics_glob/${data.id}/`,
        source: {
          name: 'SDG Poland',
          url: 'https://sdg.gov.pl',
          icon: 'https://sdg.gov.pl/assets/images/logo.png',
        },
        type: 'statistic',
        metadata: {
          goal: data.goal || data.metadata?.goal,
          target: data.target || data.metadata?.target,
          data: data.data,
          source: data.source,
        }
      }];
    }
    
    return NextResponse.json({
      results,
      totalResults: results.length,
      source: 'sdg-poland',
      authenticated: !!githubToken,
      rateLimit: githubToken ? '5000 requests/hour' : '60 requests/hour'
    });
  } catch (error: any) {
    console.error('Error fetching data from SDG API:', error);
    
    // Handle rate limit exceeded errors specifically
    if (error.response && error.response.status === 403) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded for SDG API. Consider using a GitHub token for higher limits.',
          message: error.response.data?.message || 'GitHub API rate limit exceeded'
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch data from SDG API', message: error.message },
      { status: 500 }
    );
  }
}