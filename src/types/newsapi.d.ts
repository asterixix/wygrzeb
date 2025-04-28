declare module 'newsapi' {
  interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: Array<{
      source: {
        id: string | null;
        name: string;
      };
      author: string | null;
      title: string;
      description: string;
      url: string;
      urlToImage: string;
      publishedAt: string;
      content: string | null;
    }>;
  }

  interface NewsAPIConstructor {
    new (apiKey: string): NewsAPI;
  }

  interface NewsAPI {
    v2: {
      everything(params: {
        q: string;
        language?: string;
        page?: number;
        pageSize?: number;
        sortBy?: string;
        country?: string;
        from?: string;
        to?: string;
      }): Promise<NewsAPIResponse>;
    };
  }

  const NewsAPI: NewsAPIConstructor;
  export default NewsAPI;
} 