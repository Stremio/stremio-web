// Copyright (C) 2017-2022 Smart code 203358507

const Bowser = require('bowser');

const browser = Bowser.parse(window.navigator?.userAgent || '');

module.exports = () => {
    if (browser?.os?.name === 'iOS') return 'ios';
    if (browser?.os?.name === 'Android') return 'android';
    return false;
};
