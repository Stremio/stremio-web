const React = require('react');
const { useServices } = require('stremio/services');

const mapBoardState = (state) => {
    const selected = state.board.selected;
    const catalog_resources = state.board.catalog_resources.map((catalog_resource) => {
        catalog_resource.href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}`;
        return catalog_resource;
    });
    return { selected, catalog_resources };
};

const useBoard = () => {
    const { core } = useServices();
    const [board, setBoard] = React.useState(() => {
        const state = core.getState();
        const board = mapBoardState(state);
        return board;
    });
    React.useLayoutEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            const board = mapBoardState(state);
            setBoard(board);
        };
        core.on('NewModel', onNewState);
        core.dispatch({
            action: 'Load',
            args: {
                load: 'CatalogsWithExtra',
                args: { extra: [] }
            }
        }, 'Board');
        return () => {
            core.off('NewModel', onNewState);
        };
    }, []);
    return board;
};

module.exports = useBoard;
