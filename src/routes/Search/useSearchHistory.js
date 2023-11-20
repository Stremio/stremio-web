// Copyright (C) 2017-2023 Smart code 203358507

const useModelState = require('stremio/common/useModelState');

const useSearchHistory = () => {
    const { searchHistory } = useModelState({ model: 'ctx' });
    return searchHistory;
};

module.exports = useSearchHistory;
