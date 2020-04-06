const React = require('react');
const { deepLinking, useModelState } = require('stremio/common');

const initSearchState = () => ({
    selected: null,
    catalog_resources: []
});

const mapSearchStateWithCtx = (search, ctx) => {
    const selected = search.selected;
    const catalog_resources = search.catalog_resources.map((catalog_resource) => {
        const request = catalog_resource.request;
        const content = catalog_resource.content.type === 'Ready' ?
            {
                type: 'Ready',
                content: catalog_resource.content.content.map((metaItem, _, metaItems) => ({
                    type: metaItem.type,
                    name: metaItem.name,
                    poster: metaItem.poster,
                    posterShape: metaItems[0].posterShape,
                    deepLinks: deepLinking.withMetaItem({ metaItem })
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
        const deepLinks = deepLinking.withCatalog({ request });
        return { request, content, origin, deepLinks };
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
