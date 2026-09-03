/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    const rawBackendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://government-web-backend.onrender.com/api/v1';
    const targetUrl = rawBackendUrl.replace(/\/+$/, '');
    const destination = targetUrl.endsWith('/api/v1')
      ? `${targetUrl}/:path*`
      : `${targetUrl}/api/v1/:path*`;

    return [
      {
        source: '/api/v1/:path*',
        destination,
      },
    ];
  },
};

export default nextConfig;

