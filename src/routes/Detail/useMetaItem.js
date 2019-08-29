const React = require('react');

const useMetaItem = (type = '', id = '', videoId = '') => {
    const [metaItem] = React.useState(() => ({
        id,
        type,
        name: 'Underworld',
        logo: 'https://images.metahub.space/logo/medium/tt0320691/img',
        background: 'https://images.metahub.space/background/medium/tt0320691/img',
        duration: '121 min',
        releaseInfo: '2003',
        released: '2003-09-19T00:00:00.000Z',
        description: 'Selene, a vampire warrior, is entrenched in a conflict between vampires and werewolves, while falling in love with Michael, a human who is sought by werewolves for unknown reasons.',
        genres: ['Action', 'Fantasy', 'Thriller'],
        writers: ['Kevin Grevioux', 'Len Wiseman', 'Danny McBride', 'Danny McBride'],
        directors: ['Len Wiseman'],
        cast: ['Kate Beckinsale', 'Scott Speedman', 'Michael Sheen', 'Shane Brolly'],
        imdbRating: '7.0',
        links: {
            trailer: 'mn4O3iQ8B_s',
            imdb: 'tt0320691',
            share: 'movie/underworld-0320691'
        },
        videos: [
            {
                id: '1',
                name: 'How to create a Stremio add-on with Node.js',
                description: 'This is a step-by-step tutorial on how to create your own add-on using Node.js.',
                released: 'Mon Jul 01 2019 00:00:00 GMT+0300 (Eastern European Summer Time)',
                poster: 'https://theme.zdassets.com/theme_assets/2160011/77a6ad5aee11a07eb9b87281070f1aadf946f2b3.png',
                season: '1',
                episode: '1'
            },
            {
                id: '2',
                name: 'How to create a Stremio add-on with Node.js',
                description: 'This is a step-by-step tutorial on how to create your own add-on using Node.js.',
                released: 'Mon Jul 02 2019 00:00:00 GMT+0300 (Eastern European Summer Time)',
                poster: 'https://theme.zdassets.com/theme_assets/2160011/77a6ad5aee11a07eb9b87281070f1aadf946f2b3.png',
                season: '2',
                episode: '1'
            }
        ]
    }));
    return metaItem;
};

module.exports = useMetaItem;
