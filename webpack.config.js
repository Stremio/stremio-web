// Copyright (C) 2017-2023 Smart code 203358507

const path = require('path');
const { execSync } = require('child_process');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const pachageJson = require('./package.json');

const COMMIT_HASH = execSync('git rev-parse HEAD').toString().trim();

module.exports = (env, argv) => ({
    mode: argv.mode,
    devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
    entry: {
        main: './src/index.js',
        worker: './node_modules/@stremio/stremio-core-web/worker.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: `${COMMIT_HASH}/scripts/[name].js`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-object-rest-spread'
                        ]
                    }
                }
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            importLoaders: 2,
                            modules: {
                                namedExport: false,
                                localIdentName: '[local]-[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
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
                                                    grid: false
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
                                                zindex: false
                                            }
                                        ]
                                    })
                                ]
                            }
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                strictMath: true,
                                ieCompat: false
                            }
                        }
                    }
                ]
            },
            {
                test: /\.ttf$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: `${COMMIT_HASH}/fonts/[name][ext][query]`
                }
            },
            {
                test: /\.(png|jpe?g|svg)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: `${COMMIT_HASH}/images/[name][ext][query]`
                }
            },
            {
                test: /\.wasm$/,
                type: 'asset/resource',
                generator: {
                    filename: `${COMMIT_HASH}/binaries/[name][ext][query]`
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.less', '.wasm'],
        alias: {
            'stremio': path.resolve(__dirname, 'src'),
            'stremio-router': path.resolve(__dirname, 'src', 'router')
        }
    },
    devServer: {
        host: '0.0.0.0',
        static: false,
        hot: false,
        server: 'https',
        liveReload: false
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js$/,
                extractComments: false,
                terserOptions: {
                    ecma: 5,
                    mangle: true,
                    warnings: false,
                    output: {
                        comments: false,
                        beautify: false,
                        wrap_iife: true
                    }
                }
            })
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.EnvironmentPlugin({
            SENTRY_DSN: null,
            ...env,
            DEBUG: argv.mode !== 'production',
            VERSION: pachageJson.version,
            COMMIT_HASH
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['*']
        }),
        argv.mode === 'production' && 
            new WorkboxPlugin.GenerateSW({
                maximumFileSizeToCacheInBytes: 20000000,
                clientsClaim: true,
                skipWaiting: true
            }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'favicons', to: `${COMMIT_HASH}/favicons` },
                { from: 'images', to: `${COMMIT_HASH}/images` },
                { from: 'screenshots/*.webp', to: `${COMMIT_HASH}` },
            ]
        }),
        new MiniCssExtractPlugin({
            filename: `${COMMIT_HASH}/styles/[name].css`
        }),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            inject: false,
            scriptLoading: 'blocking',
            faviconsPath: `${COMMIT_HASH}/favicons`,
            imagesPath: `${COMMIT_HASH}/images`,
        }),
        new WebpackPwaManifest({
            name: 'Stremio Web',
            short_name: 'Stremio',
            description: 'Freedom To Stream',
            background_color: '#161523',
            theme_color: '#2a2843',
            orientation: 'any',
            display: 'standalone',
            display_override: ['standalone'],
            scope: './',
            start_url: './',
            publicPath: './',
            icons: [
                {
                    src: 'images/icon.png',
                    destination: `${COMMIT_HASH}/images`,
                    sizes: [196, 512],
                    purpose: 'any',
                    ios: true,
                },
                {
                    src: 'images/maskable_icon.png',
                    destination: `${COMMIT_HASH}/images`,
                    sizes: [196, 512],
                    purpose: 'maskable',
                },
                {
                    src: 'favicons/favicon.ico',
                    destination: `${COMMIT_HASH}/favicons`,
                    sizes: [256],
                }
            ],
            screenshots : [
                {
                    src: `${COMMIT_HASH}/screenshots/board_wide.webp`,
                    sizes: '1440x900',
                    type: 'image/webp',
                    form_factor: 'wide',
                    label: 'Homescreen of Stremio'
                },
                {
                    src: `${COMMIT_HASH}/screenshots/board_narrow.webp`,
                    sizes: '414x896',
                    type: 'image/webp',
                    form_factor: 'narrow',
                    label: 'Homescreen of Stremio'
                }
            ],
            fingerprints: false,
            ios: true
        }),
    ].filter(Boolean)
});
