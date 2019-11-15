const React = require('react');
const UrlUtils = require('url');
const { useServices } = require('stremio/services');

const DEFAULT_TYPE = 'movie';

const useLibrary = (urlParams) => {
    const { core } = useServices();
    const [library, setLibrary] = React.useState([[], null]);
    React.useEffect(() => {
        const type = typeof urlParams.type === 'string' && urlParams.type.length > 0 ? urlParams.type : DEFAULT_TYPE;
        const onNewState = () => {
            const state = core.getState();
            const selectInput = {
                selected: [type],
                options: state.library.types
                    .map((type) => ({
                        label: type,
                        value: type
                    })),
                onSelect: (event) => {
                    const { search } = UrlUtils.parse(window.location.hash.slice(1));
                    const queryParams = new URLSearchParams(search || { sort: 'recent' });
                    window.location.replace(`#/library/${event.value}?${queryParams}`);
                }
            };
            const items = state.library.items.filter(item => !item.removed);
            setLibrary([items, selectInput]);
        }
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
