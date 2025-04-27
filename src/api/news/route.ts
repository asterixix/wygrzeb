import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { NewsAPIResponse, FactCheckResult } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const country = searchParams.get('country') || 'pl'; // Default to Poland
    const language = searchParams.get('language') || 'pl'; // Default to Polish
    const category = searchParams.get('category') || '';
    const sources = searchParams.get('sources') || '';
    const domains = searchParams.get('domains') || '';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    
    // API key from environment variables
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API key is not configured' },
        { status: 500 }
      );
    }
    
    // Prepare parameters
    const params: any = {
      q: query,
      page,
      pageSize,
      language,
      sortBy,
      apiKey,
    };
    
    // Add optional parameters if provided
    if (searchParams.get('country') && !sources) params.country = country; // country and sources cannot be mixed
    if (category && !sources) params.category = category;
    if (sources) params.sources = sources;
    if (domains) params.domains = domains;
    
    // Add date range if provided
    if (searchParams.get('from')) {
      params.from = searchParams.get('from');
    }
    
    if (searchParams.get('to')) {
      params.to = searchParams.get('to');
    }
    
    // Determine which endpoint to use
    const endpoint = query 
      ? 'https://newsapi.org/v2/everything' 
      : 'https://newsapi.org/v2/top-headlines';
    
    // Make the API request
    const response = await axios.get(endpoint, { params });
    
    // Check for successful response
    if (response.status !== 200) {
      return NextResponse.json(
        { error: `Failed to fetch news: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Extract and format the news results
    const data = response.data as NewsAPIResponse;
    
    // Transform NewsAPI articles to our FactCheckResult format
    const results: FactCheckResult[] = data.articles.map((article, index) => ({
      id: `newsapi-${Date.now()}-${index}`,
      title: article.title,
      content: article.content || article.description || '',
      url: article.url,
      source: {
        name: article.source.name,
        url: article.url.split('/').slice(0, 3).join('/'), // Extract base URL
      },
      date: article.publishedAt,
      image: article.urlToImage || undefined,
      type: 'news',
      metadata: {
        author: article.author,
        description: article.description,
      }
    }));
    
    return NextResponse.json({
      results,
      totalResults: data.totalResults,
      source: 'news-api',
    });
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch news from NewsAPI' },
      { status: 500 }
    );
  }
}