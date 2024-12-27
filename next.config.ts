import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://223.130.137.39:6060/api/:path*"
      },
      {
        source: "/:path*",
        destination: "http://localhost:8000/:path*"
      },
    ];
  },
};

export default nextConfig;
