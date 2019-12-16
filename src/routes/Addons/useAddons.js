const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const initAddonsState = () => ({
    selectable: {
        types: [],
        catalogs: [],
        extra: [],
        has_next_page: false,
        has_prev_page: false
    },
    catalog_resource: null
});

const mapAddonsStateWithCtx = (addons, ctx) => {
    const selectable = addons.selectable;
    // TODO replace catalog content if resource catalog id is MY
    const catalog_resource = addons.catalog_resource !== null && addons.catalog_resource.content.type === 'Ready' ?
        {
            ...addons.catalog_resource,
            content: {
                ...addons.catalog_resource.content,
                content: addons.catalog_resource.content.content.map((descriptor) => ({
                    transportUrl: descriptor.transportUrl,
                    installed: ctx.content.addons.some((addon) => addon.transportUrl === descriptor.transportUrl),
                    manifest: {
                        id: descriptor.manifest.id,
                        name: descriptor.manifest.name,
                        version: descriptor.manifest.version,
                        logo: descriptor.manifest.logo,
                        description: descriptor.manifest.description,
                        types: descriptor.manifest.types
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
                load: 'CatalogFiltered',
                args: addons.selectable.catalogs[0].load_request
            }
        };
    }
};

const useAddons = (urlParams) => {
    const { core } = useServices();
    const loadAddonsAction = React.useMemo(() => {
        if (typeof urlParams.addonTransportUrl === 'string' && typeof urlParams.catalogId === 'string' && typeof urlParams.type === 'string') {
            return {
                action: 'Load',
                args: {
                    load: 'CatalogFiltered',
                    args: {
                        base: urlParams.addonTransportUrl,
                        path: {
                            resource: 'addon_catalog',
                            type_name: urlParams.type,
                            id: urlParams.catalogId,
                            extra: []
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
                        load: 'CatalogFiltered',
                        args: addons.selectable.catalogs[0].load_request
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
