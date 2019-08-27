module.exports = (viewsConfig, path) => {
    for (const viewConfig of viewsConfig) {
        for (const routeConfig of viewConfig) {
            if (path.match(routeConfig.regexp)) {
                return routeConfig;
            }
        }
    }
};