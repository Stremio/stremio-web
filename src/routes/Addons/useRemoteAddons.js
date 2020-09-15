// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const initAddonsState = () => ({
    selected: null,
    selectable: {
        types: [],
        catalogs: []
    },
    catalog_resource: null
});

const mapAddonsStateWithCtx = (addons, ctx) => {
    const selected = addons.selected;
    const selectable = addons.selectable;
    const catalog_resource = addons.catalog_resource !== null && addons.catalog_resource.content.type === 'Ready' ?
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
    return { selected, selectable, catalog_resource };
};

const useRemoteAddons = (urlParams) => {
    const loadAddonsAction = React.useMemo(() => {
        if (typeof urlParams.type === 'string' && typeof urlParams.transportUrl === 'string' && typeof urlParams.catalogId === 'string') {
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
            return {
                action: 'Unload'
            };
        }
    }, [urlParams]);
    return useModelState({
        model: 'remote_addons',
        action: loadAddonsAction,
        mapWithCtx: mapAddonsStateWithCtx,
        init: initAddonsState
    });
};

module.exports = useRemoteAddons;
