// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const usePWA = () => {
    const isPWA = React.useMemo(() => {
        const isIOSPWA = window.navigator.standalone;
        const isAndroidPWA = window.matchMedia('(display-mode: standalone)').matches;
        return [isIOSPWA, isAndroidPWA];
    }, []);
    return isPWA;
};

module.exports = usePWA;
