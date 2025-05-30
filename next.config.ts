import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**', // Adjust this pattern if you want to restrict access
      },
    ],
  },
  reactStrictMode: true,

};

export default nextConfig;
