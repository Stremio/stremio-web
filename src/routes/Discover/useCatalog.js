const React = require('react');

const useCatalog = () => {
    return React.useMemo(() => {
        return Array(303).fill(null).map((_, index) => ({
            id: `tt${index}`,
            type: 'movie',
            name: 'Stremio demo item',
            poster: `https://dummyimage.com/300x400/000/0011ff.jpg&text=${index + 1}`,
            posterShape: 'poster'
        }));
    }, []);
};

module.exports = useCatalog;
