// Copyright (C) 2017-2023 Smart code 203358507

const urlParamsForPath = (routeConfig, path) => {
    const matches = path.match(routeConfig.regexp);
    return routeConfig.urlParamsNames.reduce((urlParams, name, index) => {
        if (Array.isArray(matches) && typeof matches[index + 1] === 'string') {
            urlParams[name] = decodeURIComponent(matches[index + 1]);
        } else {
            urlParams[name] = null;
        }

        return urlParams;
    }, { path });
};

module.exports = urlParamsForPath;
