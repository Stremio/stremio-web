// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const useStreamingServer = () => {
    const { core } = useServices();
    const initStreamingServer = React.useCallback(() => {
        return core.transport.getState('streaming_server');
    }, []);
    const loadStreamingServerAction = React.useMemo(() => {
        const streamingServer = core.transport.getState('streaming_server');
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
