import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "KaruviLab — Free Online Tools",
  description: "KaruviLab – fast, private browser tools for developers, designers, and daily tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)})();`,
          }}
        />
      </head>
      <body className="antialiased bg-bg text-text min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-[280px]">
            <header className="h-[52px] border-b border-border flex items-center justify-end px-6 sticky top-0 bg-surface/90 backdrop-blur-md z-30">
              <ThemeToggle />
            </header>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
