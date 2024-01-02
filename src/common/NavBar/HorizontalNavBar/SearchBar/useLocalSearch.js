// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('stremio/common/useModelState');

const useLocalSearch = () => {
    const { core } = useServices();

    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'LocalSearch',
        }
    }), []);

    const { items } = useModelState({ model: 'local_search', action });

    const search = React.useCallback((query) => {
        core.transport.dispatch({
            action: 'Search',
            args: {
                action: 'Search',
                args: {
                    searchQuery: query,
                    maxResults: 5
                }
            },
        });
    }, []);

    return {
        items,
        search,
    };
};

module.exports = useLocalSearch;
