// Copyright (C) 2017-2023 Smart code 203358507

// this detects ipad properly in safari
// while bowser does not
function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}

const Bowser = require('bowser');

const browser = Bowser.parse(window.navigator?.userAgent || '');

const name = iOS() ? 'ios' : (browser?.os?.name || 'unknown').toLowerCase();

module.exports = {
    name,
    isMobile: () => {
        return name === 'ios' || name === 'android';
    }
};
