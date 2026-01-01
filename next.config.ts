import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow multiple dev instances by disabling lock file check
  experimental: {
    // This helps with multiple instances
  },
};

export default nextConfig;
