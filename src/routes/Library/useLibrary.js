const React = require('react');
const UrlUtils = require('url');
const { useServices } = require('stremio/services');

const useLibrary = (urlParams) => {
    const { core } = useServices();
    const [library, setLibrary] = React.useState([[], null, null]);
    React.useEffect(() => {
        const state = core.getState();
        const type = typeof urlParams.type === 'string' && urlParams.type.length > 0 ?
            urlParams.type
            :
            state.library.types.length > 0 ?
                state.library.types[0]
                :
                '';
        const onNewState = () => {
            const state = core.getState();
            const selectInput = {
                selected: [state.library.selected],
                options: state.library.types
                    .map((type) => ({
                        label: type === '' ? '"Empty"' : type,
                        value: type
                    })),
                onSelect: (event) => {
                    const { search } = UrlUtils.parse(window.location.hash.slice(1));
                    window.location.replace(`#/library/${event.value}${search !== null ? search : ''}`);
                }
            };
            const error = state.library.items === 0 ? state.library.items : null;
            setLibrary([state.library.items, selectInput, error]);
        };
        core.on('NewModel', onNewState);
        core.dispatch({
            action: 'Load',
            args: {
                load: 'LibItemsByType',
                args: type
            }
        });
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [urlParams]);
    return library;
}

module.exports = useLibrary;
