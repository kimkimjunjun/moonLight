import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "http://223.130.150.200:4040/:path*"
      },
    ];
  },
};

export default nextConfig;
