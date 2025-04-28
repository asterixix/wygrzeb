import { NextResponse } from 'next/server';
import { API_KEYS } from '@/config/api';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const language = searchParams.get('language') || 'en';

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        totalResults: 0,
        page,
        pageSize
      });
    }

    const searchUrl = `https://serpapi.com/search.json`;
    const params = new URLSearchParams({
      engine: 'google_news',
      q: query,
      api_key: API_KEYS.SERP_API_KEY || '',
      hl: language,
      num: pageSize.toString(),
      start: ((page - 1) * pageSize).toString()
    });

    const response = await axios.get(`${searchUrl}?${params.toString()}`);
    const data = response.data;

    const results = (data.articles || data.news_results || []).map((article: any) => ({
      id: article.link,
      title: article.title,
      description: article.snippet || article.description || '',
      url: article.link,
      imageUrl: article.thumbnail || null,
      publishedAt: article.date || null,
      source: {
        id: null,
        name: typeof article.source === 'object' && article.source !== null
          ? article.source.name || null
          : article.source || null
      },
      author: null,
      content: article.snippet || article.description || ''
    }));

    return NextResponse.json({
      results,
      totalResults: data.search_information?.total_results || results.length,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Google News API error:', error);
    return NextResponse.json({
      results: [],
      totalResults: 0,
      page: 1,
      pageSize: 10,
      error: 'Failed to fetch news'
    }, { status: 500 });
  }
} 