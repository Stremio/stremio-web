module.exports = (routeConfig, path) => {
    const matches = path.match(routeConfig.regexp);
    return routeConfig.keys.reduce((urlParams, key, index) => {
        if (Array.isArray(matches) && typeof matches[index + 1] === 'string') {
            urlParams[key.name] = matches[index + 1];
        } else {
            urlParams[key.name] = null;
        }

        return urlParams;
    }, {});
};