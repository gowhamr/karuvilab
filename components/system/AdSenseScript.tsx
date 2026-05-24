import Script from "next/script";

export function AdSenseScript() {
  const isProd = process.env.NODE_ENV === "production";
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!isProd || !publisherId) return null;

  // The script loading logic should ideally verify consent in the client
  // But for SSR compatibility, we can add a check here.
  // Note: localStorage is not accessible during initial SSR, 
  // so this script is essentially "guarded" by our client-side logic.
  
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
