import { NextResponse } from 'next/server';
import { API_KEYS } from '@/config/api';
import NewsAPI from 'newsapi';

const newsapi = new NewsAPI(API_KEYS.NEWS_API);

const SORT_MAP: Record<string, string> = {
  relevance: 'relevancy',
  relevancy: 'relevancy',
  popularity: 'popularity',
  date: 'publishedAt',
  publishedAt: 'publishedAt'
};

interface NewsAPIParams {
  q: string;
  language: string;
  page: number;
  pageSize: number;
  sortBy: string;
  country?: string;
  from?: string;
  to?: string;
}

interface NewsAPIArticle {
  url: string;
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  content: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const language = searchParams.get('language') || 'en';
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const sortByRaw = searchParams.get('sortBy') || 'relevance';
    const sortBy = SORT_MAP[sortByRaw] || 'relevancy';

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        totalResults: 0,
        page,
        pageSize
      });
    }

    const apiParams: any = {
      q: query,
      language,
      page,
      pageSize,
      sortBy
    };
    if (dateFrom) apiParams.from = dateFrom;
    if (dateTo) apiParams.to = dateTo;

    const response = await newsapi.v2.everything(apiParams);

    const results = (response.articles || []).map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      source: {
        id: article.source?.id || null,
        name: article.source?.name || null
      },
      author: article.author || null,
      content: article.content || null
    }));

    return NextResponse.json({
      results,
      totalResults: response.totalResults || 0,
      page,
      pageSize
    });
  } catch (error) {
    console.error('NewsAPI error:', error);
    return NextResponse.json({
      results: [],
      totalResults: 0,
      page: 1,
      pageSize: 10,
      error: 'Failed to fetch news'
    }, { status: 500 });
  }
} 