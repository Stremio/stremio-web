const React = require('react');
const { useServices } = require('stremio/services');

const mapSearchState = (state) => {
    const query = state.search.selected.reduceRight((query, [name, value]) => {
        if (name === 'search') {
            return value;
        }
        return query;
    }, '');
    const selected = state.search.selected;
    const items_groups = state.search.items_groups.map((group) => {
        group.href = `#/discover/${encodeURIComponent(group.request.base)}/${encodeURIComponent(group.request.path.id)}/${encodeURIComponent(group.request.path.type_name)}?search=${query}`;
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
        if (queryParams.has('search')) {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogsGrouped',
                    args: {
                        extra: [
                            ['search', queryParams.get('search')]
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
