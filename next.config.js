/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com"
      },
      {
        hostname: "avatars.githubusercontent.com"
      }
    ]
  }
};

module.exports = nextConfig;
