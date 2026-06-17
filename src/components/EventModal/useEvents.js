// Copyright (C) 2017-2023 Smart code 203358507

const { useCore } = require('stremio/core');
const useModelState = require('stremio/common/useModelState');

const map = (ctx) => ({
    ...ctx.events,
});

const useEvents = () => {
    const core = useCore();

    const pullEvents = () => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'GetEvents',
            },
        });
    };

    const dismissEvent = (id) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'DismissEvent',
                args: id,
            },
        });
    };

    const events = useModelState({ model: 'ctx', map });
    return { events, pullEvents, dismissEvent };
};

module.exports = useEvents;
