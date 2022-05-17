// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('stremio/common/useModelState');

const map = (ctx) => ({
    ...ctx.profile,
    settings: {
        ...ctx.profile.settings,
        streamingServerWarningDismissed: new Date(
            typeof ctx.profile.settings.streamingServerWarningDismissed === 'string' ?
                ctx.profile.settings.streamingServerWarningDismissed
                :
                NaN
        )
    }
});

const useProfile = () => {
    const { core } = useServices();
    const init = React.useCallback(() => {
        const ctx = core.transport.getState('ctx');
        return map(ctx);
    }, []);
    return useModelState({ model: 'ctx', init, map });
};

module.exports = useProfile;
