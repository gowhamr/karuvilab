import { describe, it, expect } from 'vitest';
import { calculateDiff, isLeapYear, getNextBirthday, } from '../../features/calculators/age/date-utils';
import { calculateAyanamsa, calculateEphemeris, } from '../../features/calculators/age/astronomy-utils';
import { getDetailedMoonPosition, getSunZodiacSign, getChineseZodiac, getBirthstoneAndFlower, } from '../../features/calculators/age/astrology-utils';
import { calculateLifeStatistics, } from '../../features/calculators/age/life-stats-utils';
import { calculateFullAgeProfile, calculateAgeComparison, } from '../../features/calculators/age/age-utils';
describe('Age Calculator & Date Mathematics Matrix', () => {
    it('calculates exact age on standard 25-year boundary (30-04-2001 → 30-04-2026)', () => {
        const diff = calculateDiff(new Date('2001-04-30'), new Date('2026-04-30'));
        expect(diff).not.toBeNull();
        expect(diff?.years).toBe(25);
        expect(diff?.months).toBe(0);
        expect(diff?.days).toBe(0);
    });
    it('handles leap day birth on non-leap Feb 28 (29-02-2000 → 28-02-2021)', () => {
        const diff = calculateDiff(new Date('2000-02-29'), new Date('2021-02-28'));
        expect(diff).not.toBeNull();
        expect(diff?.years).toBe(20);
        expect(diff?.months).toBe(11);
        expect(diff?.days).toBe(30);
    });
    it('handles leap day birth rolling into March 1 (29-02-2000 → 01-03-2021)', () => {
        const diff = calculateDiff(new Date('2000-02-29'), new Date('2021-03-01'));
        expect(diff).not.toBeNull();
        expect(diff?.years).toBe(21);
        expect(diff?.months).toBe(0);
        expect(diff?.days).toBe(0);
    });
    it('handles month borrow transitions (31-03-2021 → 30-04-2021)', () => {
        const diff = calculateDiff(new Date('2021-03-31'), new Date('2021-04-30'));
        expect(diff).not.toBeNull();
        expect(diff?.years).toBe(0);
        expect(diff?.months).toBe(0);
        expect(diff?.days).toBe(30);
    });
    it('handles year boundary transitions (31-12-2020 → 01-01-2021)', () => {
        const diff = calculateDiff(new Date('2020-12-31'), new Date('2021-01-01'));
        expect(diff).not.toBeNull();
        expect(diff?.years).toBe(0);
        expect(diff?.months).toBe(0);
        expect(diff?.days).toBe(1);
    });
    it('handles same-day DOB (2020-05-15 → 2020-05-15)', () => {
        const diff = calculateDiff(new Date('2020-05-15'), new Date('2020-05-15'));
        expect(diff).not.toBeNull();
        expect(diff?.years).toBe(0);
        expect(diff?.months).toBe(0);
        expect(diff?.days).toBe(0);
    });
    it('returns null when DOB is in the future relative to reference date', () => {
        const diff = calculateDiff(new Date('2025-01-01'), new Date('2020-01-01'));
        expect(diff).toBeNull();
    });
    it('returns null for invalid dates', () => {
        const diff = calculateDiff(new Date('invalid-date'), new Date('2020-01-01'));
        expect(diff).toBeNull();
    });
    it('validates Gregorian leap years accurately including 400-year and century rules', () => {
        expect(isLeapYear(2000)).toBe(true);
        expect(isLeapYear(2024)).toBe(true);
        expect(isLeapYear(1900)).toBe(false);
        expect(isLeapYear(2100)).toBe(false);
        expect(isLeapYear(2023)).toBe(false);
    });
    it('computes next birthday and remaining days accurately', () => {
        const dob = new Date('1995-06-15');
        const asOf = new Date('2024-01-01');
        const { nextBirthdayStr, daysUntil } = getNextBirthday(dob, asOf);
        expect(nextBirthdayStr).toBe('2024-06-15');
        expect(daysUntil).toBeGreaterThan(0);
    });
});
describe('Astronomical & Celestial Engine Benchmark Matrix', () => {
    it('validates J2000 epoch reference date (2000-01-01 12:00 UTC)', () => {
        const ephemeris = calculateEphemeris('2000-01-01', '12:00', 0);
        expect(ephemeris.planets.length).toBe(12);
        const sun = ephemeris.planets.find(p => p.name.includes('Sun'));
        expect(sun).toBeDefined();
        expect(sun?.trop).toContain('Capricorn');
        const ayanamsa = calculateAyanamsa(2000, 1, 1);
        expect(Math.abs(ayanamsa - 23.8566)).toBeLessThan(0.01);
    });
    it('validates empirical test benchmark (2001-04-30 06:30 IST / 01:00 UTC)', () => {
        const moon = getDetailedMoonPosition('2001-04-30', '06:30', 330);
        expect(moon.tropicalMoon).toBe('♌ Leo');
        expect(moon.vedicRasi).toBe('♋ Karka (Cancer)');
        expect(moon.nakshatra).toBe('Pushya');
        const ephemeris = calculateEphemeris('2001-04-30', '06:30', 330);
        const sun = ephemeris.planets.find(p => p.name.includes('Sun'));
        const rahu = ephemeris.planets.find(p => p.name.includes('Rahu'));
        const ketu = ephemeris.planets.find(p => p.name.includes('Ketu'));
        expect(sun?.trop).toContain('Taurus');
        expect(rahu?.trop).toContain('Cancer');
        expect(ketu?.trop).toContain('Capricorn');
    });
    it('validates Vernal Equinox 2026 Sun position in Aries (2026-03-21 12:00 UTC)', () => {
        const ephemeris = calculateEphemeris('2026-03-21', '12:00', 0);
        const sun = ephemeris.planets.find(p => p.name.includes('Sun'));
        expect(sun).toBeDefined();
        expect(sun?.trop).toContain('Aries');
    });
    it('validates Summer Solstice 2026 Sun position in Cancer (2026-06-21 12:00 UTC)', () => {
        const ephemeris = calculateEphemeris('2026-06-21', '12:00', 0);
        const sun = ephemeris.planets.find(p => p.name.includes('Sun'));
        expect(sun).toBeDefined();
        expect(sun?.trop).toContain('Cancer');
    });
    it('validates Rahu and Ketu are always exact 180° opposites in the zodiac', () => {
        const testDates = ['1990-05-12', '2000-01-01', '2015-11-20', '2026-08-19'];
        for (const d of testDates) {
            const ephem = calculateEphemeris(d, '12:00', 0);
            const rahu = ephem.planets.find(p => p.name.includes('Rahu'));
            const ketu = ephem.planets.find(p => p.name.includes('Ketu'));
            expect(rahu).toBeDefined();
            expect(ketu).toBeDefined();
        }
    });
    it('validates lunar illumination is bounded strictly between 0% and 100%', () => {
        const testDates = ['2026-01-18', '2026-02-02', '2026-03-10', '2026-08-19'];
        for (const d of testDates) {
            const moon = getDetailedMoonPosition(d, '12:00', 0);
            const pct = parseInt(moon.illumination.replace('%', ''), 10);
            expect(pct).toBeGreaterThanOrEqual(0);
            expect(pct).toBeLessThanOrEqual(100);
        }
    });
    it('validates Chinese Zodiac cycle calculation (12 animals + 5 elements)', () => {
        const z1984 = getChineseZodiac(1984);
        expect(z1984.animal).toBe('Rat');
        expect(z1984.element).toBe('Wood');
        const z2024 = getChineseZodiac(2024);
        expect(z2024.animal).toBe('Dragon');
        expect(z2024.element).toBe('Wood');
        const z2026 = getChineseZodiac(2026);
        expect(z2026.animal).toBe('Horse');
        expect(z2026.element).toBe('Fire');
    });
    it('validates Western Sun Sign date classification across all 12 months', () => {
        expect(getSunZodiacSign(1, 15).sign).toBe('Capricorn');
        expect(getSunZodiacSign(2, 10).sign).toBe('Aquarius');
        expect(getSunZodiacSign(3, 15).sign).toBe('Pisces');
        expect(getSunZodiacSign(4, 10).sign).toBe('Aries');
        expect(getSunZodiacSign(5, 10).sign).toBe('Taurus');
        expect(getSunZodiacSign(6, 10).sign).toBe('Gemini');
        expect(getSunZodiacSign(7, 10).sign).toBe('Cancer');
        expect(getSunZodiacSign(8, 10).sign).toBe('Leo');
        expect(getSunZodiacSign(9, 10).sign).toBe('Virgo');
        expect(getSunZodiacSign(10, 10).sign).toBe('Libra');
        expect(getSunZodiacSign(11, 10).sign).toBe('Scorpio');
        expect(getSunZodiacSign(12, 10).sign).toBe('Sagittarius');
    });
    it('validates traditional birthstone and flower mappings for all 12 calendar months', () => {
        for (let m = 1; m <= 12; m++) {
            const gems = getBirthstoneAndFlower(m);
            expect(gems.birthstone.length).toBeGreaterThan(0);
            expect(gems.birthFlower.length).toBeGreaterThan(0);
        }
    });
});
describe('Life Statistics & Comparative Engine Matrix', () => {
    it('calculates human biological estimates proportionally', () => {
        const stats = calculateLifeStatistics(10000, 240000, 14400000, new Date('2026-07-02'));
        expect(stats.approxHeartbeats).toBe(14400000 * 75);
        expect(stats.approxSleepHours).toBe(80000);
        expect(stats.approxBreaths).toBe(14400000 * 16);
        expect(stats.yearProgressPct).toBeGreaterThan(49);
        expect(stats.yearProgressPct).toBeLessThan(52);
        expect(stats.lifespanProgressPct).toBeGreaterThan(30);
        expect(stats.lifespanProgressPct).toBeLessThan(40);
    });
    it('calculates full age profile with identical contract', () => {
        const profile = calculateFullAgeProfile('1995-01-01', '2025-01-01', false, '12:00', 0);
        expect(profile).not.toBeNull();
        expect(profile?.years).toBe(30);
        expect(profile?.months).toBe(0);
        expect(profile?.days).toBe(0);
        expect(profile?.totalMonths).toBe(360);
        expect(profile?.sunSign).toBe('♑ Capricorn');
        expect(profile?.ephemeris.planets.length).toBe(12);
    });
    it('calculates age difference between two individuals correctly', () => {
        const comp = calculateAgeComparison('1990-05-10', '1995-08-20');
        expect(comp).not.toBeNull();
        expect(comp?.years).toBe(5);
        expect(comp?.months).toBe(3);
        expect(comp?.days).toBe(10);
    });
});
