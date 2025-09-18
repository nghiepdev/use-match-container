import type {BunPlugin} from 'bun';
import {transformSync} from '@babel/core';

const es5Plugin: BunPlugin = {
  name: 'es5 loader',
  setup(build) {
    build.onLoad({filter: /node_modules\/match-container/}, async (args) => {
      const contents = await Bun.file(args.path).text();
      const babelResult = transformSync(contents, {
        presets: ['@babel/preset-env'],
      });
      return {
        contents: babelResult?.code || contents,
      };
    });
  },
};

Bun.build({
  entrypoints: ['./use-match-container.tsx'],
  outdir: './build',
  external: ['react'],
  banner: '"use client";',
  plugins: [es5Plugin],
});
