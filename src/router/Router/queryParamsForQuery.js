module.exports = (query) => {
    const searchParams = new URLSearchParams(typeof query === 'string' ? query : '');
    return Array.from(searchParams.entries())
        .reduce((result, [key, value]) => {
            result[key] = value;
            return result;
        }, {});
};