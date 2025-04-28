import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const githubToken = process.env.SDG_API_TOKEN;
    const baseUrl = 'https://api.github.com/repos/statisticspoland/sdg-indicators-pl/contents/api/v1';
    const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3.raw' };
    if (githubToken) headers['Authorization'] = `token ${githubToken}`;
    // Always fetch all indicators (globalne_dane.json)
    const apiPath = '/globalne_dane.json';
    const response = await axios.get(`${baseUrl}${apiPath}`, { headers });
    if (response.status !== 200) {
      return NextResponse.json({ error: `Failed to fetch SDG data: ${response.statusText}` }, { status: response.status });
    }
    const data = response.data;
    // Filter by query if provided
    let results = Array.isArray(data) ? data : [];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter((item: any) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.goal && String(item.goal).includes(q))
      );
    }
    // Pagination
    const totalResults = results.length;
    const pagedResults = results.slice((page - 1) * pageSize, page * pageSize);
    return NextResponse.json({
      results: pagedResults,
      totalResults,
      page,
      pageSize
    });
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      return NextResponse.json({ error: 'Rate limit exceeded for SDG API. Consider using a GitHub token for higher limits.', message: error.response.data?.message || 'GitHub API rate limit exceeded' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch data from SDG API', message: error.message }, { status: 500 });
  }
} 