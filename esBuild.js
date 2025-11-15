const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: 'dist/mi-libreria.bundle.js',
    format: 'esm',
    target: ['es2020']
  })
  .catch(() => process.exit(1));
