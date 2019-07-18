const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
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
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]',
                            importLoaders: 2
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
                                                flexbox: true,
                                                grid: 'autoplace'
                                            },
                                            calc: false,
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
                            noIeCompat: true,
                            paths: [
                                path.resolve(__dirname, 'node_modules')
                            ]
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.less', '.wasm'],
        alias: {
            'stremio-common': path.resolve(__dirname, 'src/common'),
            'stremio-routes': path.resolve(__dirname, 'src/routes'),
            'stremio-services': path.resolve(__dirname, 'src/services'),
            'stremio-navigation': path.resolve(__dirname, 'src/navigation')
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
                terserOptions: {
                    ecma: 5,
                    mangle: true,
                    warnings: true,
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
        new CopyWebpackPlugin([
            { from: 'node_modules/stremio-state-container-web/static', to: '' },
            { from: 'images', to: 'images' },
            { from: 'fonts', to: 'fonts' }
        ]),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            inject: false
        })
    ]
};
