const React = require('react');

const useLocationHash = () => {
    const [locationHash, setLocationHash] = React.useState(window.location.hash);
    React.useEffect(() => {
        const onLocationHashChanged = () => {
            setLocationHash(window.location.hash);
        };
        window.addEventListener('hashchange', onLocationHashChanged);
        return () => {
            window.removeEventListener('hashchange', onLocationHashChanged);
        };
    }, []);
    return locationHash;
};

module.exports = useLocationHash;
