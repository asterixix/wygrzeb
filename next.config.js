/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mui/x-date-pickers'],
  
  // Configure headers to allow cross-origin requests for API routes
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },

  // Handle API fallbacks for missing or failed API endpoints
  async rewrites() {
    return [
      // If Twitter API is not available, use a fallback
      {
        source: '/api/twitter/:path*',
        has: [
          {
            type: 'header',
            key: 'x-use-fallback',
          },
        ],
        destination: '/api/fallback-twitter/:path*',
      },
      // Similar fallbacks for other API routes if needed
    ]
  },
}

export default nextConfig
