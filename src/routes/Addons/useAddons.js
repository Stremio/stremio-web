const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const INSTALLED_CATALOG_ID = 'INSTALLED';
const INSTALLED_CATALOG_BASE = '';

const initAddonsState = () => ({
    selectable: {
        types: [],
        catalogs: []
    },
    catalog_resource: null
});

const mapAddonsStateWithCtx = (addons, ctx) => {
    const installedSelectableTypes = ctx.profile.addons.map(addon => addon.manifest.types)
        .flat(2).filter((type, index, types) => types.indexOf(type) === index)
        .map((type) => ({
            name: type,
            request: {
                base: INSTALLED_CATALOG_BASE,
                path: {
                    resource: 'addon_catalog',
                    type_name: type,
                    id: INSTALLED_CATALOG_ID,
                    extra: []
                }
            }
        }));
    const selectable = {
        types: addons.selected !== null && addons.selected.request.path.id === INSTALLED_CATALOG_ID ? installedSelectableTypes : addons.selectable.types,
        catalogs: addons.selectable.catalogs.concat({
            name: 'Installed',
            addon_name: '',
            request: {
                base: INSTALLED_CATALOG_BASE,
                path: {
                    resource: 'addon_catalog',
                    type_name: installedSelectableTypes[0].request.path.type_name,
                    id: INSTALLED_CATALOG_ID,
                    extra: []
                }
            }
        })
    };
    const catalog_resource = addons.selected !== null && addons.selected.request.base === INSTALLED_CATALOG_BASE && addons.selected.request.path.id === INSTALLED_CATALOG_ID ?
        {
            request: addons.selected.request,
            content: {
                type: 'Ready',
                content: ctx.profile.addons.filter((addon) => addon.manifest.types.includes(addons.selected.request.path.type_name)).map((addon) => ({
                    transportUrl: addon.transportUrl,
                    installed: true,
                    manifest: {
                        id: addon.manifest.id,
                        name: addon.manifest.name,
                        version: addon.manifest.version,
                        logo: addon.manifest.logo,
                        description: addon.manifest.description,
                        types: addon.manifest.types
                    }
                }))
            }
        }
        :
        addons.catalog_resource !== null && addons.catalog_resource.content.type === 'Ready' ?
            {
                request: addons.catalog_resource.request,
                content: {
                    type: addons.catalog_resource.content.type,
                    content: addons.catalog_resource.content.content.map((addon) => ({
                        transportUrl: addon.transportUrl,
                        installed: ctx.profile.addons.some(({ transportUrl }) => transportUrl === addon.transportUrl),
                        manifest: {
                            id: addon.manifest.id,
                            name: addon.manifest.name,
                            version: addon.manifest.version,
                            logo: addon.manifest.logo,
                            description: addon.manifest.description,
                            types: addon.manifest.types
                        }
                    }))
                }
            }
            :
            addons.catalog_resource;
    return { selectable, catalog_resource };
};

const onNewAddonsState = (addons) => {
    if (addons.catalog_resource === null && addons.selectable.catalogs.length > 0) {
        return {
            action: 'Load',
            args: {
                model: 'CatalogWithFilters',
                args: {
                    request: addons.selectable.catalogs[0].request
                }
            }
        };
    }
};

const useAddons = (urlParams) => {
    const { core } = useServices();
    const loadAddonsAction = React.useMemo(() => {
        if (typeof urlParams.transportUrl === 'string' && typeof urlParams.catalogId === 'string' && typeof urlParams.type === 'string') {
            return {
                action: 'Load',
                args: {
                    model: 'CatalogWithFilters',
                    args: {
                        request: {
                            base: urlParams.transportUrl,
                            path: {
                                resource: 'addon_catalog',
                                type_name: urlParams.type,
                                id: urlParams.catalogId,
                                extra: []
                            }
                        }
                    }
                }
            };
        } else {
            const addons = core.getState('addons');
            if (addons.selectable.catalogs.length > 0) {
                return {
                    action: 'Load',
                    args: {
                        model: 'CatalogWithFilters',
                        args: {
                            request: addons.selectable.catalogs[0].request
                        }
                    }
                };
            } else {
                return {
                    action: 'Unload'
                };
            }
        }
    }, [urlParams]);
    return useModelState({
        model: 'addons',
        action: loadAddonsAction,
        mapWithCtx: mapAddonsStateWithCtx,
        init: initAddonsState,
        onNewState: onNewAddonsState
    });
};

module.exports = useAddons;
