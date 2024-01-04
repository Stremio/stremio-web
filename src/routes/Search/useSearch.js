// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');
const { useServices } = require('stremio/services');

const useSearch = (queryParams) => {
    const { core } = useServices();
    // TODO: refactor this to be in stremio-core-web
    // React.useEffect(() => {
    //     let timerId = setTimeout(emitSearchEvent, 500);
    //     function emitSearchEvent() {
    //         timerId = null;
    //         const state = core.transport.getState('search');
    //         if (state.selected !== null) {
    //             const [, query] = state.selected.extra.find(([name]) => name === 'search');
    //             const responses = state.catalogs.filter((catalog) => catalog.content?.type === 'Ready');
    //             core.transport.analytics({
    //                 event: 'Search',
    //                 args: {
    //                     query,
    //                     responsesCount: responses.length
    //                 }
    //             });
    //         }
    //     }
    //     return () => {
    //         if (timerId !== null) {
    //             clearTimeout(timerId);
    //             emitSearchEvent();
    //         }
    //     };
    // }, [queryParams.get('search')]);
    const action = React.useMemo(() => {
        const query = queryParams.get('search') ?? queryParams.get('query');
        if (query?.length > 0) {
            return {
                action: 'Load',
                args: {
                    model: 'CatalogsWithExtra',
                    args: {
                        extra: [
                            ['search', query]
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
    const loadRange = React.useCallback((range) => {
        core.transport.dispatch({
            action: 'CatalogsWithExtra',
            args: {
                action: 'LoadRange',
                args: range
            }
        }, 'search');
    }, []);
    const search = useModelState({ model: 'search', action });
    return [search, loadRange];
};

module.exports = useSearch;
