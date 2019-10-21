const React = require('react');
const { useServices } = require('stremio/services');

const CATEGORIES = ['official', 'community', 'my'];
const DEFAULT_CATEGORY = 'community';
const DEFAULT_TYPE = 'all';

const useAddons = (category, type) => {
    const { core } = useServices();
    const [addons, setAddons] = React.useState([[], []]);
    React.useEffect(() => {
        category = CATEGORIES.includes(category) ? category : DEFAULT_CATEGORY;
        type = typeof type === 'string' && type.length > 0 ? type : DEFAULT_TYPE;
        const onSelect = (event) => {
            const { value } = event.reactEvent.currentTarget.dataset;
            const name = event.dataset.name;
            if (name === 'category') {
                const nextCategory = CATEGORIES.includes(value) ? value : '';
                window.location.replace(`#/addons/${nextCategory}/${DEFAULT_TYPE}`);
            } else if (name === 'type') {
                const nextType = typeof value === 'string' ? value : '';
                window.location.replace(`#/addons/${category}/${nextType}`);
            }
        };
        const categoryDropdown = () => {
            const selected = CATEGORIES.includes(category) ? [category] : [];
            const options = CATEGORIES
                .map((category) => ({ label: category, value: category }));
            return {
                'data-name': 'category',
                selected,
                options,
                onSelect
            };
        };
        const typeDropdown = () => {
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
        };
        const onNewState = () => {
            const state = core.getState();
            setAddons([
                state.ctx.content.addons.filter((addon) => {
                    return (categoryDropdown().selected.join('') === 'official' ? addon.flags.official : !addon.flags.official) &&
                        (typeDropdown().selected.join('') === 'all' || addon.manifest.types.includes(typeDropdown().selected.join('')));
                }),
                [categoryDropdown(), typeDropdown()]
            ]);
        };
        core.on('NewModel', onNewState);
        onNewState();
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [category, type]);
    return addons;
};

module.exports = useAddons;
