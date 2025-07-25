import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // !! WARNING !!
    // This allows production builds to succeed even if your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARNING !!
    // This allows production builds to succeed even if you have ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
