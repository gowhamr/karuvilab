import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'vitest') {
    const shimPath = path.resolve('./scripts/vitest-shim.mjs');
    return { url: pathToFileURL(shimPath).href, shortCircuit: true };
  }

  let target = specifier;
  
  if (target.startsWith('@/')) {
    target = path.resolve('./.test-dist', target.slice(2));
  } else if (target.startsWith('.')) {
    if (context.parentURL) {
      const parentPath = new URL(context.parentURL).pathname;
      const parentDir = path.dirname(parentPath);
      target = path.resolve(parentDir, target);
    }
  }

  if (target.startsWith('/')) {
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      return { url: pathToFileURL(target).href, shortCircuit: true };
    }
    if (fs.existsSync(target + '.js')) {
      return { url: pathToFileURL(target + '.js').href, shortCircuit: true };
    }
    if (fs.existsSync(path.join(target, 'index.js'))) {
      return { url: pathToFileURL(path.join(target, 'index.js')).href, shortCircuit: true };
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    const filePath = new URL(url).pathname;
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${content};`
    };
  }
  return nextLoad(url, context);
}
