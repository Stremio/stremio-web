const UrlUtils = require('url');
const { routesRegexp } = require('stremio/common');

const sanitizedUrl = () => {
    const { href, pathname, search } = UrlUtils.parse(window.location.hash.slice(1));
    if (typeof pathname === 'string') {
        const matches = pathname.match(routesRegexp.player.regexp);
        if (matches) {
            if (typeof matches[2] === 'string') {
                return `/player/***/***/${matches[3]}/${matches[4]}/${matches[5]}/${matches[6]}${typeof search === 'string' ? search : ''}`;
            } else {
                return `/player/***${typeof search === 'string' ? search : ''}`;
            }
        }
    }

    return href;
};

module.exports = sanitizedUrl;
