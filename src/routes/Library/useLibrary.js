// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const useLibrary = (model, urlParams, queryParams) => {
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'LibraryWithFilters',
            args: {
                request: {
                    type: typeof urlParams.type === 'string' ? urlParams.type : null,
                    sort: queryParams.has('sort') ? queryParams.get('sort') : undefined,
                    page: queryParams.has('page') ? parseInt(queryParams.get('page'), 10) : undefined
                }
            }
        }
    }), [urlParams, queryParams]);
    return useModelState({ model, action });
};

module.exports = useLibrary;
