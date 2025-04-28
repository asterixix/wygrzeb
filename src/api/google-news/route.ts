import { NextRequest, NextResponse } from 'next/server';
import { SearchResultUnion } from '@/types/SearchResult';

interface GoogleNewsAPIParams {
  query: string;
  page: number;
  pageSize: number;
  country: string;
  language: string;
  sortBy?: string;
  sortOrder?: string;
}

interface GoogleNewsResponse {
  articles: Array<{
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      name: string;
    };
    author?: string;
  }>;
  totalResults: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const country = searchParams.get('country') || 'us';
  const language = searchParams.get('language') || 'en';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_NEWS_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_NEWS_API_KEY is not defined');
    }

    const apiParams: GoogleNewsAPIParams = {
      query,
      page,
      pageSize,
      country,
      language
    };

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.append('q', apiParams.query);
    url.searchParams.append('page', apiParams.page.toString());
    url.searchParams.append('pageSize', apiParams.pageSize.toString());
    url.searchParams.append('language', apiParams.language);

    const response = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google News API error: ${errorData.message || response.statusText}`);
    }

    const data: GoogleNewsResponse = await response.json();

    const results: SearchResultUnion[] = data.articles.map((article, index) => ({
      id: `google-news-${index}-${Date.now()}`,
      type: 'news',
      title: article.title,
      description: article.description || '',
      url: article.url,
      imageUrl: article.urlToImage,
      date: article.publishedAt,
      source: article.source.name,
      author: article.author,
    }));

    return NextResponse.json({
      results,
      totalResults: data.totalResults
    });
  } catch (error) {
    console.error('Google News API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}