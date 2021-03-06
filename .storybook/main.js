// Copyright (C) 2017-2020 Smart code 203358507

const appConfig = require('../webpack.config.js')({}, { mode: 'development' });
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    webpackFinal: async (storybookConfig) => {
        storybookConfig.module = {
            ...storybookConfig.module,
            rules: [
                ...storybookConfig.module.rules,
                ...appConfig.module.rules
            ]
        };
        storybookConfig.resolve = {
            ...storybookConfig.resolve,
            extensions: [
                ...storybookConfig.resolve.extensions,
                ...appConfig.resolve.extensions
            ],
            alias: {
                ...storybookConfig.resolve.alias,
                ...appConfig.resolve.alias
            }
        };
        storybookConfig.plugins = [
            ...storybookConfig.plugins,
            new MiniCssExtractPlugin()
        ];

        return storybookConfig;
    },
    core: {
        builder: 'webpack5',
    },
    stories: ['../src/stories/**/*.@(js)'],
};
