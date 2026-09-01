const {copyWorkboxLibraries} = require('workbox-build');
copyWorkboxLibraries('public/lib/workbox').then(dir => console.log('Copied to', dir));
