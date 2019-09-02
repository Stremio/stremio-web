module.exports = (viewsConfig, path) => {
    if (typeof path === 'string') {
        for (const viewConfig of viewsConfig) {
            for (const routeConfig of viewConfig) {
                if (path.match(routeConfig.regexp)) {
                    return routeConfig;
                }
            }
        }
    }
};