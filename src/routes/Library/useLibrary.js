const React = require('react');
const UrlUtils = require('url');
const { useServices } = require('stremio/services');

const useLibrary = (urlParams) => {
    const { core } = useServices();
    const [library, setLibrary] = React.useState([[], null, null]);
    React.useEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            if (state.library.selected === null && state.library.types.length > 0) {
                core.dispatch({
                    action: 'Load',
                    args: {
                        load: 'LibItemsByType',
                        args: state.library.types[0]
                    }
                });
                return;
            }
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
            const error = state.ctx.library.Ready.type !== 'Ready' ? state.ctx.library.Ready.type : null;
            setLibrary([state.library.items, selectInput, error]);
        };
        core.on('NewModel', onNewState);
        const state = core.getState();
        if (typeof urlParams.type === 'string') {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'LibItemsByType',
                    args: urlParams.type
                }
            });
        } else if (state.library.types.length > 0) {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'LibItemsByType',
                    args: state.library.types[0]
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
