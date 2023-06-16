// Copyright (C) 2017-2023 Smart code 203358507

const { useModelState } = require('stremio/common');

const useContinueWatchingPreview = () => {
    return useModelState({ model: 'continue_watching_preview' });
};

module.exports = useContinueWatchingPreview;
