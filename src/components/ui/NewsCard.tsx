"use client";

import React from 'react';
import { NewsArticle } from '@/types/news';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';
import Link from 'next/link'; // Keep for potential internal links if needed
import { 
  NewspaperIcon, 
  CalendarDaysIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formattedDate = article.publishedAt ? formatDate(article.publishedAt) : null;
  
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: pl });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }
  
  const sourceName = article.source?.name || 'Unknown Source';
  const sourceUrl = article.source?.url || article.url || '#';
  const imageUrl = (article as any).urlToImage;
  const hasValidImage = imageUrl && typeof imageUrl === 'string' && !imageUrl.includes('placeholder') && !imageUrl.includes('default');

  return (
    // DaisyUI Card
    <div className="card card-compact bg-base-100 shadow-md border border-base-300 border-l-4 border-l-blue-600 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 h-full flex flex-col">
      {hasValidImage && (
        <figure className="h-40"> {/* Fixed height for image container */}
          <img 
            src={imageUrl} 
            alt={article.title || 'News image'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide the figure on error
              const target = e.target as HTMLImageElement;
              if (target.parentElement) {
                target.parentElement.style.display = 'none';
              }
            }}
          />
        </figure>
      )}
      
      <div className="card-body flex-grow pt-4"> {/* Adjusted padding */}
        {/* Source Info */}
        <div className="flex items-center mb-3">
          <div className="avatar mr-3">
            <div className="w-8 h-8 rounded ring ring-offset-base-100 ring-offset-1 flex items-center justify-center bg-blue-600 text-white">
              {article.logo ? (
                <img src={article.logo} alt={sourceName} className="rounded" />
              ) : (
                <NewspaperIcon className="h-5 w-5" />
              )}
            </div>
          </div>
          <div>
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="link link-hover font-medium text-sm"
            >
              {sourceName}
            </a>
            {formattedDate && (
              <div className="flex items-center text-xs text-base-content/70 mt-0.5">
                <CalendarDaysIcon className="h-3 w-3 mr-1" /> {formattedDate}
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h2 className="card-title text-base font-semibold leading-snug mb-2 line-clamp-2">
          {article.title || 'Untitled Article'}
        </h2>
        
        {/* Description */}
        {article.description && (
          <p className="text-sm text-base-content/80 mb-3 line-clamp-3">
            {article.description}
          </p>
        )}
        
        {/* Author */}
        {article.author && (
          <p className="text-sm text-base-content/70 italic mt-1">
            By {article.author}
          </p>
        )}
        
        {/* Categories/Chips */}
        {article.category && (
          <div className="mt-2 flex flex-wrap gap-1">
            {(Array.isArray(article.category) ? article.category : [article.category])
              .filter(cat => typeof cat === 'string' && cat.trim())
              .map((category, index) => (
                <div key={index} className="badge badge-sm badge-outline text-xs">
                  {category}
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* Footer Link */}
      <div className="mt-auto">
        <div className="divider my-0"></div>
        <div className="p-4">
          <a
            href={article.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary link-hover text-sm font-medium flex items-center"
          >
            Read full article
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;