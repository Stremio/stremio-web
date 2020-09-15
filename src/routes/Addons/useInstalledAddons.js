// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const mapAddonsState = (installedAddons) => {
    const selected = installedAddons.selected;
    const type_names = installedAddons.type_names;
    const addons = installedAddons.addons.map((addon) => ({
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
    }));
    return { selected, type_names, addons };
};

const useInstalledAddons = (urlParams) => {
    const { core } = useServices();
    const initAddonsState = React.useMemo(() => {
        const installedAddons = core.transport.getState('installed_addons');
        return mapAddonsState(installedAddons);
    }, []);
    const loadAddonsAction = React.useMemo(() => {
        if (typeof urlParams.transportUrl !== 'string' && typeof urlParams.catalogId !== 'string') {
            return {
                action: 'Load',
                args: {
                    model: 'InstalledAddonsWithFilters',
                    args: {
                        type_name: urlParams.type
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
        model: 'installed_addons',
        action: loadAddonsAction,
        map: mapAddonsState,
        init: initAddonsState
    });
};

module.exports = useInstalledAddons;
