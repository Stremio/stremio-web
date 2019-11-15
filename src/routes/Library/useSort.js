const React = require('react');
const { useServices } = require('stremio/services');

const DEFAULT_SORT = 'recent';
const SORTS = [DEFAULT_SORT, 'year', 'a-z'];
const SORT_PROPS = new Map([
    ['recent', '_ctime'],
    ['a-z', 'name'],
    ['year', 'year']
]);

const useSort = (urlParams, queryParams) => {
    const { core } = useServices();
    const [sort, setSort] = React.useState([null, () => { }]);
    React.useEffect(() => {
        const sort = queryParams.has('sort') && SORTS.includes(queryParams.get('sort')) ? queryParams.get('sort') : DEFAULT_SORT;
        const sortProp = SORT_PROPS.get(sort);
        const sortItems = (a, b) => {
            if (a[sortProp] < b[sortProp]) return -1;
            if (a[sortProp] > b[sortProp]) return 1;
            return 0;
        };
        const selectInput = {
            selected: [sort],
            options: [{ label: 'Recent', value: 'recent' }, { label: 'A-Z', value: 'a-z' }, { label: 'Year', value: 'year' }],
            onSelect: (event) => {
                const nextQuery = new URLSearchParams({ sort: event.value });
                const state = core.getState();
                window.location.replace(`#/library/${state.library.selected !== null ? state.library.selected : ''}?${nextQuery}`);
            }
        };
        setSort([selectInput, sortItems]);
    }, [urlParams, queryParams]);
    return sort;
};

module.exports = useSort;
