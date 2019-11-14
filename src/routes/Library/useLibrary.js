const React = require('react');
const { useServices } = require('stremio/services');

const DEFAULT_TYPE = 'movie';
const DEFAULT_SORT = 'recent';

const useLibrary = (urlParams, queryParams) => {
    const { core } = useServices();
    const [library, setLibrary] = React.useState([[], []]);

    React.useEffect(() => {
        const type = typeof urlParams.type === 'string' && urlParams.type.length > 0 ? urlParams.type : DEFAULT_TYPE;
        const sort = typeof queryParams.get('sort') === 'string' && queryParams.get('sort').length > 0 ? queryParams.get('sort') : DEFAULT_SORT;
        const onNewState = () => {
            const state = core.getState();
            const sortItems = (items, prop) => {
                return items
                    .filter(item => !item.removed)
                    .sort((a, b) => {
                        if (a[prop] < b[prop]) return -1;
                        if (a[prop] > b[prop]) return 1;
                        return 0;
                    });
            }
            const selectInputs = [
                {
                    selected: [type],
                    options: state.library.types
                        .map((type) => ({
                            label: type,
                            value: type
                        })),
                    onSelect: (event) => {
                        const value = event.value;
                        const nextQuery = new URLSearchParams({ sort: typeof sort === 'string' ? sort : '' });
                        const nextType = typeof value === 'string' ? value : '';
                        window.location.replace(`#/library/${nextType}?${nextQuery}`);
                    }
                },
                {
                    selected: [sort],
                    options: [{ label: 'A-Z', value: 'a-z' }, { label: 'Recent', value: 'recent' }],
                    onSelect: (event) => {
                        const value = event.value;
                        const nextQuery = new URLSearchParams({ sort: typeof value === 'string' ? value : '' });
                        const nextType = typeof type === 'string' ? type : '';
                        window.location.replace(`#/library/${nextType}?${nextQuery}`);
                    }
                }
            ];
            const items = sort === 'recent' ? sortItems(state.library.items, '_ctime') : sortItems(state.library.items, 'name');
            setLibrary([items, selectInputs]);
        }
        core.on('NewModel', onNewState);
        core.dispatch({
            action: 'Load',
            args: {
                load: 'LibItemsByType',
                args: type
            }
        });
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [urlParams, queryParams]);
    return library;
}

module.exports = useLibrary;
