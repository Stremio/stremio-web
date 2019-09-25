const appConfig = require('../webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({ config: storybookConfig }) => {
    storybookConfig.module = {
        ...storybookConfig.module,
        rules: appConfig.module.rules
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
};
