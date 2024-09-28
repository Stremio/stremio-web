// Copyright (C) 2017-2024 Smart code 203358507

// this detects ipad properly in safari
// while bowser does not
const iOS = () => {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};

const Bowser = require('bowser');

const browser = Bowser.parse(window.navigator?.userAgent || '');

// Edge case: iPad is included in this function
// Keep in mind maxTouchPoints for Vision Pro might change in the future
const isVisionProUser = () => {
    const isMacintosh = navigator.userAgent.includes('Macintosh');
    const hasFiveTouchPoints = navigator.maxTouchPoints === 5;
    return isMacintosh && hasFiveTouchPoints;
};

const name = isVisionProUser() ? 'visionos' : (iOS() ? 'ios' : (browser?.os?.name || 'unknown').toLowerCase());

module.exports = {
    name,
    isMobile: () => {
        return name === 'ios' || name === 'android';
    }
};
