/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'granduniversity.s3.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
