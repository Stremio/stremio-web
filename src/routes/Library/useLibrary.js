const React = require('react');
const { useServices } = require('stremio/services');

const useLibrary = (urlParams) => {
    const { core } = useServices();
    const [library, setLibrary] = React.useState([null, [], []]);
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
            setLibrary([state.library.selected.type_name, state.library.type_names, state.library.lib_items]);
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
