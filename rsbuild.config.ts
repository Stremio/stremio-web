import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from '@rsbuild/core';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';
import { type LessLoaderOptions, pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import { GenerateSW } from '@aaroon/workbox-rspack-plugin';
import { ProvidePlugin } from '@rspack/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMMIT_HASH = execSync('git rev-parse HEAD').toString().trim();
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')) as {
  version: string;
};

export default defineConfig(({ command }) => ({
  dev: {
    hmr: false,
    liveReload: false,
  },
  server: {
    host: '0.0.0.0',
    publicDir: false,
  },
  html: {
    template: './src/index.html',
    mountId: 'app',
    inject: false,
    scriptLoading: 'blocking',
    templateParameters: {
      faviconsPath: 'favicons',
    },
  },
  source: {
    entry: {
      main: './src/index.js',
      worker: {
        import: './node_modules/@stremio/stremio-core-web/worker.js',
        html: false,
      },
    },
    define: {
      'process.env.VERSION': JSON.stringify(packageJson.version),
      'process.env.COMMIT_HASH': JSON.stringify(COMMIT_HASH),
      'process.env.SENTRY_DSN':
        process.env.SENTRY_DSN !== undefined
          ? JSON.stringify(process.env.SENTRY_DSN)
          : 'null',
      'process.env.SERVICE_WORKER_DISABLED': JSON.stringify(
        process.env.SERVICE_WORKER_DISABLED ?? 'false',
      ),
      'process.env.DEBUG': JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
  },
  output: {
    // Match webpack: `output.filename` was `${COMMIT_HASH}/scripts/[name].js` with no `static/js/` prefix.
    distPath: {
      js: `${COMMIT_HASH}/scripts`,
      jsAsync: `${COMMIT_HASH}/scripts`,
    },
    filename: {
      js: '[name].js',
    },
    copy: [
      { from: 'assets/favicons', to: 'favicons' },
      { from: 'assets/images', to: 'images' },
      { from: 'assets/screenshots/*.webp', to: 'screenshots/[name][ext]' },
      { from: '.well-known', to: '.well-known' },
      { from: 'manifest.json', to: 'manifest.json' },
    ],
    cssModules: {
      // Webpack applied css-loader `modules` to every app `.less` file (not only `*.module.less`).
      auto: (resourcePath: string) =>
        /\.less$/i.test(resourcePath) && !resourcePath.includes(`${path.sep}node_modules${path.sep}`),
      localIdentName: '[local]-[hash:base64:5]',
      namedExport: false,
    },
  },
  plugins: [
    pluginReact(),
    pluginBasicSsl(),
    pluginLess({
      exclude: /node_modules/,
      lessLoaderOptions: {
        lessOptions: {
          strictMath: true,
        },
      } as LessLoaderOptions,
    }),
  ],
  tools: {
    rspack(_config, { addRules, appendPlugins }) {
      addRules([
        {
          test: /\.(ttf|woff2)$/i,
          exclude: /node_modules/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext][query]',
          },
        },
        {
          test: /\.(png|jpe?g|svg)$/i,
          exclude: /node_modules/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext][query]',
          },
        },
        {
          test: /\.wasm$/i,
          type: 'asset/resource',
          generator: {
            filename: `${COMMIT_HASH}/binaries/[name][ext][query]`,
          },
        },
      ]);
      appendPlugins([
        new ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        ...(command === 'build'
          ? [
              new GenerateSW({
                maximumFileSizeToCacheInBytes: 20_000_000,
                clientsClaim: true,
                skipWaiting: true,
              }),
            ]
          : []),
      ]);
    },
    postcss: {
      postcssOptions: {
        plugins: [
          require('cssnano')({
            preset: [
              'advanced',
              {
                autoprefixer: {
                  add: true,
                  remove: true,
                  flexbox: false,
                  grid: false,
                },
                cssDeclarationSorter: true,
                calc: false,
                colormin: false,
                convertValues: false,
                discardComments: {
                  removeAll: true,
                },
                discardOverridden: false,
                discardUnused: false,
                mergeIdents: false,
                normalizeDisplayValues: false,
                normalizePositions: false,
                normalizeRepeatStyle: false,
                normalizeUnicode: false,
                normalizeUrl: false,
                reduceIdents: false,
                reduceInitial: false,
                zindex: false,
              },
            ],
          }),
        ],
      },
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.less', '.wasm'],
    alias: {
      stremio: path.resolve(__dirname, 'src'),
      'stremio-router': path.resolve(__dirname, 'src', 'router'),
      '/assets': path.resolve(__dirname, 'assets'),
    },
  },
}));
