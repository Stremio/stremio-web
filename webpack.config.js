const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/stremio-icons/dom')
                ],
                use: {
                    loader: 'babel-loader'
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
                            localIdentName: '[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            noIeCompat: true,
                            compress: true,
                            paths: [
                                path.resolve(__dirname, 'node_modules/stremio-colors')
                            ]
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.less'],
        alias: {
            'stremio-common': path.resolve(__dirname, 'src/common')
        }
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html'
        }),
        new UglifyJsPlugin({
            test: /\.js$/,
            uglifyOptions: {
                mangle: true,
                output: {
                    ecma: 5,
                    comments: false,
                    beautify: false,
                    wrap_iife: true
                }
            }
        }),
        new CopyWebpackPlugin([
            { from: 'images' }
        ])
    ]
};