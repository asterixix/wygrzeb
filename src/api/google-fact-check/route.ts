import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { GoogleFactCheckResponse, FactCheckResult } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const language = searchParams.get('language') || 'pl'; // Default to Polish
    const reviewPublisherSiteFilter = searchParams.get('reviewPublisherSiteFilter') || '';
    
    // API key from environment variables
    const apiKey = process.env.GOOGLE_FACT_CHECK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Fact Check API key is not configured' },
        { status: 500 }
      );
    }
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Prepare parameters
    const params: any = {
      query,
      languageCode: language,
      key: apiKey,
    };
    
    // Add optional parameters if provided
    if (reviewPublisherSiteFilter) {
      params.reviewPublisherSiteFilter = reviewPublisherSiteFilter;
    }
    
    // Make the API request
    const response = await axios.get('https://factchecktools.googleapis.com/v1alpha1/claims:search', {
      params,
    });
    
    // Check for successful response
    if (response.status !== 200) {
      return NextResponse.json(
        { error: `Failed to fetch fact checks: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Extract and format the fact check results
    const data = response.data as GoogleFactCheckResponse;
    const claims = data.claims || [];
    
    // Transform Google Fact Check claims to our FactCheckResult format
    const results: FactCheckResult[] = claims.map((claim, index) => {
      // Use the first claim review if available
      const claimReview = claim.claimReview?.[0];
      
      return {
        id: `factcheck-${Date.now()}-${index}`,
        title: claimReview?.title || claim.text,
        content: claim.text,
        url: claimReview?.url || '',
        source: {
          name: claimReview?.publisher?.name || 'Unknown Fact Checker',
          url: claimReview?.publisher?.site || '',
        },
        date: claimReview?.reviewDate || claim.claimDate,
        type: 'factcheck',
        rating: claimReview?.textualRating || 'Unknown',
        metadata: {
          claimant: claim.claimant,
          claimDate: claim.claimDate,
          languageCode: claimReview?.languageCode,
        }
      };
    });
    
    return NextResponse.json({
      results,
      totalResults: results.length,
      source: 'google-fact-check',
    });
  } catch (error) {
    console.error('Error fetching data from Google Fact Check API:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch fact checks from Google Fact Check API' },
      { status: 500 }
    );
  }
}