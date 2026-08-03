const DOMPurifyModule = require('dompurify');
const instance = DOMPurifyModule.default || DOMPurifyModule;
try {
  console.log("Creating instance...");
  const purify = typeof instance === 'function' ? instance(globalThis) : instance;
  console.log("Success", typeof purify.sanitize);
  if (typeof purify.sanitize === 'function') {
    console.log(purify.sanitize('<img src=x onerror=alert(1)>'));
  }
} catch (e) {
  console.log("Error:", e.message);
}
