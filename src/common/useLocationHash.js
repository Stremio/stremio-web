const React = require('react');

const useLocationHash = () => {
    const [locationHash, setLocationHash] = React.useState(window.location.hash);
    const onLocationHashChanged = React.useCallback(() => {
        setLocationHash(window.location.hash);
    }, []);
    useEffect(() => {
        window.addEventListener('hashchange', onLocationHashChanged);
        return () => {
            window.removeEventListener('hashchange', onLocationHashChanged);
        };
    }, []);
    return locationHash;
};

module.exports = useLocationHash;
