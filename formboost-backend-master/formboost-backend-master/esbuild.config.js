import { build } from 'esbuild';

const buildOptions = {
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/index.js',
  external: ['./node_modules/*'],
  logLevel: 'silent',
};

build(buildOptions)
  .then((result) => {
    if (result.warnings && result.warnings.length > 0) {
      console.error('❌ Build failed due to warnings:');
      for (const warning of result.warnings) {
        console.warn(warning.text);
      }
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Build error:', error.message);
    process.exit(1);
  });
