const React = require('react');

const libraryItems = [
    {
        id: '1',
        type: 'movie',
        name: 'Stremio demo item movie 1',
        poster: 'images/intro_background.png',
        logo: 'images/default_avatar.png',
        posterShape: 'poster'
    },
    {
        id: '2',
        type: 'movie',
        name: 'Stremio demo item movie 2',
        poster: 'images/intro_background.png',
        logo: 'images/default_avatar.png',
        posterShape: 'poster'
    },
    {
        id: '3',
        type: 'series',
        name: 'Stremio demo item series 1',
        poster: 'images/intro_background.png',
        logo: 'images/default_avatar.png',
        posterShape: 'poster'
    },
    {
        id: '4',
        type: 'series',
        name: 'Stremio demo item series 2',
        poster: 'images/intro_background.png',
        logo: 'images/default_avatar.png',
        posterShape: 'poster'
    },
    {
        id: '5',
        type: 'channel',
        name: 'Stremio demo item channel 1',
        poster: 'images/intro_background.png',
        logo: 'images/default_avatar.png',
        posterShape: 'square'
    },
    {
        id: '6',
        type: 'channel',
        name: 'Stremio demo item channel 2',
        poster: 'images/intro_background.png',
        logo: 'images/default_avatar.png',
        posterShape: 'square'
    }
];

const useLibrary = (type, sort) => {
    const items = React.useMemo(() => {
        return libraryItems.filter(item => typeof type === 'string' && item.type === type);
    }, [type, sort]);
    const onSelect = React.useCallback((event) => {
        const { name, value } = event.currentTarget.dataset;
        if (name === 'type') {
            const nextQuery = new URLSearchParams({ sort: typeof sort === 'string' ? sort : '' });
            const nextType = typeof value === 'string' ? value : '';
            window.location = `#/library/${nextType}?${nextQuery}`;
        } else if (name === 'sort') {
            const nextQuery = new URLSearchParams({ sort: typeof value === 'string' ? value : '' });
            const nextType = typeof type === 'string' ? type : '';
            window.location = `#/library/${nextType}?${nextQuery}`;
        }
    }, [type, sort]);
    const typeDropdown = React.useMemo(() => {
        const selected = typeof type === 'string' && type.length > 0 ? [type] : [];
        const options = libraryItems
            .map(({ type }) => type)
            .concat(selected)
            .filter((type, index, types) => types.indexOf(type) === index)
            .map((type) => ({ label: type, value: type }));
        return {
            name: 'type',
            selected,
            options,
            onSelect
        };
    }, [type, onSelect]);
    const sortDropdown = React.useMemo(() => {
        const selected = typeof sort === 'string' && sort.length > 0 ? [sort] : [];
        const options = [{ label: 'A-Z', value: 'a-z' }, { label: 'Recent', value: 'recent' }];
        return {
            name: 'sort',
            selected,
            options,
            onSelect
        };
    }, [sort, onSelect]);
    return [items, [typeDropdown, sortDropdown]];
};

module.exports = useLibrary;
