// Copyright (C) 2017-2022 Smart code 203358507

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

function android() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('android') > -1;
}

module.exports = () => {
    if (iOS()) return 'ios';
    if (android()) return 'android';
    return false;
};
