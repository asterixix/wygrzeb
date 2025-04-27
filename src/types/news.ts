import { Source } from './api';

// News article type
export interface NewsArticle {
  id: string;
  title: string;
  content?: string;
  description?: string;
  url: string;
  source: Source;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  category?: string;
  keywords?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  type: 'news';
  metadata?: any;
  date?: string;
  logo?: string;
}

// Fact check type
export interface FactCheck {
  id: string;
  title: string;
  url: string;
  reviewer: Source;
  claim: string;
  claimant?: string;
  claimDate?: string;
  reviewDate?: string;
  ratingValue: string;
  ratingExplanation?: string;
  textualRating?: string;
  source: Source;
  language?: string;
  image?: string;
  type: 'factcheck';
  url_to_claim?: string;
  date?: string;
  content?: string;
  rating?: string;
  logo?: string;
  summary?: string;
  topics?: string;
}

// Twitter/X tweet type
export interface Tweet {
  id: string;
  content: string;
  url: string;
  author: {
    name: string;
    username: string;
    profileImage?: string;
    verified?: boolean;
  };
  date?: string;
  hashtags?: string[];
  mentions?: string[];
  metrics?: {
    likes: number;
    retweets: number;
    replies: number;
    views?: number;
  };
  media?: Array<{
    type: 'image' | 'video';
    url: string;
  }>;
  inReplyTo?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  source: Source;
  type: 'tweet';
  title?: string;
  metadata?: {
    fallbackNotice?: string;
    isFallback?: boolean;
  };
}

// Dataset type (for DANE.GOV.PL, etc.)
export interface Dataset {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: Source;
  publisher?: string;
  publicationDate?: string;
  lastUpdated?: string;
  format?: string;
  license?: string;
  categories?: string[];
  tags?: string[];
  dateModified?: string;
  resources?: Array<{
    name: string;
    format: string;
    url: string;
    size?: string;
  }>;
  type: 'dataset';
  content?: string;
  date?: string;
  fields?: string;
  metadata?: string;
}

// Statistic type (for STAT.GOV.PL, SDG, etc.)
export interface Statistic {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  date?: string;
  source: Source;
  description?: string;
  category?: string;
  region?: string;
  url: string;
  topic?: string;
  indicator?: string;
  area?: string;
  period?: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
  historicalData?: Array<{
    date: string;
    value: string | number;
  }>;
  relatedStats?: Array<{
    title: string;
    value: string | number;
    unit?: string;
  }>;
  type: 'statistic';
  content?: string;
  metadata?: string;
}