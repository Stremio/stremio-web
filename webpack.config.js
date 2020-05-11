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

module.exports = (env, argv) => ({
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build')
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
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: {
                                localIdentName: '[local]-[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss-id',
                            plugins: () => [
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
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            noIeCompat: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.less', '.wasm'],
        alias: {
            'stremio': path.resolve(__dirname, 'src'),
            'stremio-router': path.resolve(__dirname, 'src/router')
        }
    },
    devServer: {
        host: '0.0.0.0',
        hot: false,
        inline: false
    },
    optimization: {
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
            DEBUG: argv.mode !== 'production',
            VERSION: pachageJson.version,
            COMMIT_HASH: child_process.execSync('git rev-parse HEAD').toString(),
            ...env
        }),
        new webpack.ProgressPlugin(),
        new CopyWebpackPlugin([
            { from: 'node_modules/@stremio/stremio-core-web/static', to: '' },
            { from: 'images', to: 'images' },
            { from: 'fonts', to: 'fonts' }
        ]),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            inject: false
        }),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['*'],
            cleanAfterEveryBuildPatterns: ['./main.js', './main.css']
        })
    ]
});
