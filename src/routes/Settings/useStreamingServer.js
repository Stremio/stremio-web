const { useModelState } = require('stremio/common');

const initStreamingServer = () => ({
    selected: null,
    settings: null
});

const useStreamingServer = () => {
    const streamingServer = useModelState({
        model: 'streaming_server',
        init: initStreamingServer,
    });
    return streamingServer;
};

module.exports = useStreamingServer;
