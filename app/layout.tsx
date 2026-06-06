import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PWARegistration } from "@/components/PWARegistration";
import { ClientProviders } from "@/components/ClientProviders";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { RecoveryBanner } from "@/components/system/RecoveryBanner";
import { CookieConsentBanner } from "@/components/system/CookieConsentBanner";
import { AdSenseConditional } from "@/components/system/AdSenseConditional";
import { StructuredData } from "@/src/lib/seo";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif",
});

export { metadata };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSerif.variable} preload`}>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var s = JSON.parse(localStorage.getItem('karuvi-settings') || '{}');
                var state = s.state || {};
                var app = state.appearance || {};
                
                var t = app.theme || 'system';
                var r = t;
                if (t === 'system') {
                  r = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', r);
                
                var f = app.fontSize || '1.0';
                document.documentElement.setAttribute('data-font-size', f);

                if (app.highContrast === true) {
                  document.documentElement.classList.add('high-contrast');
                }

                // Remove preload class after a frame to enable transitions
                window.requestAnimationFrame(function() {
                  setTimeout(function() {
                    document.documentElement.classList.remove('preload');
                  }, 10);
                });
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-bg text-text min-h-screen selection:bg-blue/20 selection:text-blue`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-blue focus:text-white focus:rounded-xl focus:font-black focus:uppercase focus:tracking-widest focus:shadow-2xl focus:shadow-blue/50 outline-none"
        >
          Skip to Content
        </a>
        <ClientProviders>
          <RecoveryBanner />
          <CookieConsentBanner />
          <AdSenseConditional />
          <div className="flex min-h-screen">
            <Sidebar />
            
            <div className="flex-1 flex flex-col md:ml-[280px] min-w-0">
              <Header />
              
              <main id="main-content" className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0 outline-none" tabIndex={-1}>
                {children}
              </main>

              <Footer />
              <BottomNav />
            </div>
          </div>
          <PWARegistration />
          <StructuredData />
        </ClientProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
