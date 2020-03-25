const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const useStreamingServer = () => {
    const { core } = useServices();
    const initStreamingServer = React.useCallback(() => {
        return core.getState('streaming_server');
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
    return useModelState({
        model: 'streaming_server',
        init: initStreamingServer,
        action: loadStreamingServerAction
    });
};

module.exports = useStreamingServer;
