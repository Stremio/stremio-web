// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    catalogs: []
});

const useSearch = (queryParams) => {
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
