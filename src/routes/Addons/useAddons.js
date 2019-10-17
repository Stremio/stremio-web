const React = require('react');
const { useServices } = require('stremio/services');

const CATEGORIES = ['official', 'community', 'my'];
const DEFAULT_CATEGORY = 'community';
const DEFAULT_TYPE = 'all';

const useAddons = (category, type) => {
    category = CATEGORIES.includes(category) ? category : DEFAULT_CATEGORY;
    type = typeof type === 'string' && type.length > 0 ? type : DEFAULT_TYPE;
    const [addons, setAddons] = React.useState([]);
    const { core } = useServices();
    React.useEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            setAddons(state.ctx.content.addons);
        };
        core.on('NewModel', onNewState);
        core.dispatch({
            action: 'LoadCtx'
        });
        onNewState();
        return () => {
            core.off('NewModel', onNewState);
        };
    }, []);
    const onSelect = React.useCallback((event) => {
        const { value } = event.reactEvent.currentTarget.dataset;
        const name = event.dataset.name;
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
            'data-name': 'category',
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
            'data-name': 'type',
            selected,
            options,
            onSelect
        };
    }, [type, onSelect]);
    return [addons, [categoryDropdown, typeDropdown]];
};

module.exports = useAddons;
