export const API_KEYS = {
  NEWS_API: process.env.NEWS_API_KEY || '',
  SERP_API_KEY: process.env.SERP_API_KEY || '',
  GOOGLE_FACT_CHECK_API_KEY: process.env.GOOGLE_FACT_CHECK_API_KEY || '',
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || '',
  SDG_API_KEY: process.env.SDG_API_KEY || '', // Optional - can use GitHub token instead
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '', // Used as fallback for SDG API
  STAT_GOV_API_KEY: process.env.STAT_GOV_API_KEY || '', // Optional (X-ClientId)
  DANE_API_KEY: process.env.DANE_API_KEY || '', // Optional
  // Add other API keys here as we implement them
}; 