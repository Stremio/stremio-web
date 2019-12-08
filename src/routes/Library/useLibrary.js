const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const initLibraryState = () => ({
    library_state: {
        type: 'NotLoaded'
    },
    selected: null,
    type_names: [],
    lib_items: []
});

const mapLibraryState = (library) => {
    const library_state = library.library_state;
    const selected = library.selected;
    const type_names = library.type_names;
    const lib_items = library.lib_items.map((lib_item) => ({
        id: lib_item._id,
        type: lib_item.type,
        name: lib_item.name,
        poster: lib_item.poster,
        posterShape: lib_item.posterShape,
        progress: lib_item.state.timeOffset > 0 && lib_item.state.duration > 0 ?
            lib_item.state.timeOffset / lib_item.state.duration
            :
            null,
        videoId: lib_item.state.video_id,
        href: `#/metadetails/${encodeURIComponent(lib_item.type)}/${encodeURIComponent(lib_item._id)}${lib_item.state.video_id !== null ? `/${encodeURIComponent(lib_item.state.video_id)}` : ''}`
    }));
    return { library_state, selected, type_names, lib_items };
};

const onNewLibraryState = (library) => {
    if (library.selected === null && library.type_names.length > 0) {
        return {
            action: 'Load',
            args: {
                load: 'LibraryFiltered',
                args: {
                    type_name: library.type_names[0],
                    sort_prop: null
                }
            }
        };
    }
};

const useLibrary = (urlParams, queryParams) => {
    const { core } = useServices();
    const loadLibraryAction = React.useMemo(() => {
        if (typeof urlParams.type === 'string') {
            return {
                action: 'Load',
                args: {
                    load: 'LibraryFiltered',
                    args: {
                        type_name: urlParams.type,
                        sort_prop: queryParams.has('sort_prop') ?
                            queryParams.get('sort_prop')
                            :
                            null
                    }
                }
            };
        } else {
            const library = core.getState('library');
            if (library.type_names.length > 0) {
                return {
                    action: 'Load',
                    args: {
                        load: 'LibraryFiltered',
                        args: {
                            type_name: library.type_names[0],
                            sort_prop: null
                        }
                    }
                };
            }
        }
    }, [urlParams, queryParams]);
    return useModelState({
        model: 'library',
        action: loadLibraryAction,
        map: mapLibraryState,
        init: initLibraryState,
        onNewState: onNewLibraryState
    });
}

module.exports = useLibrary;
