// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const debounce = require('lodash.debounce');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    catalogs: []
});

const useBoard = () => {
    const { core } = useServices();
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'CatalogsWithExtra',
            args: { extra: [] }
        }
    }), []);
    const loadRange = React.useCallback(debounce((start, end) => {
        core.transport.dispatch({
            action: 'CatalogsWithExtra',
            args: {
                action: 'LoadRange',
                args: { start, end }
            }
        }, 'board');
    }, 100), []);
    const board = useModelState({ model: 'board', timeout: 1500, action, init });
    return [board, loadRange];
};

module.exports = useBoard;
