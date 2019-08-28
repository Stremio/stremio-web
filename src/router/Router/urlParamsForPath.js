module.exports = (routeConfig, path) => {
    const matches = path.match(routeConfig.regexp);
    return routeConfig.urlParamsNames.reduce((urlParams, name, index) => {
        if (Array.isArray(matches) && typeof matches[index + 1] === 'string') {
            urlParams[name] = matches[index + 1];
        } else {
            urlParams[name] = null;
        }

        return urlParams;
    }, {});
};