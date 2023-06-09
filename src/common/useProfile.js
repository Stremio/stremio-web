// Copyright (C) 2017-2023 Smart code 203358507

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
    return useModelState({ model: 'ctx', map });
};

module.exports = useProfile;
