const fs = require('fs');

const file = 'src/features/calendar/world-events-db.ts';
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

const index = lines.findIndex(line => line.startsWith('export const ALL_WORLD_EVENTS'));

if (index !== -1) {
  const newContent = lines.slice(0, index).join('\n') + '\n\nimport allEventsData from "./world-events-data.json";\n\nexport const ALL_WORLD_EVENTS: WorldEvent[] = allEventsData as WorldEvent[];\n';
  fs.writeFileSync(file, newContent);
  console.log('Successfully refactored world-events-db.ts');
} else {
  console.log('Could not find ALL_WORLD_EVENTS');
}
