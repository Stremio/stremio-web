const React = require('react');
const { useServices } = require('stremio/services');

const mapLibraryState = (state) => {
    const library_state = state.library.library_state;
    const selected = state.library.selected;
    const lib_items = state.library.lib_items.map((lib_item) => {
        lib_item._ctime = new Date(lib_item._ctime);
        return lib_item;
    });
    const type_names = state.library.type_names;
    return { library_state, selected, lib_items, type_names };
};

const useLibrary = (urlParams) => {
    const { core } = useServices();
    const [library, setLibrary] = React.useState(() => {
        const state = core.getState();
        const library = mapLibraryState(state);
        return library;
    });
    React.useEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            if (state.library.selected.type_name === null && state.library.type_names.length > 0) {
                core.dispatch({
                    action: 'Load',
                    args: {
                        load: 'LibraryFiltered',
                        args: {
                            type_name: state.library.type_names[0]
                        }
                    }
                });
                return;
            }
            const library = mapLibraryState(state);
            setLibrary(library);
        };
        core.on('NewModel', onNewState);
        const state = core.getState();
        if (typeof urlParams.type === 'string') {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'LibraryFiltered',
                    args: {
                        type_name: urlParams.type
                    }
                }
            });
        } else if (state.library.type_names.length > 0) {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'LibraryFiltered',
                    args: {
                        type_name: state.library.type_names[0]
                    }
                }
            });
        }
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [urlParams]);
    return library;
}

module.exports = useLibrary;
