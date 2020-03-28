const React = require('react');
const { useModelState } = require('stremio/common');

const initSearchState = () => ({
    selected: null,
    catalog_resources: []
});

const mapSearchStateWithCtx = (search, ctx) => {
    const queryString = search.selected !== null ?
        new URLSearchParams(search.selected.extra).toString()
        :
        '';
    const selected = search.selected;
    const catalog_resources = search.catalog_resources.map((catalog_resource) => {
        const request = catalog_resource.request;
        const content = catalog_resource.content.type === 'Ready' ?
            {
                type: 'Ready',
                content: catalog_resource.content.content.map((metaItem) => ({
                    type: metaItem.type,
                    name: metaItem.name,
                    poster: metaItem.poster,
                    posterShape: metaItem.posterShape,
                    href: `#/metadetails/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}` // TODO this should redirect with videoId at some cases
                }))
            }
            :
            catalog_resource.content;
        const origin = ctx.profile.addons.reduce((origin, addon) => {
            if (addon.transportUrl === catalog_resource.request.base) {
                return typeof addon.manifest.name === 'string' && addon.manifest.name.length > 0 ?
                    addon.manifest.name
                    :
                    addon.manifest.id;
            }

            return origin;
        }, catalog_resource.request.base);
        const href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}?${queryString}`;
        return { request, content, origin, href };
    });
    return { selected, catalog_resources };
};

const useSearch = (queryParams) => {
    const loadSearchAction = React.useMemo(() => {
        if (queryParams.has('search') && queryParams.get('search').length > 0) {
            return {
                action: 'Load',
                args: {
                    model: 'CatalogsWithExtra',
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
        mapWithCtx: mapSearchStateWithCtx,
        init: initSearchState
    });
};

module.exports = useSearch;
