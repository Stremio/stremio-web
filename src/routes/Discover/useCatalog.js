const React = require('react');

const useCatalog = (urlParams, queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
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
                    options: ['Action', 'Drama', 'Boring']
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
    const dropdowns = React.useMemo(() => {
        const onTypeChange = (event) => {
            const { value } = event.currentTarget.dataset;
            const query = new URLSearchParams(queryParams);
            window.location = `#/discover/${value}/${addon.id}:${catalog.id}?${query}`;
        };
        const onCatalogChange = (event) => {
            const { value } = event.currentTarget.dataset;
            const query = new URLSearchParams(queryParams);
            window.location = `#/discover/${catalog.type}/${value}?${query}`;
        };
        const onQueryParamChange = (event) => {
            const { name, value } = event.currentTarget.dataset;
            const query = new URLSearchParams({ ...queryParams, [name]: value });
            window.location = `#/discover/${catalog.type}/${addon.id}:${catalog.id}?${query}`;
        };
        const requiredDropdowns = [
            {
                name: 'type',
                selected: [catalog.type],
                options: [
                    { value: 'movie', label: 'movie' },
                    { value: 'series', label: 'series' },
                    { value: 'channels', label: 'channels' },
                    { value: 'games', label: 'games' }
                ],
                onSelect: onTypeChange
            },
            {
                name: 'catalog',
                selected: [`${addon.id}:${catalog.id}`],
                options: [
                    { value: 'com.linvo.cinemeta:top', label: 'Top' },
                    { value: 'com.linvo.cinemeta:year', label: 'By year' }
                ],
                onSelect: onCatalogChange
            }
        ];
        const extraDropdowns = catalog.extra
            .filter((extra) => {
                return extra.name !== 'skip' && extra.name !== 'search';
            })
            .map((extra) => ({
                ...extra,
                onSelect: onQueryParamChange,
                options: extra.options.map((option) => ({ value: option, label: option })),
                selected: extra.options.includes(queryParams[extra.name]) ?
                    [queryParams[extra.name]]
                    :
                    extra.isRequired ?
                        [extra.options[0]]
                        :
                        []
            }));
        return requiredDropdowns.concat(extraDropdowns);
    }, [addon, catalog, queryString]);
    const items = React.useMemo(() => {
        return Array(100).fill(null).map((_, index) => ({
            id: `tt${index}`,
            type: 'movie',
            name: `Stremio demo item ${index}`,
            poster: `https://www.stremio.com/website/technology-hero.jpg`,
            logo: `https://www.stremio.com/website/stremio-logo-small.png`,
            posterShape: 'poster'
        }));
    }, []);
    return [dropdowns, items];
};

module.exports = useCatalog;
