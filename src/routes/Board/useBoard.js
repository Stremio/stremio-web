const React = require('react');
const { useModelState } = require('stremio/common');

const initBoardState = () => ({
    selected: null,
    catalog_resources: []
});

const mapBoardState = (board) => {
    const selected = board.selected;
    const catalog_resources = board.catalog_resources.map((catalog_resource) => {
        catalog_resource.href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}`;
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
        timeout: 1000,
        map: mapBoardState,
        init: initBoardState
    });
};

module.exports = useBoard;
