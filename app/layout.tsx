import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { PWARegistration } from "@/components/PWARegistration";
import { ClientProviders } from "@/components/ClientProviders";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { RecoveryBanner } from "@/components/system/RecoveryBanner";
import { CookieConsentBanner } from "@/components/system/CookieConsentBanner";
import { AdSenseScript } from "@/components/system/AdSenseScript";

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var t = localStorage.getItem('karuvi-theme') || 'system';
              var r = t;
              if (t === 'system') {
                r = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              document.documentElement.setAttribute('data-theme', r);
              
              var f = localStorage.getItem('karuvi-font-size') || '1.0';
              document.documentElement.setAttribute('data-font-size', f);

              if (localStorage.getItem('karuvi-high-contrast') === 'true') {
                document.documentElement.classList.add('high-contrast');
              }
            })();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-bg text-text min-h-screen selection:bg-blue/20 selection:text-blue`}>
        <ClientProviders>
          <RecoveryBanner />
          <CookieConsentBanner />
          <AdSenseScript />
          <div className="flex min-h-screen">
            <Sidebar />
            
            <div className="flex-1 flex flex-col md:ml-[280px] min-w-0">
              <Header />
              
              <main className="flex-1 pb-20 md:pb-0">
                {children}
              </main>

              <Footer />
              <BottomNav />
            </div>
          </div>
          <PWARegistration />
        </ClientProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
