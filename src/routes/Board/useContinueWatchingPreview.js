// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const useContinueWatchingPreview = () => {
    const { core } = useServices();
    const init = React.useMemo(() => {
        return core.transport.getState('continue_watching_preview');
    }, []);
    return useModelState({ model: 'continue_watching_preview', init });
};

module.exports = useContinueWatchingPreview;
