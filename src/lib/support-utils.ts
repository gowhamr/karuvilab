export interface SystemInfo {
  browser: string;
  os: string;
  screenSize: string;
  timestamp: string;
  userAgent: string;
}

export function getSystemInfo(): SystemInfo {
  if (typeof window === 'undefined') {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      screenSize: 'Unknown',
      timestamp: new Date().toISOString(),
      userAgent: 'Unknown'
    };
  }

  const ua = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";

  // Browser detection
  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
  else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
  else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
  else if (ua.indexOf("Edge") > -1) browser = "Edge";
  else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";

  // OS detection
  if (ua.indexOf("Win") > -1) os = "Windows";
  else if (ua.indexOf("Mac") > -1) os = "macOS";
  else if (ua.indexOf("X11") > -1) os = "Linux";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iPhone") > -1) os = "iOS";

  return {
    browser,
    os,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString(),
    userAgent: ua
  };
}
