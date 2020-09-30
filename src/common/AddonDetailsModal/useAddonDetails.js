// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const useModelState = require('stremio/common/useModelState');

const initAddonDetailsState = () => ({
    selected: null,
    remote_addon: null
});

const mapAddonDetailsStateWithCtx = (addonDetails, ctx) => {
    const selected = addonDetails.selected;
    const remote_addon = addonDetails.remote_addon !== null && addonDetails.remote_addon.content.type === 'Ready' ?
        {
            transport_url: addonDetails.remote_addon.transport_url,
            content: {
                type: addonDetails.remote_addon.content.type,
                content: {
                    ...addonDetails.remote_addon.content.content,
                    installed: ctx.profile.addons.some(({ transportUrl }) => transportUrl === addonDetails.remote_addon.transport_url),
                }
            }
        }
        :
        addonDetails.remote_addon;
    return { selected, remote_addon };
};

const useAddonDetails = (transportUrl) => {
    const loadAddonDetailsAction = React.useMemo(() => {
        if (typeof transportUrl === 'string') {
            return {
                action: 'Load',
                args: {
                    model: 'AddonDetails',
                    args: {
                        transport_url: transportUrl
                    }
                }
            };
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [transportUrl]);
    return useModelState({
        model: 'addon_details',
        action: loadAddonDetailsAction,
        mapWithCtx: mapAddonDetailsStateWithCtx,
        init: initAddonDetailsState,
    });
};

module.exports = useAddonDetails;
