const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('stremio/common/useModelState');

const mapStreamingServerState = (ctx) => {
    return ctx.streaming_server;
};

const useStreamingServer = () => {
    const { core } = useServices();
    const initStreamingServer = React.useCallback(() => {
        const ctx = core.getState('ctx');
        return mapStreamingServerState(ctx);
    }, []);
    const streamingServer = useModelState({
        model: 'ctx',
        init: initStreamingServer,
        map: mapStreamingServerState
    });
    return streamingServer;
};

module.exports = useStreamingServer;
