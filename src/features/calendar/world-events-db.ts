export type EventCategory =
  | 'global-holiday'      // Christmas, New Year, Eid, Diwali
  | 'un-observance'       // UN designated days
  | 'environmental'       // World Environment Day, Earth Day
  | 'health'              // World Health Day, Cancer Day
  | 'cultural'            // Holi, Carnival, Lunar New Year
  | 'historical'          // Independence days, historical milestones
  | 'awareness'           // Mental Health, Women's Day
  | 'science-tech'        // World Space Week, Pi Day
  | 'indian-national'     // Republic Day, Gandhi Jayanti
  | 'indian-festival'     // Diwali, Holi, Pongal, Navratri
  | 'sporting'            // Olympics, World Cup
  | 'professional';       // World Teachers Day, Doctors Day

export type EventImportance = 'major' | 'moderate' | 'minor';

export interface WorldEvent {
  id: string;
  name: string;
  shortName: string;           // for calendar cell badge
  date: {
    month: number;             // 1-12
    day: number;               // fixed date
  };
  rule?: FloatingDateRule;
  category: EventCategory;
  importance: EventImportance;
  emoji: string;               // visual identifier
  colors: {
    bg: string;                // Tailwind bg class
    text: string;              // Tailwind text class
    border: string;            // Tailwind border class
  };
  description: {
    short: string;             // 1 sentence — shown in cell tooltip
    full: string;              // 3-5 sentences — shown in event panel
    history: string;           // origin and history paragraph
    whyCelebrate: string;      // significance and purpose paragraph
    howToObserve: string;      // how people celebrate/observe
    funFact: string;           // interesting fact
  };
  globalReach: 'worldwide' | 'regional' | 'india-specific';
  tags: string[];
  links?: {
    label: string;
    url: string;
  }[];
}

export type FloatingDateRule =
  | { type: 'nth-weekday'; month: number; weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; n: number }
  | { type: 'lunar-lookup'; id: 'holi' | 'diwali' };

export const HOLI_LUNAR_LOOKUP: Record<number, { month: number; day: number }> = {
  2020: { month: 3, day: 9 },
  2021: { month: 3, day: 29 },
  2022: { month: 3, day: 18 },
  2023: { month: 3, day: 8 },
  2024: { month: 3, day: 25 },
  2025: { month: 3, day: 14 },
  2026: { month: 3, day: 4 },
  2027: { month: 3, day: 22 },
  2028: { month: 3, day: 11 },
  2029: { month: 3, day: 1 },
  2030: { month: 3, day: 20 },
  2031: { month: 3, day: 9 },
  2032: { month: 3, day: 27 },
  2033: { month: 3, day: 15 },
  2034: { month: 3, day: 5 },
  2035: { month: 3, day: 25 },
};

export const DIWALI_LUNAR_LOOKUP: Record<number, { month: number; day: number }> = {
  2020: { month: 11, day: 14 },
  2021: { month: 11, day: 4 },
  2022: { month: 10, day: 24 },
  2023: { month: 11, day: 12 },
  2024: { month: 10, day: 31 },
  2025: { month: 10, day: 20 },
  2026: { month: 11, day: 8 },
  2027: { month: 10, day: 29 },
  2028: { month: 10, day: 17 },
  2029: { month: 11, day: 5 },
  2030: { month: 10, day: 26 },
  2031: { month: 11, day: 14 },
  2032: { month: 11, day: 2 },
  2033: { month: 10, day: 22 },
  2034: { month: 11, day: 10 },
  2035: { month: 10, day: 31 },
};


import allEventsData from "./world-events-data.json";

export const ALL_WORLD_EVENTS: WorldEvent[] = allEventsData as WorldEvent[];
