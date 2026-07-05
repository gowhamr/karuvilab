import fs from 'fs';
import { ALL_WORLD_EVENTS } from '../src/features/calendar/world-events-db';

fs.writeFileSync('src/features/calendar/world-events-data.json', JSON.stringify(ALL_WORLD_EVENTS, null, 2));
console.log("Successfully extracted events to JSON.");
