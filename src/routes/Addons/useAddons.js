const React = require('react');
const { useServices } = require('stremio/services');

const DEFAULT_TYPE = 'movie';
const DEFAULT_CATEGORY = 'thirdparty';

const useAddons = (urlParams, queryParams) => {
    const { core } = useServices();
    const [addons, setAddons] = React.useState([[], []]);
    React.useEffect(() => {
        const type = typeof urlParams.type === 'string' && urlParams.type.length > 0 ? urlParams.type : DEFAULT_TYPE;
        const category = typeof urlParams.category === 'string' && urlParams.category.length > 0 ? urlParams.category : DEFAULT_CATEGORY;
        const onNewState = () => {
            const state = core.getState();
            const selectInputs = [
                {
                    'data-name': 'type',
                    selected: state.addons.types
                        .filter(({ is_selected }) => is_selected)
                        .map(({ load }) => JSON.stringify(load)),
                    options: state.addons.types
                        .map(({ type_name, load }) => ({
                            value: JSON.stringify(load),
                            label: type_name
                        })),
                    onSelect: (event) => {
                        const load = JSON.parse(event.reactEvent.currentTarget.dataset.value);
                        window.location = `#/addons/${encodeURIComponent(load.path.type_name)}/${encodeURIComponent(load.path.id)}`;
                    }
                },
                {
                    'data-name': 'category',
                    selected: state.addons.catalogs
                        .filter(({ is_selected }) => is_selected)
                        .map(({ load }) => JSON.stringify(load)),
                    options: state.addons.catalogs
                        .filter(({ load: { path: { type_name } } }) => {
                            return type_name === type;
                        })
                        .map(({ name, load }) => ({
                            value: JSON.stringify(load),
                            label: name
                        })),
                    onSelect: (event) => {
                        const load = JSON.parse(event.reactEvent.currentTarget.dataset.value);
                        window.location = `#/addons/${encodeURIComponent(load.path.type_name)}/${encodeURIComponent(load.path.id)}`
                    }
                }
            ];
            const addonsItems = state.addons.content.type === 'Ready' ? state.addons.content.content : [];
            setAddons([addonsItems, selectInputs]);
        };
        core.on('NewModel', onNewState);
        core.dispatch({
            action: 'Load',
            args: {
                load: 'CatalogFiltered',
                args: {
                    base: 'https://v3-cinemeta.strem.io/manifest.json',
                    path: {
                        resource: 'addon_catalog',
                        type_name: type,
                        id: category,
                        extra: [] // TODO
                    }
                }
            }
        });
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [urlParams, queryParams]);
    return addons;
};

module.exports = useAddons;
