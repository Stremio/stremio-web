const React = require('react');

const CATEGORIES = ['official', 'community', 'my'];
const DEFAULT_CATEGORY = 'community';
const DEFAULT_TYPE = 'all';

const useAddons = (category, type) => {
    category = CATEGORIES.includes(category) ? category : DEFAULT_CATEGORY;
    type = typeof type === 'string' && type.length > 0 ? type : DEFAULT_TYPE;
    const addons = React.useMemo(() => {
        return [
            {
                id: 'com.linvo.cinemeta',
                name: 'Cinemeta',
                description: 'The official add-on for movie and series catalogs',
                types: ['movie', 'series'],
                version: '2.12.1',
                transportUrl: 'https://v3-cinemeta.strem.io/manifest.json',
                installed: true,
                official: true
            },
            {
                id: 'com.linvo.cinemeta2',
                name: 'Cinemeta2',
                logo: '/images/intro_background.jpg',
                description: 'The official add-on for movie and series catalogs',
                types: ['movie', 'series'],
                version: '2.12.2',
                transportUrl: 'https://v2-cinemeta.strem.io/manifest.json',
                installed: false,
                official: false
            }
        ];
    }, []);
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
    return [addons, [categoryDropdown, typeDropdown]];
};

module.exports = useAddons;
