// Copyright (C) 2017-2020 Smart code 203358507

const urlParamsForPath = (routeConfig, path) => {
    const matches = path.match(routeConfig.regexp);

    if (matches[1] === 'movie' && typeof matches[3] != 'string') {
        matches[3] = matches[2]
    }

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
