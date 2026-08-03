import { sanitizeHtml } from '../src/lib/security.js';
console.log("Start");
console.log(sanitizeHtml('<img src="x" onerror="alert(1)">'));
console.log("End");
