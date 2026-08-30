import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display, Poppins } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import { PWARegistration } from "@/components/PWARegistration";
import { ClientProviders } from "@/components/ClientProviders";
import { MainLayout } from "@/components/system/MainLayout";
import { RecoveryBanner } from "@/components/system/RecoveryBanner";
import { StructuredData } from "@/src/lib/seo";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${dmSerif.variable} preload`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KaruviLab" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
        
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/splashes/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1242x2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-828x1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1284x2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1179x2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1488x2266.png" media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1640x2360.png" media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var s = {};
                try {
                  s = JSON.parse(localStorage.getItem('karuvi-settings') || '{}');
                } catch(e) {}
                var state = s.state || {};
                var app = state.appearance || {};
                var acc = state.accessibility || {};
                
                var cookieMatch = document.cookie.match(/(?:^|; )kv-theme=([^;]*)/);
                var cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

                var t = app.theme || cookieTheme || 'system';
                var r = t;
                if (t === 'system') {
                  try {
                    r = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
                  } catch (me) {
                    r = 'light';
                  }
                }
                document.documentElement.setAttribute('data-theme', r);
                if (r === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                var f = acc.fontScaling || app.fontSize || '1.0';
                document.documentElement.setAttribute('data-font-size', f);

                if (acc.highContrast === true || app.highContrast === true) {
                  document.documentElement.classList.add('high-contrast');
                }
                
                if (acc.focusMode === true) {
                  document.documentElement.classList.add('focus-mode');
                }
                
                if (acc.keyboardShortcutsOverlay === true) {
                  document.documentElement.classList.add('show-shortcuts');
                }

              } catch (e) {}
            })();`,
          }}
        />
        <link rel="llms-txt" href="/llms.txt" />
      </head>
      <body suppressHydrationWarning className={`${inter.className} antialiased bg-bg text-text min-h-screen selection:bg-blue/20 selection:text-blue`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-dropdown focus:px-6 focus:py-3 focus:bg-blue focus:text-white focus:rounded-xl focus:font-black focus:uppercase focus:tracking-widest focus:shadow-2xl focus:shadow-blue/50 outline-none"
        >
          Skip to Content
        </a>
        <ClientProviders>
          <RecoveryBanner />
          <MainLayout>
            {children}
          </MainLayout>
          <PWARegistration />
          <StructuredData />
        </ClientProviders>
      </body>
    </html>
  );
}
