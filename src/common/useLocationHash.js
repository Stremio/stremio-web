const React = require('react');

const useLocationHash = () => {
    const [locationHash, setLocationHash] = React.useState(window.location.hash);
    React.useEffect(() => {
        const onLocationHashChange = () => {
            setLocationHash(window.location.hash);
        };
        window.addEventListener('hashchange', onLocationHashChange);
        return () => {
            window.removeEventListener('hashchange', onLocationHashChange);
        };
    }, []);
    return locationHash;
};

module.exports = useLocationHash;
