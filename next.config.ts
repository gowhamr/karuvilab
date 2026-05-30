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
  ...(isGithubPages ? {} : {
    async redirects() {
      return [
        { source: "/tools/calculators/age/:path*",        destination: "/calculators/age-calculator/",       permanent: true },
        { source: "/tools/calculators/emi/:path*",        destination: "/calculators/emi-calculator/",       permanent: true },
        { source: "/tools/calculators/gst/:path*",        destination: "/calculators/gst-calculator/",       permanent: true },
        { source: "/tools/calculators/sip/:path*",        destination: "/calculators/sip-calculator/",       permanent: true },
        { source: "/tools/calculators/percentage/:path*", destination: "/calculators/percentage-calculator/",permanent: true },
        { source: "/tools/calculators/discount/:path*",   destination: "/calculators/discount-calculator/",  permanent: true },
        { source: "/tools/calculators/unit/:path*",       destination: "/calculators/unit-converter/",       permanent: true },
        { source: "/tools/calculators/speed/:path*",      destination: "/calculators/unit-converter/",       permanent: true },
        { source: "/tools/calculators/temp/:path*",       destination: "/calculators/unit-converter/",       permanent: true },
        { source: "/tools/calculators/storage/:path*",    destination: "/calculators/unit-converter/",       permanent: true },
        { source: "/tools/calculators/date/:path*",       destination: "/calculators/date-calculator/",      permanent: true },
        { source: "/tools/calculators/time/:path*",       destination: "/calculators/time-calculator/",      permanent: true },
        { source: "/tools/calculators/compound/:path*",   destination: "/calculators/compound-interest/",    permanent: true },
        { source: "/tools/calculators/currency/:path*",   destination: "/calculators/currency-converter/",   permanent: true },
        { source: "/tools/calculators/numeral/:path*",    destination: "/calculators/numeral-converter/",    permanent: true },
        { source: "/tools/calculators/worldclock/:path*", destination: "/calculators/world-clock/",          permanent: true },
        { source: "/tools/calculators/utc/:path*",        destination: "/calculators/utc-ist-converter/",    permanent: true },
        { source: "/tools/pdf/compress/:path*",           destination: "/pdf-tools/compress-pdf/",           permanent: true },
        { source: "/tools/pdf/merge/:path*",              destination: "/pdf-tools/merge-pdf/",              permanent: true },
        { source: "/tools/pdf/split/:path*",              destination: "/pdf-tools/split-pdf/",              permanent: true },
        { source: "/tools/pdf/imgtopdf/:path*",           destination: "/pdf-tools/image-to-pdf/",           permanent: true }
      ];
    }
  }),
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
