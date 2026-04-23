/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Performance
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  allowedDevOrigins: [
    "*.preview.emergentagent.com",
    "*.emergentagent.com",
    "localhost",
  ],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "framer-motion",
    ],
  },
  images: { unoptimized: true },
  webpack: (config) => config,
};

module.exports = nextConfig;
