const appConfig = require('../webpack.config.js');

module.exports = async ({ config: storybookConfig, mode }) => {
    storybookConfig.module = {
        ...storybookConfig.module
    };
    storybookConfig.module.rules = appConfig.module.rules;
    storybookConfig.resolve = {
        ...storybookConfig.resolve
    };
    storybookConfig.resolve.extensions = [
        ...storybookConfig.resolve.extensions,
        ...appConfig.resolve.extensions
    ];
    storybookConfig.resolve.alias = {
        ...storybookConfig.resolve.alias,
        ...appConfig.resolve.alias
    };

    return storybookConfig;
};
