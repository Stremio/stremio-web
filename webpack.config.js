const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread']
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
                                require('autoprefixer')()
                            ]
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            noIeCompat: true,
                            compress: true,
                            paths: [
                                path.resolve(__dirname, 'node_modules/stremio-colors'),
                                path.resolve(__dirname, 'src/common')
                            ]
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.less'],
        alias: {
            'stremio-common': path.resolve(__dirname, 'src/common'),
            'stremio-routes': path.resolve(__dirname, 'src/routes'),
            'stremio-services': path.resolve(__dirname, 'src/services')
        }
    },
    devServer: {
        host: '0.0.0.0'
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
        new HtmlWebPackPlugin({
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([
            { from: 'images', to: 'images' },
            { from: 'fonts', to: 'fonts' }
        ])
    ]
};
