// Copyright (C) 2017-2022 Smart code 203358507

const Bowser = require('bowser');

const browser = Bowser.parse(window.navigator?.userAgent || '');

const name = (browser?.os?.name || 'unknown').toLowerCase();

module.exports = {
    name,
    isMobile: () => {
        return name === 'ios' || name === 'android';
    }
};
