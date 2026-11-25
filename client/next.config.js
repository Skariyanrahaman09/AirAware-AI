const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// Normalize URL: strip trailing slash and optional trailing /api to prevent malformed double-paths
const backendOrigin = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: backendOrigin,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
