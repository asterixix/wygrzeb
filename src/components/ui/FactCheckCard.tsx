"use client";

import React from 'react';
import { FactCheck } from '@/types/news';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';
import Link from 'next/link'; // Keep for potential internal links
import { 
  CheckBadgeIcon as CheckBadgeIconSolid,
  QuestionMarkCircleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/solid'; // Use solid for badge icons
import { 
  CalendarDaysIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';

interface FactCheckCardProps {
  factCheck: FactCheck;
}

const FactCheckCard: React.FC<FactCheckCardProps> = ({ factCheck }) => {
  
  const formattedDate = factCheck.date ? formatDate(factCheck.date) : null;
  
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: pl });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }
  
  const getRatingInfo = (rating: string | undefined) => {
    const iconClass = "h-4 w-4"; // Consistent icon size for badge
    if (!rating) return { color: 'badge-neutral', icon: <QuestionMarkCircleIcon className={iconClass} />, label: 'Unrated' };
    
    const ratingLower = rating.toLowerCase();
    
    if (ratingLower.includes('true') || ratingLower.includes('correct') || ratingLower.includes('accurate') || ratingLower.includes('prawda')) {
      return { color: 'badge-success', icon: <HandThumbUpIcon className={iconClass} />, label: rating };
    } else if (ratingLower.includes('false') || ratingLower.includes('fake') || ratingLower.includes('incorrect') || ratingLower.includes('misleading') || ratingLower.includes('fałsz')) {
      return { color: 'badge-error', icon: <HandThumbDownIcon className={iconClass} />, label: rating };
    } else if (ratingLower.includes('partly') || ratingLower.includes('half') || ratingLower.includes('mixed') || ratingLower.includes('unclear') || ratingLower.includes('częściowo')) {
      return { color: 'badge-warning', icon: <QuestionMarkCircleIcon className={iconClass} />, label: rating };
    }
    
    return { color: 'badge-neutral', icon: <QuestionMarkCircleIcon className={iconClass} />, label: rating };
  };
  
  const ratingInfo = getRatingInfo(factCheck.rating);
  const sourceName = factCheck.source?.name || 'Unknown Fact-Checker';
  const sourceUrl = factCheck.source?.url || factCheck.url || '#';
  
  return (
    // DaisyUI Card
    <div className="card card-compact bg-base-100 shadow-md border border-base-300 border-l-4 border-l-green-600 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 h-full flex flex-col factcheck-card">
      <div className="card-body flex-grow pt-4 pb-2">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {/* Avatar */}
            <div className="avatar mr-3">
              <div className="w-10 h-10 rounded ring ring-offset-base-100 ring-offset-1 flex items-center justify-center bg-green-600 text-white">
                {factCheck.logo ? (
                  <img src={factCheck.logo} alt={sourceName} className="rounded" />
                ) : (
                  <CheckBadgeIconSolid className="h-6 w-6" />
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
              <p className="text-xs text-base-content/70">Fact-checker</p>
            </div>
          </div>
          
          {/* Rating Badge */}
          <div className="tooltip tooltip-left" data-tip={ratingInfo.label}>
            <div className={`badge ${ratingInfo.color} text-white font-bold gap-1`}>
              {ratingInfo.icon}
              <span className="hidden sm:inline">{ratingInfo.label}</span>
            </div>
          </div>
        </div>
        
        {/* Claim */}
        <h2 className="card-title text-base font-semibold leading-snug mb-2 line-clamp-2">
          {factCheck.claim || 'Unspecified Claim'}
        </h2>
        
        {/* Claimant */}
        {factCheck.claimant && (
          <p className="text-sm text-primary font-medium mb-1">
            Claimed by: {factCheck.claimant}
          </p>
        )}
        
        {/* Date */}
        {formattedDate && (
          <div className="flex items-center text-xs text-base-content/70 mb-2">
            <CalendarDaysIcon className="h-3 w-3 mr-1" /> {formattedDate}
          </div>
        )}
        
        {/* Summary */}
        {factCheck.summary && (
          <p className="text-sm text-base-content/80 mb-3 line-clamp-3">
            {factCheck.summary}
          </p>
        )}
        
        {/* Topics */}
        {Array.isArray(factCheck.topics) && factCheck.topics.length > 0 && (
          <div className="mt-2 mb-1 flex flex-wrap gap-1">
            {factCheck.topics.map((topic, index) => (
              <div key={index} className="badge badge-sm badge-outline text-xs">
                {topic}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Link */}
      <div className="mt-auto">
        <div className="divider my-0"></div>
        <div className="p-4">
          {factCheck.url && factCheck.url.startsWith('/') ? (
            <Link
              href={factCheck.url}
              className="link link-success link-hover text-sm font-medium flex items-center"
            >
              Read full fact-check
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <a
              href={factCheck.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-success link-hover text-sm font-medium flex items-center"
            >
              Read full fact-check
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactCheckCard;