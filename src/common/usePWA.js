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
