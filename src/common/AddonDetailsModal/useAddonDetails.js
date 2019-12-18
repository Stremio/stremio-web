const React = require('react');
const useModelState = require('stremio/common/useModelState');

const initAddonDetailsState = () => ({
    descriptor: null
});

const mapAddonDetailsStateWithCtx = (addonDetails, ctx) => {
    const descriptor = addonDetails.descriptor !== null && addonDetails.descriptor.content.type === 'Ready' ?
        {
            ...addonDetails.descriptor,
            content: {
                ...addonDetails.descriptor.content,
                content: {
                    ...addonDetails.descriptor.content.content,
                    installed: ctx.content.addons.some((addon) => addon.transportUrl === addonDetails.descriptor.transportUrl),
                }
            }
        }
        :
        addonDetails.descriptor;
    return { descriptor };
};

const useAddonDetails = (transportUrl) => {
    const loadAddonDetailsAction = React.useMemo(() => {
        if (typeof transportUrl === 'string') {
            return {
                action: 'Load',
                args: {
                    load: 'AddonDetails',
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
