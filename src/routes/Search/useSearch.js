// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    catalogs: []
});

const map = (search) => ({
    ...search,
    catalogs: search.catalogs.map((catalog) => ({
        ...catalog,
        content: catalog.content.type === 'Ready' ?
            {
                ...catalog.content,
                content: catalog.content.content.map((metaItem, _, metaItems) => ({
                    type: metaItem.type,
                    name: metaItem.name,
                    poster: metaItem.poster,
                    posterShape: metaItems[0].posterShape,
                    deepLinks: metaItem.deepLinks
                }))
            }
            :
            catalog.content
    }))
});

const useSearch = (queryParams) => {
    const action = React.useMemo(() => {
        if (queryParams.has('q') && queryParams.get('q').length > 0) {
            return {
                action: 'Load',
                args: {
                    model: 'CatalogsWithExtra',
                    args: {
                        extra: [
                            ['search', queryParams.get('q')]
                        ]
                    }
                }
            };
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [queryParams]);
    return useModelState({ model: 'search', action, map, init });
};

module.exports = useSearch;
