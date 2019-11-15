const React = require('react');

const DEFAULT_TYPE = 'movie';
const DEFAULT_SORT = 'recent';
const SORTS = [DEFAULT_SORT, 'year', 'a-z'];
const SORT_PROPS = {
    'recent': '_ctime',
    'a-z': 'name',
    'year': 'year'
};

const useSort = (urlParams, queryParams) => {
    const [sort, setSort] = React.useState([null, () => { }]);
    React.useEffect(() => {
        const type = typeof type === 'string' && type.length > 0 ? urlParams.type : DEFAULT_TYPE;
        const sort = queryParams.has('sort') && SORTS.includes(queryParams.get('sort')) ? queryParams.get('sort') : DEFAULT_SORT;
        const sortProp = SORT_PROPS[sort];
        const sortItems = (a, b) => {
            if (a[sortProp] < b[sortProp]) return -1;
            if (a[sortProp] > b[sortProp]) return 1;
            return 0;
        };
        const selectInput = {
            selected: [sort],
            options: [{ label: 'A-Z', value: 'a-z' }, { label: 'Recent', value: 'recent' }, { label: 'Year', value: 'year' }],
            onSelect: (event) => {
                const nextQuery = new URLSearchParams({ sort: event.value });
                window.location.replace(`#/library/${type}?${nextQuery}`);
            }
        };
        setSort([selectInput, sortItems]);
    }, [urlParams, queryParams]);
    return sort;
};

module.exports = useSort;
