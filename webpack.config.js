// Copyright (C) 2017-2020 Smart code 203358507

const path = require('path');
const child_process = require('child_process');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pachageJson = require('./package.json');

const COMMIT_HASH = child_process.execSync('git rev-parse HEAD').toString().trim();

module.exports = (env, argv) => ({
    mode: argv.mode,
    entry: './src/index.js',
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
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                            modules: {
                                namedExport: false
                            }
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
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: '[name].[ext]',
                    outputPath: `${COMMIT_HASH}/fonts`,
                    publicPath: `/${COMMIT_HASH}/fonts`
                }
            },
            {
                test: /\.(png|jpe?g)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: '[name].[ext]',
                    outputPath: `${COMMIT_HASH}/images`,
                    publicPath: `/${COMMIT_HASH}/images`
                }
            },
            {
                test: /\.wasm$/,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: '[name].[ext]',
                    outputPath: `${COMMIT_HASH}/binaries`,
                    publicPath: `/${COMMIT_HASH}/binaries`
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.less', '.wasm'],
        alias: {
            'stremio': path.join(__dirname, 'src'),
            'stremio-router': path.join(__dirname, 'src', 'router')
        }
    },
    devServer: {
        host: '0.0.0.0',
        contentBase: false,
        hot: false,
        inline: false,
        https: true
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
        new webpack.EnvironmentPlugin({
            SENTRY_DSN: null,
            ...env,
            DEBUG: argv.mode !== 'production',
            VERSION: pachageJson.version,
            COMMIT_HASH
        }),
        new webpack.ProgressPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'favicons',
                    to: `${COMMIT_HASH}/favicons`
                }
            ]
        }),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            inject: false,
            faviconsPath: `${COMMIT_HASH}/favicons`
        }),
        new MiniCssExtractPlugin({
            filename: `${COMMIT_HASH}/styles/[name].css`
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['*']
        })
    ]
});
