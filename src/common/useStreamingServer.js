// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('stremio/common/useModelState');

const useStreamingServer = () => {
    const { core } = useServices();
    const init = React.useCallback(() => {
        return core.transport.getState('streaming_server');
    }, []);
    return useModelState({ model: 'streaming_server', init });
};

module.exports = useStreamingServer;
