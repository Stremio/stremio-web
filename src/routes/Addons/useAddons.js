const React = require('react');

const CATEGORIES = ['official', 'community', 'my'];
const DEFAULT_CATEGORY = 'community';
const DEFAULT_TYPE = 'all';

const useAddons = (category, type) => {
    category = CATEGORIES.includes(category) ? category : DEFAULT_CATEGORY;
    type = typeof type === 'string' && type.length > 0 ? type : DEFAULT_TYPE;
    const onSelect = React.useCallback((event) => {
        const { name, value } = event.currentTarget.dataset;
        if (name === 'category') {
            const nextCategory = CATEGORIES.includes(value) ? value : '';
            window.location.replace(`#/addons/${nextCategory}/${type}`);
        } else if (name === 'type') {
            const nextType = typeof value === 'string' ? value : '';
            window.location.replace(`#/addons/${category}/${nextType}`);
        }
    }, [category, type]);
    const categoryDropdown = React.useMemo(() => {
        const selected = CATEGORIES.includes(category) ? [category] : [];
        const options = CATEGORIES
            .map((category) => ({ label: category, value: category }));
        return {
            name: 'category',
            selected,
            options,
            onSelect
        };
    }, [category, onSelect]);
    const typeDropdown = React.useMemo(() => {
        const selected = typeof type === 'string' && type.length > 0 ? [type] : [];
        const options = ['all', 'movie', 'series', 'channel']
            .concat(selected)
            .filter((type, index, types) => types.indexOf(type) === index)
            .map((type) => ({ label: type, value: type }));
        return {
            name: 'type',
            selected,
            options,
            onSelect
        };
    }, [type, onSelect]);
    return [[], [categoryDropdown, typeDropdown]];
};

module.exports = useAddons;
