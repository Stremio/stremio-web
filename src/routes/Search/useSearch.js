const React = require('react');
const { useServices } = require('stremio/services');

const mapSearchState = (state) => {
    const queryString = state.search.selected !== null ?
        new URLSearchParams(state.search.selected.extra).toString()
        :
        '';
    const selected = state.search.selected;
    const catalog_resources = state.search.catalog_resources.map((catalog_resource) => {
        catalog_resource.href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}?${queryString}`;
        return catalog_resource;
    });
    return { selected, catalog_resources };
};

const useSearch = (queryParams) => {
    const { core } = useServices();
    const [search, setSearch] = React.useState(() => {
        const state = core.getState();
        const search = mapSearchState(state);
        return search;
    });
    React.useLayoutEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            const search = mapSearchState(state);
            setSearch(search);
        };
        core.on('NewModel', onNewState);
        if (queryParams.has('search') && queryParams.get('search').length > 0) {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogsWithExtra',
                    args: {
                        extra: [
                            ['search', queryParams.get('search')]
                        ]
                    }
                }
            }, 'Search');
        }
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [queryParams]);
    return search;
};

module.exports = useSearch;
