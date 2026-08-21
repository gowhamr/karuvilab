export function toRad(deg) {
    return (deg * Math.PI) / 180;
}
export function toDeg(rad) {
    return (rad * 180) / Math.PI;
}
export function normDeg(deg) {
    return ((deg % 360) + 360) % 360;
}
export function calculateAyanamsa(year, month, day) {
    const decimalYear = year + (month - 1) / 12 + day / 365.25;
    return 23.8566 + 0.013968 * (decimalYear - 2000);
}
export function getUtcDateFromLocal(dateStr, timeStr = "12:00", tzOffsetMinutes = 0) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = (timeStr || "12:00").split(":").map(Number);
    if (!y || !m || !d)
        return null;
    const localMs = Date.UTC(y, m - 1, d, hh || 12, mm || 0);
    const utcMs = localMs - tzOffsetMinutes * 60 * 1000;
    return new Date(utcMs);
}
export function calculateEphemeris(dateStr, timeStr = "12:00", tzOffsetMinutes = 0) {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) {
        return { ayanamsa: "0°", planets: [] };
    }
    const utcDate = getUtcDateFromLocal(dateStr, timeStr, tzOffsetMinutes);
    if (!utcDate) {
        return { ayanamsa: "0°", planets: [] };
    }
    const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
    const days = (utcDate.getTime() - j2000) / 86400000;
    // Sun Longitude & Earth Heliocentric Vector
    const sunL = normDeg(280.46646 + 0.98564736 * days);
    const sunM = normDeg(357.52911 + 0.98560028 * days);
    const sunLambda = normDeg(sunL + 1.914602 * Math.sin(toRad(sunM)) + 0.019993 * Math.sin(toRad(2 * sunM)));
    const sunR = 1.00014 - 0.01671 * Math.cos(toRad(sunM)) - 0.00014 * Math.cos(toRad(2 * sunM));
    const earthHelioX = sunR * Math.cos(toRad(sunLambda + 180));
    const earthHelioY = sunR * Math.sin(toRad(sunLambda + 180));
    // Moon Longitude (Brown-Chapront Perturbation Terms)
    const moonL = normDeg(218.3164477 + 13.17639647 * days);
    const moonM = normDeg(134.9634025 + 13.06499295 * days);
    const moonF = normDeg(93.2720950 + 13.22935026 * days);
    const moonD = normDeg(297.8501921 + 12.19074912 * days);
    let moonLambda = moonL +
        6.288774 * Math.sin(toRad(moonM)) -
        1.274020 * Math.sin(toRad(2 * moonD - moonM)) +
        0.658314 * Math.sin(toRad(2 * moonD)) +
        0.213618 * Math.sin(toRad(2 * moonM)) -
        0.185116 * Math.sin(toRad(sunM)) -
        0.114332 * Math.sin(toRad(2 * moonF));
    moonLambda = normDeg(moonLambda);
    function calcPlanetGeo(a, e, meanL_0, rateL, meanM_0, rateM, c1, c2 = 0) {
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
    const ayanamsaVal = calculateAyanamsa(y, m, d);
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
    function formatCoord(degVal, isVedic = false) {
        const adjusted = isVedic ? normDeg(degVal - ayanamsaVal) : degVal;
        const signIdx = Math.floor(adjusted / 30) % 12;
        const s = signs[signIdx] || signs[0];
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
    const planets = rawBodies.map((b) => {
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
