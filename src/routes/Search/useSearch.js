// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');
const { useServices } = require('stremio/services');

const init = () => ({
    selected: null,
    catalogs: []
});

const useSearch = (queryParams) => {
    const { core } = useServices();
    React.useEffect(() => {
        let timerId = setTimeout(emitSearchEvent, 500);
        function emitSearchEvent() {
            timerId = null;
            const state = core.transport.getState('search');
            if (state.selected !== null) {
                const [, query] = state.selected.extra.find(([name]) => name === 'search');
                const responses = state.catalogs.filter((catalog) => catalog.content.type === 'Ready');
                core.transport.analytics({
                    event: 'Search',
                    args: {
                        query,
                        responsesCount: responses.length
                    }
                });
            }
        }
        return () => {
            if (timerId !== null) {
                clearTimeout(timerId);
                emitSearchEvent();
            }
        };
    }, [queryParams.get('search')]);
    const action = React.useMemo(() => {
        if (queryParams.has('search') && queryParams.get('search').length > 0) {
            return {
                action: 'Load',
                args: {
                    model: 'CatalogsWithExtra',
                    args: {
                        extra: [
                            ['search', queryParams.get('search')]
                        ]
                    }
                }
            };
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [queryParams]);
    return useModelState({ model: 'search', action, init });
};

module.exports = useSearch;
