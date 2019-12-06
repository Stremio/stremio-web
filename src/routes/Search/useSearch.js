const React = require('react');
const { useModelState } = require('stremio/common');

const initSearchState = () => ({
    selected: null,
    catalog_resources: []
});

const mapSearchState = (search, ctx) => {
    const queryString = search.selected !== null ?
        new URLSearchParams(search.selected.extra).toString()
        :
        '';
    const selected = search.selected;
    const catalog_resources = search.catalog_resources.map((catalog_resource) => {
        catalog_resource.addon_name = ctx.content.addons.reduce((addon_name, addon) => {
            if (addon.transportUrl === catalog_resource.request.base) {
                return addon.manifest.name;
            }

            return addon_name;
        }, catalog_resource.request.base);
        catalog_resource.href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}?${queryString}`;
        if (catalog_resource.content.type === 'Ready') {
            catalog_resource.content.content.map((metaItem) => {
                metaItem.href = `#/metadetails/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}`;
                return metaItem;
            });
        }

        return catalog_resource;
    });
    return { selected, catalog_resources };
};

const useSearch = (queryParams) => {
    const loadSearchAction = React.useMemo(() => {
        if (queryParams.has('search') && queryParams.get('search').length > 0) {
            return {
                action: 'Load',
                args: {
                    load: 'CatalogsWithExtra',
                    args: {
                        extra: [
                            ['search', queryParams.get('search')]
                        ]
                    }
                }
            };
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [queryParams]);
    return useModelState({
        model: 'search',
        action: loadSearchAction,
        mapWithCtx: mapSearchState,
        init: initSearchState
    });
};

module.exports = useSearch;
