const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const useStreamingServer = () => {
    const { core } = useServices();
    const initStreamingServer = React.useMemo(() => {
        const streamingServer = core.getState('streaming_server');
        return streamingServer;
    }, []);
    const loadStreamingServerAction = React.useMemo(() => {
        const streamingServer = core.getState('streaming_server');
        if (streamingServer.selected === null) {
            return {
                action: 'StreamingServer',
                args: {
                    action: 'Reload'
                }
            };
        } else {
            return null;
        }
    }, []);
    const streamingServer = useModelState({
        model: 'streaming_server',
        init: initStreamingServer,
        action: loadStreamingServerAction
    });
    return streamingServer;
};

module.exports = useStreamingServer;
