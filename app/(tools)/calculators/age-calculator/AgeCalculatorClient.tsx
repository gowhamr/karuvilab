"use client";

import { useState, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { HybridDateInput } from "@/components/ui/HybridDateInput";
import { useUrlState } from "@/src/hooks/useUrlState";
import { ShareButton } from "@/components/ui/ShareButton";
import { SharedResultBanner } from "@/components/ui/SharedResultBanner";
import { QRModal } from "@/components/ui/QRModal";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { RotateCcw, Users, Sparkles, Clock, Globe, ChevronDown, ChevronUp, HeartPulse } from "lucide-react";

function todayISO(): string {
  return new Date().toISOString().split('T')[0]!;
}

const TIMEZONE_PRESETS = [
  { label: "India Standard Time (IST, UTC+5:30)", offset: 330, id: "Asia/Kolkata" },
  { label: "UTC / GMT (London, UTC+0:00)", offset: 0, id: "Europe/London" },
  { label: "US Eastern Time (EST/EDT, UTC-5:00)", offset: -300, id: "America/New_York" },
  { label: "US Central Time (CST/CDT, UTC-6:00)", offset: -360, id: "America/Chicago" },
  { label: "US Mountain Time (MST/MDT, UTC-7:00)", offset: -420, id: "America/Denver" },
  { label: "US Pacific Time (PST/PDT, UTC-8:00)", offset: -480, id: "America/Los_Angeles" },
  { label: "Central European Time (CET/CEST, UTC+1:00)", offset: 60, id: "Europe/Paris" },
  { label: "Gulf Standard Time (Dubai/UAE, UTC+4:00)", offset: 240, id: "Asia/Dubai" },
  { label: "Singapore / Malaysia / China (SGT/CST, UTC+8:00)", offset: 480, id: "Asia/Singapore" },
  { label: "Japan Standard Time (JST, Tokyo, UTC+9:00)", offset: 540, id: "Asia/Tokyo" },
  { label: "Australian Eastern Time (AEST/AEDT, UTC+10:00)", offset: 600, id: "Australia/Sydney" },
  { label: "New Zealand Time (NZST/NZDT, UTC+12:00)", offset: 720, id: "Pacific/Auckland" },
  { label: "Brazil / Sao Paulo (BRT, UTC-3:00)", offset: -180, id: "America/Sao_Paulo" },
];

function getSunZodiacSign(month: number, day: number): { sign: string; emoji: string; element: string; dates: string } {
  const signs = [
    { sign: 'Capricorn', emoji: '♑', element: 'Earth', start: [1, 1], end: [1, 19], dates: 'Dec 22 – Jan 19' },
    { sign: 'Aquarius', emoji: '♒', element: 'Air', start: [1, 20], end: [2, 18], dates: 'Jan 20 – Feb 18' },
    { sign: 'Pisces', emoji: '♓', element: 'Water', start: [2, 19], end: [3, 20], dates: 'Feb 19 – Mar 20' },
    { sign: 'Aries', emoji: '♈', element: 'Fire', start: [3, 21], end: [4, 19], dates: 'Mar 21 – Apr 19' },
    { sign: 'Taurus', emoji: '♉', element: 'Earth', start: [4, 20], end: [5, 20], dates: 'Apr 20 – May 20' },
    { sign: 'Gemini', emoji: '♊', element: 'Air', start: [5, 21], end: [6, 20], dates: 'May 21 – Jun 20' },
    { sign: 'Cancer', emoji: '♋', element: 'Water', start: [6, 21], end: [7, 22], dates: 'Jun 21 – Jul 22' },
    { sign: 'Leo', emoji: '♌', element: 'Fire', start: [7, 23], end: [8, 22], dates: 'Jul 23 – Aug 22' },
    { sign: 'Virgo', emoji: '♍', element: 'Earth', start: [8, 23], end: [9, 22], dates: 'Aug 23 – Sep 22' },
    { sign: 'Libra', emoji: '♎', element: 'Air', start: [9, 23], end: [10, 22], dates: 'Sep 23 – Oct 22' },
    { sign: 'Scorpio', emoji: '♏', element: 'Water', start: [10, 23], end: [11, 21], dates: 'Oct 23 – Nov 21' },
    { sign: 'Sagittarius', emoji: '♐', element: 'Fire', start: [11, 22], end: [12, 21], dates: 'Nov 22 – Dec 21' },
    { sign: 'Capricorn', emoji: '♑', element: 'Earth', start: [12, 22], end: [12, 31], dates: 'Dec 22 – Jan 19' },
  ];
  for (const s of signs) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (sm !== undefined && sd !== undefined && em !== undefined && ed !== undefined) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) {
        return s;
      }
    }
  }
  return signs[0]!;
}

function getDetailedMoonPosition(
  dateStr: string,
  timeStr: string = "12:00",
  tzOffsetMinutes: number = 0
): {
  tropicalMoon: string;
  tropicalElement: string;
  tropicalDeg: string;
  vedicRasi: string;
  vedicElement: string;
  vedicDeg: string;
  nakshatra: string;
  nakshatraPada: string;
  moonPhase: string;
  illumination: string;
  ayanamsa: string;
} {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "12:00").split(":").map(Number);

  if (!y || !m || !d) {
    return {
      tropicalMoon: "Unknown",
      tropicalElement: "Unknown",
      tropicalDeg: "",
      vedicRasi: "Unknown",
      vedicElement: "Unknown",
      vedicDeg: "",
      nakshatra: "Unknown",
      nakshatraPada: "",
      moonPhase: "🌑 New Moon",
      illumination: "0%",
      ayanamsa: "0°",
    };
  }

  // Convert local date/time to UTC timestamp
  const localMs = Date.UTC(y, m - 1, d, hh || 12, mm || 0);
  const utcMs = localMs - tzOffsetMinutes * 60 * 1000;
  const utcDate = new Date(utcMs);

  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const days = (utcDate.getTime() - j2000) / 86400000;

  const L = (218.3164477 + 13.17639647 * days) % 360;
  const M = (134.9634025 + 13.06499295 * days) % 360;
  const F = (93.2720950 + 13.22935026 * days) % 360;
  const SunM = (357.5291092 + 0.98560028 * days) % 360;
  const D = (297.8501921 + 12.19074912 * days) % 360;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  let lambda =
    L +
    6.288774 * Math.sin(toRad(M)) -
    1.274020 * Math.sin(toRad(2 * D - M)) +
    0.658314 * Math.sin(toRad(2 * D)) +
    0.213618 * Math.sin(toRad(2 * M)) -
    0.185116 * Math.sin(toRad(SunM)) -
    0.114332 * Math.sin(toRad(2 * F)) +
    0.058793 * Math.sin(toRad(2 * D - 2 * M)) +
    0.057066 * Math.sin(toRad(2 * D - SunM - M)) +
    0.053322 * Math.sin(toRad(2 * D + M));

  lambda = ((lambda % 360) + 360) % 360;

  const signs = [
    { sign: "Aries", emoji: "♈", element: "Fire" },
    { sign: "Taurus", emoji: "♉", element: "Earth" },
    { sign: "Gemini", emoji: "♊", element: "Air" },
    { sign: "Cancer", emoji: "♋", element: "Water" },
    { sign: "Leo", emoji: "♌", element: "Fire" },
    { sign: "Virgo", emoji: "♍", element: "Earth" },
    { sign: "Libra", emoji: "♎", element: "Air" },
    { sign: "Scorpio", emoji: "♏", element: "Water" },
    { sign: "Sagittarius", emoji: "♐", element: "Fire" },
    { sign: "Capricorn", emoji: "♑", element: "Earth" },
    { sign: "Aquarius", emoji: "♒", element: "Air" },
    { sign: "Pisces", emoji: "♓", element: "Water" },
  ];

  // Western Tropical Sign
  const tropSignIdx = Math.floor(lambda / 30) % 12;
  const tropSign = signs[tropSignIdx] || signs[0]!;
  const tropDeg = Math.floor(lambda % 30);
  const tropMin = Math.floor(((lambda % 30) - tropDeg) * 60);

  // Lahiri Ayanamsa for Vedic
  const decimalYear = y + (m - 1) / 12 + d / 365.25;
  const ayanamsa = 23.8566 + 0.013968 * (decimalYear - 2000);
  const siderealLambda = ((lambda - ayanamsa) % 360 + 360) % 360;

  const vedicRasis = [
    { name: "Mesha (Aries)", emoji: "♈", element: "Fire" },
    { name: "Vrishabha (Taurus)", emoji: "♉", element: "Earth" },
    { name: "Mithuna (Gemini)", emoji: "♊", element: "Air" },
    { name: "Karka (Cancer)", emoji: "♋", element: "Water" },
    { name: "Simha (Leo)", emoji: "♌", element: "Fire" },
    { name: "Kanya (Virgo)", emoji: "♍", element: "Earth" },
    { name: "Tula (Libra)", emoji: "♎", element: "Air" },
    { name: "Vrishchika (Scorpio)", emoji: "♏", element: "Water" },
    { name: "Dhanu (Sagittarius)", emoji: "♐", element: "Fire" },
    { name: "Makara (Capricorn)", emoji: "♑", element: "Earth" },
    { name: "Kumbha (Aquarius)", emoji: "♒", element: "Air" },
    { name: "Meena (Pisces)", emoji: "♓", element: "Water" },
  ];

  const vedicRasiIdx = Math.floor(siderealLambda / 30) % 12;
  const vedicRasi = vedicRasis[vedicRasiIdx] || vedicRasis[0]!;
  const vedicDeg = Math.floor(siderealLambda % 30);
  const vedicMin = Math.floor(((siderealLambda % 30) - vedicDeg) * 60);

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];

  const nakshatraSpan = 360 / 27;
  const nakshatraIdx = Math.floor(siderealLambda / nakshatraSpan) % 27;
  const nakshatraName = nakshatras[nakshatraIdx] || nakshatras[0]!;
  const pada = Math.floor(((siderealLambda % nakshatraSpan) / (nakshatraSpan / 4))) + 1;

  // Synodic Phase
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const phaseDays = ((utcDate.getTime() - knownNewMoon) / 86400000) % 29.530588853;
  const normalizedPhase = ((phaseDays % 29.530588853) + 29.530588853) % 29.530588853;

  let phaseName = "New Moon";
  let phaseEmoji = "🌑";
  if (normalizedPhase < 1.85) { phaseName = "New Moon"; phaseEmoji = "🌑"; }
  else if (normalizedPhase < 5.54) { phaseName = "Waxing Crescent"; phaseEmoji = "🌒"; }
  else if (normalizedPhase < 9.23) { phaseName = "First Quarter"; phaseEmoji = "🌓"; }
  else if (normalizedPhase < 12.92) { phaseName = "Waxing Gibbous"; phaseEmoji = "🌔"; }
  else if (normalizedPhase < 16.61) { phaseName = "Full Moon"; phaseEmoji = "🌕"; }
  else if (normalizedPhase < 20.30) { phaseName = "Waning Gibbous"; phaseEmoji = "🌖"; }
  else if (normalizedPhase < 23.99) { phaseName = "Last Quarter"; phaseEmoji = "🌗"; }
  else if (normalizedPhase < 27.68) { phaseName = "Waning Crescent"; phaseEmoji = "🌘"; }
  else { phaseName = "New Moon"; phaseEmoji = "🌑"; }

  const illumination = Math.round(((1 - Math.cos((normalizedPhase / 29.530588853) * 2 * Math.PI)) / 2) * 100);

  return {
    tropicalMoon: `${tropSign.emoji} ${tropSign.sign}`,
    tropicalElement: tropSign.element,
    tropicalDeg: `${tropDeg}°${tropMin.toString().padStart(2, "0")}'`,
    vedicRasi: `${vedicRasi.emoji} ${vedicRasi.name}`,
    vedicElement: vedicRasi.element,
    vedicDeg: `${vedicDeg}°${vedicMin.toString().padStart(2, "0")}'`,
    nakshatra: nakshatraName,
    nakshatraPada: `Pada ${pada}`,
    moonPhase: `${phaseEmoji} ${phaseName}`,
    illumination: `${illumination}%`,
    ayanamsa: `${ayanamsa.toFixed(2)}°`,
  };
}

function getChineseZodiac(year: number): { animal: string; element: string; emoji: string } {
  const animals = [
    { animal: 'Rat', emoji: '🐀' },
    { animal: 'Ox', emoji: '🐂' },
    { animal: 'Tiger', emoji: '🐅' },
    { animal: 'Rabbit', emoji: '🐇' },
    { animal: 'Dragon', emoji: '🐉' },
    { animal: 'Snake', emoji: '🐍' },
    { animal: 'Horse', emoji: '🐎' },
    { animal: 'Goat', emoji: '🐐' },
    { animal: 'Monkey', emoji: '🐒' },
    { animal: 'Rooster', emoji: '🐓' },
    { animal: 'Dog', emoji: '🐕' },
    { animal: 'Pig', emoji: '🐖' },
  ];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const elementIndex = Math.floor(((year - 4) % 10 + 10) % 10 / 2) % 5;

  const a = animals[animalIndex] || animals[0]!;
  const e = elements[elementIndex] || elements[0]!;

  return {
    animal: a.animal,
    emoji: a.emoji,
    element: e,
  };
}

function getBirthstoneAndFlower(month: number): { birthstone: string; birthFlower: string } {
  const items = [
    { birthstone: '💎 Garnet', birthFlower: '🌸 Carnation' },
    { birthstone: '💎 Amethyst', birthFlower: '🌸 Violet' },
    { birthstone: '💎 Aquamarine', birthFlower: '🌸 Daffodil' },
    { birthstone: '💎 Diamond', birthFlower: '🌸 Daisy' },
    { birthstone: '💎 Emerald', birthFlower: '🌸 Lily of the Valley' },
    { birthstone: '💎 Pearl', birthFlower: '🌸 Rose' },
    { birthstone: '💎 Ruby', birthFlower: '🌸 Water Lily' },
    { birthstone: '💎 Peridot', birthFlower: '🌸 Poppy' },
    { birthstone: '💎 Sapphire', birthFlower: '🌸 Morning Glory' },
    { birthstone: '💎 Opal', birthFlower: '🌸 Marigold' },
    { birthstone: '💎 Topaz', birthFlower: '🌸 Chrysanthemum' },
    { birthstone: '💎 Turquoise', birthFlower: '🌸 Narcissus' },
  ];
  return items[month - 1] || items[0]!;
}

function calculateDiff(d1: Date, d2: Date) {
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
  if (d1 > d2) return null;

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months--;
    const prev = new Date(d2.getFullYear(), d2.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

interface PlanetInfo {
  name: string;
  symbol: string;
  trop: string;
  tropElement: string;
  ved: string;
  vedElement: string;
}

function calculateEphemeris(
  dateStr: string,
  timeStr: string = "12:00",
  tzOffsetMinutes: number = 0
): {
  ayanamsa: string;
  planets: PlanetInfo[];
} {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "12:00").split(":").map(Number);

  if (!y || !m || !d) {
    return { ayanamsa: "0°", planets: [] };
  }

  const localMs = Date.UTC(y, m - 1, d, hh || 12, mm || 0);
  const utcMs = localMs - tzOffsetMinutes * 60 * 1000;
  const utcDate = new Date(utcMs);

  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const days = (utcDate.getTime() - j2000) / 86400000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const normDeg = (deg: number) => ((deg % 360) + 360) % 360;

  // Sun
  const sunL = normDeg(280.46646 + 0.98564736 * days);
  const sunM = normDeg(357.52911 + 0.98560028 * days);
  const sunLambda = normDeg(sunL + 1.914602 * Math.sin(toRad(sunM)) + 0.019993 * Math.sin(toRad(2 * sunM)));
  const sunR = 1.00014 - 0.01671 * Math.cos(toRad(sunM)) - 0.00014 * Math.cos(toRad(2 * sunM));
  const earthHelioX = sunR * Math.cos(toRad(sunLambda + 180));
  const earthHelioY = sunR * Math.sin(toRad(sunLambda + 180));

  // Moon
  const moonL = normDeg(218.3164477 + 13.17639647 * days);
  const moonM = normDeg(134.9634025 + 13.06499295 * days);
  const moonF = normDeg(93.2720950 + 13.22935026 * days);
  const moonD = normDeg(297.8501921 + 12.19074912 * days);
  let moonLambda =
    moonL +
    6.288774 * Math.sin(toRad(moonM)) -
    1.274020 * Math.sin(toRad(2 * moonD - moonM)) +
    0.658314 * Math.sin(toRad(2 * moonD)) +
    0.213618 * Math.sin(toRad(2 * moonM)) -
    0.185116 * Math.sin(toRad(sunM)) -
    0.114332 * Math.sin(toRad(2 * moonF));
  moonLambda = normDeg(moonLambda);

  function calcPlanetGeo(
    a: number,
    e: number,
    meanL_0: number,
    rateL: number,
    meanM_0: number,
    rateM: number,
    c1: number,
    c2: number = 0
  ): number {
    const lMean = normDeg(meanL_0 + rateL * days);
    const mMean = normDeg(meanM_0 + rateM * days);
    const center = c1 * Math.sin(toRad(mMean)) + c2 * Math.sin(toRad(2 * mMean));
    const helioL = normDeg(lMean + center);
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(toRad(mMean + center)));
    const xh = r * Math.cos(toRad(helioL));
    const yh = r * Math.sin(toRad(helioL));
    const xg = xh - earthHelioX;
    const yg = yh - earthHelioY;
    return normDeg(toDeg(Math.atan2(yg, xg)));
  }

  const mercuryLambda = calcPlanetGeo(0.387098, 0.205630, 252.2507, 4.0923388, 174.7947, 4.0923344, 23.440, 2.9818);
  const venusLambda = calcPlanetGeo(0.723330, 0.006772, 181.9798, 1.6021302, 50.115, 1.6021305, 0.7758, 0.0033);
  const marsLambda = calcPlanetGeo(1.523688, 0.093405, 355.433, 0.5240330, 19.373, 0.5240208, 10.691, 0.623);
  const jupiterLambda = calcPlanetGeo(5.20256, 0.048498, 34.351, 0.0830853, 20.020, 0.0830853, 5.555, 0.168);
  const saturnLambda = calcPlanetGeo(9.55475, 0.055546, 50.077, 0.0334442, 317.020, 0.0334442, 6.358, 0.220);
  const uranusLambda = calcPlanetGeo(19.2184, 0.04638, 314.055, 0.0117258, 142.2386, 0.0117258, 5.304);
  const neptuneLambda = calcPlanetGeo(30.1104, 0.00946, 304.349, 0.0059810, 256.228, 0.0059810, 1.100);
  const plutoLambda = calcPlanetGeo(39.482, 0.2488, 238.929, 0.003960, 14.882, 0.003960, 28.3);
  const rahuLambda = normDeg(125.04452 - 0.05295376 * days);
  const ketuLambda = normDeg(rahuLambda + 180);

  // Lahiri Ayanamsa
  const decimalYear = y + (m - 1) / 12 + d / 365.25;
  const ayanamsaVal = 23.8566 + 0.013968 * (decimalYear - 2000);

  const signs = [
    { sign: "Aries", vedic: "Mesha", emoji: "♈", element: "Fire" },
    { sign: "Taurus", vedic: "Vrishabha", emoji: "♉", element: "Earth" },
    { sign: "Gemini", vedic: "Mithuna", emoji: "♊", element: "Air" },
    { sign: "Cancer", vedic: "Karka", emoji: "♋", element: "Water" },
    { sign: "Leo", vedic: "Simha", emoji: "♌", element: "Fire" },
    { sign: "Virgo", vedic: "Kanya", emoji: "♍", element: "Earth" },
    { sign: "Libra", vedic: "Tula", emoji: "♎", element: "Air" },
    { sign: "Scorpio", vedic: "Vrishchika", emoji: "♏", element: "Water" },
    { sign: "Sagittarius", vedic: "Dhanu", emoji: "♐", element: "Fire" },
    { sign: "Capricorn", vedic: "Makara", emoji: "♑", element: "Earth" },
    { sign: "Aquarius", vedic: "Kumbha", emoji: "♒", element: "Air" },
    { sign: "Pisces", vedic: "Meena", emoji: "♓", element: "Water" },
  ];

  function formatCoord(degVal: number, isVedic = false): { text: string; element: string } {
    const adjusted = isVedic ? normDeg(degVal - ayanamsaVal) : degVal;
    const signIdx = Math.floor(adjusted / 30) % 12;
    const s = signs[signIdx] || signs[0]!;
    const degNum = Math.floor(adjusted % 30);
    const min = Math.floor(((adjusted % 30) - degNum) * 60);
    const signName = isVedic ? s.vedic : s.sign;
    return {
      text: `${s.emoji} ${signName} ~${degNum}°${min.toString().padStart(2, "0")}'`,
      element: s.element,
    };
  }

  const rawBodies = [
    { name: "Sun (Surya)", symbol: "☀️", deg: sunLambda },
    { name: "Moon (Chandra)", symbol: "🌙", deg: moonLambda },
    { name: "Mercury (Budha)", symbol: "☿", deg: mercuryLambda },
    { name: "Venus (Shukra)", symbol: "♀", deg: venusLambda },
    { name: "Mars (Mangala)", symbol: "♂", deg: marsLambda },
    { name: "Jupiter (Guru)", symbol: "♃", deg: jupiterLambda },
    { name: "Saturn (Shani)", symbol: "♄", deg: saturnLambda },
    { name: "Uranus", symbol: "♅", deg: uranusLambda },
    { name: "Neptune", symbol: "♆", deg: neptuneLambda },
    { name: "Pluto", symbol: "♇", deg: plutoLambda },
    { name: "Rahu (North Node)", symbol: "☊", deg: rahuLambda },
    { name: "Ketu (South Node)", symbol: "☋", deg: ketuLambda },
  ];

  const planets: PlanetInfo[] = rawBodies.map((b) => {
    const trop = formatCoord(b.deg, false);
    const ved = formatCoord(b.deg, true);
    return {
      name: b.name,
      symbol: b.symbol,
      trop: trop.text,
      tropElement: trop.element,
      ved: ved.text,
      vedElement: ved.element,
    };
  });

  return {
    ayanamsa: `${ayanamsaVal.toFixed(2)}°`,
    planets,
  };
}

export default function AgeCalculatorClient() {
  const { state, setState, shareUrl, hasParams } = useUrlState({
    defaults: { dob: '1995-01-01', ref: todayISO() },
    debounceMs: 400,
  });

  const dob = state.dob as string;
  const asOf = (state.ref as string) || todayISO();
  const [isQrOpen, setIsQrOpen] = useState(false);
  
  const [showComparison, setShowComparison] = useState(false);
  const [dob2, setDob2] = useState('');

  // Precision Celestial state (Birth Time & Place/Timezone)
  const [showPrecisionTime, setShowPrecisionTime] = useState(false);
  const [birthTime, setBirthTime] = useState("12:00");
  const [tzOffset, setTzOffset] = useState<number>(() => -new Date().getTimezoneOffset());
  const [astrologySystem, setAstrologySystem] = useState<"tropical" | "vedic">("tropical");

  const setDob = useCallback((v: string) => setState({ dob: v }), [setState]);
  const setAsOf = useCallback((v: string) => setState({ ref: v }), [setState]);

  const resetAll = () => {
    setState({ dob: '1995-01-01', ref: todayISO() });
    setDob2('');
    setShowComparison(false);
    setShowPrecisionTime(false);
    setBirthTime("12:00");
    setTzOffset(-new Date().getTimezoneOffset());
  };

  const result = useMemo(() => {
    if (!asOf || !dob) return null;

    const d1 = new Date(dob);
    const d2 = new Date(asOf);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    if (d1 > d2) return null;

    const diff = calculateDiff(d1, d2);
    if (!diff) return null;
    const { years, months, days } = diff;

    const totalDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    const totalWeeks = totalDays / 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalDays * 24 * 60;
    const totalSeconds = totalDays * 24 * 60 * 60;

    // Life Statistics (Biological & Calendar Estimates)
    const approxHeartbeats = Math.round(totalMinutes * 75); // ~75 bpm average resting heart rate
    const approxSleepHours = Math.round(totalHours / 3); // ~8 hours/day (1/3 of life)
    const approxBreaths = Math.round(totalMinutes * 16); // ~16 breaths per minute

    // Percentage of current year completed
    const startOfYear = new Date(d2.getFullYear(), 0, 1);
    const endOfYear = new Date(d2.getFullYear() + 1, 0, 1);
    const yearProgressPct = Math.min(
      100,
      Math.max(
        0,
        ((d2.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100
      )
    );

    // Percentage of expected lifespan (based on statistical 80-year lifespan baseline)
    const expectedLifespanYears = 80;
    const lifespanProgressPct = Math.min(
      100,
      (totalDays / (expectedLifespanYears * 365.2425)) * 100
    );
    
    const today = new Date();
    let nextBDay = new Date(today.getFullYear(), d1.getMonth(), d1.getDate());
    if (nextBDay <= today) {
      nextBDay = new Date(today.getFullYear() + 1, d1.getMonth(), d1.getDate());
    }

    const sunZodiac = getSunZodiacSign(d1.getMonth() + 1, d1.getDate());
    const moonDetails = getDetailedMoonPosition(
      dob,
      showPrecisionTime ? birthTime : "12:00",
      showPrecisionTime ? tzOffset : 0
    );
    const ephemeris = calculateEphemeris(
      dob,
      showPrecisionTime ? birthTime : "12:00",
      showPrecisionTime ? tzOffset : 0
    );
    const chineseZodiac = getChineseZodiac(d1.getFullYear());
    const birthstoneFlower = getBirthstoneAndFlower(d1.getMonth() + 1);

    return {
      years,
      months,
      days,
      totalMonths,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      approxHeartbeats,
      approxSleepHours,
      approxBreaths,
      yearProgressPct,
      lifespanProgressPct,
      birthDayOfWeek: new Date(dob).toLocaleDateString('en-US', { weekday: 'long' }),
      sunSign: `${sunZodiac.emoji} ${sunZodiac.sign}`,
      sunElement: sunZodiac.element,
      sunDates: sunZodiac.dates,
      tropicalMoon: moonDetails.tropicalMoon,
      tropicalElement: moonDetails.tropicalElement,
      tropicalDeg: moonDetails.tropicalDeg,
      vedicRasi: moonDetails.vedicRasi,
      vedicElement: moonDetails.vedicElement,
      vedicDeg: moonDetails.vedicDeg,
      nakshatra: moonDetails.nakshatra,
      nakshatraPada: moonDetails.nakshatraPada,
      moonPhase: moonDetails.moonPhase,
      moonIllumination: moonDetails.illumination,
      chineseZodiac: `${chineseZodiac.emoji} ${chineseZodiac.element} ${chineseZodiac.animal}`,
      birthstone: birthstoneFlower.birthstone,
      birthFlower: birthstoneFlower.birthFlower,
      nextBirthday: nextBDay.toISOString().split('T')[0],
      daysUntilBirthday: Math.ceil((nextBDay.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      isLeapYearBirth: (d1.getFullYear() % 4 === 0 && (d1.getFullYear() % 100 !== 0 || d1.getFullYear() % 400 === 0)),
      ephemeris,
    };
  }, [dob, asOf, showPrecisionTime, birthTime, tzOffset]);

  const comparisonResult = useMemo(() => {
    if (!showComparison || !dob || !dob2) return null;
    const d1 = new Date(dob);
    const d2 = new Date(dob2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    
    const older = d1 < d2 ? d1 : d2;
    const younger = d1 < d2 ? d2 : d1;
    
    const diff = calculateDiff(older, younger);
    return diff;
  }, [showComparison, dob, dob2]);

  return (
    <div className="w-full space-y-8">
      <SharedResultBanner hasParams={hasParams} toolName="Age Calculator" />
      <QRModal url={shareUrl} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ToolWorkspace
        layout="split"
        input={
          <div className="grid grid-cols-1 gap-6">
            <HybridDateInput
              label="Date of Birth"
              value={dob}
              onChange={setDob}
              max={asOf}
              description="DD / MM / YYYY"
              id="age-calc-dob"
            />
            {showComparison && (
              <HybridDateInput
                label="Person 2 Date of Birth"
                value={dob2}
                onChange={setDob2}
                description="DD / MM / YYYY"
                id="age-calc-dob2"
              />
            )}
            <HybridDateInput
              label="Calculate As Of"
              value={asOf}
              onChange={setAsOf}
              description="DD / MM / YYYY"
              id="age-calc-asof"
            />

            {/* Precision Celestial Settings Accordion */}
            <div className="border border-border/80 rounded-2xl p-4 bg-surface-2/40 space-y-4">
              <button
                type="button"
                onClick={() => setShowPrecisionTime(!showPrecisionTime)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-text hover:text-blue transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue" />
                  <span>Precision Birth Time & Location (Optional)</span>
                </div>
                {showPrecisionTime ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>

              {showPrecisionTime && (
                <div className="space-y-4 pt-2 border-t border-border/50 text-xs">
                  <p className="text-text-muted">
                    Planets traverse zodiac positions continually. Enter birth time and location/timezone for pinpoint planetary positions, Moon Sign (Rasi), and Nakshatra.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="birth-time-input" className="flex items-center gap-1.5 font-medium text-text">
                        <Clock className="w-3.5 h-3.5 text-blue" />
                        <span>Birth Time (24h)</span>
                      </label>
                      <input
                        id="birth-time-input"
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-blue text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="birth-tz-select" className="flex items-center gap-1.5 font-medium text-text">
                        <Globe className="w-3.5 h-3.5 text-blue" />
                        <span>Birth Place / Timezone</span>
                      </label>
                      <select
                        id="birth-tz-select"
                        value={tzOffset}
                        onChange={(e) => setTzOffset(Number(e.target.value))}
                        className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-blue text-sm"
                      >
                        {TIMEZONE_PRESETS.map((tz) => (
                          <option key={tz.id} value={tz.offset}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        output={
          result ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <h3 className="text-lg font-semibold text-text">Result</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <button 
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    {showComparison ? "Hide Comparison" : "Compare Ages"}
                  </button>
                  <button 
                    onClick={resetAll}
                    className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <ShareButton
                    url={shareUrl}
                    title={`Age: ${result.years} years ${result.months} months ${result.days} days — KaruviLab`}
                    onQrClick={() => setIsQrOpen(true)}
                  />
                </div>
              </div>
              
              {/* Section 1: Primary Result */}
              <div className="w-full">
                <MetricCard 
                  label="Exact Age" 
                  value={`${result.years} Years, ${result.months} Months, ${result.days} Days`} 
                  accent 
                />
              </div>

              {/* Section 2: Birthday Countdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard label="Next Birthday" value={result.nextBirthday || ''} />
                <MetricCard label="Days Until Birthday" value={`${result.daysUntilBirthday.toLocaleString()} 🎂`} />
              </div>

              {/* Section 3: Time Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard label="Total Months" value={result.totalMonths.toLocaleString()} />
                <MetricCard 
                  label="Total Weeks" 
                  value={result.totalWeeks.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
                />
                <MetricCard label="Total Days" value={result.totalDays.toLocaleString()} />
                <MetricCard label="Total Hours" value={result.totalHours.toLocaleString()} />
                <MetricCard label="Total Minutes" value={result.totalMinutes.toLocaleString()} />
                <MetricCard label="Total Seconds" value={result.totalSeconds.toLocaleString()} />
              </div>

              {/* Age Difference (Comparison Mode - Placed above Zodiac) */}
              {showComparison && comparisonResult && (
                <div className="w-full">
                  <MetricCard 
                    label="Age Difference (Comparison)" 
                    value={`${comparisonResult.years} Years, ${comparisonResult.months} Months, ${comparisonResult.days} Days`} 
                    accent
                  />
                </div>
              )}

              {/* Section 4: Zodiac & Celestial Profile */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted">
                    <Sparkles className="w-3.5 h-3.5 text-blue" />
                    <span>Zodiac & Celestial Profile</span>
                  </div>

                  {/* Astrology System Switcher */}
                  <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-border text-xs">
                    <button
                      type="button"
                      onClick={() => setAstrologySystem("tropical")}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                        astrologySystem === "tropical"
                          ? "bg-blue text-white shadow-sm"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      Western / Tropical
                    </button>
                    <button
                      type="button"
                      onClick={() => setAstrologySystem("vedic")}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                        astrologySystem === "vedic"
                          ? "bg-blue text-white shadow-sm"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      Vedic / Sidereal
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <MetricCard 
                    label="Sun Sign" 
                    value={result.sunSign}
                    sub={`${result.sunElement} • ${result.sunDates}`} 
                  />
                  <MetricCard 
                    label="Moon Sign" 
                    value={astrologySystem === "tropical" ? result.tropicalMoon : result.vedicRasi} 
                    sub={
                      astrologySystem === "tropical"
                        ? `${result.tropicalElement} Element • ${result.tropicalDeg}`
                        : `${result.vedicElement} • ${result.vedicDeg} (Lahiri)`
                    } 
                  />
                  <MetricCard 
                    label="Nakshatra (Lunar Mansion)" 
                    value={result.nakshatra} 
                    sub={result.nakshatraPada} 
                  />
                  <MetricCard 
                    label="Birth Moon Phase" 
                    value={result.moonPhase} 
                    sub={`${result.moonIllumination} Illumination`} 
                  />
                  <MetricCard 
                    label="Chinese Zodiac" 
                    value={result.chineseZodiac} 
                    sub="Lunar Year Stem" 
                  />
                  <MetricCard 
                    label="Ayanamsa (Precession)" 
                    value={result.ephemeris.ayanamsa} 
                    sub="Chitra Paksha / Lahiri" 
                  />
                </div>

                {/* Planetary Positions Ephemeris Table */}
                <div className="border border-border rounded-2xl overflow-hidden bg-surface-2/30">
                  <div className="px-4 py-3 bg-surface-2 border-b border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-text uppercase tracking-wider">
                      {astrologySystem === "tropical" ? "Western / Tropical Planetary Positions" : "Vedic / Sidereal Planetary Positions"}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Ephemeris Longitudes at Birth
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-text-muted bg-surface-2/50">
                          <th className="py-2.5 px-4 font-semibold">Planet</th>
                          <th className="py-2.5 px-4 font-semibold">Position</th>
                          <th className="py-2.5 px-4 font-semibold">Element</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {result.ephemeris.planets.map((planet) => (
                          <tr key={planet.name} className="hover:bg-surface-2/40 transition-colors">
                            <td className="py-2 px-4 font-medium text-text flex items-center gap-2">
                              <span className="text-sm">{planet.symbol}</span>
                              <span>{planet.name}</span>
                            </td>
                            <td className="py-2 px-4 font-semibold text-text">
                              {astrologySystem === "tropical" ? planet.trop : planet.ved}
                            </td>
                            <td className="py-2 px-4 text-text-muted">
                              {astrologySystem === "tropical" ? planet.tropElement : planet.vedElement}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Section 5: Life Statistics & Biological Estimates */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted">
                  <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                  <span>Life Statistics & Bio-Estimates</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard 
                    label="Days Lived" 
                    value={result.totalDays.toLocaleString()} 
                    sub={`${result.totalWeeks.toLocaleString(undefined, { maximumFractionDigits: 1 })} weeks`} 
                  />
                  <MetricCard 
                    label="Months Lived" 
                    value={result.totalMonths.toLocaleString()} 
                    sub={`${result.totalHours.toLocaleString()} hours`} 
                  />
                  <MetricCard 
                    label="Estimated Heartbeats" 
                    value={result.approxHeartbeats.toLocaleString()} 
                    sub="~75 bpm resting avg (estimate)" 
                  />
                  <MetricCard 
                    label="Estimated Sleep" 
                    value={`${result.approxSleepHours.toLocaleString()} hrs`} 
                    sub="~8 hrs/day (1/3 of life)" 
                  />
                  <MetricCard 
                    label="Estimated Breaths" 
                    value={result.approxBreaths.toLocaleString()} 
                    sub="~16 breaths/min (estimate)" 
                  />
                  <MetricCard 
                    label="Current Year Progress" 
                    value={`${result.yearProgressPct.toFixed(1)}%`} 
                    sub={`Year ${new Date(asOf).getFullYear()} elapsed`} 
                  />
                  <MetricCard 
                    label="Statistical Lifespan" 
                    value={`${result.lifespanProgressPct.toFixed(1)}%`} 
                    sub="Based on 80-yr statistical baseline" 
                  />
                  <MetricCard 
                    label="Total Seconds" 
                    value={result.totalSeconds.toLocaleString()} 
                    sub="Total seconds elapsed" 
                  />
                </div>
              </div>

              {/* Section 6: Birth Info & Traditional Gems */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Birth Day of Week" value={result.birthDayOfWeek} />
                <MetricCard label="Leap Year Birth" value={result.isLeapYearBirth ? "Yes" : "No"} />
                <MetricCard label="Birthstone" value={result.birthstone} />
                <MetricCard label="Birth Flower" value={result.birthFlower} />
              </div>
            </div>
          ) : null
        }
      />
    </div>
  );
}

