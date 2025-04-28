"use client";

import React from 'react';
// Removed MUI imports
// Remove FactCheckResult import from api.ts if not directly used
// import { FactCheckResult } from '@/types/api'; 
import { 
    SearchResultUnion, 
    NewsResult, 
    FactCheckResult as FactCheckResultType, // Rename to avoid conflict
    Tweet as TweetResult, // Rename to avoid conflict
    DatasetResult, 
    GovernmentDataResult 
} from '@/types/SearchResult'; // Use types from SearchResult.ts
import NewsCard from '@/components/ui/NewsCard';
import FactCheckCard from '@/components/ui/FactCheckCard';
import TweetCard from '@/components/ui/TweetCard';
// Import specific types expected by the cards
import { NewsArticle, FactCheck, Tweet } from '@/types/news'; 
import { 
  InformationCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

// Map API results (SearchResultUnion) to component specific types (NewsArticle, FactCheck, Tweet)
const mapToComponentType = (result: SearchResultUnion): NewsArticle | FactCheck | Tweet | DatasetResult | GovernmentDataResult | SearchResultUnion => {
  try {
    switch (result.type) {
      case 'news':
        const newsResult = result as NewsResult;
        const newsArticle: NewsArticle = {
          id: newsResult.id,
          type: 'news',
          title: newsResult.title,
          content: newsResult.description, // Map description to content if needed by card
          description: newsResult.description,
          url: newsResult.url,
          source: { name: newsResult.source, url: newsResult.url }, // Adapt source format
          publishedAt: newsResult.date,
          image: newsResult.imageUrl, // Map imageUrl
          author: newsResult.author,
          category: newsResult.category,
          // Add other fields if NewsArticle expects them
        };
        return newsArticle;

      case 'fact-check':
        const factCheckResult = result as FactCheckResultType;
        const factCheck: FactCheck = {
          id: factCheckResult.id,
          type: 'factcheck', // Use 'factcheck' consistently
          title: factCheckResult.title, // Or map claim if more appropriate
          claim: factCheckResult.description || factCheckResult.title, // Map description or title to claim
          url: factCheckResult.url,
          source: { name: factCheckResult.source, url: factCheckResult.url }, // Adapt source format
          reviewer: { name: factCheckResult.source, url: factCheckResult.url }, // Adapt reviewer format
          reviewDate: factCheckResult.reviewDate || factCheckResult.date,
          rating: factCheckResult.rating, // Map rating
          ratingValue: factCheckResult.rating || '', // Use rating if available, otherwise default to empty string
          // ratingExplanation: factCheckResult.metadata?.explanation, // If metadata exists
          claimant: factCheckResult.claimant,
          // claimDate: factCheckResult.metadata?.claimDate, // If metadata exists
          date: factCheckResult.date, // Keep original date if needed
          // Add other fields if FactCheck expects them
        };
        return factCheck;

      case 'tweet':
        const tweetResult = result as TweetResult;
        const tweet: Tweet = {
          id: tweetResult.tweetId || tweetResult.id, // Use tweetId if available
          type: 'tweet',
          author: { // Construct author object
              name: tweetResult.author,
              username: tweetResult.authorUsername,
              profileImage: tweetResult.authorProfileImageUrl,
              verified: false, // Assuming not available in SearchResultUnion, adjust if it is
          },
          content: tweetResult.description || tweetResult.title, // Map description or title
          url: tweetResult.url,
          source: { name: tweetResult.source, url: tweetResult.url }, // Adapt source format
          date: tweetResult.date,
          metrics: { // Construct metrics object
              replies: 0, // Assuming not available, default to 0
              retweets: tweetResult.retweets ?? 0, // Default to 0 if undefined
              likes: tweetResult.likes ?? 0, // Default to 0 if undefined
              views: 0, // Assuming not available, default to 0
          },
          // Add other fields if Tweet expects them (like media)
          // media: tweetResult.media, // If media is part of TweetResult
        };
        return tweet;

      case 'dataset':
         // No mapping needed if SearchResults directly uses DatasetResult
         return result as DatasetResult;

      case 'government-data':
         // No mapping needed if SearchResults directly uses GovernmentDataResult
         return result as GovernmentDataResult;

      default:
        // Return the original result if type is unknown or doesn't need mapping
        // Assert type to any to access properties in the default case
        const unknownResultForLog = result as any;
        console.warn("Unknown or unmapped result type:", unknownResultForLog.type, result);
        return result;
    }
  } catch (mapError) {
      console.error("Error mapping result:", result, mapError);
      return result; // Return original result on mapping error
  }
};

// Define the SearchResultsProps interface
interface SearchResultsProps {
  results: SearchResultUnion[];
  loading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div role="alert" className="alert alert-info mt-4">
        <InformationCircleIcon className="h-6 w-6" />
        <span>Brak wyników do wyświetlenia. Spróbuj zmienić zapytanie lub sprawdź filtry.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => {
        let resultComponent: React.ReactNode = null;

        try {
          switch (result.type) {
            case 'news':
              const newsArticle = mapToComponentType(result) as NewsArticle;
              resultComponent = <NewsCard article={newsArticle} />;
              break;
            case 'fact-check':
              const factCheck = mapToComponentType(result) as FactCheck;
              resultComponent = <FactCheckCard factCheck={factCheck} />;
              break;
            case 'tweet':
              const tweet = mapToComponentType(result) as Tweet;
              resultComponent = <TweetCard tweet={tweet} />;
              break;
            case 'dataset':
            case 'government-data':
              const genericResult = result as DatasetResult | GovernmentDataResult;
              // Safely extract source name
              let sourceDisplay = 'Unknown';
              if (typeof genericResult.source === 'object' && genericResult.source !== null) {
                sourceDisplay = (genericResult.source as any).name || 'Unknown';
              } else if (typeof genericResult.source === 'string') {
                sourceDisplay = genericResult.source;
              }
              // Safely extract category
              let categoryDisplay = '';
              if (genericResult.type === 'government-data' && genericResult.category) {
                if (typeof genericResult.category === 'object' && !Array.isArray(genericResult.category) && genericResult.category !== null) {
                  categoryDisplay = (genericResult.category as { name?: string }).name || '';
                } else if (Array.isArray(genericResult.category)) {
                  categoryDisplay = (genericResult.category as any[]).map((cat: any) => {
                    if (cat && typeof cat === 'object' && cat !== null && 'name' in cat && typeof (cat as any).name === 'string') {
                      return (cat as { name: string }).name;
                    }
                    return typeof cat === 'string' ? cat : '';
                  }).filter(Boolean).join(', ');
                } else if (typeof genericResult.category === 'string') {
                  categoryDisplay = genericResult.category;
                }
              }
              resultComponent = (
                <div className={`card card-compact bg-base-200 shadow border border-base-300 ${genericResult.type}-card`}>
                  <div className="card-body">
                    <h2 className="card-title text-lg">
                      {genericResult.title || 'Untitled'}
                    </h2>
                    
                    <p className="text-xs text-base-content/70 mb-2">
                      Źródło: {sourceDisplay}
                      {genericResult.type === 'dataset' && genericResult.publisher && ` (${genericResult.publisher})`}
                      {genericResult.type === 'government-data' && genericResult.institution && ` (${genericResult.institution})`}
                    </p>
                    
                    {genericResult.description && (
                      <p className="text-sm mb-3">{genericResult.description}</p>
                    )}

                    {(() => {
                      let dateValue: string | undefined;
                      if (genericResult.type === 'dataset') {
                          dateValue = genericResult.date || genericResult.lastUpdated;
                      } else { // type === 'government-data'
                          dateValue = genericResult.date || genericResult.publicationDate;
                      }
                      return dateValue ? (
                        <p className="text-xs text-base-content/70">
                          Data: {new Date(dateValue).toLocaleDateString('pl-PL')}
                        </p>
                      ) : null;
                    })()}
                    
                    {genericResult.type === 'dataset' && (genericResult.format || genericResult.fields) && (
                       <div className="mt-3 text-xs">
                         <h3 className="font-semibold mb-1">Dodatkowe informacje:</h3>
                         <dl className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-0.5">
                           {genericResult.format && <><dt className="font-medium">Format:</dt><dd>{genericResult.format}</dd></>}
                           {genericResult.fields && genericResult.fields.length > 0 && <><dt className="font-medium">Fields:</dt><dd>{genericResult.fields.join(', ')}</dd></>}
                         </dl>
                       </div>
                    )}

                     {genericResult.type === 'government-data' && categoryDisplay && (
                       <div className="mt-3 text-xs">
                         <h3 className="font-semibold mb-1">Dodatkowe informacje:</h3>
                         <dl className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-0.5">
                            <dt className="font-medium">Category:</dt><dd>{categoryDisplay}</dd>
                         </dl>
                       </div>
                    )}

                     {genericResult.url && (
                        <div className="card-actions justify-end mt-2">
                          <a href={genericResult.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link no-underline hover:underline gap-1">
                            View Source <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              );
              break;
            default:
              // Cast result to access properties safely when type is unknown
              const unknownResult = result as any;
              console.warn("Rendering fallback for unknown type:", unknownResult.type);
              const title = unknownResult.title || 'Unknown Result Type';
              const content = unknownResult.description || unknownResult.content || 'No content available';
              let sourceName = 'Unknown source';
              if (typeof unknownResult.source === 'object' && unknownResult.source !== null) {
                sourceName = unknownResult.source.name || 'Unknown source';
              } else if (typeof unknownResult.source === 'string') {
                sourceName = unknownResult.source;
              }
              resultComponent = (
                <div className="card card-compact bg-base-300 shadow border border-base-300">
                  <div className="card-body">
                    <h2 className="card-title text-lg">{title}</h2>
                    <p className="text-sm mb-2">{content}</p>
                    <p className="text-xs text-base-content/70">{sourceName}</p>
                     {unknownResult.url && (
                        <div className="card-actions justify-end mt-2">
                          <a href={unknownResult.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link no-underline hover:underline gap-1">
                            View Source <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              );
          }
        } catch (error) {
          console.error(`Error rendering result (Index: ${index}, Type: ${result.type}):`, error, result);
          resultComponent = (
            <div role="alert" className="alert alert-error">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <span>Wystąpił problem z wyświetleniem tego wyniku.</span>
            </div>
          );
        }

        return (
          <div key={result.id || `result-${index}`}> {/* Ensure unique key */}
            {resultComponent}
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;