const DOMPurify = require('isomorphic-dompurify');
console.log('sanitize start');
const clean = DOMPurify.sanitize('<img src="x" onerror="alert(1)">');
console.log('sanitize end', clean);
