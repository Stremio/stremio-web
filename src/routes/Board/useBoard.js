// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const useBoard = () => {
    const { core } = useServices();
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'CatalogsWithExtra',
            args: { extra: [] }
        }
    }), []);
    const loadRange = React.useCallback((range) => {
        core.transport.dispatch({
            action: 'CatalogsWithExtra',
            args: {
                action: 'LoadRange',
                args: range
            }
        }, 'board');
    }, []);
    const board = useModelState({ model: 'board', action });
    return [board, loadRange];
};

module.exports = useBoard;
