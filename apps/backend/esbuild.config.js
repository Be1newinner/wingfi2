// esbuild.config.js
import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : [];

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/index.js',
  sourcemap: true,
  external: dependencies,
}).catch(() => process.exit(1));
