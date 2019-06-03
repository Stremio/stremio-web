const React = require('react');

const useCatalog = (urlParams, queryParams) => {
    const query = new URLSearchParams(queryParams).toString();
    const [addon, catalog] = React.useMemo(() => {
        // TODO impl this logic to stremio-core for code-reuse:
        // TODO use type if it is part of user's addons
        // TODO fallback to first type from user's addons
        // TODO find catalog for addonId, catalogId and type
        // TODO fallback to first catalog for the type from user's catalogs
        const addon = {
            id: 'com.linvo.cinemeta',
            version: '2.11.0',
            name: 'Cinemeta'
        };
        const catalog = {
            id: 'top',
            type: 'movie',
            name: 'Top',
            extra: [
                {
                    name: 'genre',
                    isRequired: false,
                    options: ['Action', 'drama', 'Boring']
                },
                {
                    name: 'year',
                    isRequired: false,
                    options: ['2017', '2016', '2015']
                }
            ]
        };
        return [addon, catalog];
    }, [urlParams.type, urlParams.catalog]);
    const pickers = React.useMemo(() => {
        const replaceType = (event) => {
            const { value } = event.currentTarget.dataset;
            const query = new URLSearchParams(queryParams);
            window.location = `#/discover/${value}/${addon.id}:${catalog.id}?${query}`;
        };
        const replaceCatalog = (event) => {
            const { value } = event.currentTarget.dataset;
            const query = new URLSearchParams(queryParams);
            window.location = `#/discover/${catalog.type}/${value}?${query}`;
        };
        const replaceQueryParam = (event) => {
            const { name, value } = event.currentTarget.dataset;
            const query = new URLSearchParams({ ...queryParams, [name]: value });
            window.location = `#/discover/${catalog.type}/${addon.id}:${catalog.id}?${query}`;
        };
        const requiredPickers = [
            {
                name: 'type',
                value: catalog.type,
                options: [
                    { value: 'movie', label: 'movie' },
                    { value: 'series', label: 'series' },
                    { value: 'channels', label: 'channels' },
                    { value: 'games', label: 'games' }
                ],
                toggle: replaceType
            },
            {
                name: 'catalog',
                value: catalog.name,
                options: [
                    { value: 'com.linvo.cinemeta:top', label: 'Top' },
                    { value: 'com.linvo.cinemeta:year', label: 'By year' }
                ],
                toggle: replaceCatalog
            }
        ];
        const extraPickers = catalog.extra
            .filter((extra) => {
                return extra.name !== 'skip' && extra.name !== 'search';
            })
            .map((extra) => ({
                ...extra,
                toggle: replaceQueryParam,
                options: extra.options.map((option) => ({ value: option, label: option })),
                value: extra.options.includes(queryParams[extra.name]) ?
                    queryParams[extra.name]
                    :
                    extra.isRequired ?
                        extra.options[0]
                        :
                        null
            }));
        return requiredPickers.concat(extraPickers);
    }, [addon, catalog, query]);
    const items = React.useMemo(() => {
        return Array(303).fill(null).map((_, index) => ({
            id: `tt${index}`,
            type: 'movie',
            name: `Stremio demo item${index}`,
            poster: `https://dummyimage.com/300x400/000/0011ff.jpg&text=${index + 1}`,
            logo: `https://dummyimage.com/300x400/000/0011ff.jpg&text=${index + 1}`,
            posterShape: 'poster'
        }));
    }, []);
    return [pickers, items];
};

module.exports = useCatalog;
