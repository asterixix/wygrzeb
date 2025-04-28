import { NextResponse } from 'next/server';
import { API_KEYS } from '@/config/api';
import axios from 'axios';

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

interface TwitterResponse {
  data: TwitterTweet[];
  includes: {
    users: TwitterUser[];
  };
  meta: {
    result_count: number;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const language = searchParams.get('language') || 'en';

    // If query is empty, return empty results
    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        totalResults: 0,
        page,
        pageSize
      });
    }

    // Build the search URL
    const searchUrl = 'https://api.twitter.com/2/tweets/search/recent';
    const params = new URLSearchParams({
      query: `${query} lang:${language}`,
      max_results: pageSize.toString(),
      'tweet.fields': 'created_at,public_metrics,author_id',
      'user.fields': 'name,username,profile_image_url',
      expansions: 'author_id'
    });

    // Make the API request
    const response = await axios.get<TwitterResponse>(`${searchUrl}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${API_KEYS.TWITTER_BEARER_TOKEN}`
      }
    });
    const data = response.data;

    // Create a map of users for quick lookup
    const usersMap = new Map(
      data.includes?.users?.map((user: TwitterUser) => [user.id, user]) || []
    );

    // Transform the response to match our expected format
    const results = data.data?.map((tweet: TwitterTweet) => {
      const user = usersMap.get(tweet.author_id);
      return {
        id: tweet.id,
        title: tweet.text,
        description: tweet.text,
        url: `https://twitter.com/${user?.username}/status/${tweet.id}`,
        imageUrl: user?.profile_image_url || null,
        publishedAt: tweet.created_at,
        source: {
          id: user?.id || null,
          name: user?.name || 'Unknown'
        },
        author: user?.username || 'Unknown',
        content: tweet.text,
        metrics: tweet.public_metrics
      };
    }) || [];

    return NextResponse.json({
      results,
      totalResults: data.meta?.result_count || 0,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Twitter API error:', error);
    return NextResponse.json({
      results: [],
      totalResults: 0,
      page: 1,
      pageSize: 10,
      error: 'Failed to fetch tweets'
    }, { status: 500 });
  }
} 