import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: process.env.CI !== 'true',
});

const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  serverExternalPackages: ['isomorphic-dompurify'],
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-slider',
      'isomorphic-dompurify',
    ],
  },
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
  ...(isGithubPages ? {} : {
    async headers() {
      const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob:;
        worker-src 'self' blob: https://unpkg.com;
        connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://open.er-api.com https://api.frankfurter.dev;
        object-src 'none';
        frame-ancestors 'self';
        base-uri 'self';
      `.replace(/\s{2,}/g, ' ').trim();
      return [
        {
          source: "/:path*",
          headers: [
            { key: "Content-Security-Policy", value: cspHeader },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
            { key: "Permissions-Policy", value: "camera=(), geolocation=(), browsing-topics=()" },
            { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
            // Spectre mitigation + SharedArrayBuffer isolation (matches vercel.json)
            { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
            { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
            // Defense-in-depth for legacy browsers
            { key: "X-XSS-Protection", value: "1; mode=block" }
          ],
        },
        {
          // Workbench loads same-origin tool pages inside iframes.
          // COEP: credentialless on the embedding page causes browsers to block
          // iframes that themselves respond with COEP headers (COEP mismatch).
          // Override to unsafe-none only for /workbench so iframes can load.
          // X-Frame-Options stays SAMEORIGIN — Workbench itself can still be framed
          // by same-origin contexts (Antigravity IDE etc). P-20 compliant.
          source: "/workbench",
          headers: [
            { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
          ],
        },
      ];
    }
  }),


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
        { source: "/tools/pdf/imgtopdf/:path*",           destination: "/pdf-tools/image-to-pdf/",           permanent: true },
        { source: "/tools/background-remover/:path*",     destination: "/image-tools/bg-remover/",           permanent: true },
        { source: "/tool/compress-pdf/:path*",            destination: "/pdf-tools/compress-pdf/",           permanent: true },
        { source: "/tool/hash-generator/:path*",          destination: "/security-tools/hash-generator/",    permanent: true },
        { source: "/pdf-editor/:path*",                   destination: "/pdf-tools/pdf-editor/",             permanent: true },
        { source: "/hash-generator/:path*",               destination: "/security-tools/hash-generator/",    permanent: true },
        { source: "/tool/pdf-editor/:path*",              destination: "/pdf-tools/pdf-editor/",             permanent: true }
      ];
    }
  }),

  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Explicitly add aliases since Next.js might fail to parse tsconfig paths with TS7
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': process.cwd()
    };
    
    return config;
  },
};

if (isGithubPages) {
  nextConfig.output = 'export';
}

export default withAnalyzer(nextConfig);
