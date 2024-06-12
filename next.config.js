/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@mui/x-charts'],

  async redirects() {
    return [
      {
        source: '/companies/:slug',
        destination: '/company/:slug',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
