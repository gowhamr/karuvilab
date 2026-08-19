import {
  WESTERN_ZODIAC_SIGNS,
  VEDIC_RASIS,
  VEDIC_NAKSHATRAS,
  CHINESE_ZODIAC_ANIMALS,
  CHINESE_ZODIAC_ELEMENTS,
  BIRTH_GEMS_AND_FLOWERS,
} from './constants';
import {
  SunSignInfo,
  MoonPositionResult,
  ChineseZodiacInfo,
  BirthGemsInfo,
} from './types';
import {
  toRad,
  normDeg,
  calculateAyanamsa,
  getUtcDateFromLocal,
} from './astronomy-utils';

export function getSunZodiacSign(month: number, day: number): SunSignInfo {
  for (const s of WESTERN_ZODIAC_SIGNS) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (sm !== undefined && sd !== undefined && em !== undefined && ed !== undefined) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) {
        return {
          sign: s.sign,
          emoji: s.emoji,
          element: s.element,
          dates: s.dates,
        };
      }
    }
  }
  const defaultSign = WESTERN_ZODIAC_SIGNS[0]!;
  return {
    sign: defaultSign.sign,
    emoji: defaultSign.emoji,
    element: defaultSign.element,
    dates: defaultSign.dates,
  };
}

export function getDetailedMoonPosition(
  dateStr: string,
  timeStr: string = "12:00",
  tzOffsetMinutes: number = 0
): MoonPositionResult {
  const [y, m, d] = dateStr.split("-").map(Number);
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

  const utcDate = getUtcDateFromLocal(dateStr, timeStr, tzOffsetMinutes);
  if (!utcDate) {
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

  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const days = (utcDate.getTime() - j2000) / 86400000;

  const L = (218.3164477 + 13.17639647 * days) % 360;
  const M = (134.9634025 + 13.06499295 * days) % 360;
  const F = (93.2720950 + 13.22935026 * days) % 360;
  const SunM = (357.5291092 + 0.98560028 * days) % 360;
  const D = (297.8501921 + 12.19074912 * days) % 360;

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

  const westernSigns = [
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
  const tropSign = westernSigns[tropSignIdx] || westernSigns[0]!;
  const tropDeg = Math.floor(lambda % 30);
  const tropMin = Math.floor(((lambda % 30) - tropDeg) * 60);

  // Lahiri Ayanamsa for Vedic
  const ayanamsa = calculateAyanamsa(y, m, d);
  const siderealLambda = normDeg(lambda - ayanamsa);

  const vedicRasiIdx = Math.floor(siderealLambda / 30) % 12;
  const vedicRasi = VEDIC_RASIS[vedicRasiIdx] || VEDIC_RASIS[0]!;
  const vedicDeg = Math.floor(siderealLambda % 30);
  const vedicMin = Math.floor(((siderealLambda % 30) - vedicDeg) * 60);

  const nakshatraSpan = 360 / 27;
  const nakshatraIdx = Math.floor(siderealLambda / nakshatraSpan) % 27;
  const nakshatraName = VEDIC_NAKSHATRAS[nakshatraIdx] || VEDIC_NAKSHATRAS[0]!;
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

export function getChineseZodiac(year: number): ChineseZodiacInfo {
  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const elementIndex = Math.floor(((year - 4) % 10 + 10) % 10 / 2) % 5;

  const a = CHINESE_ZODIAC_ANIMALS[animalIndex] || CHINESE_ZODIAC_ANIMALS[0]!;
  const e = CHINESE_ZODIAC_ELEMENTS[elementIndex] || CHINESE_ZODIAC_ELEMENTS[0]!;

  return {
    animal: a.animal,
    emoji: a.emoji,
    element: e,
  };
}

export function getBirthstoneAndFlower(month: number): BirthGemsInfo {
  const items = BIRTH_GEMS_AND_FLOWERS[month - 1] || BIRTH_GEMS_AND_FLOWERS[0]!;
  return {
    birthstone: items.birthstone,
    birthFlower: items.birthFlower,
  };
}
