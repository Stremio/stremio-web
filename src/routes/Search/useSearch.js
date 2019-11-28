const React = require('react');
const { useServices } = require('stremio/services');

const useSearch = (queryParams) => {
    const { core } = useServices();
    const [search, setSearch] = React.useState([]);
    React.useEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            setSearch(state.search.groups);
        };
        core.on('NewModel', onNewState);
        if (queryParams.has('q')) {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogGrouped',
                    args: {
                        extra: [
                            ['search', queryParams.get('q')]
                        ]
                    }
                }
            });
        }
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [queryParams]);
    return search;
};

module.exports = useSearch;
