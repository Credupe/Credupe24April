/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Allow Emergent preview subdomains to connect to the dev server via WS.
  // Top-level field in Next 15.
  allowedDevOrigins: [
    "*.preview.emergentagent.com",
    "*.emergentagent.com",
    "localhost",
  ],
  webpack: (config) => {
    // Images are served as static files from /public/assets/ — no special
    // webpack handling required. Kept here intentionally minimal.
    return config;
  },
};

module.exports = nextConfig;
