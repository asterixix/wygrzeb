import { NextRequest, NextResponse } from 'next/server';
import Client from 'twitter-api-v2';
import { SearchResultUnion } from '@/types/SearchResult';

interface TwitterAPIParams {
  query: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: string;
  language?: string;
  next_token?: string;
  start_time?: string;
  end_time?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const language = searchParams.get('language') || 'en';
  const nextToken = searchParams.get('nextToken') || undefined;
  const dateFrom = searchParams.get('dateFrom') || undefined;
  const dateTo = searchParams.get('dateTo') || undefined;

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      throw new Error('TWITTER_BEARER_TOKEN is not defined');
    }

    const client = new Client(bearerToken);

    const twitterParams: TwitterAPIParams = {
      query: query,
      page,
      pageSize
    };

    if (nextToken) {
      twitterParams.next_token = nextToken;
    }

    if (dateFrom) {
      twitterParams.start_time = new Date(dateFrom).toISOString();
    }

    if (dateTo) {
      twitterParams.end_time = new Date(dateTo).toISOString();
    }

    // Use the twitter-api-sdk to search for tweets
    const response = await client.v2.search(`${query} lang:${language}`, {
      max_results: pageSize,
      next_token: nextToken,
      start_time: dateFrom ? new Date(dateFrom).toISOString() : undefined,
      end_time: dateTo ? new Date(dateTo).toISOString() : undefined,
      "tweet.fields": ["created_at", "public_metrics", "author_id"],
      "user.fields": ["name", "username", "profile_image_url"],
      "expansions": ["author_id"]
    });

    if (!response.data || response.meta?.result_count === 0) {
      return NextResponse.json({
        results: [],
        totalResults: 0,
        nextToken: response.meta?.next_token
      });
    }

    // Create a map of users for easy lookup
    const users = new Map();
    if (response.includes?.users) {
      for (const user of response.includes.users) {
        users.set(user.id, user);
      }
    }

    const results: SearchResultUnion[] = response.data?.data.map(tweet => {
      const user = users.get(tweet.author_id);
      return {
        id: tweet.id,
        type: 'tweet',
        title: tweet.text.substring(0, 100) + (tweet.text.length > 100 ? '...' : ''),
        description: tweet.text,
        url: `https://x.com/${user?.username}/status/${tweet.id}`,
        source: 'X',
        date: tweet.created_at,
        author: user?.name || 'Unknown',
        authorUsername: user?.username || 'unknown',
        authorProfileImageUrl: user?.profile_image_url,
        retweets: tweet.public_metrics?.retweet_count,
        likes: tweet.public_metrics?.like_count,
        tweetId: tweet.id
      };
    });

    return NextResponse.json({
      results,
      totalResults: response.meta?.result_count || results.length,
      nextToken: response.meta?.next_token
    });
  } catch (error) {
    console.error('Twitter API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}