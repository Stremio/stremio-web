const React = require('react');
const { useModelState } = require('stremio/common');

const initBoardState = () => ({
    selected: null,
    catalog_resources: []
});

const mapBoardStateWithCtx = (board, ctx) => {
    const selected = board.selected;
    const catalog_resources = board.catalog_resources.map((catalog_resource) => {
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
        return { request, content, origin };
    });
    return { selected, catalog_resources };
};

const useBoard = () => {
    const loadBoardAction = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'CatalogsWithExtra',
            args: { extra: [] }
        }
    }), []);
    return useModelState({
        model: 'board',
        action: loadBoardAction,
        mapWithCtx: mapBoardStateWithCtx,
        init: initBoardState,
        timeout: 1500
    });
};

module.exports = useBoard;
