// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const useModelState = require('stremio/common/useModelState');

const useAddonDetails = (transportUrl) => {
    const action = React.useMemo(() => {
        if (typeof transportUrl === 'string') {
            return {
                action: 'Load',
                args: {
                    model: 'AddonDetails',
                    args: {
                        transportUrl
                    }
                }
            };
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [transportUrl]);
    return useModelState({ model: 'addon_details', action });
};

module.exports = useAddonDetails;
