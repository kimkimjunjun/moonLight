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
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://223.130.137.39:6060/api/:path*"
      },
      // {
      //   source: "/:path*",
      //   destination: "http://223.130.150.200:4040/:path*"
      // },
    ];
  },
};

export default nextConfig;
