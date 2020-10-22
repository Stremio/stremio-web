// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    selectable: {
        types: [],
        sorts: []
    },
    catalog: []
});

const map = (library) => ({
    ...library,
    catalog: library.catalog.map((libItem) => ({
        id: libItem._id,
        type: libItem.type,
        name: libItem.name,
        poster: libItem.poster,
        posterShape: libItem.posterShape === 'landscape' ? 'square' : libItem.posterShape,
        progress: libItem.state.timeOffset > 0 && libItem.state.duration > 0 ?
            libItem.state.timeOffset / libItem.state.duration
            :
            null,
        deepLinks: libItem.deep_links
    }))
});

const useLibrary = (model, urlParams, queryParams) => {
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'LibraryWithFilters',
            args: {
                request: {
                    type: typeof urlParams.type === 'string' ? urlParams.type : null,
                    sort: queryParams.has('sort') ? queryParams.get('sort') : undefined
                }
            }
        }
    }), [urlParams, queryParams]);
    return useModelState({ model, action, map, init });
};

module.exports = useLibrary;
