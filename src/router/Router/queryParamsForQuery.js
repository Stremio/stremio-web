module.exports = (query) => {
    return Array.from(new URLSearchParams(query).entries())
        .reduce((result, [key, value]) => {
            result[key] = value;
            return result;
        }, {});
};