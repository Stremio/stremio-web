const React = require('react');
const { useServices } = require('stremio/services');

const DEFAULT_TYPE = 'movie';
const DEFAULT_CATEGORY = 'thirdparty';

const useAddons = (urlParams, queryParams) => {
    const { core } = useServices();
    const [addons, setAddons] = React.useState([[], [], [], [], null]);
    const installAddon = React.useCallback(descriptor => {
        core.dispatch({
            action: 'AddonOp',
            args: {
                addonOp: 'Install',
                args: descriptor
            }
        });
    }, []);
    const uninstallAddon = React.useCallback(descriptor => {
        core.dispatch({
            action: 'AddonOp',
            args: {
                addonOp: 'Remove',
                args: {
                    transport_url: descriptor.transportUrl
                }
            }
        });
    }, []);
    React.useEffect(() => {
        const type = typeof urlParams.type === 'string' && urlParams.type.length > 0 ? urlParams.type : DEFAULT_TYPE;
        const category = typeof urlParams.category === 'string' && urlParams.category.length > 0 ? urlParams.category : DEFAULT_CATEGORY;
        const onNewState = () => {
            const state = core.getState();
            [...new Set(
                ['all'].concat(...state.ctx.content.addons.map(addon => addon.manifest.types))
            )]
                .map((type) => (
                    {
                        is_selected: urlParams.category === 'my' && urlParams.type === type,
                        name: 'my',
                        load: {
                            base: 'https://v3-cinemeta.strem.io/manifest.json',
                            path: {
                                resource: 'addon_catalog',
                                type_name: type,
                                id: 'my',
                                extra: []
                            }
                        }
                    })
                )
                .forEach(addon => state.addons.catalogs.push(addon));
            const selectAddon = (transportUrl) => {
                window.location = `#/addons/${category}/${type}?addon=${transportUrl}`;
            };
            const selectInputs = [
                {
                    selected: state.addons.catalogs
                        .filter(({ is_selected }) => is_selected)
                        .map(({ load }) => load.path.id),
                    options: state.addons.catalogs
                        .filter((catalog, index, catalogs) => {
                            return catalogs.map(ctg => ctg.name).indexOf(catalog.name) === index;
                        })
                        .map(({ name, load }) => ({
                            value: load.path.id,
                            label: name
                        })),
                    onSelect: (event) => {
                        const load = state.addons.catalogs.find(({ load: { path: { id } } }) => {
                            return id === event.value;
                        }).load;
                        window.location = `#/addons/${encodeURIComponent(load.path.id)}/${encodeURIComponent(load.path.type_name)}`;
                    }
                },
                {
                    selected: state.addons.catalogs
                        .filter(({ is_selected }) => is_selected)
                        .map(({ load }) => JSON.stringify(load)),
                    options: state.addons.catalogs
                        .filter(({ load: { path: { id } } }) => {
                            return id === category;
                        })
                        .map(({ load }) => ({
                            value: JSON.stringify(load),
                            label: load.path.type_name
                        })),
                    onSelect: (event) => {
                        const load = JSON.parse(event.reactEvent.currentTarget.dataset.value);
                        window.location = `#/addons/${encodeURIComponent(load.path.id)}/${encodeURIComponent(load.path.type_name)}`;
                    }
                }
            ];
            const installedAddons = state.ctx.is_loaded ? state.ctx.content.addons : [];
            const addonsItems = urlParams.category === 'my' ?
                installedAddons.filter(addon => urlParams.type === 'all' || addon.manifest.types.includes(urlParams.type))
                :
                state.addons.content.type === 'Ready' ?
                    state.addons.content.content
                    :
                    [];
            const error = state.addons.content.type === 'Err' ? state.addons.content.content : null;
            setAddons([addonsItems, selectInputs, selectAddon, installedAddons, error]);
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
                        extra: []
                    }
                }
            }
        });
        return () => {
            core.off('NewModel', onNewState);
        };
    }, [urlParams, queryParams]);
    return [addons, installAddon, uninstallAddon];
};

module.exports = useAddons;
