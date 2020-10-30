// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    catalogs: []
});

const useBoard = () => {
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'CatalogsWithExtra',
            args: { extra: [] }
        }
    }), []);
    return useModelState({ model: 'board', timeout: 1500, action, init });
};

module.exports = useBoard;
