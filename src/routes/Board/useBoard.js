const React = require('react');
const { useModelState } = require('stremio/common');

const initBoardState = () => ({
    selected: null,
    catalog_resources: []
});

const mapBoardStateWithCtx = (board, ctx) => {
    const selected = board.selected;
    const catalog_resources = board.catalog_resources.map((catalog_resource) => {
        catalog_resource.addon_name = ctx.content.addons.reduce((addon_name, addon) => {
            if (addon.transportUrl === catalog_resource.request.base) {
                return addon.manifest.name;
            }

            return addon_name;
        }, catalog_resource.request.base);
        if (catalog_resource.content.type === 'Ready') {
            catalog_resource.content.content = catalog_resource.content.content.map((metaItem) => ({
                type: metaItem.type,
                name: metaItem.name,
                poster: metaItem.poster,
                posterShape: metaItem.posterShape,
                href: `#/metadetails/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}` // TODO this should redirect with videoId at some cases
            }));
        }
        catalog_resource.href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}`;
        return catalog_resource;
    });
    return { selected, catalog_resources };
};

const useBoard = () => {
    const loadBoardAction = React.useMemo(() => ({
        action: 'Load',
        args: {
            load: 'CatalogsWithExtra',
            args: { extra: [] }
        }
    }), []);
    return useModelState({
        model: 'board',
        action: loadBoardAction,
        mapWithCtx: mapBoardStateWithCtx,
        init: initBoardState,
        timeout: 1000
    });
};

module.exports = useBoard;
