const React = require('react');

const useSearch = (query) => {
    const items = React.useMemo(() => {
        return [
            {
                title: 'demo addon',
                items: [
                    {
                        id: '1',
                        type: 'movie',
                        name: 'Stremio demo item movie 1',
                        poster: '/images/intro_background.jpg',
                        logo: '/images/default_avatar.png',
                        posterShape: 'poster'
                    },
                    {
                        id: '2',
                        type: 'movie',
                        name: 'Stremio demo item movie 2',
                        poster: '/images/intro_background.jpg',
                        logo: '/images/default_avatar.png',
                        posterShape: 'poster'
                    },
                ]
            }
        ];
    }, [query]);
    return items;
};

module.exports = useSearch;
