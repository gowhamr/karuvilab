"use client";
import { useEffect, useRef } from "react";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  siteKey?: string;
  invisible?: boolean;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: any) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export function Turnstile({ 
  onSuccess, 
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  invisible = false
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let fallbackTimer: NodeJS.Timeout | null = null;

    const handleFallback = () => {
      if (isMounted) {
        onSuccess("cf-fallback-token");
      }
    };

    const renderWidget = () => {
      if (!isMounted) return;
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              if (fallbackTimer) clearTimeout(fallbackTimer);
              onSuccess(token);
            },
            'error-callback': () => {
              handleFallback();
            },
            theme: 'auto',
            ...(invisible ? { size: 'invisible' } : {})
          });
        } catch {
          handleFallback();
        }
      }
    };

    // Set a 3.5s timeout: if Turnstile is blocked by ad-blocker or offline, unblock submit button
    fallbackTimer = setTimeout(() => {
      if (!widgetIdRef.current) {
        handleFallback();
      }
    }, 3500);

    if (window.turnstile) {
      renderWidget();
    } else {
      window.onloadTurnstileCallback = renderWidget;
      let script = document.getElementById("turnstile-script") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback";
        script.async = true;
        script.defer = true;
        script.onerror = () => handleFallback();
        document.head.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onSuccess, invisible]);

  return <div ref={containerRef} className={invisible ? "hidden" : "my-3 flex justify-center"} />;
}
