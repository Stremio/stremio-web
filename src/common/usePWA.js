// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const usePWA = () => {
    const [isPWA, setIsPWA] = React.useState(false);

    React.useEffect(() => {
        const isIOSPWA = window.navigator.standalone;
        const isAndroidPWA = window.matchMedia('(display-mode: standalone)').matches;
        if (isIOSPWA || isAndroidPWA) {
            setIsPWA(true);
        }
    }, []);
    return isPWA;
};

module.exports = usePWA;
