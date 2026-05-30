import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  basePath: isGithubPages ? '/karuvilab' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? '/karuvilab' : '',
  },
  images: {
    unoptimized: isGithubPages,
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  turbopack: {},
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

if (isGithubPages) {
  nextConfig.output = 'export';
}

export default nextConfig;
