// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useCore } = require('stremio/core');
const useModelState = require('stremio/common/useModelState');

const useSearchHistory = () => {
    const core = useCore();
    const { searchHistory: items } = useModelState({ model: 'ctx' });

    const clear = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'ClearSearchHistory',
            },
        });
    }, []);

    return {
        items,
        clear,
    };
};

module.exports = useSearchHistory;
