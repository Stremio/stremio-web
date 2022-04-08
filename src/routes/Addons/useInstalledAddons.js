// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const useInstalledAddons = (urlParams) => {
    const { core } = useServices();
    const init = React.useMemo(() => {
        return core.transport.getState('installed_addons');
    }, []);
    const action = React.useMemo(() => {
        if (typeof urlParams.transportUrl !== 'string' && typeof urlParams.catalogId !== 'string') {
            return {
                action: 'Load',
                args: {
                    model: 'InstalledAddonsWithFilters',
                    args: {
                        request: {
                            type: typeof urlParams.type === 'string' ? urlParams.type : null
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
    return useModelState({ model: 'installed_addons', action, init });
};

module.exports = useInstalledAddons;
