// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const isDisplayModeInstalled = () => (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches
);

const usePWA = () => {
    const isPWA = React.useMemo(() => {
        const isIOSPWA = Boolean(
            window.navigator.standalone === true ||
            isDisplayModeInstalled()
        );
        const isAndroidPWA = window.matchMedia('(display-mode: standalone)').matches;
        return [isIOSPWA, isAndroidPWA];
    }, []);
    return isPWA;
};

module.exports = usePWA;
module.exports.isDisplayModeInstalled = isDisplayModeInstalled;
