#!/usr/bin/env node
// esbuild build script – compiles src/*.ts → js/*.js (types stripped, no bundling)

const esbuild = require('esbuild');
const path    = require('path');
const fs      = require('fs');

const isWatch = process.argv.includes('--watch');

/** Map of src/*.ts → js/*.js */
const entries = [
  'utils',
  'theme',
  'home',
  'shell',
  'format-utils',
  'image-tools',
  'pdf-tools',
  'security-tools',
  'validator',
  'qrcode-tool',
  'regex-worker',
  'app',
  'markdown-tool',
  'split-tool',
];

const entryPoints = entries.map(name => ({
  in:  path.join(__dirname, 'src', `${name}.ts`),
  out: path.join(__dirname, 'js', name),
}));

/** Shared esbuild options */
const sharedOptions = {
  bundle: false,        // No import resolution – files remain standalone global scripts
  platform: 'browser',
  target: 'es2020',
  format: 'esm',        // No IIFE wrapper; globals stay at top-level scope
  sourcemap: false,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  minifySyntax: false,
  logLevel: 'info',
};

async function build() {
  // esbuild won't create the output dir automatically in this mode
  const jsDir = path.join(__dirname, 'js');
  if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

  if (isWatch) {
    const ctx = await esbuild.context({
      ...sharedOptions,
      entryPoints,
      outdir: __dirname,   // `out` paths already contain 'js/', so outdir=root works
    });
    await ctx.watch();
    console.log('[esbuild] Watching for changes…');
  } else {
    await esbuild.build({
      ...sharedOptions,
      entryPoints,
      outdir: __dirname,
    });
    console.log('[esbuild] Build complete.');
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
