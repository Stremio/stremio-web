const React = require('react');
const useModelState = require('stremio/common/useModelState');

const initAddonDetailsState = () => ({
    selected: null,
    addon: null
});

const mapAddonDetailsStateWithCtx = (addonDetails, ctx) => {
    const selected = addonDetails.selected;
    const addon = addonDetails.addon !== null && addonDetails.addon.content.type === 'Ready' ?
        {
            transport_url: addonDetails.addon.transport_url,
            content: {
                type: addonDetails.addon.content.type,
                content: {
                    ...addonDetails.addon.content.content,
                    installed: ctx.profile.addons.some(({ transportUrl }) => transportUrl === addonDetails.addon.transport_url),
                }
            }
        }
        :
        addonDetails.addon;
    return { selected, addon };
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
