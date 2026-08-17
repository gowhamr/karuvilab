export const COMMON_CITIES = [
    { city: "Mumbai", country: "India", tz: "Asia/Kolkata" },
    { city: "New York", country: "USA", tz: "America/New_York" },
    { city: "London", country: "UK", tz: "Europe/London" },
    { city: "Dubai", country: "UAE", tz: "Asia/Dubai" },
    { city: "Singapore", country: "Singapore", tz: "Asia/Singapore" },
    { city: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
    { city: "Sydney", country: "Australia", tz: "Australia/Sydney" },
    { city: "Los Angeles", country: "USA", tz: "America/Los_Angeles" },
    { city: "San Francisco", country: "USA", tz: "America/Los_Angeles" },
    { city: "Chicago", country: "USA", tz: "America/Chicago" },
    { city: "Toronto", country: "Canada", tz: "America/Toronto" },
    { city: "Paris", country: "France", tz: "Europe/Paris" },
    { city: "Berlin", country: "Germany", tz: "Europe/Berlin" },
    { city: "Hong Kong", country: "China", tz: "Asia/Hong_Kong" },
    { city: "Seoul", country: "South Korea", tz: "Asia/Seoul" },
    { city: "Bangkok", country: "Thailand", tz: "Asia/Bangkok" },
    { city: "Jakarta", country: "Indonesia", tz: "Asia/Jakarta" },
    { city: "Moscow", country: "Russia", tz: "Europe/Moscow" },
    { city: "Sao Paulo", country: "Brazil", tz: "America/Sao_Paulo" },
    { city: "Mexico City", country: "Mexico", tz: "America/Mexico_City" },
    { city: "Cairo", country: "Egypt", tz: "Africa/Cairo" },
    { city: "Johannesburg", country: "South Africa", tz: "Africa/Johannesburg" },
    { city: "Istanbul", country: "Turkey", tz: "Europe/Istanbul" },
    { city: "Riyadh", country: "Saudi Arabia", tz: "Asia/Riyadh" },
];
export function getAllTimezones() {
    if (typeof Intl === 'undefined' || !Intl.supportedValuesOf) {
        return COMMON_CITIES;
    }
    const commonMap = new Map(COMMON_CITIES.map(c => [c.tz, c]));
    const zones = Intl.supportedValuesOf('timeZone');
    return zones.map(tz => {
        if (commonMap.has(tz)) {
            return commonMap.get(tz);
        }
        const parts = tz.split('/');
        const city = (parts[parts.length - 1] || '').replace(/_/g, ' ');
        const country = parts.length > 1 ? (parts[0] || '').replace(/_/g, ' ') : '';
        return { city, country, tz };
    });
}
