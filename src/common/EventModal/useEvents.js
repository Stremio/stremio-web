// Copyright (C) 2017-2023 Smart code 203358507

const useModelState = require('stremio/common/useModelState');
const { useServices } = require('stremio/services');

const map = (ctx) => ({
    ...ctx.events,
});

const useEvents = () => {
    const { core } = useServices();

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
