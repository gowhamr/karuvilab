import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(pathToFileURL('./scripts/esm-loader.mjs').href, import.meta.url);
