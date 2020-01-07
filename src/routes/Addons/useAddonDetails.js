const React = require('react');
const { useModelState } = require('stremio/common');

const initAddonDetailsState = () => ({
    descriptor: null
});

const mapAddonDetailsStateWithCtx = (addonDetails, ctx) => {
    const descriptor = addonDetails.descriptor !== null && addonDetails.descriptor.content.type === 'Ready' ?
        {
            ...addonDetails.descriptor,
            content: {
                ...addonDetails.descriptor.content,
                installed: ctx.content.addons.some((addon) => addon.transportUrl === addonDetails.descriptor.transport_url),
            }
        }
        :
        addonDetails.descriptor;
    return { descriptor };
};

const useAddonDetails = (queryParams) => {
    const loadAddonDetailsAction = React.useMemo(() => {
        if (queryParams.has('addon')) {
            return {
                action: 'Load',
                args: {
                    load: 'AddonDetails',
                    args: {
                        transport_url: queryParams.get('addon')
                    }
                }
            };
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [queryParams]);
    return useModelState({
        model: 'addon_details',
        action: loadAddonDetailsAction,
        mapWithCtx: mapAddonDetailsStateWithCtx,
        init: initAddonDetailsState,
    });
};

module.exports = useAddonDetails;
