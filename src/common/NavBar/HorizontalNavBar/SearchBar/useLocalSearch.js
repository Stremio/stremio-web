// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('../../../../common/useModelState');

const useLocalSearch = (query) => {
    const { core } = useServices();

    const { searchResults } = useModelState({ model: 'local_search' });

    const dispatchSearch = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Search',
            args: {
                action: 'Search',
                args: {
                    searchQuery: query,
                    maxResults: 5
                },
            },
        });
    }, [query]);

    return {
        searchResults,
        dispatchSearch
    };
};

module.exports = useLocalSearch;
