"use client";

import React from 'react';
import { Tweet } from '@/types/news';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';
import Link from 'next/link'; // Use Next.js Link for internal routing if needed
import { 
  CheckBadgeIcon as CheckBadgeIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';
import { 
  BookmarkIcon as BookmarkIconOutline,
  ShareIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface TweetMetrics {
  replies?: number;
  retweets?: number;
  likes?: number;
  views?: number;
}

interface TweetCardProps {
  tweet: Tweet;
  onBookmark?: (tweet: Tweet) => void;
  isBookmarked?: boolean;
}

const TweetCard: React.FC<TweetCardProps> = ({ 
  tweet, 
  onBookmark, 
  isBookmarked = false 
}) => {
  
  const formattedDate = tweet.date ? formatDate(tweet.date) : null;
  
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'd MMMM yyyy • HH:mm', { locale: pl });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }
  
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };
  
  const metrics: TweetMetrics = tweet.metrics || {};
  const author = tweet.author || {
    name: 'Unknown User',
    username: 'unknown',
    profileImage: null,
    verified: false
  };
  
  const isFallback = tweet.metadata?.fallbackNotice || tweet.metadata?.isFallback || false;

  // Determine the image URL to display
  let displayMediaUrl: string | null = null;
  if (tweet.media) {
    if (typeof tweet.media === 'string') {
      displayMediaUrl = tweet.media;
    } else if (Array.isArray(tweet.media) && tweet.media.length > 0) {
      // Find the first image or fallback to the first media item's URL
      const firstImage = tweet.media.find(m => m.type === 'image');
      displayMediaUrl = firstImage ? firstImage.url : tweet.media[0].url;
    }
  }
  
  return (
    // Use DaisyUI card component
    <div className="card card-compact bg-base-100 shadow-md border border-base-300 border-l-4 border-l-blue-500 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 h-full flex flex-col tweet-card">
      <div className="card-body flex-grow pb-2">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {/* DaisyUI Avatar */}
            <div className="avatar mr-3">
              <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                {author.profileImage ? (
                  <img src={author.profileImage} alt={author.name} />
                ) : (
                  <span className="text-xl flex items-center justify-center w-full h-full bg-neutral-focus text-neutral-content">
                    {author.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium mr-1">{author.name}</span>
                {author.verified && (
                  <div className="tooltip tooltip-right" data-tip="Verified Account">
                    <CheckBadgeIconSolid className="h-5 w-5 text-blue-500" /> 
                  </div>
                )}
              </div>
              <span className="text-sm text-base-content/70">@{author.username}</span>
            </div>
          </div>
          <div className="flex items-center">
            {/* Bookmark and Share Buttons */}
            <button 
              className={`btn btn-ghost btn-sm btn-circle ${isBookmarked ? 'text-primary' : ''}`}
              onClick={() => onBookmark && onBookmark(tweet)}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? <BookmarkIconSolid className="h-5 w-5"/> : <BookmarkIconOutline className="h-5 w-5"/>}
            </button>
            <button className="btn btn-ghost btn-sm btn-circle" aria-label="Share tweet">
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <p className="whitespace-pre-wrap break-words mb-3">
          {tweet.content || 'No content available'}
        </p>
        
        {/* Fallback Notice */}
        {isFallback && (
          <div className="mb-3">
            <div className="badge badge-warning text-white font-bold">FALLBACK DATA</div>
            <p className="text-xs text-base-content/70 mt-1">
              {typeof isFallback === 'string' 
                ? isFallback 
                : "This is fallback data as the Twitter API is currently unavailable."}
            </p>
          </div>
        )}
        
        {/* Media */}
        {displayMediaUrl && (
          <figure className="mt-1 mb-3 rounded-lg overflow-hidden h-48">
            <img src={displayMediaUrl} alt="Tweet media" className="w-full h-full object-cover" />
          </figure>
        )}
        
        {/* Date */}
        {formattedDate && (
          <p className="text-xs text-base-content/70 mt-1 mb-3">
            {formattedDate}
          </p>
        )}
      </div>
      
      {/* Footer with Metrics */}
      <div className="mt-auto w-full">
        <div className="divider my-0"></div>
        <div className="px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex space-x-4">
            {/* Replies */}
            <div className="tooltip" data-tip="Replies">
              <div className="flex items-center text-base-content/70">
                <ChatBubbleOvalLeftIcon className="h-4 w-4 mr-1" /> {formatNumber(metrics.replies)}
              </div>
            </div>
            {/* Retweets */}
            <div className="tooltip" data-tip="Retweets">
              <div className="flex items-center text-base-content/70">
                <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-1" /> {formatNumber(metrics.retweets)}
              </div>
            </div>
            {/* Likes */}
            <div className="tooltip" data-tip="Likes">
              <div className="flex items-center text-base-content/70">
                <HeartIcon className="h-4 w-4 mr-1" /> {formatNumber(metrics.likes)}
              </div>
            </div>
            {/* Views */}
            {metrics.views !== undefined && (
              <div className="tooltip" data-tip="Views">
                <div className="flex items-center text-base-content/70">
                  <EyeIcon className="h-4 w-4 mr-1" /> {formatNumber(metrics.views)}
                </div>
              </div>
            )}
          </div>
          
          {/* Link to Tweet */}
          <div className="tooltip" data-tip="View on Twitter">
            {tweet.url && tweet.url.startsWith('/') ? (
              <Link
                href={tweet.url}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="View on Twitter"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </Link>
            ) : (
              <a
                href={tweet.url || `https://twitter.com/${author.username}/status/${tweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="View on Twitter"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;