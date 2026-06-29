import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  basePath: (isGithubPages && !process.env.CUSTOM_DOMAIN) ? '/karuvilab' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: (isGithubPages && !process.env.CUSTOM_DOMAIN) ? '/karuvilab' : '',
  },
  images: {
    unoptimized: isGithubPages,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 300,
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' https://pagead2.googlesyndication.com https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://pagead2.googlesyndication.com;
      worker-src 'self' blob:;
      connect-src 'self' https://pagead2.googlesyndication.com https://cdn.jsdelivr.net https://open.er-api.com https://api.frankfurter.dev;
      object-src 'none';
      frame-ancestors 'none';
      base-uri 'self';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-slider",
      "@radix-ui/react-toggle-group",
    ],
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
    };
    return config;
  },
};

if (isGithubPages) {
  nextConfig.output = 'export';
}

export default nextConfig;
