const React = require('react');

const useMetaItems = (metaItems) => {
    const metaItemsNotifications = React.useMemo(() => {
        return metaItems !== null ?
            [
                {
                    id: '1',
                    type: 'channel',
                    name: 'Linus Tech Tips',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Linus Tech Tips',
                            released: new Date(2019, 9, 1),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 1,
                            episode: 1
                        },
                        {
                            id: '2',
                            name: 'Linus Tech Tips',
                            released: new Date(2019, 9, 2),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 1,
                            episode: 2
                        },
                        {
                            id: '3',
                            name: 'Linus Tech Tips',
                            released: new Date(2019, 9, 3),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 1,
                            episode: 3
                        }
                    ]
                },
                {
                    id: '2',
                    type: 'series',
                    name: 'Family Guy',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Island Adventure',
                            released: new Date(2019, 9, 2),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 17,
                            episode: 17
                        }
                    ]
                },
                {
                    id: '3',
                    type: 'series',
                    name: 'The Walking Dead',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Evolution',
                            released: new Date(2019, 8, 12),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 9,
                            episode: 8
                        }
                    ]
                },
                {
                    id: '4',
                    type: 'series',
                    name: 'Family Guy',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Island Adventure',
                            released: new Date(2019, 9, 2),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 17,
                            episode: 17
                        }
                    ]
                },
                {
                    id: '5',
                    type: 'series',
                    name: 'The Walking Dead',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Evolution',
                            released: new Date(2019, 8, 12),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 9,
                            episode: 8
                        }
                    ]
                },
                {
                    id: '6',
                    type: 'series',
                    name: 'Family Guy',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Island Adventure',
                            released: new Date(2019, 9, 2),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 17,
                            episode: 17
                        }
                    ]
                },
                {
                    id: '7',
                    type: 'series',
                    name: 'The Walking Dead',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Evolution',
                            released: new Date(2019, 8, 12),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 9,
                            episode: 8
                        }
                    ]
                },
                {
                    id: '8',
                    type: 'series',
                    name: 'Family Guy',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Island Adventure',
                            released: new Date(2019, 9, 2),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 17,
                            episode: 17
                        }
                    ]
                },
                {
                    id: '9',
                    type: 'series',
                    name: 'The Walking Dead',
                    logo: 'https://www.stremio.com/website/home-stremio.png',
                    videos: [
                        {
                            id: '1',
                            name: 'Evolution',
                            released: new Date(2019, 8, 12),
                            poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                            season: 9,
                            episode: 8
                        }
                    ]
                },
            ]
            :
            [];
    }, [metaItems]);
    return metaItemsNotifications;
};

module.exports = useMetaItems;
