const fs = require('fs');
const path = 'components/ui/BatchQueue.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add shrink-0 to actions div
content = content.replace(
  'className="flex items-center justify-end gap-1 mt-1 sm:mt-0 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 border-t sm:border-none border-border pt-2 sm:pt-0"',
  'className="flex items-center justify-end gap-1 mt-1 sm:mt-0 w-full sm:w-auto shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 border-t sm:border-none border-border pt-2 sm:pt-0"'
);

// Ensure the main container does not overflow by adding overflow-hidden
content = content.replace(
  'className={cn(\n        "group bg-surface-2 border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all relative",',
  'className={cn(\n        "group bg-surface-2 border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all relative overflow-hidden",'
);

fs.writeFileSync(path, content);
console.log("Patched BatchQueueItemComponent");
