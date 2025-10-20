import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // skip lint errors
  },
  typescript: {
    ignoreBuildErrors: true, // skip TS errors
  },
};

export default nextConfig;
