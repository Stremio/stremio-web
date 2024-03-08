// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const useLibrary = (model, urlParams, queryParams) => {
    const { core } = useServices();
    const loadNextPage = React.useCallback(() => {
        core.transport.dispatch({
            action: 'LibraryWithFilters',
            args: {
                action: 'LoadNextPage',
            }
        }, 'library');
    }, []);
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'LibraryWithFilters',
            args: {
                request: {
                    type: typeof urlParams.type === 'string' ? urlParams.type : null,
                    sort: queryParams.has('sort') ? queryParams.get('sort') : undefined,
                }
            }
        }
    }), [urlParams, queryParams]);
    const library = useModelState({ model, action });
    return [library, loadNextPage];
};

module.exports = useLibrary;
