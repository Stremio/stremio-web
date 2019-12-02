const React = require('react');
const { useServices } = require('stremio/services');

const mapSearchState = (state) => {
    const selected = state.search.selected && state.search.selected[0] && state.search.selected[0][1] && state.search.selected[0][1].length > 0 ? state.search.selected[0][1] : '';
    const items_groups = state.search.items_groups.map((group) => {
        group.href = `#/discover/${encodeURIComponent(group.request.base)}/${encodeURIComponent(group.request.path.id)}/${encodeURIComponent(group.request.path.type_name)}?search=${state.search.selected[0][1]}`;
        return group;
    });
    return { selected, items_groups };
};

const useSearch = (queryParams) => {
    const { core } = useServices();
    const [search, setSearch] = React.useState(() => {
        const state = core.getState();
        const search = mapSearchState(state);
        return search;
    });
    React.useEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            const search = mapSearchState(state);
            setSearch(search);
        };
        core.on('NewModel', onNewState);
        if (queryParams.has('q')) {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogsGrouped',
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
