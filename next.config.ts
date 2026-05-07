import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // The double asterisk allows all HTTPS image sources
      },
    ],
  },
};

export default nextConfig;