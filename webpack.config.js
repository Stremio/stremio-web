const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
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
                            noIeCompat: true
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
        })
    ]
};