const React = require('react');
const { CONSTANTS, deepLinking, useModelState, comparatorWithPriorities } = require('stremio/common');

const initLibraryState = () => ({
    selected: null,
    type_names: [],
    lib_items: []
});

const mapLibraryState = (library) => {
    const selected = library.selected;
    const type_names = library.type_names.sort(comparatorWithPriorities(CONSTANTS.TYPE_PRIORITIES));
    const lib_items = library.lib_items.map((libItem) => ({
        id: libItem._id,
        type: libItem.type,
        name: libItem.name,
        poster: libItem.poster,
        posterShape: libItem.posterShape === 'landscape' ? 'square' : libItem.posterShape,
        progress: libItem.state.timeOffset > 0 && libItem.state.duration > 0 ?
            libItem.state.timeOffset / libItem.state.duration
            :
            null,
        deepLinks: deepLinking.withLibItem({ libItem })
    }));
    return { selected, type_names, lib_items };
};

const useLibrary = (libraryModel, urlParams, queryParams) => {
    const loadLibraryAction = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'LibraryWithFilters',
            args: {
                type_name: typeof urlParams.type === 'string' ? urlParams.type : null,
                sort: queryParams.has('sort') ? queryParams.get('sort') : 'lastwatched'
            }
        }
    }), [urlParams, queryParams]);
    return useModelState({
        model: libraryModel,
        action: loadLibraryAction,
        map: mapLibraryState,
        init: initLibraryState
    });
};

module.exports = useLibrary;
