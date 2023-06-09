// Copyright (C) 2017-2023 Smart code 203358507

const routeConfigForPath = (viewsConfig, path) => {
    for (const viewConfig of viewsConfig) {
        for (const routeConfig of viewConfig) {
            if (path.match(routeConfig.regexp)) {
                return routeConfig;
            }
        }
    }

    return null;
};

module.exports = routeConfigForPath;
